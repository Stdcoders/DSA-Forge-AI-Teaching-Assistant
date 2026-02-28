import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LANGUAGE_IDS, type Language } from '@/data/curriculum';
import { Play, RotateCcw } from 'lucide-react';

const JUDGE0_URL = 'https://ce.judge0.com';

interface TryItEditorProps {
  initialCode: string;
  language: Language;
  testCases?: { input: string; expectedOutput: string }[];
}

export default function TryItEditor({ initialCode, language, testCases }: TryItEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState(testCases?.[0]?.input || '');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setOutput('Running...');
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
      if (!res.ok) { setOutput('Execution service unavailable.'); setRunning(false); return; }
      const data = await res.json();
      setOutput(data.stdout || data.stderr || data.compile_output || 'No output');
    } catch {
      setOutput('Judge0 unavailable.');
    }
    setRunning(false);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setInput(testCases?.[0]?.input || '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
      {/* Editor side */}
      <div className="flex flex-col border-r border-border">
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-semibold text-primary">✏️ Code Editor</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleReset}>
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
            <Button size="sm" className="h-7 text-xs bg-dsa-green hover:bg-dsa-green/90 text-foreground" onClick={handleRun} disabled={running}>
              <Play className="w-3 h-3 mr-1" /> {running ? 'Running...' : 'Run Code ▶'}
            </Button>
          </div>
        </div>
        <div className="h-[280px]">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(v) => setCode(v || '')}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on', scrollBeyondLastLine: false, padding: { top: 8 } }}
          />
        </div>
      </div>

      {/* Output side */}
      <div className="flex flex-col">
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-semibold">📥 Input</span>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input here..."
          className="min-h-[60px] max-h-[80px] rounded-none border-0 border-b border-border text-xs font-mono resize-none focus-visible:ring-0"
        />
        <div className="px-3 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs font-semibold">📤 Output</span>
        </div>
        <pre className="flex-1 p-3 text-xs font-mono whitespace-pre-wrap overflow-auto min-h-[140px] bg-background">
          {output || <span className="text-muted-foreground italic">Click "Run Code" to see output...</span>}
        </pre>

        {/* Quick test cases */}
        {testCases && testCases.length > 0 && (
          <div className="px-3 py-2 border-t border-border bg-muted/30">
            <span className="text-[10px] text-muted-foreground font-semibold block mb-1">Quick Test Inputs:</span>
            <div className="flex gap-1 flex-wrap">
              {testCases.slice(0, 3).map((tc, i) => (
                <button
                  key={i}
                  onClick={() => setInput(tc.input)}
                  className="text-[10px] px-2 py-0.5 rounded bg-muted border border-border hover:bg-accent transition-colors font-mono"
                >
                  {tc.input.length > 20 ? tc.input.slice(0, 20) + '…' : tc.input}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
