import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LANGUAGE_IDS, LANGUAGE_LABELS, type Language } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import DryRunPanel, { type DryRunStep } from '@/components/DryRunPanel';
import { generateLocalDryRun } from '@/data/sampleDryRuns';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Code2 } from 'lucide-react';

const JUDGE0_URL = 'https://ce.judge0.com';

const DEFAULT_CODE: Record<Language, string> = {
  python: `# Write your code here\ndef solution():\n    pass\n\nprint(solution())`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
};

export default function CodeEditorPage() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';
  const initialLang = (searchParams.get('lang') as Language) || preferredLang;

  const [language, setLanguage] = useState<Language>(initialLang);
  const [code, setCode] = useState(DEFAULT_CODE[initialLang]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [dryRunSteps, setDryRunSteps] = useState<DryRunStep[]>([]);
  const [loadingDryRun, setLoadingDryRun] = useState(false);
  const [dryRunError, setDryRunError] = useState('');
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput('');
    setDryRunSteps([]);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    try {
      const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_code: code, language_id: LANGUAGE_IDS[language], stdin: input }),
      });
      if (!res.ok) {
        setOutput('⚠️ Execution service unavailable. Please try again.');
        setRunning(false);
        return;
      }
      const data = await res.json();
      if (data.status?.id === 3) setOutput(data.stdout || '(no output)');
      else if (data.compile_output) setOutput('Compilation Error:\n' + data.compile_output);
      else if (data.stderr) setOutput('Runtime Error:\n' + data.stderr);
      else setOutput(`Status: ${data.status?.description || 'Unknown'}\n${data.stdout || ''}`);
    } catch {
      setOutput('Connection error. Judge0 may be unavailable.');
    }
    setRunning(false);
  };

  const handleDryRun = async () => {
    if (!code.trim()) return;
    setLoadingDryRun(true);
    setDryRunSteps([]);
    setDryRunError('');
    setIsOfflineDemo(false);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const MAX_RETRIES = 4;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/dry-run-explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            code, 
            language, 
            input,
            problemTitle: "User Code Execution", 
            problemDescription: "General code execution trace. User might be writing custom unsaved logic." 
          }),
          signal: controller.signal,
        });
        if (!resp.ok) {
          const err = await resp.json();
          if (resp.status === 429) toast.error('Rate limit reached.');
          else if (resp.status === 402) toast.error('AI credits exhausted.');
          else toast.error(err.error || 'Dry run failed');
          setLoadingDryRun(false);
          return;
        }
        const data = await resp.json();
        if (data.steps && Array.isArray(data.steps)) setDryRunSteps(data.steps);
        else toast.error('Could not parse dry run steps');
        setLoadingDryRun(false);
        return;
      } catch {
        if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 1000 * attempt));
        else {
          const fallback = generateLocalDryRun(code);
          setDryRunSteps(fallback);
          setIsOfflineDemo(true);
          toast('Using offline demo — connect to see your actual code traced', { icon: '📡' });
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
    setLoadingDryRun(false);
  };

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, language, input]);

  const codeLines = code.split('\n');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border flex-shrink-0 bg-card">
        <Code2 className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground">DSA AI Code Studio</span>

        <div className="ml-auto flex items-center gap-2">
          <Select value={language} onValueChange={v => handleLanguageChange(v as Language)}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_LABELS).map(([id, label]) => (
                <SelectItem key={id} value={id}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" onClick={handleRun} disabled={running}
            className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs">
            {running ? '⏳ Running...' : '▶ Run Code'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDryRun} disabled={loadingDryRun}
            className="h-8 text-xs">
            🔍 {loadingDryRun ? 'Analyzing...' : 'Dry Run'}
          </Button>
          <span className="text-[10px] text-muted-foreground hidden sm:inline ml-1">Ctrl+Enter to run</span>
        </div>
      </div>

      {/* Resizable panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left: Editor */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={v => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              lineNumbers: 'on',
              automaticLayout: true,
            }}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Output + Dry Run stacked */}
        <ResizablePanel defaultSize={45} minSize={25}>
          <ResizablePanelGroup direction="vertical">
            {/* Output */}
            <ResizablePanel defaultSize={45} minSize={15}>
              <div className="h-full flex flex-col bg-card">
                <div className="px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  📤 Output
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {output ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-foreground">{output}</pre>
                  ) : (
                    <div className="text-muted-foreground text-sm text-center mt-8">
                      <div className="text-3xl mb-2">▶</div>
                      <p>Click <strong>Run Code</strong> to see output here</p>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Dry Run */}
            <ResizablePanel defaultSize={55} minSize={15}>
              <div className="h-full flex flex-col bg-card">
                <div className="px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  🔍 AI Dry Run
                </div>
                <div className="flex-1 overflow-hidden">
                  <DryRunPanel
                    steps={dryRunSteps}
                    isLoading={loadingDryRun}
                    codeLines={codeLines}
                    error={dryRunError}
                    onRetry={handleDryRun}
                    isOfflineDemo={isOfflineDemo}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
