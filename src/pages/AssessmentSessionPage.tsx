import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { ASSESSMENT_TOPICS, LANGUAGE_LABELS, type Language, type Difficulty } from '@/data/curriculum';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';
import {
  Play, Send, SkipForward, Lightbulb, ArrowLeft, Loader2, ChevronRight,
} from 'lucide-react';

import AssessmentProgressBar from '@/components/assessment/AssessmentProgressBar';
import AssessmentQuestionPanel from '@/components/assessment/AssessmentQuestionPanel';
import EvaluationResultCard from '@/components/assessment/EvaluationResultCard';
import HintPanel from '@/components/assessment/HintPanel';
import LevelUpScreen from '@/components/assessment/LevelUpScreen';
import TopicMasteredScreen from '@/components/assessment/TopicMasteredScreen';

type TabType = 'output' | 'results' | 'evaluation' | 'hints';

const NEXT_LEVEL: Record<string, Difficulty | null> = {
  easy: 'medium',
  medium: 'hard',
  hard: null,
};

export default function AssessmentSessionPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const [searchParams] = useSearchParams();
  const startLevel = (searchParams.get('level') || 'easy') as Difficulty;
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';

  const {
    session, currentQuestion, status, evaluation, levelProgress,
    hintLevel, currentHint, hintLoading, generating, evaluating,
    testResults, output, errorMessage,
    startSession, submitCode, runCode, skipQuestion, requestHint,
    advanceToNextLevel, nextQuestion, completeSession, abandonSession,
  } = useAssessment();

  const [language, setLanguage] = useState<Language>(preferredLang);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('output');

  const topic = ASSESSMENT_TOPICS.find(t => t.id === topicId);

  // Start session only once on mount (not on every user reference change)
  const sessionStartedRef = useRef(false);
  useEffect(() => {
    if (topicId && user && !sessionStartedRef.current) {
      sessionStartedRef.current = true;
      startSession(topicId, startLevel);
    }
  }, [topicId, user]);

  // Load starter code when question changes
  useEffect(() => {
    if (currentQuestion) {
      const starter = currentQuestion.starter_code as Record<Language, string>;
      if (starter?.[language]) {
        setCode(starter[language]);
      } else {
        // Language-appropriate fallback skeleton
        const fallbacks: Record<Language, string> = {
          python: "class Solution:\n    def solve(self):\n        # Write your solution here\n        pass\n",
          java: "class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}",
          cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};\n",
        };
        setCode(fallbacks[language] || fallbacks.python);
      }
      setActiveTab('output');
    }
  }, [currentQuestion?.id, language]);

  // Pre-fill stdin with first test case so Run works immediately
  useEffect(() => {
    if (currentQuestion) {
      const tcs = currentQuestion.test_cases as { input: string; expectedOutput: string }[];
      if (tcs?.length > 0) {
        setInput(tcs[0].input);
      }
    }
  }, [currentQuestion?.id]);

  // Switch to evaluation tab when eval completes
  useEffect(() => {
    if (evaluation) {
      setActiveTab('evaluation');
    }
  }, [evaluation]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to take assessments.</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Topic not found.</p>
      </div>
    );
  }

  const handleRun = () => {
    if (!code.trim()) return;
    let stdin = input;
    if (!stdin.trim() && currentQuestion) {
      const tcs = currentQuestion.test_cases as { input: string; expectedOutput: string }[];
      if (tcs?.length > 0) stdin = tcs[0].input;
    }
    runCode(code, language, stdin);
    setActiveTab('output');
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting.');
      return;
    }
    await submitCode(code, language);
  };

  const handleSkip = async () => {
    await skipQuestion();
  };

  const handleHint = () => {
    requestHint(code, language);
    setActiveTab('hints');
  };

  const handleLevelUpContinue = async () => {
    await advanceToNextLevel();
  };

  const handleMasteredComplete = async () => {
    await completeSession();
    navigate('/assessment');
  };

  const handleKeepPracticing = async () => {
    // Generate another hard question
    await nextQuestion();
  };

  const handleBack = async () => {
    await abandonSession();
    navigate('/assessment');
  };

  const currentLevel = (session?.current_level || startLevel) as Difficulty;
  const nextLevel = NEXT_LEVEL[currentLevel];

  // Determine level for mastered screen
  const determinedLevel = (() => {
    const lp = levelProgress;
    if (lp.hard.solved >= 1) return 'master';
    if (lp.medium.attempted > 0 && lp.medium.solved >= 2) return 'hard';
    if (lp.easy.attempted > 0 && lp.easy.solved >= 3) return 'medium';
    if (lp.easy.attempted > 0) return 'easy';
    return 'beginner';
  })();

  return (
    <div className="h-[calc(100vh-0px)] flex flex-col">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border" style={{ background: 'var(--gradient-card)' }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 px-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5 text-sm">
            <span>{topic.icon}</span>
            <span className="font-semibold">{topic.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className={`text-xs font-bold uppercase ${
              currentLevel === 'easy' ? 'text-dsa-green' :
              currentLevel === 'medium' ? 'text-amber' : 'text-destructive'
            }`}>
              {currentLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={v => setLanguage(v as Language)}>
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map(lang => (
                <SelectItem key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" onClick={handleHint} disabled={hintLevel >= 3 || hintLoading || generating || evaluating} className="h-7 text-xs">
            <Lightbulb className="w-3.5 h-3.5 mr-1" />
            Hint ({hintLevel}/3)
          </Button>
          <Button size="sm" variant="outline" onClick={handleSkip} disabled={generating || evaluating} className="h-7 text-xs">
            <SkipForward className="w-3.5 h-3.5 mr-1" />
            Skip
          </Button>
          <Button size="sm" variant="outline" onClick={handleRun} disabled={generating || evaluating} className="h-7 text-xs">
            <Play className="w-3.5 h-3.5 mr-1" />
            Run
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={generating || evaluating} className="h-7 text-xs">
            {evaluating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
            Submit
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <AssessmentProgressBar currentLevel={currentLevel} levelProgress={levelProgress} />

      {/* Main Content */}
      {status === 'error' ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-sm text-destructive font-semibold">Something went wrong</p>
            <p className="text-xs text-muted-foreground">{errorMessage || 'Failed to generate question.'}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={handleBack}>Back to Hub</Button>
              <Button size="sm" onClick={async () => { await abandonSession(); startSession(topicId!, startLevel); }}>Retry</Button>
            </div>
          </div>
        </div>
      ) : (generating && !currentQuestion) ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Generating your {currentLevel} question...</p>
          </div>
        </div>
      ) : currentQuestion ? (
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left: Question Panel */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={45}>
            <AssessmentQuestionPanel question={currentQuestion} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Editor + Output */}
          <ResizablePanel defaultSize={70} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={55} minSize={25}>
                <div className="h-full overflow-hidden">
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
                      automaticLayout: true,
                    }}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Bottom: Input + Tabs */}
              <ResizablePanel defaultSize={45} minSize={20}>
                <div className="h-full flex flex-col">
                  {/* Stdin */}
                  <div className="px-3 py-2 border-b border-border">
                    <Textarea
                      placeholder="Custom stdin (pre-filled from test case 1)"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="h-10 min-h-10 resize-none text-xs font-mono"
                    />
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    {(['output', 'results', 'evaluation', 'hints'] as TabType[]).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-xs capitalize transition-all border-b-2 ${
                          activeTab === tab
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab === 'results' ? 'Test Results' : tab === 'evaluation' ? 'AI Evaluation' : tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <ScrollArea className="flex-1">
                    {activeTab === 'output' && (
                      <pre className="p-3 text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                        {output || 'Run your code to see output here.'}
                      </pre>
                    )}

                    {activeTab === 'results' && (
                      <div className="p-3 space-y-2">
                        {testResults.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Submit your code to see test results.</p>
                        ) : (
                          testResults.map((tr, i) => (
                            <div key={i} className={`rounded-lg border p-2.5 text-xs ${
                              tr.passed ? 'border-dsa-green/30 bg-dsa-green/5' : 'border-destructive/30 bg-destructive/5'
                            }`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-semibold">Test Case {i + 1}</span>
                                <span className={tr.passed ? 'text-dsa-green font-bold' : 'text-destructive font-bold'}>
                                  {tr.passed ? 'PASS' : 'FAIL'}
                                </span>
                              </div>
                              <div className="space-y-1 font-mono">
                                <div><span className="text-muted-foreground">Input: </span>{tr.input}</div>
                                <div><span className="text-muted-foreground">Expected: </span>{tr.expected}</div>
                                {!tr.passed && <div><span className="text-muted-foreground">Got: </span><span className="text-destructive">{tr.got}</span></div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'evaluation' && (
                      evaluation ? (
                        <div>
                          <EvaluationResultCard evaluation={evaluation} difficulty={currentQuestion.difficulty} />
                          {/* Next question button after evaluation */}
                          {status === 'solving' && (
                            <div className="px-4 pb-4">
                              <Button className="w-full" onClick={() => nextQuestion()}>
                                Next Question
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : evaluating ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">AI is evaluating your code...</span>
                        </div>
                      ) : (
                        <p className="p-3 text-xs text-muted-foreground">Submit your code to get AI evaluation.</p>
                      )
                    )}

                    {activeTab === 'hints' && (
                      <HintPanel
                        hintLevel={hintLevel}
                        currentHint={currentHint}
                        hintLoading={hintLoading}
                        onRequestHint={handleHint}
                      />
                    )}
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Setting up your assessment...</p>
          </div>
        </div>
      )}

      {/* Level Up Dialog */}
      {status === 'level-up' && nextLevel && (
        <LevelUpScreen
          open={true}
          fromLevel={currentLevel}
          toLevel={nextLevel}
          levelProgress={levelProgress}
          topicTitle={topic.title}
          onContinue={handleLevelUpContinue}
          onBack={handleBack}
        />
      )}

      {/* Topic Mastered Dialog */}
      {status === 'mastered' && (
        <TopicMasteredScreen
          open={true}
          levelProgress={levelProgress}
          topicTitle={topic.title}
          determinedLevel={determinedLevel}
          onBack={handleMasteredComplete}
          onKeepPracticing={handleKeepPracticing}
        />
      )}
    </div>
  );
}
