import { 
  FlaskConical, 
  Activity, 
  TrendingUp, 
  FileCheck, 
  Lightbulb,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FlaskConical,
    title: "Molecule Selection & Unmet Needs",
    description: "Identify approved molecules with untapped potential and highlight underserved patient populations.",
    href: "/dashboard/molecules",
    color: "primary",
  },
  {
    icon: Activity,
    title: "Clinical Trial Intelligence",
    description: "Summarize ongoing trials, identify competitors, and highlight pipeline gaps in real-time.",
    href: "/dashboard/trials",
    color: "accent",
  },
  {
    icon: TrendingUp,
    title: "Repurposing & Market Segmentation",
    description: "Discover new therapeutic use cases and analyze commercial relevance by patient segment.",
    href: "/dashboard/repurposing",
    color: "primary",
  },
  {
    icon: FileCheck,
    title: "Patent & Regulatory Assessment",
    description: "Evaluate freedom-to-operate risks, track patent landscapes, and outline regulatory pathways.",
    href: "/dashboard/patents",
    color: "accent",
  },
  {
    icon: Lightbulb,
    title: "Innovation Strategy Summary",
    description: "Combine insights into clear roadmaps with go/no-go recommendations for executives.",
    href: "/dashboard/strategy",
    color: "primary",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Comprehensive Innovation Modules
          </h2>
          <p className="text-lg text-muted-foreground">
            Five integrated modules powered by AI to transform your pharmaceutical innovation process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card h-full p-6 rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-1 hover:border-primary/30">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  feature.color === 'primary' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-accent/10 text-accent'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore Module
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
