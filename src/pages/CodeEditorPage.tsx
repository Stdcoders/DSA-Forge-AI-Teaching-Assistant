import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TOPICS, LANGUAGE_IDS, LANGUAGE_LABELS, type Language } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import DryRunPanel, { type DryRunStep } from '@/components/DryRunPanel';

const JUDGE0_URL = 'https://ce.judge0.com';

const DEFAULT_CODE: Record<Language, string> = {
  python: `# Write your code here
def solution():
    pass

print(solution())`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, World!");
    }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
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
  const [activePanel, setActivePanel] = useState<'output' | 'dryrun'>('output');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput('');
    setDryRunSteps([]);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    setActivePanel('output');

    try {
      const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin: input,
        }),
      });

      if (!res.ok) {
        setOutput('⚠️ Execution service unavailable. Please try again or use a local environment.\n\nTip: For full Judge0 support, configure an API key.');
        setRunning(false);
        return;
      }

      const data = await res.json();
      if (data.status?.id === 3) {
        setOutput(data.stdout || '(no output)');
      } else if (data.compile_output) {
        setOutput('Compilation Error:\n' + data.compile_output);
      } else if (data.stderr) {
        setOutput('Runtime Error:\n' + data.stderr);
      } else {
        setOutput(`Status: ${data.status?.description || 'Unknown'}\n${data.stdout || ''}`);
      }
    } catch (e) {
      setOutput('Connection error. Judge0 may be unavailable.');
    }
    setRunning(false);
  };

  const [dryRunError, setDryRunError] = useState('');

  const handleDryRun = async () => {
    if (!code.trim()) return;
    setLoadingDryRun(true);
    setDryRunSteps([]);
    setDryRunError('');
    setActivePanel('dryrun');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/dry-run-explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ code, language, input }),
        });

        if (!resp.ok) {
          const err = await resp.json();
          if (resp.status === 429) toast.error('Rate limit reached. Please wait a moment.');
          else if (resp.status === 402) toast.error('AI credits exhausted. Please add credits.');
          else toast.error(err.error || 'Dry run failed');
          setLoadingDryRun(false);
          return;
        }

        const data = await resp.json();
        if (data.steps && Array.isArray(data.steps)) {
          setDryRunSteps(data.steps);
        } else {
          toast.error('Could not parse dry run steps');
        }
        setLoadingDryRun(false);
        return;
      } catch (e) {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000));
        } else {
          setDryRunError('Network error. Please check your connection and try again.');
          toast.error('Failed to connect after multiple attempts');
        }
      }
    }
    setLoadingDryRun(false);
  };

  const codeLines = code.split('\n');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0"
        style={{ background: 'hsl(var(--card))' }}>
        <div className="font-semibold text-sm gradient-text-brand">Code Editor</div>
        <Select value={language} onValueChange={v => handleLanguageChange(v as Language)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANGUAGE_LABELS).map(([id, label]) => (
              <SelectItem key={id} value={id}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={handleRun} disabled={running}
            style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
            {running ? '⏳ Running...' : '▶ Run Code'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDryRun} disabled={loadingDryRun}>
            🔍 {loadingDryRun ? 'Analyzing...' : 'Dry Run'}
          </Button>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1">
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
          </div>
          {/* Stdin */}
          <div className="border-t border-border flex-shrink-0"
            style={{ background: 'hsl(var(--muted))' }}>
            <div className="px-4 pt-2 pb-1 text-xs text-muted-foreground font-mono">stdin (optional)</div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full px-4 pb-2 bg-transparent text-sm font-mono resize-none focus:outline-none text-foreground"
              rows={3}
              placeholder="Enter input for your program..."
            />
          </div>
        </div>

        {/* Output/Dry Run Panel */}
        <div className="w-96 border-l border-border flex flex-col flex-shrink-0 overflow-hidden"
          style={{ background: 'hsl(var(--card))' }}>
          {/* Tabs */}
          <div className="flex border-b border-border flex-shrink-0">
            {(['output', 'dryrun'] as const).map(tab => (
              <button key={tab} onClick={() => setActivePanel(tab)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activePanel === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                {tab === 'output' ? '📤 Output' : '🔍 Dry Run'}
              </button>
            ))}
          </div>
          {/* Panel content — full height, no extra padding wrapper */}

          {activePanel === 'output' ? (
            <div className="flex-1 overflow-y-auto p-4 animate-fade-in">
              {output ? (
                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-foreground">{output}</pre>
              ) : (
                <div className="text-muted-foreground text-sm text-center mt-8">
                  <div className="text-3xl mb-2">▶</div>
                  <p>Run your code to see output here</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <DryRunPanel
                steps={dryRunSteps}
                isLoading={loadingDryRun}
                codeLines={codeLines}
                error={dryRunError}
                onRetry={handleDryRun}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
