import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient?: "primary" | "accent";
  stats?: { label: string; value: string }[];
}

export function ModuleCard({ 
  icon: Icon, 
  title, 
  description, 
  href,
  gradient = "primary",
  stats 
}: ModuleCardProps) {
  return (
    <Link to={href} className="group block">
      <div className="glass-card h-full p-6 rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-1 hover:border-primary/30">
        <div className={cn(
          "inline-flex p-3 rounded-xl mb-4",
          gradient === "primary" 
            ? "bg-primary/10 text-primary" 
            : "bg-accent/10 text-accent"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4">
          {description}
        </p>

        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center text-primary font-medium text-sm">
          Explore
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
