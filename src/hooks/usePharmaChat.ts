import { useState, useCallback } from "react";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pharma-chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    if (resp.status === 429) {
      onError("Rate limit exceeded. Please wait a moment and try again.");
      return;
    }
    if (resp.status === 402) {
      onError("AI usage limit reached. Please add credits to continue.");
      return;
    }
    onError(errorData.error || "Failed to get response from AI");
    return;
  }

  if (!resp.body) {
    onError("No response body");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Final flush
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        /* ignore partial leftovers */
      }
    }
  }

  onDone();
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function usePharmaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant" as const,
            content: assistantContent,
            timestamp: new Date(),
          },
        ];
      });
    };

    const chatMessages: Message[] = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      await streamChat({
        messages: chatMessages,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error("Chat error:", e);
      toast.error("Failed to send message. Please try again.");
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return { messages, isLoading, sendMessage };
}
