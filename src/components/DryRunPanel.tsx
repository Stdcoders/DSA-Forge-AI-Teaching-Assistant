import { useCallback, useEffect, useRef, useState } from 'react';
import AlgoArray, { type ArrayState } from './AlgoArray';

export interface DryRunStep {
  line: number;
  code: string;
  explanation: string;
  conceptNote?: string;
  variables: Record<string, string | number | boolean>;
  highlight: 'normal' | 'branch' | 'loop' | 'return' | 'error';
  arrayState?: ArrayState;
}

interface DryRunPanelProps {
  steps: DryRunStep[];
  isLoading: boolean;
  codeLines: string[];
  error?: string;
  onRetry?: () => void;
}

const HIGHLIGHT_COLORS: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  normal:  { border: 'border-primary/30',     bg: 'bg-primary/5',     badge: 'bg-primary/20 text-primary',         label: 'EXEC'   },
  branch:  { border: 'border-amber/40',       bg: 'bg-amber/5',       badge: 'bg-amber/20 text-amber',             label: 'BRANCH' },
  loop:    { border: 'border-purple/40',      bg: 'bg-purple/5',      badge: 'bg-purple/20 text-purple',           label: 'LOOP'   },
  return:  { border: 'border-dsa-green/40',   bg: 'bg-dsa-green/5',   badge: 'bg-dsa-green/20 text-dsa-green',     label: 'RETURN' },
  error:   { border: 'border-destructive/40', bg: 'bg-destructive/5', badge: 'bg-destructive/20 text-destructive', label: 'ERROR'  },
};

const SPEEDS = [
  { label: '0.5×', ms: 2000 },
  { label: '1×',   ms: 1000 },
  { label: '1.5×', ms: 667  },
  { label: '2×',   ms: 400  },
];

// ─── Loading state ───────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 p-3 animate-fade-in">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <span className="ai-pulse">●</span> Generating visual trace...
      </div>

      {/* Array skeleton */}
      <div className="rounded-xl border border-border p-4 flex flex-col gap-3" style={{ background: 'hsl(222 50% 4% / 0.5)' }}>
        <div className="flex gap-px">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-10 h-10 shimmer rounded-sm" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
        <div className="flex gap-3 mt-1">
          {['low=0','mid=?','high=7'].map((t, i) => (
            <div key={i} className="h-2 w-12 shimmer rounded-full" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="flex gap-2 justify-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 shimmer rounded-lg" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>

      {/* Step skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-3 shimmer rounded-full w-3/4" />
        <div className="h-3 shimmer rounded-full w-1/2" />
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center mt-6 px-3 animate-fade-in gap-3">
      <div className="text-4xl">▶</div>
      <p className="font-semibold text-foreground/80 text-sm">Algorithm Visualizer</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Click <span className="text-primary font-mono">🔍 Dry Run</span> to see a step‑by‑step visual animation of your code with array states, pointers, and conceptual explanations.
      </p>

      {/* Preview array */}
      <div className="mt-2 p-3 rounded-xl border border-border w-full" style={{ background: 'hsl(222 50% 4% / 0.5)' }}>
        <div className="flex justify-center gap-px border border-border/50 rounded-md overflow-hidden mb-2 opacity-60">
          {[2,5,8,12,16,23,38,56].map((v, i) => (
            <div key={i} className={`w-9 h-9 flex items-center justify-center text-xs font-mono font-bold border-r border-border/30 last:border-r-0 ${i === 4 ? 'bg-primary/25 text-primary' : 'bg-card text-foreground/60'}`}>
              {v}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 text-[10px] font-mono opacity-50">
          <span className="text-dsa-green">low=0</span>
          <span className="text-primary">mid=4</span>
          <span className="text-destructive">high=7</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-left w-full px-1 mt-1">
        {['Animated array cells with color states','Pointer labels (low/mid/high/i/j)','Play, pause & step-by-step controls','Conceptual explanations per step'].map(f => (
          <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <span className="w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center text-center mt-6 px-3 animate-fade-in gap-3">
      <div className="text-4xl">⚠️</div>
      <p className="font-semibold text-destructive text-sm">Connection Failed</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}
        >
          🔄 Retry Dry Run
        </button>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function DryRunPanel({ steps, isLoading, codeLines, error, onRetry }: DryRunPanelProps) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1×
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = steps.length;
  const step = steps[current] || null;
  const prevStep = steps[current - 1] || null;

  // Auto-play
  useEffect(() => {
    if (playing && current < totalSteps - 1) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => {
          if (c >= totalSteps - 1) { setPlaying(false); return c; }
          return c + 1;
        });
      }, SPEEDS[speedIdx].ms);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (current >= totalSteps - 1) setPlaying(false);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speedIdx, current, totalSteps]);

  // Reset when steps change
  useEffect(() => {
    setCurrent(0);
    setPlaying(false);
  }, [steps]);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(totalSteps - 1, c + 1)), [totalSteps]);
  const togglePlay = useCallback(() => {
    if (current >= totalSteps - 1) { setCurrent(0); setPlaying(true); return; }
    setPlaying(p => !p);
  }, [current, totalSteps]);

  if (isLoading) return <LoadingSkeleton />;
  if (error && !steps.length) return <ErrorState error={error} onRetry={onRetry} />;
  if (!steps.length) return <EmptyState />;

  const hl = HIGHLIGHT_COLORS[step?.highlight || 'normal'] || HIGHLIGHT_COLORS.normal;
  const progress = totalSteps > 1 ? (current / (totalSteps - 1)) * 100 : 100;

  return (
    <div className="flex flex-col gap-0 h-full overflow-hidden">

      {/* ── Progress bar ── */}
      <div className="h-1 bg-muted flex-shrink-0">
        <div className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-3">

        {/* ── Array Visualization ── */}
        {step?.arrayState && (
          <div className="rounded-xl border border-border p-4 flex-shrink-0 overflow-x-auto animate-fade-in"
            style={{ background: 'hsl(222 50% 4% / 0.6)' }}>
            <AlgoArray
              arrayState={step.arrayState}
              prevArrayState={prevStep?.arrayState}
              stepIndex={current}
            />
          </div>
        )}

        {/* ── Concept badge + explanation ── */}
        <div key={current} className={`rounded-xl border p-3 flex flex-col gap-2 flex-shrink-0 animate-fade-in transition-all duration-300 ${hl.border} ${hl.bg}`}>
          <div className="flex items-center gap-2 flex-wrap">
            {step?.conceptNote && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${hl.badge}`}>
                ⚡ {step.conceptNote}
              </span>
            )}
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${hl.badge}`}>
              {hl.label}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto font-mono">
              Step {current + 1} / {totalSteps}
            </span>
          </div>

          {/* Code line */}
          <code className="text-xs font-mono text-foreground/90 bg-black/30 px-3 py-1.5 rounded-lg block">
            <span className="text-muted-foreground/50 mr-2 select-none">L{step?.line}</span>
            {step?.code}
          </code>

          {/* Explanation */}
          <p className="text-sm text-foreground/85 leading-relaxed font-medium">
            {step?.explanation}
          </p>
        </div>

        {/* ── Variable state ── */}
        {step && Object.keys(step.variables).length > 0 && (
          <div className="rounded-xl border border-border p-3 flex-shrink-0"
            style={{ background: 'hsl(222 40% 7%)' }}>
            <div className="text-[10px] text-muted-foreground font-mono mb-2 uppercase tracking-wider">Variables</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(step.variables).map(([k, v]) => (
                <div key={k}
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-black/30 border border-border/40">
                  <span className="text-cyan font-semibold">{k}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-dsa-green font-semibold">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All steps mini timeline ── */}
        <div className="rounded-xl border border-border p-3 flex-shrink-0"
          style={{ background: 'hsl(222 40% 7%)' }}>
          <div className="text-[10px] text-muted-foreground font-mono mb-2 uppercase tracking-wider">Timeline</div>
          <div className="flex gap-1 flex-wrap">
            {steps.map((s, i) => {
              const c = HIGHLIGHT_COLORS[s.highlight] || HIGHLIGHT_COLORS.normal;
              return (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPlaying(false); }}
                  className={`w-6 h-6 rounded text-[9px] font-mono font-bold transition-all duration-200 border ${
                    i === current
                      ? `${c.badge} border-current scale-110 shadow-md`
                      : i < current
                      ? 'bg-muted/60 text-muted-foreground/60 border-border/30'
                      : 'bg-muted/20 text-muted-foreground/30 border-border/20'
                  }`}
                  title={`Step ${i + 1}: L${s.line}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Controls bar (fixed bottom) ── */}
      <div className="flex-shrink-0 border-t border-border px-3 py-2.5 flex items-center gap-2"
        style={{ background: 'hsl(var(--card))' }}>

        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-sm disabled:opacity-30 hover:border-primary/50 hover:text-primary transition-all"
        >
          ⏮
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex-1 h-9 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
          style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}
        >
          {playing ? '⏸ Pause' : current >= totalSteps - 1 ? '↺ Replay' : '▶ Play'}
        </button>

        {/* Next */}
        <button
          onClick={next}
          disabled={current >= totalSteps - 1}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-sm disabled:opacity-30 hover:border-primary/50 hover:text-primary transition-all"
        >
          ⏭
        </button>

        {/* Speed selector */}
        <div className="flex items-center gap-1 border border-border rounded-lg px-1 py-0.5">
          {SPEEDS.map((s, i) => (
            <button
              key={i}
              onClick={() => setSpeedIdx(i)}
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all ${
                speedIdx === i ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
