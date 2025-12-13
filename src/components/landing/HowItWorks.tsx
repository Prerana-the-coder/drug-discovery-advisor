import { MessageSquare, Database, LineChart, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Ask Natural Language Questions",
    description: "Simply type your pharmaceutical innovation queries in plain English. Our AI understands complex scientific and business contexts.",
  },
  {
    icon: Database,
    step: "02",
    title: "AI Analyzes Your Data",
    description: "The system processes your uploaded pharmaceutical data, extracting insights using advanced NLP and machine learning models.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Receive Structured Insights",
    description: "Get actionable recommendations with supporting evidence, market analysis, and strategic considerations in clear, decision-ready formats.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Make Informed Decisions",
    description: "Use go/no-go recommendations and executive summaries to accelerate your innovation pipeline with confidence.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            How PharmaInnovate AI Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From question to actionable insight in minutes, not months.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.step}
                className="relative flex gap-6 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-300"
              >
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <span className="text-xs font-bold text-primary tracking-wider">
                    STEP {step.step}
                  </span>
                  <h3 className="font-display text-lg font-semibold mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (for desktop) */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
