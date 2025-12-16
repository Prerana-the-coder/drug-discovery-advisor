import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePharmaChat, ChatMessage } from "@/hooks/usePharmaChat";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const suggestedQuestions = [
  "What are the top drug repurposing opportunities for oncology?",
  "Summarize the clinical trial landscape for Alzheimer's treatments",
  "Identify unmet therapeutic needs in rare diseases",
  "What are the patent risks for biosimilar development?",
  "Generate an innovation strategy for cardiovascular drugs",
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = usePharmaChat();
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

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
      
      // Add the result as a message
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

  const speakMessage = async (message: ChatMessage) => {
    if (isSpeaking && speakingMessageId === message.id) {
      // Stop speaking
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    setIsSpeaking(true);
    setSpeakingMessageId(message.id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: message.content.slice(0, 4000) }),
        }
      );

      if (!response.ok) throw new Error("TTS request failed");

      const data = await response.json();
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      await audioRef.current.play();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error playing audio",
        description: "Could not generate speech. Please try again.",
        variant: "destructive",
      });
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 hover:bg-primary/10"
                        onClick={() => speakMessage(message)}
                      >
                        {isSpeaking && speakingMessageId === message.id ? (
                          <VolumeX className="w-4 h-4 text-destructive" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
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
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about drug repurposing, clinical trials, patents, or upload a medicine photo..."
            className="min-h-[60px] max-h-[150px] resize-none bg-card border-border/50 focus:border-primary/50"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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
  );
}
