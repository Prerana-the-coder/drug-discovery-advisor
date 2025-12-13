import { TrendingUp, Search, Filter, ArrowRight, DollarSign, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const opportunities = [
  {
    molecule: "Metformin",
    newIndication: "Longevity / Anti-Aging",
    marketSize: "$45B",
    patientPopulation: "250M+",
    competition: "Low",
    confidence: 85,
    rationale: "Strong preclinical evidence, multiple ongoing trials, favorable safety profile",
  },
  {
    molecule: "Rapamycin Analogs",
    newIndication: "Age-Related Neurodegeneration",
    marketSize: "$28B",
    patientPopulation: "50M",
    competition: "Medium",
    confidence: 72,
    rationale: "mTOR pathway well-validated, dosing optimization needed",
  },
  {
    molecule: "GLP-1 Agonists",
    newIndication: "NASH/MASH",
    marketSize: "$35B",
    patientPopulation: "85M",
    competition: "High",
    confidence: 90,
    rationale: "Multiple Phase III successes, regulatory pathway clear",
  },
  {
    molecule: "JAK Inhibitors",
    newIndication: "Alopecia Areata",
    marketSize: "$3.5B",
    patientPopulation: "6.8M",
    competition: "Medium",
    confidence: 88,
    rationale: "Recent FDA approvals validate mechanism",
  },
];

const RepurposingPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Repurposing & Market Segmentation</h1>
            <p className="text-muted-foreground">
              Discover new therapeutic use cases and market opportunities
            </p>
          </div>
        </div>
        <Link to="/dashboard/chat">
          <Button variant="gradient">
            Find Opportunities
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by molecule, indication, or market segment..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Opportunities Identified</span>
          </div>
          <p className="text-3xl font-bold">423</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Total Addressable Market</span>
          </div>
          <p className="text-3xl font-bold">$248B</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Patient Segments</span>
          </div>
          <p className="text-3xl font-bold">34</p>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="space-y-4">
        <h2 className="font-display font-semibold">Top Repurposing Opportunities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((opp, index) => (
            <div key={index} className="glass-card p-6 rounded-xl hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{opp.molecule}</h3>
                  <p className="text-primary font-medium">{opp.newIndication}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{opp.confidence}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Market Size</p>
                  <p className="font-semibold">{opp.marketSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient Pop.</p>
                  <p className="font-semibold">{opp.patientPopulation}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Competition</p>
                  <Badge variant={opp.competition === "Low" ? "default" : "secondary"} className={opp.competition === "Low" ? "bg-accent/10 text-accent" : ""}>
                    {opp.competition}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {opp.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepurposingPage;
