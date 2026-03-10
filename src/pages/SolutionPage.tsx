import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOPICS, type Language } from '@/data/curriculum';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Lightbulb, Play, Pause, SkipForward, RotateCcw, Sparkles } from 'lucide-react';

export default function SolutionPage() {
  const { topicId, problemId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';

  const [language, setLanguage] = useState<Language>(preferredLang);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const topic = TOPICS.find(t => t.id === topicId);
  const problem = topic?.problems.find(p => p.id === problemId);

  // Auto-step animation
  useEffect(() => {
    if (!isPlaying || !problem) return;
    const approaches = getApproaches();
    const currentApproach = approaches[0];
    if (!currentApproach) return;
    const maxSteps = currentApproach.steps.length - 1;
    if (activeStep >= maxSteps) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setActiveStep(s => s + 1), 1500);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, problem]);

  if (!topic || !problem) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Problem not found</p>
          <Button onClick={() => navigate('/practice')}>← Back to Practice</Button>
        </div>
      </div>
    );
  }

  // Extract key concepts from the topic's theory
  const keyConcepts = [
    { title: 'Definition', content: topic.definition },
    { title: 'Analogy', content: topic.analogy },
    { title: 'Why Use It', content: topic.whyUseIt },
  ];

  // Generate solution approaches based on problem difficulty
  function getApproaches() {
    const approaches = [
      {
        name: 'Brute Force',
        badge: 'Basic',
        badgeClass: 'bg-dsa-green/20 text-dsa-green',
        description: `Start with the simplest approach. Walk through the problem step by step, checking every possibility.`,
        steps: [
          { title: 'Understand the Problem', description: `Read "${problem!.title}" carefully. Identify inputs and expected outputs.`, highlight: 'concept' },
          { title: 'Identify the Pattern', description: `This is a ${topic.title} problem. Think about what operations you need.`, highlight: 'pattern' },
          { title: 'Write the Logic', description: `Use basic loops and conditions to solve it directly. Don't worry about optimization yet.`, highlight: 'code' },
          { title: 'Test with Examples', description: `Verify with: ${problem!.examples[0]?.input || 'sample input'} → ${problem!.examples[0]?.output || 'expected output'}`, highlight: 'test' },
          { title: 'Analyze Complexity', description: `Determine the time and space complexity of your brute force solution.`, highlight: 'analyze' },
        ],
        complexity: { time: 'O(n²) or O(n)', space: 'O(1) or O(n)' },
        code: problem!.starterCode[language] + `\n\n# Brute force: iterate through all possibilities\n# Time: O(n²) | Space: O(1)`,
      },
      {
        name: 'Optimized',
        badge: 'Efficient',
        badgeClass: 'bg-primary/20 text-primary',
        description: `Optimize using ${topic.title} techniques. Reduce redundant computations.`,
        steps: [
          { title: 'Spot the Bottleneck', description: `Identify what makes the brute force slow — repeated work, unnecessary comparisons, etc.`, highlight: 'concept' },
          { title: 'Apply the Right Technique', description: `Use ${topic.title} concepts: ${topic.definition.slice(0, 100)}...`, highlight: 'pattern' },
          { title: 'Optimize Data Access', description: `Use appropriate data structures for O(1) lookups or sorted access patterns.`, highlight: 'optimize' },
          { title: 'Implement Cleanly', description: `Write clean, readable code that implements the optimized approach.`, highlight: 'code' },
          { title: 'Verify & Compare', description: `Compare with brute force on the same test cases. Ensure correctness first, then performance.`, highlight: 'test' },
        ],
        complexity: { time: 'O(n) or O(n log n)', space: 'O(n) or O(1)' },
        code: problem!.starterCode[language] + `\n\n# Optimized approach using ${topic.title} techniques\n# Time: O(n) | Space: O(1)`,
      },
    ];
    return approaches;
  }

  const approaches = getApproaches();

  const handleAIExplain = async () => {
    setLoadingAI(true);
    setAiExplanation('');
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Explain the problem "${problem.title}" in detail.\n\nDescription: ${problem.description}\n\nExamples:\n${problem.examples.map(e => `Input: ${e.input} → Output: ${e.output}`).join('\n')}\n\nProvide:\n1. A clear explanation of what the problem asks\n2. Key observations and patterns\n3. A brute force approach with code in ${language}\n4. An optimized approach with code in ${language}\n5. Time and space complexity for both\n6. Common mistakes to avoid`
          }],
          userProfile: profile,
          currentTopicId: topicId,
        }),
      });

      if (!resp.ok) {
        toast.error('AI explanation failed');
        setLoadingAI(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) setAiExplanation(prev => prev + content);
          } catch {}
        }
      }
    } catch {
      toast.error('Failed to get AI explanation');
    }
    setLoadingAI(false);
  };

  const HIGHLIGHT_COLORS: Record<string, string> = {
    concept: 'border-primary bg-primary/10',
    pattern: 'border-dsa-purple bg-dsa-purple/10',
    code: 'border-dsa-cyan bg-dsa-cyan/10',
    test: 'border-dsa-green bg-dsa-green/10',
    analyze: 'border-dsa-amber bg-dsa-amber/10',
    optimize: 'border-primary bg-primary/10',
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/practice?topic=${topicId}&problem=${problemId}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Practice
        </Button>
        <div className="h-4 w-px bg-border" />
        <Lightbulb className="w-4 h-4 text-dsa-amber" />
        <h1 className="font-semibold text-sm">{problem.title} — Solution Guide</h1>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
          problem.difficulty === 'easy' ? 'badge-easy' :
          problem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
        }`}>{problem.difficulty}</span>
        <div className="flex-1" />
        <Select value={language} onValueChange={v => setLanguage(v as Language)}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">

          {/* Problem Statement */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">📋 Problem Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
              <div className="space-y-2">
                {problem.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted text-xs font-mono space-y-1">
                    <div><span className="text-muted-foreground">Input: </span><span className="text-foreground">{ex.input}</span></div>
                    <div><span className="text-muted-foreground">Output: </span><span className="text-foreground">{ex.output}</span></div>
                    {ex.explanation && <div className="text-muted-foreground italic mt-1">{ex.explanation}</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">🧠 Key Concepts — {topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {keyConcepts.map((concept, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-muted/50 space-y-1">
                    <h4 className="text-xs font-semibold text-primary">{concept.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{concept.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Solution Approaches */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">🚀 Solution Approaches</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="approach-0">
                <TabsList className="mb-4">
                  {approaches.map((a, i) => (
                    <TabsTrigger key={i} value={`approach-${i}`} className="text-xs">
                      {a.name}
                      <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${a.badgeClass}`}>{a.badge}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {approaches.map((approach, i) => (
                  <TabsContent key={i} value={`approach-${i}`} className="space-y-4">
                    <p className="text-sm text-muted-foreground">{approach.description}</p>

                    {/* Step-by-step animated walkthrough */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold">Step-by-Step Walkthrough</h4>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => { setActiveStep(0); setIsPlaying(false); }}>
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setActiveStep(s => Math.min(s + 1, approach.steps.length - 1))}>
                            <SkipForward className="w-3 h-3" />
                          </Button>
                          <span className="text-[10px] text-muted-foreground ml-2">
                            Step {activeStep + 1}/{approach.steps.length}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {approach.steps.map((step, si) => (
                          <div
                            key={si}
                            onClick={() => { setActiveStep(si); setIsPlaying(false); }}
                            className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-500 ${
                              si === activeStep
                                ? `${HIGHLIGHT_COLORS[step.highlight]} scale-[1.01] shadow-md`
                                : si < activeStep
                                ? 'border-border bg-muted/30 opacity-60'
                                : 'border-border bg-muted/10 opacity-40'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                si === activeStep ? 'bg-primary text-primary-foreground' :
                                si < activeStep ? 'bg-muted-foreground/30 text-muted-foreground' : 'bg-muted text-muted-foreground'
                              }`}>{si + 1}</span>
                              <h5 className="text-xs font-semibold">{step.title}</h5>
                            </div>
                            {(si === activeStep || si < activeStep) && (
                              <p className="text-xs text-muted-foreground ml-7 animate-fade-in">{step.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Code implementation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold">Code Template</h4>
                      <pre className="p-4 rounded-lg bg-muted text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-border">
                        {approach.code}
                      </pre>
                    </div>

                    {/* Complexity */}
                    <div className="flex gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 border border-border flex-1">
                        <span className="text-[10px] text-muted-foreground block mb-0.5">⏱ Time Complexity</span>
                        <span className="text-sm font-mono font-semibold text-primary">{approach.complexity.time}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border flex-1">
                        <span className="text-[10px] text-muted-foreground block mb-0.5">💾 Space Complexity</span>
                        <span className="text-sm font-mono font-semibold text-dsa-purple">{approach.complexity.space}</span>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-dsa-amber" /> AI Deep Explanation
                </CardTitle>
                <Button onClick={handleAIExplain} disabled={loadingAI} size="sm" className="h-8 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {loadingAI ? 'Generating...' : 'Generate AI Explanation'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAI && !aiExplanation ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                  <span className="ai-pulse">●</span> AI is analyzing this problem and generating a detailed explanation...
                </div>
              ) : aiExplanation ? (
                <div className="prose-dark text-sm leading-relaxed">
                  <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  Click "Generate AI Explanation" to get a comprehensive, personalized breakdown of this problem with full solutions in {language}.
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
