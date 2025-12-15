import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ANALYSIS_SYSTEM_PROMPT = `You are Medlens AI, an expert pharmaceutical innovation analyst. Generate professional reports and analysis.

## Output Formats

For REPORT type:
Generate a structured CEO-ready presentation outline with:
- Executive Summary (3-4 bullet points)
- Market Opportunity (size, growth, trends)
- Competitive Landscape (key players, market share)
- Strategic Recommendation (GO/NO-GO with rationale)
- Risk Assessment (top 3 risks with mitigation)
- Timeline & Next Steps

For INVESTMENT_MEMO type:
Generate a structured investment memo with:
- Investment Thesis
- Market Analysis
- Competitive Advantage
- Financial Projections Summary
- Risk Factors
- Recommendation

For GO_NO_GO type:
Generate a decision slide with:
- Clear GO, CONDITIONAL GO, or NO-GO recommendation
- Key supporting evidence (3-5 points)
- Critical risks
- Required resources
- Decision deadline

For COMPETITOR_SIM type:
Simulate competitor responses with:
- Likely competitor moves (next 6-12 months)
- Market reaction scenarios
- Counter-strategies for each scenario
- Timing predictions

For SCORING type:
Return a JSON object with scores (1-100) and justifications for:
- science: Scientific validity and innovation
- market: Market potential and commercial viability
- risk: Risk level (inverted - higher = less risky)
- speed: Time to market
- cost: Cost efficiency (inverted - higher = lower cost)
- composite: Weighted average of all scores

Always be concise, professional, and data-driven. Use bullet points and clear headers.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context, ideaDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${type} analysis`);

    const userPrompt = type === "SCORING" 
      ? `Analyze this pharmaceutical innovation idea and provide scores. Return ONLY valid JSON with this structure:
{
  "science": { "score": <1-100>, "justification": "<brief explanation>" },
  "market": { "score": <1-100>, "justification": "<brief explanation>" },
  "risk": { "score": <1-100>, "justification": "<brief explanation, higher = less risky>" },
  "speed": { "score": <1-100>, "justification": "<brief explanation>" },
  "cost": { "score": <1-100>, "justification": "<brief explanation, higher = lower cost>" },
  "composite": { "score": <weighted average>, "justification": "<overall assessment>" }
}

Innovation idea: ${ideaDescription}
Context: ${context || 'General pharmaceutical innovation'}`
      : `Generate a ${type.replace('_', ' ')} for:
Innovation/Topic: ${ideaDescription}
Context: ${context || 'General pharmaceutical innovation'}

Provide a comprehensive, professional analysis suitable for executive presentation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("Analysis generated successfully");
    
    return new Response(JSON.stringify({ content, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
