import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, TrendingUp, AlertTriangle, Zap, DollarSign, Target } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScoreData {
  score: number;
  justification: string;
}

interface Scores {
  science: ScoreData;
  market: ScoreData;
  risk: ScoreData;
  speed: ScoreData;
  cost: ScoreData;
  composite: ScoreData;
}

const scoreConfig = [
  { key: "science", label: "Science", icon: Brain, color: "from-blue-500 to-cyan-500" },
  { key: "market", label: "Market", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { key: "risk", label: "Risk (Low)", icon: AlertTriangle, color: "from-amber-500 to-yellow-500" },
  { key: "speed", label: "Speed", icon: Zap, color: "from-purple-500 to-pink-500" },
  { key: "cost", label: "Cost Eff.", icon: DollarSign, color: "from-rose-500 to-red-500" },
];

export function IdeaScoring() {
  const [idea, setIdea] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState<Scores | null>(null);
  const { toast } = useToast();

  const generateScores = async () => {
    if (!idea.trim()) {
      toast({ title: "Please enter an idea", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-analysis", {
        body: { type: "SCORING", ideaDescription: idea, context },
      });

      if (error) throw error;

      // Parse JSON from the response
      const content = data.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setScores(parsed);
      } else {
        throw new Error("Could not parse scores");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error generating scores", description: String(err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Innovation Scoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Describe your innovation idea</label>
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., Repurposing metformin for anti-aging applications in cardiovascular patients..."
            className="min-h-[100px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Additional context (optional)</label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Market focus, target population, competitive landscape..."
            className="min-h-[60px]"
          />
        </div>
        <Button onClick={generateScores} disabled={isLoading} className="w-full" variant="gradient">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate Scores"
          )}
        </Button>

        {scores && (
          <div className="mt-6 space-y-6">
            {/* Composite Score */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Composite Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(scores.composite.score)}`}>
                {scores.composite.score}
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                {scores.composite.justification}
              </p>
            </div>

            {/* Individual Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoreConfig.map(({ key, label, icon: Icon, color }) => {
                const scoreData = scores[key as keyof Scores];
                return (
                  <div key={key} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{label}</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(scoreData.score)}`}>
                        {scoreData.score}
                      </span>
                    </div>
                    <Progress value={scoreData.score} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{scoreData.justification}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
