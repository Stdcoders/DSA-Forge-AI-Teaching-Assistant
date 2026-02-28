import { useState, useEffect, useRef, useCallback } from 'react';
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
import { ArrowLeft, ArrowRight, Lightbulb, Play, Pause, SkipForward, RotateCcw, Sparkles, Volume2, VolumeX, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import TryItEditor from '@/components/TryItEditor';
import SolutionVisualizer from '@/components/SolutionVisualizer';
import InlineTutor from '@/components/InlineTutor';

// ─── Section Navigation ───
const SECTIONS = [
  { id: 'problem', label: '📋 Problem', icon: '📋' },
  { id: 'concepts', label: '🧠 Concepts', icon: '🧠' },
  { id: 'visual', label: '📊 Visual', icon: '📊' },
  { id: 'tryit', label: '✏️ Try It', icon: '✏️' },
  { id: 'approaches', label: '🚀 Approaches', icon: '🚀' },
  { id: 'ai-explain', label: '✨ AI Explain', icon: '✨' },
  { id: 'tutor', label: '🤖 AI Tutor', icon: '🤖' },
];

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
  const [activeSection, setActiveSection] = useState('problem');

  // Voice narration state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const topic = TOPICS.find(t => t.id === topicId);
  const problem = topic?.problems.find(p => p.id === problemId);

  // Find prev/next problem
  const allProblems = topic?.problems || [];
  const currentIdx = allProblems.findIndex(p => p.id === problemId);
  const prevProblem = currentIdx > 0 ? allProblems[currentIdx - 1] : null;
  const nextProblem = currentIdx < allProblems.length - 1 ? allProblems[currentIdx + 1] : null;

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

  // Track scroll position for section nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach(s => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [problem]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

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

  const keyConcepts = [
    { title: 'Definition', content: topic.definition },
    { title: 'Analogy', content: topic.analogy },
    { title: 'Why Use It', content: topic.whyUseIt },
  ];

  function getApproaches() {
    return [
      {
        name: 'Brute Force',
        badge: 'Basic',
        badgeClass: 'bg-dsa-green/20 text-dsa-green',
        description: `Start with the simplest approach. Walk through the problem step by step.`,
        steps: [
          { title: 'Understand the Problem', description: `Read "${problem!.title}" carefully. Identify inputs and expected outputs.`, highlight: 'concept' },
          { title: 'Identify the Pattern', description: `This is a ${topic.title} problem. Think about what operations you need.`, highlight: 'pattern' },
          { title: 'Write the Logic', description: `Use basic loops and conditions to solve it directly.`, highlight: 'code' },
          { title: 'Test with Examples', description: `Verify with: ${problem!.examples[0]?.input || 'sample input'} → ${problem!.examples[0]?.output || 'expected output'}`, highlight: 'test' },
          { title: 'Analyze Complexity', description: `Determine time and space complexity.`, highlight: 'analyze' },
        ],
        complexity: { time: 'O(n²) or O(n)', space: 'O(1) or O(n)' },
        code: problem!.starterCode[language] + `\n\n# Brute force approach\n# Time: O(n²) | Space: O(1)`,
      },
      {
        name: 'Optimized',
        badge: 'Efficient',
        badgeClass: 'bg-primary/20 text-primary',
        description: `Optimize using ${topic.title} techniques.`,
        steps: [
          { title: 'Spot the Bottleneck', description: `Identify what makes the brute force slow.`, highlight: 'concept' },
          { title: 'Apply Technique', description: `Use ${topic.title} concepts: ${topic.definition.slice(0, 80)}...`, highlight: 'pattern' },
          { title: 'Optimize Access', description: `Use appropriate data structures for O(1) lookups.`, highlight: 'optimize' },
          { title: 'Implement', description: `Write clean, readable optimized code.`, highlight: 'code' },
          { title: 'Verify', description: `Compare with brute force on test cases.`, highlight: 'test' },
        ],
        complexity: { time: 'O(n) or O(n log n)', space: 'O(n) or O(1)' },
        code: problem!.starterCode[language] + `\n\n# Optimized using ${topic.title}\n# Time: O(n) | Space: O(1)`,
      },
    ];
  }

  const approaches = getApproaches();

  // ─── AI Explain ───
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
            content: `Explain the problem "${problem.title}" in detail.\n\nDescription: ${problem.description}\n\nExamples:\n${problem.examples.map(e => `Input: ${e.input} → Output: ${e.output}`).join('\n')}\n\nProvide:\n1. Clear explanation\n2. Key observations\n3. Brute force approach with code in ${language}\n4. Optimized approach with code in ${language}\n5. Time and space complexity\n6. Common mistakes`
          }],
          userProfile: profile,
          currentTopicId: topicId,
        }),
      });

      if (!resp.ok) { toast.error('AI explanation failed'); setLoadingAI(false); return; }

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

  // ─── Voice Narration ───
  const handleSpeak = useCallback(() => {
    if (!aiExplanation) {
      toast.error('Generate an AI explanation first');
      return;
    }
    window.speechSynthesis.cancel();
    // Strip markdown for cleaner speech
    const plainText = aiExplanation.replace(/[#*`_\[\]()>-]/g, '').replace(/\n+/g, '. ');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  }, [aiExplanation]);

  const handlePauseSpeech = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-card flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/practice?topic=${topicId}&problem=${problemId}`)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="h-4 w-px bg-border" />
        <Lightbulb className="w-4 h-4 text-dsa-amber" />
        <h1 className="font-semibold text-sm truncate">{problem.title} — Solution Guide</h1>
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

      {/* Sticky Section Navigation */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/30 overflow-x-auto flex-shrink-0">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollToSection(s.id)}
            className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">

          {/* ═══ Problem Statement ═══ */}
          <div id="problem" ref={el => { sectionRefs.current['problem'] = el; }}>
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
          </div>

          {/* ═══ Key Concepts ═══ */}
          <div id="concepts" ref={el => { sectionRefs.current['concepts'] = el; }}>
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
          </div>

          {/* ═══ Interactive Visual Diagram ═══ */}
          <div id="visual" ref={el => { sectionRefs.current['visual'] = el; }}>
            <SolutionVisualizer
              topicId={topicId || ''}
              activeStep={activeStep}
              totalSteps={approaches[0]?.steps.length || 5}
              problemTitle={problem.title}
            />
          </div>

          {/* ═══ Try It Yourself ═══ */}
          <div id="tryit" ref={el => { sectionRefs.current['tryit'] = el; }}>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  ✏️ Try It Yourself
                  <span className="text-[10px] px-2 py-0.5 rounded bg-dsa-green/20 text-dsa-green border border-dsa-green/30 font-normal">W3Schools Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TryItEditor
                  initialCode={problem.starterCode[language]}
                  language={language}
                  testCases={problem.testCases}
                />
              </CardContent>
            </Card>
          </div>

          {/* ═══ Solution Approaches ═══ */}
          <div id="approaches" ref={el => { sectionRefs.current['approaches'] = el; }}>
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

                      {/* Step-by-step walkthrough */}
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

                      {/* Code */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold">Code Template</h4>
                        <pre className="p-4 rounded-lg bg-muted text-xs font-mono overflow-x-auto whitespace-pre-wrap border border-border">
                          {approach.code}
                        </pre>
                      </div>

                      {/* Complexity */}
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-muted/50 border border-border flex-1">
                          <span className="text-[10px] text-muted-foreground block mb-0.5">⏱ Time</span>
                          <span className="text-sm font-mono font-semibold text-primary">{approach.complexity.time}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-border flex-1">
                          <span className="text-[10px] text-muted-foreground block mb-0.5">💾 Space</span>
                          <span className="text-sm font-mono font-semibold text-dsa-purple">{approach.complexity.space}</span>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* ═══ AI Explanation with Voice ═══ */}
          <div id="ai-explain" ref={el => { sectionRefs.current['ai-explain'] = el; }}>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-dsa-amber" /> AI Deep Explanation
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Voice Controls */}
                    {aiExplanation && (
                      <div className="flex items-center gap-1 border border-border rounded-md px-1">
                        {!isSpeaking ? (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSpeak}>
                            <Volume2 className="w-3 h-3 mr-1" /> Listen
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handlePauseSpeech}>
                              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleStopSpeech}>
                              <Square className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    <Button onClick={handleAIExplain} disabled={loadingAI} size="sm" className="h-8 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {loadingAI ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingAI && !aiExplanation ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                    <span className="ai-pulse">●</span> Analyzing problem and generating explanation...
                  </div>
                ) : aiExplanation ? (
                  <div className="prose-dark text-sm leading-relaxed">
                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4">
                    Click "Generate" for a comprehensive AI breakdown with full solutions in {language}.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ═══ AI Tutor ═══ */}
          <div id="tutor" ref={el => { sectionRefs.current['tutor'] = el; }}>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">🤖 AI Tutor — Ask Follow-up Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineTutor
                  problemTitle={problem.title}
                  problemDescription={problem.description}
                  topicTitle={topic.title}
                  topicId={topicId || ''}
                  examples={problem.examples}
                />
              </CardContent>
            </Card>
          </div>

          {/* ═══ Prev / Next Navigation ═══ */}
          <div className="flex items-center justify-between py-4 border-t border-border">
            {prevProblem ? (
              <Button variant="outline" size="sm" onClick={() => navigate(`/solution/${topicId}/${prevProblem.id}`)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> {prevProblem.title}
              </Button>
            ) : <div />}
            {nextProblem ? (
              <Button variant="outline" size="sm" onClick={() => navigate(`/solution/${topicId}/${nextProblem.id}`)}>
                {nextProblem.title} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : <div />}
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
