import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Download, Presentation, FileCheck, CircleCheck, CircleX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

type ReportType = "REPORT" | "INVESTMENT_MEMO" | "GO_NO_GO";

const reportTypes = [
  { id: "REPORT" as ReportType, label: "CEO PPT", icon: Presentation, description: "Executive presentation outline" },
  { id: "INVESTMENT_MEMO" as ReportType, label: "Investment Memo", icon: FileText, description: "Investment thesis document" },
  { id: "GO_NO_GO" as ReportType, label: "Go/No-Go", icon: FileCheck, description: "Decision recommendation" },
];

export function ReportGenerator() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState<ReportType>("REPORT");
  const [reports, setReports] = useState<Record<ReportType, string | null>>({
    REPORT: null,
    INVESTMENT_MEMO: null,
    GO_NO_GO: null,
  });
  const { toast } = useToast();

  const generateReport = async (type: ReportType) => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-analysis", {
        body: { type, ideaDescription: topic, context },
      });

      if (error) throw error;
      setReports((prev) => ({ ...prev, [type]: data.content }));
      toast({ title: "Report generated successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error generating report", description: String(err), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = (type: ReportType) => {
    const content = reports[type];
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.toLowerCase().replace("_", "-")}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Topic / Innovation</label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Drug repurposing opportunity for metformin in oncology..."
            className="min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Context (optional)</label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Additional context, data points, or requirements..."
            className="min-h-[60px]"
          />
        </div>

        <Tabs value={activeType} onValueChange={(v) => setActiveType(v as ReportType)}>
          <TabsList className="grid grid-cols-3 w-full">
            {reportTypes.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {reportTypes.map(({ id, description }) => (
            <TabsContent key={id} value={id} className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="flex gap-2">
                  {reports[id] && (
                    <Button variant="outline" size="sm" onClick={() => downloadReport(id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button
                    onClick={() => generateReport(id)}
                    disabled={isLoading}
                    size="sm"
                    variant="gradient"
                  >
                    {isLoading && activeType === id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </div>

              {reports[id] ? (
                <ScrollArea className="h-[400px] rounded-xl border border-border bg-card p-4">
                  <div className="whitespace-pre-wrap text-sm">{reports[id]}</div>
                </ScrollArea>
              ) : (
                <div className="h-[200px] rounded-xl border border-dashed border-border flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Generate a report to see results</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
