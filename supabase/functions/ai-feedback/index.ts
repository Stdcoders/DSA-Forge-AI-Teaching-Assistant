import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language, problemTitle, problemDescription, testResults } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const failedTests = (testResults || []).filter((t: any) => !t.passed);
    const passedCount = (testResults || []).filter((t: any) => t.passed).length;
    const totalTests = (testResults || []).length;

    const systemPrompt = `You are an expert DSA code reviewer. Analyze the student's solution and provide constructive, educational feedback.

Structure your response as:
1. **Assessment** — Brief verdict (accepted/needs improvement) and why
2. **What You Did Well** — Acknowledge correct parts
3. **Issues Found** — Specific bugs or logical errors (Syntax/Logical/Conceptual)
4. **Correct Approach** — Explain the right algorithm/approach
5. **Optimized Solution** — Show a cleaner solution in the same language
6. **Key Takeaway** — One sentence learning point

Be encouraging and educational, not just critical.`;

    const userPrompt = `Problem: ${problemTitle}
Description: ${problemDescription}

Student's ${language} solution:
\`\`\`${language}
${code}
\`\`\`

Test results: ${passedCount}/${totalTests} passed
${failedTests.length > 0 ? `Failed cases: ${failedTests.slice(0, 3).map((t: any) => `Input: ${t.input} | Expected: ${t.expected} | Got: ${t.got}`).join('\n')}` : ''}

Please provide detailed feedback.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("ai-feedback error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
