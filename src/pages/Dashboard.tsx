import { 
  FlaskConical, 
  Activity, 
  TrendingUp, 
  FileCheck, 
  Lightbulb, 
  MessageSquare,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const modules = [
  {
    icon: FlaskConical,
    title: "Molecule Selection & Unmet Needs",
    description: "Identify approved molecules with untapped potential and underserved patient populations.",
    href: "/dashboard/molecules",
    gradient: "primary" as const,
    stats: [
      { label: "Molecules Analyzed", value: "2,847" },
      { label: "Opportunities", value: "156" },
    ],
  },
  {
    icon: Activity,
    title: "Clinical Trial Intelligence",
    description: "Summarize trials, identify competitors, and highlight pipeline gaps.",
    href: "/dashboard/trials",
    gradient: "accent" as const,
    stats: [
      { label: "Active Trials", value: "12.4K" },
      { label: "Competitors", value: "89" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Repurposing & Market Segmentation",
    description: "Discover new therapeutic use cases and analyze commercial relevance.",
    href: "/dashboard/repurposing",
    gradient: "primary" as const,
    stats: [
      { label: "Use Cases", value: "423" },
      { label: "Market Segments", value: "34" },
    ],
  },
  {
    icon: FileCheck,
    title: "Patent & Regulatory Assessment",
    description: "Evaluate FTO risks, track patents, and outline regulatory pathways.",
    href: "/dashboard/patents",
    gradient: "accent" as const,
    stats: [
      { label: "Patents Tracked", value: "8.2K" },
      { label: "Expiring Soon", value: "127" },
    ],
  },
  {
    icon: Lightbulb,
    title: "Innovation Strategy Summary",
    description: "Combined insights with go/no-go recommendations for executives.",
    href: "/dashboard/strategy",
    gradient: "primary" as const,
    stats: [
      { label: "Strategies", value: "45" },
      { label: "Go Decisions", value: "28" },
    ],
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Innovation Dashboard</h1>
          <p className="text-muted-foreground">
            Accelerate pharmaceutical discovery with AI-powered insights
          </p>
        </div>
        <Link to="/dashboard/chat">
          <Button variant="gradient" size="lg">
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask AI Assistant
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Active Projects</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-accent mt-1">+3 this month</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Insights Generated</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold">1,284</p>
          <p className="text-xs text-primary mt-1">+156 this week</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Go Decisions</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-bold">18</p>
          <p className="text-xs text-muted-foreground mt-1">75% success rate</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Time Saved</span>
            <ArrowUpRight className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-bold">847h</p>
          <p className="text-xs text-accent mt-1">vs traditional methods</p>
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Innovation Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
