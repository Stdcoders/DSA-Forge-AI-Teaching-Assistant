import { useEffect, useRef, useState } from 'react';

export interface DryRunStep {
  line: number;
  code: string;
  explanation: string;
  variables: Record<string, string | number | boolean>;
  highlight: 'normal' | 'branch' | 'loop' | 'return' | 'error';
}

interface DryRunPanelProps {
  steps: DryRunStep[];
  isLoading: boolean;
  codeLines: string[];
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  normal:  'border-primary/40 bg-primary/5',
  branch:  'border-amber/50 bg-amber/5',
  loop:    'border-purple/50 bg-purple/5',
  return:  'border-dsa-green/50 bg-dsa-green/5',
  error:   'border-destructive/50 bg-destructive/5',
};

const HIGHLIGHT_BADGE: Record<string, string> = {
  normal:  'bg-primary/20 text-primary',
  branch:  'bg-amber/20 text-amber',
  loop:    'bg-purple/20 text-purple',
  return:  'bg-dsa-green/20 text-dsa-green',
  error:   'bg-destructive/20 text-destructive',
};

const HIGHLIGHT_LABEL: Record<string, string> = {
  normal:  'EXEC',
  branch:  'BRANCH',
  loop:    'LOOP',
  return:  'RETURN',
  error:   'ERROR',
};

export default function DryRunPanel({ steps, isLoading, codeLines }: DryRunPanelProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Animate steps appearing one by one
  useEffect(() => {
    if (steps.length === 0) { setVisibleCount(0); return; }
    setVisibleCount(0);
    setActiveStep(null);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      setActiveStep(i - 1);
      if (i >= steps.length) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [steps]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-2 animate-fade-in">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span className="ai-pulse">●</span>
          Tracing execution step by step...
        </div>
        {/* Fake code lines loading skeleton */}
        <div className="rounded-lg border border-border overflow-hidden">
          {[1,2,3,4,5].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-0"
              style={{ animationDelay: `${i * 80}ms` }}>
              <span className="text-xs text-muted-foreground/50 w-4 text-right font-mono">{i+1}</span>
              <div className="h-2.5 rounded-full shimmer flex-1" style={{ width: `${[70,50,85,40,65][i]}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['Parse', 'Init vars', 'Execute', 'Trace'].map((step, i) => (
            <div key={step} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted"
              style={{ opacity: 0.3 + i * 0.2 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary pulse inline-block" />
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="text-muted-foreground text-sm text-center mt-8 animate-fade-in">
        <div className="text-3xl mb-3 hover-scale inline-block cursor-default">🔍</div>
        <p className="font-medium text-foreground/70">Step-by-step code trace</p>
        <p className="mt-1 text-xs">AI will track every variable and explain each execution step</p>
        <div className="mt-4 flex flex-col gap-1.5 text-left px-4">
          {['Variable initialization', 'Loop iterations', 'Function calls', 'Return values'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border flex-shrink-0">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono font-medium animate-scale-in">
          🔍 {steps.length} Steps Traced
        </span>
        <span className="text-xs text-muted-foreground">{visibleCount}/{steps.length}</span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.slice(0, visibleCount).map((step, idx) => {
          const isActive = idx === activeStep;
          const hlBorder = HIGHLIGHT_COLORS[step.highlight] || HIGHLIGHT_COLORS.normal;
          const hlBadge  = HIGHLIGHT_BADGE[step.highlight]  || HIGHLIGHT_BADGE.normal;
          const hlLabel  = HIGHLIGHT_LABEL[step.highlight]  || 'EXEC';

          return (
            <div
              key={idx}
              className={`rounded-lg border transition-all duration-300 overflow-hidden animate-fade-in ${hlBorder} ${
                isActive ? 'shadow-lg scale-[1.01]' : ''
              }`}
              onClick={() => setActiveStep(idx === activeStep ? null : idx)}
              style={{ cursor: 'pointer', animationDelay: '0ms' }}
            >
              {/* Step header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
                {/* Step number bubble */}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${hlBadge}`}>
                  {idx + 1}
                </span>
                {/* Code line */}
                <code className="text-xs font-mono text-foreground/90 flex-1 truncate bg-black/20 px-2 py-0.5 rounded">
                  <span className="text-muted-foreground/50 mr-2">L{step.line}</span>
                  {step.code}
                </code>
                {/* Type badge */}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold flex-shrink-0 ${hlBadge}`}>
                  {hlLabel}
                </span>
              </div>

              {/* Explanation */}
              <div className="px-3 py-2">
                <p className="text-xs text-foreground/80 leading-relaxed">{step.explanation}</p>

                {/* Variable state */}
                {Object.keys(step.variables).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(step.variables).map(([k, v]) => (
                      <div key={k}
                        className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/20 border border-border/30">
                        <span className="text-cyan">{k}</span>
                        <span className="text-muted-foreground">=</span>
                        <span className="text-dsa-green">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated typing indicator while more steps are coming */}
      {visibleCount < steps.length && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-fade-in">
          <span className="ai-pulse text-primary">●</span>
          Loading step {visibleCount + 1}...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
