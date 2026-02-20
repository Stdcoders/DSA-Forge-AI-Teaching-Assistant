import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DSA_TOPIC_GRAPH = `
Arrays → Recursion → Linked Lists → Stacks/Queues → Trees → Graphs → Dynamic Programming
Prerequisites: Arrays has none. Recursion needs Arrays. LinkedLists needs Arrays+Recursion. Stacks/Queues needs LinkedLists. Trees needs Recursion+Stacks. Graphs needs Trees+Stacks. DP needs Recursion+Graphs.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, userProfile, currentTopicId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are an expert DSA (Data Structures & Algorithms) tutor for DSA Forge, an interactive learning platform.

STUDENT PROFILE:
- Experience Level: ${userProfile?.experience_level || "beginner"}
- Preferred Language: ${userProfile?.preferred_language || "python"}
- Learning Goal: ${userProfile?.learning_goal || "learn fundamentals"}
${currentTopicId ? `- Currently studying: ${currentTopicId.replace(/-/g, " ")}` : ""}

DSA CURRICULUM DEPENDENCY GRAPH:
${DSA_TOPIC_GRAPH}

YOUR ROLE:
1. Explain DSA concepts clearly with examples in ${userProfile?.preferred_language || "python"}
2. Guide students based on their experience level (${userProfile?.experience_level || "beginner"})
3. Respect prerequisites — never recommend a topic before its prerequisites are done
4. Suggest Easy → Medium → Hard problem progression
5. Be encouraging, concise, and practical
6. When asked "what to study next", use the dependency graph and their profile

FORMAT: Use markdown with code blocks. Keep explanations targeted to ${userProfile?.experience_level || "beginner"} level.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
