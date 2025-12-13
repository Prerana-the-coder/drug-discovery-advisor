import { Activity, Search, Filter, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const trials = [
  {
    id: "NCT04523467",
    title: "Phase III Study of Novel KRAS Inhibitor",
    phase: "Phase III",
    sponsor: "Major Pharma Co",
    status: "Recruiting",
    enrollment: 450,
    target: 600,
    therapeutic: "Oncology",
  },
  {
    id: "NCT04891234",
    title: "Alzheimer's Disease Prevention Trial",
    phase: "Phase II",
    sponsor: "BioNova Therapeutics",
    status: "Active",
    enrollment: 280,
    target: 400,
    therapeutic: "Neurology",
  },
  {
    id: "NCT04567890",
    title: "CAR-T Therapy for Multiple Myeloma",
    phase: "Phase I/II",
    sponsor: "Cell Therapy Inc",
    status: "Recruiting",
    enrollment: 45,
    target: 100,
    therapeutic: "Hematology",
  },
  {
    id: "NCT04234567",
    title: "Gene Therapy for Rare Genetic Disorder",
    phase: "Phase III",
    sponsor: "GeneTech Labs",
    status: "Completed",
    enrollment: 200,
    target: 200,
    therapeutic: "Rare Disease",
  },
];

const TrialsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <Activity className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Clinical Trial Intelligence</h1>
            <p className="text-muted-foreground">
              Monitor trials, competitors, and pipeline opportunities
            </p>
          </div>
        </div>
        <Link to="/dashboard/chat">
          <Button variant="gradient">
            Analyze Trial Landscape
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search trials by ID, sponsor, or therapeutic area..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Active Trials Tracked</p>
          <p className="text-3xl font-bold">12,456</p>
          <div className="flex items-center gap-1 mt-2 text-accent">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+8% this quarter</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Competitors Identified</p>
          <p className="text-3xl font-bold text-primary">89</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Pipeline Gaps</p>
          <p className="text-3xl font-bold text-accent">34</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Phase III Success Rate</p>
          <p className="text-3xl font-bold">52%</p>
          <div className="flex items-center gap-1 mt-2 text-destructive">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs">-3% vs historical</span>
          </div>
        </div>
      </div>

      {/* Trials List */}
      <div className="space-y-4">
        <h2 className="font-display font-semibold">Key Trials to Watch</h2>
        {trials.map((trial) => (
          <div key={trial.id} className="glass-card p-6 rounded-xl hover:border-primary/30 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-xs">{trial.id}</Badge>
                  <Badge className={trial.status === "Completed" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}>
                    {trial.status}
                  </Badge>
                  <Badge variant="secondary">{trial.phase}</Badge>
                </div>
                <h3 className="font-semibold mb-1">{trial.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {trial.sponsor} • {trial.therapeutic}
                </p>
              </div>
              <div className="lg:w-48">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Enrollment</span>
                  <span className="font-medium">{trial.enrollment}/{trial.target}</span>
                </div>
                <Progress value={(trial.enrollment / trial.target) * 100} className="h-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrialsPage;
