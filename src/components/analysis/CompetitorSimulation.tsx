import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, Swords, Shield, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CompetitorSimulation() {
  const [innovation, setInnovation] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [simulation, setSimulation] = useState<string | null>(null);
  const { toast } = useToast();

  const runSimulation = async () => {
    if (!innovation.trim()) {
      toast({ title: "Please describe your innovation", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-analysis", {
        body: {
          type: "COMPETITOR_SIM",
          ideaDescription: innovation,
          context: competitors ? `Key competitors: ${competitors}` : undefined,
        },
      });

      if (error) throw error;
      setSimulation(data.content);
    } catch (err) {
      console.error(err);
      toast({ title: "Error running simulation", description: String(err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" />
          Competitor Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Innovation</label>
          <Textarea
            value={innovation}
            onChange={(e) => setInnovation(e.target.value)}
            placeholder="Describe your planned innovation or market entry strategy..."
            className="min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Key Competitors (optional)</label>
          <Textarea
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="e.g., Pfizer, Novartis, Roche..."
            className="min-h-[60px]"
          />
        </div>
        <Button onClick={runSimulation} disabled={isLoading} className="w-full" variant="gradient">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>

        {simulation && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Competitive Response Analysis</span>
            </div>
            <ScrollArea className="h-[400px] rounded-xl border border-border bg-card p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm">{simulation}</div>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
