import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TOPICS, LANGUAGE_IDS, LANGUAGE_LABELS, type Language, type Problem } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';

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
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ input: string; expected: string; got: string; passed: boolean }[]>([]);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'feedback'>('results');

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
      setResults([]);
      setAiFeedback('');
    }
  }, [language, selectedProblem]);

  const runOnJudge0 = async (code: string, input: string): Promise<string> => {
    try {
      const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': 'DEMO', // Public demo key for limited usage
        },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin: input,
        }),
      });

      if (!submitRes.ok) {
        // Fallback: simulate output for demo
        return 'Execution service unavailable. Please try the Code Editor page.';
      }

      const data = await submitRes.json();
      return data.stdout || data.stderr || data.compile_output || 'No output';
    } catch {
      return 'Judge0 unavailable. Using simulation mode.';
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !user) return;
    setRunning(true);
    setResults([]);

    const testResults = await Promise.all(
      selectedProblem.testCases.map(async tc => {
        const got = await runOnJudge0(code, tc.input);
        const gotTrimmed = got.trim();
        const expectedTrimmed = tc.expectedOutput.trim();
        const passed = gotTrimmed === expectedTrimmed || gotTrimmed.includes(expectedTrimmed);
        return { input: tc.input, expected: tc.expectedOutput, got: gotTrimmed, passed };
      })
    );

    setResults(testResults);
    const passedCount = testResults.filter(r => r.passed).length;
    const verdict = passedCount === testResults.length ? 'accepted' : 'wrong_answer';

    // Save submission
    await supabase.from('submissions').insert({
      user_id: user.id,
      problem_id: selectedProblem.id,
      topic_id: selectedTopicId,
      language,
      code,
      verdict,
      test_cases_passed: passedCount,
      test_cases_total: testResults.length,
    });

    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('daily_activity').upsert({
      user_id: user.id,
      activity_date: today,
      problems_solved: passedCount > 0 ? 1 : 0,
    }, { onConflict: 'user_id,activity_date' });

    if (verdict === 'accepted') {
      toast.success(`✅ All ${passedCount} test cases passed!`);
    } else {
      toast.error(`${passedCount}/${testResults.length} test cases passed`);
    }

    setRunning(false);
    setActiveTab('results');
  };

  const handleAIFeedback = async () => {
    if (!selectedProblem || !code) return;
    setLoadingFeedback(true);
    setActiveTab('feedback');
    setAiFeedback('');

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          code,
          language,
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          testResults: results,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        toast.error(err.error || 'AI feedback failed');
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
    } catch (e) {
      toast.error('Failed to get AI feedback');
    }
    setLoadingFeedback(false);
  };

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0"
        style={{ background: 'hsl(var(--card))' }}>
        {/* Topic selector */}
        <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty filter */}
        <div className="flex gap-1">
          {['all', 'easy', 'medium', 'hard'].map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                diffFilter === d ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted'
              }`}
              style={diffFilter === d ? { background: 'hsl(var(--primary))' } : {}}>
              {d}
            </button>
          ))}
        </div>

        {/* Language selector */}
        <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
          <SelectTrigger className="w-32 ml-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGE_LABELS).map(([id, label]) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Problem List */}
        <div className="w-48 border-r border-border flex-shrink-0 overflow-y-auto"
          style={{ background: 'hsl(var(--sidebar-background))' }}>
          {filteredProblems.map(problem => (
            <button key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className={`w-full text-left p-3 border-b border-border transition-colors ${
                selectedProblem?.id === problem.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted'
              }`}>
              <div className={`text-xs px-1.5 py-0.5 rounded inline-block mb-1 ${
                problem.difficulty === 'easy' ? 'badge-easy' :
                problem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
              }`}>
                {problem.difficulty}
              </div>
              <div className="text-sm font-medium leading-tight">{problem.title}</div>
            </button>
          ))}
        </div>

        {/* Main Area */}
        {selectedProblem ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Problem Description */}
            <div className="w-80 border-r border-border overflow-y-auto flex-shrink-0 p-4 space-y-4"
              style={{ background: 'hsl(var(--card))' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-bold text-base">{selectedProblem.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    selectedProblem.difficulty === 'easy' ? 'badge-easy' :
                    selectedProblem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                  }`}>{selectedProblem.difficulty}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedProblem.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Examples</h3>
                {selectedProblem.examples.map((ex, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted text-xs font-mono space-y-1">
                    <div><span className="text-muted-foreground">Input: </span>{ex.input}</div>
                    <div><span className="text-muted-foreground">Output: </span>{ex.output}</div>
                    {ex.explanation && <div className="text-muted-foreground">{ex.explanation}</div>}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {selectedProblem.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-muted-foreground font-mono">• {c}</li>
                  ))}
                </ul>
              </div>

              <button onClick={() => navigate(`/curriculum/${selectedTopicId}`)}
                className="text-xs text-primary hover:underline">
                ← View Theory
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
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

              {/* Actions */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0"
                style={{ background: 'hsl(var(--card))' }}>
                <Button onClick={handleSubmit} disabled={running}
                  style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
                  {running ? '⏳ Running...' : '▶ Submit'}
                </Button>
                <Button variant="outline" onClick={handleAIFeedback} disabled={loadingFeedback}>
                  🤖 {loadingFeedback ? 'Analyzing...' : 'AI Feedback'}
                </Button>
              </div>

              {/* Results Panel */}
              {(results.length > 0 || aiFeedback) && (
                <div className="border-t border-border flex-shrink-0 max-h-56 overflow-y-auto"
                  style={{ background: 'hsl(var(--muted))' }}>
                  <div className="flex gap-1 px-4 pt-3">
                    {(['results', 'feedback'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                          activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                        }`}>
                        {tab === 'results' ? `Test Results (${results.filter(r => r.passed).length}/${results.length})` : 'AI Feedback'}
                      </button>
                    ))}
                  </div>
                  <div className="p-4">
                    {activeTab === 'results' && results.map((r, i) => (
                      <div key={i} className={`flex items-start gap-3 p-2 rounded-lg mb-2 ${r.passed ? 'bg-dsa-green/10' : 'bg-destructive/10'}`}>
                        <span className={r.passed ? 'verdict-accepted' : 'verdict-wrong'}>
                          {r.passed ? '✓' : '✗'}
                        </span>
                        <div className="text-xs font-mono">
                          <div>Expected: <span className="text-dsa-green">{r.expected}</span></div>
                          {!r.passed && <div>Got: <span className="text-destructive">{r.got || 'No output'}</span></div>}
                        </div>
                      </div>
                    ))}
                    {activeTab === 'feedback' && (
                      <div className="prose-dark text-sm leading-relaxed whitespace-pre-wrap">
                        {loadingFeedback && !aiFeedback ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="ai-pulse">●</span> Analyzing your code...
                          </div>
                        ) : aiFeedback}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a problem to start practicing
          </div>
        )}
      </div>
    </div>
  );
}
