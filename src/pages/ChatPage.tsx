import { ChatInterface } from "@/components/chat/ChatInterface";

const ChatPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-2">AI Innovation Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about pharmaceutical innovation, drug repurposing, clinical trials, or strategic recommendations.
        </p>
      </div>
      <div className="glass-card rounded-xl p-6">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;
