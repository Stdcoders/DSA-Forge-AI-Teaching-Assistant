import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { questionTitle, questionDescription, difficulty, userCode, language, hintLevel, topicId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hintGuide =
      hintLevel === 1
        ? "Give a HIGH-LEVEL conceptual hint. DO NOT name the specific algorithm or data structure. Ask a guiding question that nudges the student toward the right approach. Example: 'Think about what happens when you process elements in a specific order... what if you could go back to previous elements efficiently?'"
        : hintLevel === 2
        ? "Name the technique/algorithm and outline the general approach WITHOUT pseudocode. Explain the intuition and why this technique works for this problem. Example: 'You should use a monotonic stack. The key insight is that for each element, you want to find the nearest element that satisfies a condition...'"
        : "Provide a DETAILED step-by-step walkthrough with pseudocode logic. Explain each step clearly. Do NOT write actual code in any programming language — use plain English pseudocode steps. Example: '1. Initialize an empty stack. 2. For each element from left to right: a. While stack is not empty and top of stack is less than current...'";

    const systemPrompt = `You are a helpful DSA tutor providing a hint for a coding assessment. The student is stuck and needs a nudge — not the answer.

CURRENT HINT LEVEL: ${hintLevel} of 3
${hintGuide}

ABSOLUTE RULES:
- NEVER provide actual code in any programming language
- NEVER provide the complete solution logic at hints 1 or 2
- Be encouraging — acknowledge what the student might already know
- Keep hints concise (2-4 sentences for level 1, 4-6 for level 2, step-by-step for level 3)`;

    const userPrompt = `Problem: ${questionTitle}
Description: ${questionDescription}
Difficulty: ${difficulty}
Topic: ${topicId}

${userCode ? `Student's current code:\n\`\`\`${language}\n${userCode}\n\`\`\`\n\nBased on their code, they seem to ${userCode.trim().split('\n').length <= 5 ? 'not have started much yet' : 'have some progress'}.` : 'The student has not written any code yet.'}

Please provide a level ${hintLevel} hint.`;

    const hintBody = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
    });

    const MAX_RETRIES = 4;
    let response!: Response;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        if (response && response.status === 429) {
          const retryAfter = parseInt(response.headers.get("retry-after") || "8", 10);
          await new Promise(resolve => setTimeout(resolve, Math.min(retryAfter * 1000, 20000)));
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: hintBody,
      });
      if (response.ok || response.status === 401 || response.status === 402) break;
      console.warn(`Groq hint attempt ${attempt + 1} failed with status ${response.status}, retrying...`);
    }

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("assessment-hint error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
