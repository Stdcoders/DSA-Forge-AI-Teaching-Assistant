import { useMemo } from 'react';

interface VisualizerProps {
  topicId: string;
  activeStep: number;
  totalSteps: number;
  problemTitle: string;
}

interface CellState {
  value: string;
  highlight?: 'active' | 'compare' | 'done' | 'swap';
  pointer?: string;
}

function generateArrayStates(step: number, total: number): CellState[][] {
  // Simulate a simple swap/comparison visualization
  const base = ['5', '10'];
  const states: CellState[][] = [];

  // Step 0: initial
  states.push([
    { value: '5', pointer: 'a' },
    { value: '10', pointer: 'b' },
  ]);
  // Step 1: highlight
  states.push([
    { value: '5', highlight: 'active', pointer: 'a' },
    { value: '10', highlight: 'active', pointer: 'b' },
  ]);
  // Step 2: swap in progress
  states.push([
    { value: '5', highlight: 'swap', pointer: 'a→b' },
    { value: '10', highlight: 'swap', pointer: 'b→a' },
  ]);
  // Step 3: compare
  states.push([
    { value: '10', highlight: 'compare', pointer: 'a' },
    { value: '5', highlight: 'compare', pointer: 'b' },
  ]);
  // Step 4: done
  states.push([
    { value: '10', highlight: 'done', pointer: 'a' },
    { value: '5', highlight: 'done', pointer: 'b' },
  ]);

  return states;
}

const HIGHLIGHT_STYLES: Record<string, string> = {
  active: 'bg-primary/30 border-primary ring-2 ring-primary/40 scale-110',
  compare: 'bg-dsa-purple/30 border-dsa-purple ring-2 ring-dsa-purple/40',
  swap: 'bg-dsa-amber/30 border-dsa-amber ring-2 ring-dsa-amber/40 animate-bounce',
  done: 'bg-dsa-green/30 border-dsa-green ring-2 ring-dsa-green/40',
};

export default function SolutionVisualizer({ topicId, activeStep, totalSteps, problemTitle }: VisualizerProps) {
  const states = useMemo(() => generateArrayStates(activeStep, totalSteps), [activeStep, totalSteps]);
  const currentState = states[Math.min(activeStep, states.length - 1)] || states[0];

  const stepLabels = [
    'Initial state — variables set',
    'Identify values to work with',
    'Apply operation',
    'Verify intermediate result',
    'Final result ✓',
  ];

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold flex items-center gap-2">
          <span className="text-base">📊</span> Visual Diagram
        </h4>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
          Step {activeStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Diagram area */}
      <div className="flex items-center justify-center gap-4 py-6 min-h-[120px]">
        {currentState.map((cell, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold transition-all duration-500 ${
                cell.highlight ? HIGHLIGHT_STYLES[cell.highlight] : 'border-border bg-muted'
              }`}
            >
              {cell.value}
            </div>
            {cell.pointer && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {cell.pointer}
              </span>
            )}
          </div>
        ))}

        {/* Arrow between cells during swap */}
        {activeStep === 2 && (
          <div className="absolute">
            <svg width="60" height="30" className="text-dsa-amber">
              <path d="M 5 15 Q 30 0 55 15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
              <path d="M 55 15 Q 30 30 5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
            </svg>
          </div>
        )}
      </div>

      {/* Step description */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground italic">
          {stepLabels[Math.min(activeStep, stepLabels.length - 1)]}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 pt-2 border-t border-border">
        {[
          { color: 'bg-primary/30 border-primary', label: 'Active' },
          { color: 'bg-dsa-amber/30 border-dsa-amber', label: 'Swap' },
          { color: 'bg-dsa-green/30 border-dsa-green', label: 'Done' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded border ${item.color}`} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
