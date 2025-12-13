import { FileCheck, Search, Filter, ArrowRight, AlertTriangle, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const patents = [
  {
    molecule: "Adalimumab",
    patentHolder: "AbbVie",
    expirationDate: "2023 (Expired)",
    status: "Expired",
    risk: "Low",
    biosimilars: 9,
    notes: "Biosimilar market fully open, price erosion significant",
  },
  {
    molecule: "Pembrolizumab",
    patentHolder: "Merck",
    expirationDate: "2028",
    status: "Active",
    risk: "High",
    biosimilars: 0,
    notes: "Strong patent portfolio, extended exclusivity likely",
  },
  {
    molecule: "Trastuzumab",
    patentHolder: "Roche",
    expirationDate: "2024",
    status: "Expiring Soon",
    risk: "Medium",
    biosimilars: 5,
    notes: "Multiple biosimilars approved, market share shifting",
  },
  {
    molecule: "Ustekinumab",
    patentHolder: "Johnson & Johnson",
    expirationDate: "2026",
    status: "Active",
    risk: "Medium",
    biosimilars: 2,
    notes: "Patent challenges ongoing in key markets",
  },
];

const regulatoryPaths = [
  { region: "FDA (US)", pathway: "505(b)(2)", timeline: "18-24 months", complexity: "Medium" },
  { region: "EMA (EU)", pathway: "Article 10(3)", timeline: "12-18 months", complexity: "Medium" },
  { region: "PMDA (Japan)", pathway: "Generic Pathway", timeline: "12 months", complexity: "Low" },
  { region: "NMPA (China)", pathway: "Imported Drug", timeline: "24-36 months", complexity: "High" },
];

const PatentsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-accent/10">
            <FileCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Patent & Regulatory Assessment</h1>
            <p className="text-muted-foreground">
              Evaluate FTO risks and regulatory pathways
            </p>
          </div>
        </div>
        <Link to="/dashboard/chat">
          <Button variant="gradient">
            Analyze Patent Risks
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by molecule, patent holder, or region..." 
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
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Patents Tracked</span>
          </div>
          <p className="text-3xl font-bold">8,247</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Clock className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm text-muted-foreground">Expiring in 24 Months</span>
          </div>
          <p className="text-3xl font-bold text-destructive">127</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">FTO Cleared</span>
          </div>
          <p className="text-3xl font-bold text-accent">89%</p>
        </div>
      </div>

      {/* Patent Landscape */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">Key Patent Expirations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Molecule</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Patent Holder</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Expiration</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">FTO Risk</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Biosimilars</th>
              </tr>
            </thead>
            <tbody>
              {patents.map((patent, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{patent.molecule}</td>
                  <td className="p-4 text-muted-foreground">{patent.patentHolder}</td>
                  <td className="p-4 text-muted-foreground">{patent.expirationDate}</td>
                  <td className="p-4">
                    <Badge 
                      variant="secondary"
                      className={
                        patent.status === "Expired" ? "bg-muted text-muted-foreground" :
                        patent.status === "Expiring Soon" ? "bg-destructive/10 text-destructive" :
                        "bg-accent/10 text-accent"
                      }
                    >
                      {patent.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {patent.risk === "High" && <AlertTriangle className="w-4 h-4 text-destructive" />}
                      <span className={
                        patent.risk === "High" ? "text-destructive" :
                        patent.risk === "Medium" ? "text-yellow-600" :
                        "text-accent"
                      }>
                        {patent.risk}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{patent.biosimilars}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory Pathways */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">Regulatory Pathways by Region</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {regulatoryPaths.map((path, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">{path.region}</h3>
              <p className="text-sm text-primary mb-1">{path.pathway}</p>
              <p className="text-xs text-muted-foreground">Timeline: {path.timeline}</p>
              <Badge variant="secondary" className="mt-2">
                {path.complexity} Complexity
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatentsPage;
