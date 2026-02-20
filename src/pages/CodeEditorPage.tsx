import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TOPICS, LANGUAGE_IDS, LANGUAGE_LABELS, type Language } from '@/data/curriculum';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

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
  const initialTopicId = searchParams.get('topicId') || '';
  const initialLang = (searchParams.get('lang') as Language) || preferredLang;

  const [language, setLanguage] = useState<Language>(initialLang);
  const [code, setCode] = useState(DEFAULT_CODE[initialLang]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [dryRunResult, setDryRunResult] = useState('');
  const [loadingDryRun, setLoadingDryRun] = useState(false);
  const [activePanel, setActivePanel] = useState<'output' | 'dryrun'>('output');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput('');
    setDryRunResult('');
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    setActivePanel('output');

    try {
      const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleDryRun = async () => {
    if (!code.trim()) return;
    setLoadingDryRun(true);
    setDryRunResult('');
    setActivePanel('dryrun');

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
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
            if (content) setDryRunResult(prev => prev + content);
          } catch {}
        }
      }
    } catch (e) {
      toast.error('Failed to connect to AI service');
    }
    setLoadingDryRun(false);
  };

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
        <div className="w-96 border-l border-border flex flex-col flex-shrink-0"
          style={{ background: 'hsl(var(--card))' }}>
          {/* Tabs */}
          <div className="flex border-b border-border">
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

          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'output' ? (
              <div>
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
              <div>
                {loadingDryRun && !dryRunResult && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="ai-pulse text-primary">●</span>
                    Analyzing code step by step...
                  </div>
                )}
                {dryRunResult ? (
                  <div className="prose-dark text-sm leading-relaxed whitespace-pre-wrap">{dryRunResult}</div>
                ) : !loadingDryRun && (
                  <div className="text-muted-foreground text-sm text-center mt-8">
                    <div className="text-3xl mb-2">🔍</div>
                    <p>Click "Dry Run" to get a step-by-step explanation of your code</p>
                    <p className="mt-2 text-xs">AI will trace variable values and explain each step</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
