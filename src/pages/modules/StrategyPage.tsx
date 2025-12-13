import { Lightbulb, ArrowRight, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const strategies = [
  {
    project: "GLP-1 for NASH",
    status: "GO",
    confidence: 92,
    marketPotential: "$35B",
    timeToMarket: "3-4 years",
    keyStrengths: [
      "Strong Phase III data",
      "Clear regulatory pathway",
      "Large patient population",
      "Favorable competitive landscape",
    ],
    risks: [
      "Manufacturing complexity",
      "Pricing pressure expected",
    ],
  },
  {
    project: "Rapamycin Analog for Aging",
    status: "CONDITIONAL GO",
    confidence: 68,
    marketPotential: "$28B",
    timeToMarket: "5-7 years",
    keyStrengths: [
      "Novel mechanism",
      "Strong scientific rationale",
      "Orphan designation possible",
    ],
    risks: [
      "Regulatory uncertainty",
      "Long development timeline",
      "Dosing optimization needed",
    ],
  },
  {
    project: "Biosimilar Adalimumab",
    status: "NO-GO",
    confidence: 45,
    marketPotential: "$8B (eroding)",
    timeToMarket: "2-3 years",
    keyStrengths: [
      "Established manufacturing",
      "Clear regulatory pathway",
    ],
    risks: [
      "9 biosimilars already approved",
      "Severe price erosion (>80%)",
      "Market saturation",
      "Low differentiation opportunity",
    ],
  },
];

const StrategyPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Innovation Strategy Summary</h1>
            <p className="text-muted-foreground">
              Executive-level insights and go/no-go recommendations
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Link to="/dashboard/chat">
            <Button variant="gradient">
              Generate Strategy
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Active Strategies</p>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">GO Decisions</p>
          <p className="text-3xl font-bold text-accent">28</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Conditional</p>
          <p className="text-3xl font-bold text-yellow-600">12</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">NO-GO</p>
          <p className="text-3xl font-bold text-destructive">5</p>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="space-y-6">
        <h2 className="font-display font-semibold">Featured Innovation Strategies</h2>
        
        {strategies.map((strategy, index) => (
          <div key={index} className="glass-card rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    strategy.status === "GO" ? "bg-accent/10" :
                    strategy.status === "CONDITIONAL GO" ? "bg-yellow-500/10" :
                    "bg-destructive/10"
                  }`}>
                    {strategy.status === "GO" ? <CheckCircle className="w-6 h-6 text-accent" /> :
                     strategy.status === "CONDITIONAL GO" ? <AlertCircle className="w-6 h-6 text-yellow-600" /> :
                     <XCircle className="w-6 h-6 text-destructive" />}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{strategy.project}</h3>
                    <Badge 
                      className={
                        strategy.status === "GO" ? "bg-accent text-accent-foreground" :
                        strategy.status === "CONDITIONAL GO" ? "bg-yellow-500 text-white" :
                        "bg-destructive text-destructive-foreground"
                      }
                    >
                      {strategy.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{strategy.confidence}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{strategy.marketPotential}</p>
                    <p className="text-xs text-muted-foreground">Market Potential</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{strategy.timeToMarket}</p>
                    <p className="text-xs text-muted-foreground">Time to Market</p>
                  </div>
                </div>
              </div>
              
              {/* Confidence Bar */}
              <div className="mt-4">
                <Progress 
                  value={strategy.confidence} 
                  className={`h-2 ${
                    strategy.confidence >= 80 ? "[&>div]:bg-accent" :
                    strategy.confidence >= 60 ? "[&>div]:bg-yellow-500" :
                    "[&>div]:bg-destructive"
                  }`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-accent mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {strategy.keyStrengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div>
                <h4 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Risks & Limitations
                </h4>
                <ul className="space-y-2">
                  {strategy.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyPage;
