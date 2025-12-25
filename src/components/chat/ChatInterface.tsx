import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon, 
  Volume2, 
  VolumeX,
  Pill,
  X,
  Mic,
  MicOff,
  Square,
  Download,
  FileText,
  PanelLeftClose,
  PanelLeft,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePharmaChat, ChatMessage } from "@/hooks/usePharmaChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatHistory } from "./ChatHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const suggestedQuestions = [
  "What are the top drug repurposing opportunities for oncology?",
  "Summarize the clinical trial landscape for Alzheimer's treatments",
  "Identify unmet therapeutic needs in rare diseases",
  "What are the patent risks for biosimilar development?",
  "Generate an innovation strategy for cardiovascular drugs",
];

// Voice ID mapping for ElevenLabs (English voices)
const voiceIdMap: Record<string, string> = {
  sarah: "EXAVITQu4vr4xnSDxMaL",
  roger: "CwhRBWXzGAHq8TQ4Fs17",
  alice: "Xb7hH8MSUJpSbSDYk0k2",
  brian: "nPczCjzI2devNBz1zQrb",
  lily: "pFZP5JQG7iQjIQuC4Bku",
};

// Hindi-compatible multilingual voices (same voices work for both with eleven_multilingual_v2)
const hindiVoiceIdMap: Record<string, string> = {
  rachel: "21m00Tcm4TlvDq8ikWAM",
  matilda: "XrExE9yKIg1WjnnlVkGX",
};

type TTSLanguage = "english" | "hindi";

export function ChatInterface() {
  const { 
    messages, 
    isLoading, 
    sendMessage,
    sessions,
    currentSessionId,
    isLoadingSessions,
    startNewChat,
    selectSession,
    deleteSession,
  } = usePharmaChat();
  
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState({ currentChunk: 0, totalChunks: 0, chunkProgress: 0 });
  const [showHistory, setShowHistory] = useState(true);
  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    voice: "sarah",
    autoPlay: false
  });
  const [ttsLanguage, setTtsLanguage] = useState<TTSLanguage>(() => {
    const saved = localStorage.getItem("medlens_tts_language");
    return (saved === "hindi" || saved === "english") ? saved : "english";
  });
  const isSpeakingRef = useRef(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Load voice settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("medlens_settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setVoiceSettings({
          enabled: settings.voiceEnabled ?? true,
          voice: settings.selectedVoice ?? "sarah",
          autoPlay: settings.voiceAutoPlay ?? false
        });
      } catch {}
    }
  }, []);

  // Save TTS language preference to localStorage
  useEffect(() => {
    localStorage.setItem("medlens_tts_language", ttsLanguage);
  }, [ttsLanguage]);

  // Auto-play voice when new assistant message arrives
  useEffect(() => {
    if (!voiceSettings.autoPlay || !voiceSettings.enabled || isLoading) return;
    
    if (messages.length > lastMessageCount && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        speakMessage(lastMessage);
      }
    }
    setLastMessageCount(messages.length);
  }, [messages.length, isLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMedicine = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzingImage(true);
    try {
      const base64Data = selectedImage.split(",")[1];
      const { data, error } = await supabase.functions.invoke("medicine-detection", {
        body: { imageBase64: base64Data },
      });
      
      if (error) throw error;
      
      sendMessage(`[Medicine Detection Result]\n\n${data.result}`);
      setSelectedImage(null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error analyzing medicine",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Split text into chunks at sentence boundaries
  const splitTextIntoChunks = (text: string, maxChunkSize: number = 1000): string[] => {
    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
    
    let currentChunk = "";
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxChunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        // If a single sentence is longer than maxChunkSize, split it by words
        if (sentence.length > maxChunkSize) {
          const words = sentence.split(/\s+/);
          currentChunk = "";
          for (const word of words) {
            if ((currentChunk + " " + word).length <= maxChunkSize) {
              currentChunk += (currentChunk ? " " : "") + word;
            } else {
              if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
              }
              currentChunk = word;
            }
          }
        } else {
          currentChunk = sentence;
        }
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  };

  // Generate TTS for a single chunk
  const generateChunkAudio = async (text: string, voiceId: string): Promise<string> => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voiceId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "TTS request failed");
    }

    const data = await response.json();
    return `data:audio/mpeg;base64,${data.audioContent}`;
  };

  // Play audio chunks sequentially with progress tracking
  const playAudioChunks = async (audioUrls: string[], messageId: string) => {
    setAudioProgress({ currentChunk: 0, totalChunks: audioUrls.length, chunkProgress: 0 });
    
    for (let i = 0; i < audioUrls.length; i++) {
      if (!isSpeakingRef.current) break;
      
      setAudioProgress(prev => ({ ...prev, currentChunk: i + 1, chunkProgress: 0 }));
      
      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(audioUrls[i]);
        audioRef.current = audio;
        
        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration) * 100;
            setAudioProgress(prev => ({ ...prev, chunkProgress: progress }));
          }
        };
        
        audio.oncanplaythrough = () => {
          audio.play().catch(reject);
        };
        audio.onended = () => {
          setAudioProgress(prev => ({ ...prev, chunkProgress: 100 }));
          resolve();
        };
        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          reject(new Error("Audio playback failed"));
        };
        audio.load();
      });
    }
    
    setAudioProgress({ currentChunk: 0, totalChunks: 0, chunkProgress: 0 });
  };

  const speakMessage = async (message: ChatMessage) => {
    if (!voiceSettings.enabled) {
      toast({
        title: "Voice disabled",
        description: "Enable voice output in Profile Settings to use this feature.",
      });
      return;
    }

    if (isSpeaking && speakingMessageId === message.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setSpeakingMessageId(null);
      return;
    }

    setIsSpeaking(true);
    isSpeakingRef.current = true;
    setSpeakingMessageId(message.id);

    try {
      // Select voice based on language
      let voiceId: string;
      if (ttsLanguage === "hindi") {
        voiceId = hindiVoiceIdMap.rachel; // Uses multilingual model which supports Hindi
      } else {
        voiceId = voiceIdMap[voiceSettings.voice] || voiceIdMap.sarah;
      }
      
      const chunks = splitTextIntoChunks(message.content);
      
      toast({
        title: `Converting to speech (${ttsLanguage === "hindi" ? "Hindi" : "English"})`,
        description: chunks.length > 1 
          ? `Processing ${chunks.length} segments...` 
          : "Processing audio...",
      });

      // Generate all audio chunks
      const audioUrls: string[] = [];
      for (const chunk of chunks) {
        if (!isSpeakingRef.current) break;
        const audioUrl = await generateChunkAudio(chunk, voiceId);
        audioUrls.push(audioUrl);
      }

      // Play all chunks sequentially
      if (isSpeakingRef.current && audioUrls.length > 0) {
        await playAudioChunks(audioUrls, message.id);
      }
      
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setSpeakingMessageId(null);
    } catch (err) {
      console.error("TTS Error:", err);
      toast({
        title: "Error playing audio",
        description: err instanceof Error ? err.message : "Could not generate speech. Please try again.",
        variant: "destructive",
      });
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      setSpeakingMessageId(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        
        if (audioChunksRef.current.length > 0) {
          await transcribeAudio();
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak your message, then click stop when done.",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async () => {
    setIsTranscribing(true);
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/speech-to-text`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ audio: base64Audio }),
        }
      );
      
      if (!response.ok) throw new Error("Transcription failed");
      
      const data = await response.json();
      
      if (data.text && data.text.trim()) {
        setInput(data.text.trim());
        toast({
          title: "Transcription complete",
          description: "Your speech has been converted to text.",
        });
      } else {
        toast({
          title: "No speech detected",
          description: "Please try speaking more clearly.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast({
        title: "Transcription failed",
        description: "Could not convert speech to text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
      audioChunksRef.current = [];
    }
  };

  const exportAsText = () => {
    if (messages.length === 0) {
      toast({ title: "No messages to export", variant: "destructive" });
      return;
    }

    const content = messages
      .map((m) => {
        const time = m.timestamp.toLocaleString();
        const role = m.role === "user" ? "You" : "Medlens AI";
        return `[${time}] ${role}:\n${m.content}\n`;
      })
      .join("\n---\n\n");

    const header = `Medlens AI Conversation Export\nExported on: ${new Date().toLocaleString()}\n\n${"=".repeat(50)}\n\n`;
    const footer = `\n${"=".repeat(50)}\nDesigned & Developed by Prerana`;

    const blob = new Blob([header + content + footer], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medlens-chat-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Conversation exported successfully" });
  };

  const exportAsMarkdown = () => {
    if (messages.length === 0) {
      toast({ title: "No messages to export", variant: "destructive" });
      return;
    }

    const content = messages
      .map((m) => {
        const time = m.timestamp.toLocaleString();
        const role = m.role === "user" ? "**You**" : "**Medlens AI**";
        return `### ${role} - *${time}*\n\n${m.content}\n`;
      })
      .join("\n---\n\n");

    const header = `# Medlens AI Conversation\n\n*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;
    const footer = `\n---\n\n*Designed & Developed by Prerana*`;

    const blob = new Blob([header + content + footer], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medlens-chat-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Conversation exported as Markdown" });
  };

  const exportAsJSON = () => {
    if (messages.length === 0) {
      toast({ title: "No messages to export", variant: "destructive" });
      return;
    }

    const data = {
      exportedAt: new Date().toISOString(),
      application: "Medlens AI",
      developer: "Prerana",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medlens-chat-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Conversation exported as JSON" });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] max-h-[800px] gap-4">
      {/* Chat History Sidebar */}
      <div className={cn(
        "flex-shrink-0 border border-border rounded-xl bg-card/50 transition-all duration-300 overflow-hidden",
        showHistory ? "w-72" : "w-0 border-0"
      )}>
        {showHistory && (
          <ChatHistory
            sessions={sessions}
            currentSessionId={currentSessionId}
            isLoading={isLoadingSessions}
            onNewChat={startNewChat}
            onSelectSession={selectSession}
            onDeleteSession={deleteSession}
          />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="h-9 w-9"
          >
            {showHistory ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Auto-play voice toggle */}
            <Button
              variant={voiceSettings.autoPlay ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newSettings = { ...voiceSettings, autoPlay: !voiceSettings.autoPlay };
                setVoiceSettings(newSettings);
                localStorage.setItem("medlens_settings", JSON.stringify({
                  voiceEnabled: newSettings.enabled,
                  selectedVoice: newSettings.voice,
                  voiceAutoPlay: newSettings.autoPlay
                }));
                toast({
                  title: newSettings.autoPlay ? "Auto-play enabled" : "Auto-play disabled",
                  description: newSettings.autoPlay 
                    ? "Voice responses will play automatically" 
                    : "Click the speaker icon to hear responses",
                });
              }}
              className="gap-2"
              disabled={!voiceSettings.enabled}
            >
              {voiceSettings.autoPlay ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Auto-play
            </Button>

            {messages.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportAsText}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as Text (.txt)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsMarkdown}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as Markdown (.md)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsJSON}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as JSON (.json)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-xl animate-pulse-slow" />
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 mb-6">
                  <Sparkles className="w-12 h-12 text-primary animate-float" />
                </div>
              </div>
              <h2 className="font-display text-3xl font-bold mb-2 gradient-text">
                Medlens AI Assistant
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Your intelligent partner for pharmaceutical innovation, drug analysis, and strategic insights.
              </p>
              
              {/* Medicine Detection Card */}
              <div className="w-full max-w-md mb-8">
                <div className="glass-card rounded-2xl p-4 border border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Medicine Detection</h3>
                      <p className="text-xs text-muted-foreground">Upload a photo to identify medicines</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Medicine Photo
                  </Button>
                </div>
              </div>
              
              {/* Voice Status */}
              <div className="w-full max-w-md mb-6">
                <div className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm",
                  voiceSettings.enabled 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted text-muted-foreground border border-border"
                )}>
                  <Volume2 className="w-4 h-4" />
                  Voice: {voiceSettings.enabled 
                    ? `${voiceSettings.voice}${voiceSettings.autoPlay ? " • Auto-play ON" : ""}` 
                    : "Disabled"}
                </div>
              </div>
              
              <div className="w-full max-w-2xl">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-sm px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all hover:scale-105 text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80"
                        : "bg-gradient-to-br from-accent to-primary"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "flex-1 max-w-[80%] rounded-2xl px-5 py-4 shadow-md",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto"
                        : "glass-card border border-border/50"
                    )}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-between mt-3 pt-2 border-t",
                        message.role === "user"
                          ? "text-primary-foreground/70 border-primary-foreground/20"
                          : "text-muted-foreground border-border/50"
                      )}
                    >
                      <span className="text-xs">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && (
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 hover:bg-primary/10"
                              onClick={() => setTtsLanguage(ttsLanguage === "english" ? "hindi" : "english")}
                              title={`Switch to ${ttsLanguage === "english" ? "Hindi" : "English"}`}
                            >
                              <Languages className="w-4 h-4" />
                              <span className="text-xs ml-1">{ttsLanguage === "english" ? "EN" : "HI"}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 hover:bg-primary/10"
                              onClick={() => speakMessage(message)}
                              title={voiceSettings.enabled ? `Read aloud (${ttsLanguage === "english" ? "English" : "Hindi"})` : "Voice disabled - enable in Profile Settings"}
                            >
                              {isSpeaking && speakingMessageId === message.id ? (
                                <VolumeX className="w-4 h-4 text-destructive" />
                              ) : (
                                <Volume2 className={cn("w-4 h-4", !voiceSettings.enabled && "opacity-50")} />
                              )}
                            </Button>
                          </div>
                          {/* Audio Progress Indicator */}
                          {isSpeaking && speakingMessageId === message.id && audioProgress.totalChunks > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Volume2 className="w-3 h-3 animate-pulse" />
                                  Playing...
                                </span>
                                <span>
                                  {audioProgress.currentChunk}/{audioProgress.totalChunks} segments
                                </span>
                              </div>
                              <Progress 
                                value={((audioProgress.currentChunk - 1) / audioProgress.totalChunks * 100) + (audioProgress.chunkProgress / audioProgress.totalChunks)} 
                                className="h-1.5"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="glass-card border border-border/50 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-sm">Analyzing pharmaceutical data...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Image Preview */}
        {selectedImage && (
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
              <img 
                src={selectedImage} 
                alt="Selected medicine" 
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Medicine Image Selected</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Click analyze to identify this medicine and get detailed information.
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={analyzeMedicine} 
                    disabled={isAnalyzingImage}
                    size="sm"
                    variant="gradient"
                  >
                    {isAnalyzingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Pill className="w-4 h-4 mr-2" />
                        Analyze Medicine
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={cn(
                "h-[60px] w-[60px] flex-shrink-0 transition-all",
                isRecording && "animate-pulse"
              )}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isTranscribing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isRecording ? (
                <Square className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Recording... Click the stop button when done" : "Ask about drug repurposing, clinical trials, patents, or use voice input..."}
              className="min-h-[60px] max-h-[150px] resize-none bg-card border-border/50 focus:border-primary/50"
              disabled={isLoading || isRecording}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isRecording}
              variant="gradient"
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Designed & Developed by Prerana • AI responses are based on pharmaceutical innovation frameworks
          </p>
        </div>
      </div>
    </div>
  );
}
