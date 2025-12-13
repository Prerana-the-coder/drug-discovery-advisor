import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What are the top drug repurposing opportunities for oncology?",
  "Summarize the clinical trial landscape for Alzheimer's treatments",
  "Identify unmet therapeutic needs in rare diseases",
  "What are the patent risks for biosimilar development?",
  "Generate an innovation strategy for cardiovascular drugs",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 pr-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              PharmaInnovate AI Assistant
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Ask me anything about pharmaceutical innovation, drug repurposing, clinical trials, or patent analysis.
            </p>
            
            <div className="w-full max-w-2xl">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-sm px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex-1 max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-card border border-border"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div
                    className={cn(
                      "text-xs mt-2",
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing pharmaceutical data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about drug repurposing, clinical trials, patents, or innovation strategies..."
            className="min-h-[60px] max-h-[150px] resize-none bg-card"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="gradient"
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          AI responses are based on pharmaceutical innovation frameworks. Not medical advice.
        </p>
      </div>
    </div>
  );
}

function generateMockResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes("repurposing") || lowerQuestion.includes("opportunities")) {
    return `## Drug Repurposing Opportunities Analysis

### Opportunity Overview
Based on the pharmaceutical innovation framework, several high-potential repurposing opportunities have been identified:

### Supporting Evidence
• **Metformin for Anti-Aging**: Strong clinical evidence supports potential use beyond diabetes
• **Thalidomide Derivatives**: Successful repurposing for multiple myeloma demonstrates pathway
• **Sildenafil for PAH**: Example of successful indication expansion

### Market Insight
The global drug repurposing market is projected to grow significantly, driven by:
- Reduced development timelines (3-5 years vs 10-15 years)
- Lower R&D costs (estimated 60-70% reduction)
- Established safety profiles

### Strategic Recommendation
**GO Decision** - Prioritize molecules with:
1. Expiring patents in key therapeutic areas
2. Known mechanism of action with broad applicability
3. Favorable safety profiles enabling indication expansion

### Risks & Limitations
- Regulatory pathway complexity varies by indication
- Patent landscape requires careful navigation
- Clinical evidence requirements may differ by region`;
  }
  
  if (lowerQuestion.includes("clinical trial") || lowerQuestion.includes("trials")) {
    return `## Clinical Trial Landscape Analysis

### Opportunity Overview
Current clinical trial activity reveals significant pipeline activity and competitive dynamics.

### Supporting Evidence
• **Active Trials**: Over 400,000 registered clinical trials globally
• **Key Therapeutic Areas**: Oncology leads with 35% of all trials
• **Emerging Focus**: Cell & gene therapy trials increased 40% YoY

### Market Insight
- Phase III trials show 50% success rate on average
- Adaptive trial designs gaining regulatory acceptance
- Decentralized trials reducing patient burden

### Patent / Regulatory Considerations
- FDA breakthrough therapy designations accelerating timelines
- EMA parallel scientific advice available
- Emerging market regulatory harmonization ongoing

### Strategic Recommendation
Focus resources on therapeutic areas with:
1. High unmet need and limited competition
2. Clear regulatory pathways
3. Strong biomarker-driven patient selection

### Risks & Limitations
- Trial enrollment challenges post-pandemic
- Supply chain considerations for complex biologics
- Evolving regulatory requirements in emerging markets`;
  }
  
  return `## Innovation Analysis

### Opportunity Overview
Your query has been analyzed against our pharmaceutical innovation framework.

### Supporting Evidence
Based on the AI-Powered Agentic Solution for Pharmaceutical Innovation methodology:
• Data-driven insights enable faster decision making
• Integration of multiple data sources provides comprehensive view
• Structured analysis reduces bias in innovation decisions

### Market Insight
The pharmaceutical industry continues to evolve with:
- Increased focus on precision medicine
- Growing importance of real-world evidence
- Digital health integration accelerating

### Patent / Regulatory Considerations
- Freedom-to-operate analysis recommended before major investments
- Early regulatory engagement advised for novel mechanisms
- Global regulatory strategy needed for international programs

### Strategic Recommendation
Consider a phased approach:
1. Initial feasibility assessment
2. Competitive intelligence gathering
3. Proof-of-concept validation
4. Full development decision

### Risks & Limitations
- Market dynamics may shift during development
- Regulatory requirements continue to evolve
- Competition may emerge from unexpected sources

*Note: This analysis is based on general pharmaceutical innovation principles. Specific decisions should incorporate additional due diligence.*`;
}
