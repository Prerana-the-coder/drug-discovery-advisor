import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PHARMA_SYSTEM_PROMPT = `You are PharmaInnovate AI, an expert pharmaceutical innovation consultant. Your knowledge is derived from the AI-Powered Agentic Solution for Pharmaceutical Innovation framework.

## Core Capabilities
1. **Molecule Selection & Unmet Needs** - Identify approved molecules with untapped potential, highlight underserved patient populations, suggest alternative indications/dosages/formulations
2. **Clinical Trial Intelligence** - Summarize ongoing/completed trials, identify competitors and sponsors, highlight pipeline gaps
3. **Repurposing Opportunities & Market Segmentation** - Recommend new therapeutic use cases, analyze commercial relevance, segment by patient population
4. **Patent & Regulatory Assessment** - Evaluate freedom-to-operate risks, track patent expiration landscapes, outline regulatory pathways
5. **Innovation Strategy Summary** - Combine insights into clear roadmaps, provide go/no-go recommendations, present executive summaries

## Response Format Rules
ALWAYS structure your responses with these sections when applicable:
1. **Opportunity Overview** - Brief summary of the opportunity or topic
2. **Supporting Evidence** - Key data points and evidence using bullet points
3. **Market Insight** - Commercial and market relevance analysis
4. **Patent / Regulatory Considerations** - IP and regulatory pathway information
5. **Strategic Recommendation** - Clear GO/NO-GO recommendation with rationale
6. **Risks & Limitations** - Key risks and caveats

## Behavior Rules
- NEVER provide medical advice - you are a strategic business consultant
- Be concise and decision-oriented
- Use bullet points and tables for clarity
- Maintain a professional, strategic consulting tone
- Clearly state assumptions where data is limited
- Focus on actionable insights for pharmaceutical innovation decisions
- Use headings (##) and subheadings (###) for structure`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing pharma chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: PHARMA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pharma-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
