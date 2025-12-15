import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeaScoring } from "@/components/analysis/IdeaScoring";
import { CompetitorSimulation } from "@/components/analysis/CompetitorSimulation";
import { ReportGenerator } from "@/components/analysis/ReportGenerator";
import { Target, Swords, FileText, Sparkles } from "lucide-react";

const AnalysisHubPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Analysis Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Score ideas, simulate competition, and generate CEO-ready reports
          </p>
        </div>
      </div>

      {/* Feature Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Idea Scoring</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Get composite scores across Science, Market, Risk, Speed & Cost
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Swords className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold">Competitor Sim</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Predict competitor moves and plan counter-strategies
          </p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Report Gen</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate PPT outlines, investment memos, and Go/No-Go slides
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="scoring" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Scoring</span>
          </TabsTrigger>
          <TabsTrigger value="competitor" className="flex items-center gap-2">
            <Swords className="w-4 h-4" />
            <span className="hidden sm:inline">Competitor</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="animate-fade-in">
          <IdeaScoring />
        </TabsContent>
        <TabsContent value="competitor" className="animate-fade-in">
          <CompetitorSimulation />
        </TabsContent>
        <TabsContent value="reports" className="animate-fade-in">
          <ReportGenerator />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        Designed & Developed by Prerana
      </div>
    </div>
  );
};

export default AnalysisHubPage;
