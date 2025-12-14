import { Link } from "react-router-dom";
import { FlaskConical } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 bg-card/50">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <FlaskConical className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-bold text-lg">Medlens</span>
              <p className="text-xs text-muted-foreground">Designed & Developed by Pre</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/dashboard/chat" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Assistant
            </Link>
            <Link to="/dashboard/molecules" className="text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Medlens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
