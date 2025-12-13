import { FlaskConical, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const molecules = [
  {
    name: "Metformin",
    indication: "Type 2 Diabetes",
    potential: "Anti-aging, Oncology",
    status: "High Potential",
    unmetNeed: "Longevity therapeutics",
  },
  {
    name: "Rapamycin",
    indication: "Immunosuppression",
    potential: "Anti-aging, Neurodegeneration",
    status: "Under Review",
    unmetNeed: "Age-related diseases",
  },
  {
    name: "Sildenafil",
    indication: "Erectile Dysfunction",
    potential: "Pulmonary Arterial Hypertension",
    status: "Approved",
    unmetNeed: "Cardiovascular rare diseases",
  },
  {
    name: "Thalidomide",
    indication: "Sedative (withdrawn)",
    potential: "Multiple Myeloma, Leprosy",
    status: "Approved",
    unmetNeed: "Hematological malignancies",
  },
  {
    name: "Aspirin",
    indication: "Pain/Inflammation",
    potential: "Colorectal Cancer Prevention",
    status: "Under Investigation",
    unmetNeed: "Cancer chemoprevention",
  },
];

const MoleculesPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Molecule Selection & Unmet Needs</h1>
            <p className="text-muted-foreground">
              Identify approved molecules with untapped potential
            </p>
          </div>
        </div>
        <Link to="/dashboard/chat">
          <Button variant="gradient">
            Ask AI About Molecules
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search molecules, indications, or therapeutic areas..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Molecules Analyzed</p>
          <p className="text-3xl font-bold">2,847</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">High Potential Candidates</p>
          <p className="text-3xl font-bold text-primary">156</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Unmet Needs Identified</p>
          <p className="text-3xl font-bold text-accent">89</p>
        </div>
      </div>

      {/* Molecules Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold">Top Repurposing Candidates</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Molecule</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Original Indication</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Repurposing Potential</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Unmet Need</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {molecules.map((molecule, index) => (
                <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <span className="font-medium">{molecule.name}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{molecule.indication}</td>
                  <td className="p-4 text-muted-foreground">{molecule.potential}</td>
                  <td className="p-4 text-muted-foreground">{molecule.unmetNeed}</td>
                  <td className="p-4">
                    <Badge 
                      variant={molecule.status === "High Potential" ? "default" : "secondary"}
                      className={molecule.status === "High Potential" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                    >
                      {molecule.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoleculesPage;
