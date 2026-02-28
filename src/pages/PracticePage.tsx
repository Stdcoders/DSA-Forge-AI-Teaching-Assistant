import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TOPICS, LANGUAGE_IDS, LANGUAGE_LABELS, type Language, type Problem } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import DryRunPanel, { type DryRunStep } from '@/components/DryRunPanel';
import { ScrollArea } from '@/components/ui/scroll-area';

const JUDGE0_URL = 'https://ce.judge0.com';

type TabType = 'output' | 'results' | 'feedback' | 'dryrun';

export default function PracticePage() {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topic') || TOPICS[0].id;
  const problemIdParam = searchParams.get('problem');
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';

  const [selectedTopicId, setSelectedTopicId] = useState(topicId);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [language, setLanguage] = useState<Language>(preferredLang);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<{ input: string; expected: string; got: string; passed: boolean }[]>([]);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('output');
  const [dryRunSteps, setDryRunSteps] = useState<DryRunStep[]>([]);
  const [loadingDryRun, setLoadingDryRun] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  const selectedTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];
  const filteredProblems = selectedTopic.problems.filter(p =>
    diffFilter === 'all' || p.difficulty === diffFilter
  );

  useEffect(() => {
    const problem = problemIdParam
      ? selectedTopic.problems.find(p => p.id === problemIdParam)
      : filteredProblems[0];
    if (problem) {
      setSelectedProblem(problem);
      setCode(problem.starterCode[language]);
    }
  }, [selectedTopicId, problemIdParam, language]);

  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[language]);
      setTestResults([]);
      setOutput('');
      setAiFeedback('');
      setDryRunSteps([]);
    }
  }, [language, selectedProblem]);

  const runOnJudge0 = async (sourceCode: string, stdin: string): Promise<string> => {
    try {
      const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: LANGUAGE_IDS[language],
          stdin,
        }),
      });
      if (!res.ok) return 'Execution service unavailable.';
      const data = await res.json();
      return data.stdout || data.stderr || data.compile_output || 'No output';
    } catch {
      return 'Judge0 unavailable.';
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setActiveTab('output');
    setOutput('Running...');
    const result = await runOnJudge0(code, input);
    setOutput(result);
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !user) return;
    setSubmitting(true);
    setTestResults([]);
    setActiveTab('results');

    const results = await Promise.all(
      selectedProblem.testCases.map(async tc => {
        const got = await runOnJudge0(code, tc.input);
        const gotTrimmed = got.trim();
        const expectedTrimmed = tc.expectedOutput.trim();
        const passed = gotTrimmed === expectedTrimmed || gotTrimmed.includes(expectedTrimmed);
        return { input: tc.input, expected: tc.expectedOutput, got: gotTrimmed, passed };
      })
    );

    setTestResults(results);
    const passedCount = results.filter(r => r.passed).length;
    const verdict = passedCount === results.length ? 'accepted' : 'wrong_answer';

    await supabase.from('submissions').insert({
      user_id: user.id,
      problem_id: selectedProblem.id,
      topic_id: selectedTopicId,
      language,
      code,
      verdict,
      test_cases_passed: passedCount,
      test_cases_total: results.length,
    });

    const today = new Date().toISOString().split('T')[0];
    await supabase.from('daily_activity').upsert({
      user_id: user.id,
      activity_date: today,
      problems_solved: passedCount > 0 ? 1 : 0,
    }, { onConflict: 'user_id,activity_date' });

    if (verdict === 'accepted') {
      toast.success(`✅ All ${passedCount} test cases passed!`);
    } else {
      toast.error(`${passedCount}/${results.length} test cases passed`);
    }
    setSubmitting(false);
  };

  const handleAIFeedback = async () => {
    if (!selectedProblem || !code) return;
    setLoadingFeedback(true);
    setActiveTab('feedback');
    setAiFeedback('');
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          code, language,
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          testResults,
        }),
      });
      if (!resp.ok) {
        toast.error('AI feedback failed');
        setLoadingFeedback(false);
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
            if (content) setAiFeedback(prev => prev + content);
          } catch {}
        }
      }
    } catch {
      toast.error('Failed to get AI feedback');
    }
    setLoadingFeedback(false);
  };

  const [dryRunError, setDryRunError] = useState('');

  const handleDryRun = async () => {
    if (!code.trim()) return;
    setLoadingDryRun(true);
    setDryRunSteps([]);
    setDryRunError('');
    setActiveTab('dryrun');

    const MAX_RETRIES = 4;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dry-run-explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ code, language, input }),
          signal: controller.signal,
        });
        if (!resp.ok) {
          toast.error('Dry run failed');
          setLoadingDryRun(false);
          return;
        }
        const data = await resp.json();
        setDryRunSteps(data.steps || []);
        setLoadingDryRun(false);
        return;
      } catch {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        } else {
          setDryRunError('Network error. Try refreshing the page or check your connection.');
          toast.error('Failed to connect after multiple attempts');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
    setLoadingDryRun(false);
  };

  const TAB_LABELS: Record<TabType, string> = {
    output: '▶ Output',
    results: `✓ Tests (${testResults.filter(r => r.passed).length}/${testResults.length})`,
    feedback: '🤖 AI Feedback',
    dryrun: '🔍 Dry Run',
  };

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border flex-shrink-0 bg-card flex-wrap">
        <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TOPICS.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-2 py-1 rounded text-xs capitalize transition-all ${
                diffFilter === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted'
              }`}>
              {d}
            </button>
          ))}
        </div>

        <button onClick={() => setLeftPanelOpen(v => !v)}
          className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground hover:text-foreground transition-colors">
          {leftPanelOpen ? '◀ Hide' : '▶ Problems'}
        </button>

        <div className="flex-1" />

        <Button onClick={handleRun} disabled={running} size="sm" className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
          {running ? '⏳ Running...' : '▶ Run Code'}
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} size="sm" className="h-8 text-xs"
          style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
          {submitting ? '⏳ Submitting...' : '✓ Submit'}
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleDryRun} disabled={loadingDryRun}>
          🔍 {loadingDryRun ? 'Generating...' : 'Dry Run'}
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleAIFeedback} disabled={loadingFeedback}>
          🤖 {loadingFeedback ? 'Analyzing...' : 'AI Feedback'}
        </Button>

        <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGE_LABELS).map(([id, label]) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Problem List + Description */}
        {leftPanelOpen && (
          <div className="w-80 border-r border-border flex-shrink-0 flex flex-col overflow-hidden bg-card">
            {/* Problem list */}
            <div className="border-b border-border max-h-48 overflow-y-auto flex-shrink-0">
              {filteredProblems.map(problem => (
                <button key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  className={`w-full text-left px-3 py-2 border-b border-border/50 transition-colors ${
                    selectedProblem?.id === problem.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted'
                  }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      problem.difficulty === 'easy' ? 'badge-easy' :
                      problem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-xs font-medium leading-tight truncate">{problem.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Problem description */}
            {selectedProblem && (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="font-bold text-sm">{selectedProblem.title}</h2>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        selectedProblem.difficulty === 'easy' ? 'badge-easy' :
                        selectedProblem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                      }`}>{selectedProblem.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedProblem.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold">Examples</h3>
                    {selectedProblem.examples.map((ex, i) => (
                      <div key={i} className="p-2 rounded-lg bg-muted text-[11px] font-mono space-y-0.5">
                        <div><span className="text-muted-foreground">Input: </span>{ex.input}</div>
                        <div><span className="text-muted-foreground">Output: </span>{ex.output}</div>
                        {ex.explanation && <div className="text-muted-foreground">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold mb-1">Constraints</h3>
                    <ul className="space-y-0.5">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i} className="text-[11px] text-muted-foreground font-mono">• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <button onClick={() => navigate(`/curriculum/${selectedTopicId}`)}
                    className="text-xs text-primary hover:underline">
                    ← View Theory
                  </button>
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Center — Editor + stdin */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
              }}
            />
          </div>

          <div className="border-t border-border bg-card p-2 flex-shrink-0">
            <label className="text-[10px] text-muted-foreground mb-1 block">Standard Input (stdin)</label>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter input here..."
              className="font-mono text-xs h-14 resize-none bg-muted border-border"
            />
          </div>
        </div>

        {/* Right Panel — Tabs */}
        <div className="w-96 border-l border-border flex-shrink-0 flex flex-col overflow-hidden bg-card">
          <div className="flex gap-1 px-3 pt-2 pb-2 border-b border-border flex-shrink-0 flex-wrap">
            {(['output', 'results', 'feedback', 'dryrun'] as TabType[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-2 py-1 text-[11px] rounded transition-colors ${
                  activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted'
                }`}>
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          <div className={`flex-1 ${activeTab === 'dryrun' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {activeTab === 'output' && (
              <div className="p-4">
                {output ? (
                  <pre className="text-sm font-mono whitespace-pre-wrap text-foreground bg-muted rounded-lg p-3">{output}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground">Click "▶ Run Code" to execute your code with the stdin input.</p>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="p-4 space-y-3">
                {testResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Click "✓ Submit" to run your code against all test cases.</p>
                ) : (
                  <>
                    <div className={`p-3 rounded-lg text-sm font-semibold ${
                      testResults.every(r => r.passed)
                        ? 'bg-dsa-green/10 text-dsa-green'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {testResults.every(r => r.passed)
                        ? `✅ Accepted — All ${testResults.length} test cases passed!`
                        : `❌ Wrong Answer — ${testResults.filter(r => r.passed).length}/${testResults.length} passed`}
                    </div>
                    {testResults.map((r, i) => (
                      <div key={i} className={`rounded-lg border p-3 space-y-2 ${
                        r.passed ? 'border-dsa-green/30 bg-dsa-green/5' : 'border-destructive/30 bg-destructive/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            r.passed ? 'bg-dsa-green/20 text-dsa-green' : 'bg-destructive/20 text-destructive'
                          }`}>
                            {r.passed ? '✓ PASS' : '✗ FAIL'}
                          </span>
                          <span className="text-xs text-muted-foreground">Test Case {i + 1}</span>
                        </div>
                        <div className="text-xs font-mono space-y-1">
                          <div><span className="text-muted-foreground">Input: </span><span className="text-foreground">{r.input}</span></div>
                          <div><span className="text-muted-foreground">Expected: </span><span className="text-dsa-green">{r.expected}</span></div>
                          {!r.passed && (
                            <div><span className="text-muted-foreground">Got: </span><span className="text-destructive">{r.got || 'No output'}</span></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="p-4 prose-dark text-sm leading-relaxed whitespace-pre-wrap">
                {loadingFeedback && !aiFeedback ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="ai-pulse">●</span> Analyzing your code...
                  </div>
                ) : aiFeedback ? (
                  aiFeedback
                ) : (
                  <p className="text-muted-foreground">Click "🤖 AI Feedback" to get analysis of your code.</p>
                )}
              </div>
            )}

            {activeTab === 'dryrun' && (
              dryRunSteps.length > 0 || loadingDryRun || dryRunError ? (
                <DryRunPanel
                  steps={dryRunSteps}
                  isLoading={loadingDryRun}
                  codeLines={code.split('\n')}
                  error={dryRunError}
                  onRetry={handleDryRun}
                />
              ) : (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">Click "🔍 Dry Run" to see a step-by-step execution trace of your code.</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
