import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language, questionTitle, questionDescription, difficulty, testResults, topicId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const passedCount = (testResults || []).filter((t: any) => t.passed).length;
    const totalTests = (testResults || []).length;
    const failedTests = (testResults || []).filter((t: any) => !t.passed);

    const systemPrompt = `You are an expert DSA code evaluator for a coding assessment platform. Analyze the student's solution and provide a structured evaluation.

SCORING RUBRIC (total 100 points):

1. Correctness (40 points):
   - All tests pass: 40 points
   - Partial pass: (passed/total) * 32 + 5 for reasonable attempt
   - No tests pass but approach is correct: 10-15 points
   - Code is mostly starter code or empty: 0 points

2. Approach Quality (25 points):
   - Uses the optimal/expected algorithm: 20-25 points
   - Correct but suboptimal approach: 12-18 points
   - Brute force but works: 5-10 points
   - Wrong approach: 0-4 points

3. Complexity Awareness (20 points):
   - Optimal time and space complexity: 18-20 points
   - Correct time, suboptimal space (or vice versa): 10-15 points
   - Poor complexity but functional: 5-8 points

4. Code Quality (15 points):
   - Clean, readable, good naming: 12-15 points
   - Functional but messy: 6-10 points
   - Minimal effort: 0-5 points

PASS THRESHOLDS:
- Easy: score >= 60
- Medium: score >= 55
- Hard: score >= 50

Be fair but rigorous. A student passing all tests with brute force should still pass but get a lower score.
If the submitted code is essentially the starter code unchanged, score should be 0 with passed=false.`;

    const userPrompt = `Problem: ${questionTitle}
Description: ${questionDescription}
Difficulty: ${difficulty}
Topic: ${topicId}

Student's ${language} solution:
\`\`\`${language}
${code}
\`\`\`

Test results: ${passedCount}/${totalTests} passed
${failedTests.length > 0 ? `Failed cases:\n${failedTests.slice(0, 3).map((t: any) => `  Input: ${t.input} | Expected: ${t.expected} | Got: ${t.got}`).join('\n')}` : 'All test cases passed.'}

Evaluate this submission.`;

    const evalBody = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "evaluate_submission",
            description: "Return a structured evaluation of the code submission",
            parameters: {
              type: "object",
              properties: {
                score: { type: "integer", description: "Total score 0-100" },
                passed: { type: "boolean", description: "Whether the submission passes the threshold for this difficulty" },
                feedback: { type: "string", description: "Detailed feedback explaining the evaluation" },
                correctnessScore: { type: "integer", description: "Correctness score out of 40" },
                algorithmScore: { type: "integer", description: "Algorithm/approach score out of 25" },
                codeQualityScore: { type: "integer", description: "Code quality score out of 15" },
                complexityScore: { type: "integer", description: "Complexity awareness score out of 20" },
                suggestion: { type: "string", description: "One specific suggestion for improvement" },
              },
              required: ["score", "passed", "feedback", "correctnessScore", "algorithmScore", "codeQualityScore", "complexityScore"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "evaluate_submission" } },
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
        body: evalBody,
      });
      if (response.ok || response.status === 401 || response.status === 402) break;
      console.warn(`Groq eval attempt ${attempt + 1} failed with status ${response.status}, retrying...`);
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Failed to evaluate submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No evaluation generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const evaluation = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-assessment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
