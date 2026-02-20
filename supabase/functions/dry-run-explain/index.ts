import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert programming instructor. When given code, produce a structured dry-run trace as a JSON array of steps.

Each step must be an object with these fields:
- "line": line number (1-indexed integer) being executed
- "code": the exact code snippet for that line (string)
- "explanation": short plain-English explanation of what happens (string, max 100 chars)
- "variables": object of ALL current variable name→value pairs after this step (e.g. {"i": 0, "sum": 0})
- "highlight": "normal" | "branch" | "loop" | "return" | "error" (string)
- "arrayState": (optional) if the code involves an array/list, include this object:
  {
    "name": "arr",           // variable name of the array
    "values": [2, 5, 8, 12], // current array contents as primitives
    "highlightIndices": [2], // indices to highlight in cyan (current element being accessed)
    "pointers": {            // named pointers shown below cells (e.g. low/mid/high/i/j/left/right)
      "low": 0,
      "mid": 2,
      "high": 5
    },
    "keyValue": 8,           // (optional) the search key / target value shown above with a bubble
    "keyPointer": 2          // (optional) index where the key arrow points
  }

Rules:
- Return ONLY a valid JSON array, no markdown, no extra text
- Include every meaningful execution step (initialization, loop iterations, conditionals, function calls, returns)
- For loops, show each iteration as separate steps, updating arrayState pointers on each iteration
- Keep explanations concise and educational
- Variables should show their current value after the step executes
- Max 30 steps total (summarize if needed)
- For sorting algorithms, show the array mutating step by step with highlightIndices on elements being compared/swapped
- For search algorithms, always include low/mid/high pointers and keyValue`;

    const userPrompt = `Dry-run this ${language} code${input ? ` with stdin input: ${input}` : ""} and return the JSON step array:\n\n${code}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Strip markdown code fences if present
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return new Response(JSON.stringify({ steps: JSON.parse(cleaned) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dry-run error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
