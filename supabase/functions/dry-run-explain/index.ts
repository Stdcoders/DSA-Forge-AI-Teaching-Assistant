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

    const systemPrompt = `You are an expert CS visualization instructor. When given code, produce a rich structured dry-run trace as a JSON array of steps for a visual algorithm player.

Each step must have ALL of these fields:
- "line": line number (1-indexed integer)
- "code": exact code snippet for that line
- "explanation": plain-English explanation of WHAT is happening conceptually (not just what the code says). Max 120 chars. Be educational and visual — e.g. "Comparing mid element 16 with key 23. Key is larger, so we eliminate the left half."
- "conceptNote": a very short note about the algorithm concept happening (e.g. "Binary Elimination", "Swap", "Pivot Selection", "Base Case"). Max 30 chars.
- "variables": object of ALL current variable name→value pairs after this step
- "highlight": "normal" | "branch" | "loop" | "return" | "error"
- "arrayState": (REQUIRED whenever code works with an array/list — include in EVERY step once the array exists, updating it each step):
  {
    "name": "arr",
    "values": [...],          // full array as primitive values
    "highlightIndices": [],   // indices currently being compared/accessed (shown in cyan/primary)
    "swappedIndices": [],     // indices just swapped (shown briefly in amber)
    "sortedIndices": [],      // indices already in final position (shown in green)
    "pointers": {             // named pointers below cells; use actual variable names from the code
      "low": 0,
      "mid": 4,
      "high": 9
    },
    "keyValue": 23,           // search target or pivot value if applicable
    "keyPointer": 5           // index where the key currently matches or null
  }

IMPORTANT RULES:
- Return ONLY a valid JSON array. No markdown, no code fences, no extra text.
- For every loop iteration, produce a separate step with updated arrayState.
- highlightIndices = elements being compared RIGHT NOW this step
- swappedIndices = elements that JUST got swapped this step  
- sortedIndices = elements already confirmed in correct position
- pointers must use the actual variable names from the code (i, j, left, right, low, mid, high, etc.)
- Keep explanations conceptual and educational — explain WHY, not just what
- Max 35 steps total`;

    const userPrompt = `Dry-run this ${language} code${input ? ` with stdin: ${input}` : ""} and return the visual JSON step array:\n\n${code}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    return new Response(JSON.stringify({ steps: JSON.parse(cleaned) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("dry-run error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
