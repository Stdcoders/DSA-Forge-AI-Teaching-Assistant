import { useEffect, useState } from 'react';

export interface ArrayState {
  name: string;
  values: (string | number | boolean)[];
  highlightIndices?: number[];
  pointers?: Record<string, number>;
  keyValue?: string | number;
  keyPointer?: number;
}

interface ArrayVisualizerProps {
  arrayState: ArrayState;
  animate?: boolean;
}

const POINTER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  low:   { bg: 'bg-dsa-green/20',   text: 'text-dsa-green',   border: 'border-dsa-green/40' },
  mid:   { bg: 'bg-primary/20',     text: 'text-primary',     border: 'border-primary/40' },
  high:  { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/40' },
  left:  { bg: 'bg-dsa-green/20',   text: 'text-dsa-green',   border: 'border-dsa-green/40' },
  right: { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive/40' },
  i:     { bg: 'bg-cyan/20',        text: 'text-cyan',        border: 'border-cyan/40' },
  j:     { bg: 'bg-purple/20',      text: 'text-purple',      border: 'border-purple/40' },
  k:     { bg: 'bg-amber/20',       text: 'text-amber',       border: 'border-amber/40' },
};

function getPointerColor(name: string) {
  return POINTER_COLORS[name.toLowerCase()] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
}

// Build a map: index → list of pointer names at that index
function buildPointerMap(pointers: Record<string, number>): Record<number, string[]> {
  const map: Record<number, string[]> = {};
  for (const [name, idx] of Object.entries(pointers)) {
    if (!map[idx]) map[idx] = [];
    map[idx].push(name);
  }
  return map;
}

export default function ArrayVisualizer({ arrayState, animate = true }: ArrayVisualizerProps) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [animate]);

  const { name, values, highlightIndices = [], pointers = {}, keyValue, keyPointer } = arrayState;
  const pointerMap = buildPointerMap(pointers);

  // Clamp cells if array is very long
  const MAX_CELLS = 12;
  const displayValues = values.slice(0, MAX_CELLS);
  const truncated = values.length > MAX_CELLS;

  return (
    <div
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
    >
      {/* Key bubble above array */}
      {keyValue !== undefined && keyPointer !== undefined && keyPointer < MAX_CELLS && (
        <div className="flex mb-1" style={{ paddingLeft: `calc(${keyPointer} * (2.25rem + 2px) + 2.5rem + 8px)` }}>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-dsa-green font-semibold">Key</span>
            {/* Bubble */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-dsa-green bg-dsa-green/10 text-dsa-green text-xs font-bold shadow-lg"
              style={{ boxShadow: '0 0 12px hsl(145 70% 50% / 0.4)' }}>
              {String(keyValue)}
              {/* Arrow down */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '8px solid hsl(145 70% 50%)',
                }} />
            </div>
          </div>
        </div>
      )}

      {/* Index row */}
      <div className="flex items-center gap-0">
        {/* Array name label */}
        <span className="text-xs font-mono font-bold text-foreground/70 mr-2 flex-shrink-0 w-10 text-right">
          {name}[]
        </span>
        {/* Index numbers above cells */}
        <div className="flex gap-px">
          {displayValues.map((_, i) => (
            <div key={i} className="w-9 text-center text-[10px] text-muted-foreground font-mono">
              {i}
            </div>
          ))}
          {truncated && <div className="w-6 text-center text-[10px] text-muted-foreground font-mono">…</div>}
        </div>
      </div>

      {/* Array cells */}
      <div className="flex items-stretch gap-0">
        {/* "=" label */}
        <span className="text-xs font-mono font-bold text-foreground/50 mr-2 flex-shrink-0 w-10 text-right self-center">
          =
        </span>

        {/* Cells */}
        <div className="flex gap-px border border-border rounded-md overflow-hidden">
          {displayValues.map((val, i) => {
            const isHighlighted = highlightIndices.includes(i);
            const isKey = keyPointer === i;
            return (
              <div
                key={i}
                className={`
                  w-9 h-9 flex items-center justify-center text-sm font-mono font-bold
                  border-r border-border last:border-r-0
                  transition-all duration-400
                  ${isKey
                    ? 'bg-dsa-green/25 text-dsa-green'
                    : isHighlighted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-card text-foreground/80'
                  }
                `}
                style={
                  isKey
                    ? { boxShadow: 'inset 0 0 8px hsl(145 70% 50% / 0.2)' }
                    : isHighlighted
                    ? { boxShadow: 'inset 0 0 8px hsl(185 100% 55% / 0.15)' }
                    : {}
                }
              >
                {String(val)}
              </div>
            );
          })}
          {truncated && (
            <div className="w-6 h-9 flex items-center justify-center text-xs text-muted-foreground bg-card">…</div>
          )}
        </div>
      </div>

      {/* Pointer labels row */}
      {Object.keys(pointers).length > 0 && (
        <div className="flex items-start gap-0 mt-1">
          <div className="w-10 mr-2 flex-shrink-0" /> {/* spacer for name label */}
          <div className="flex gap-px">
            {displayValues.map((_, i) => {
              const names = pointerMap[i] || [];
              return (
                <div key={i} className="w-9 flex flex-col items-center gap-0.5">
                  {names.map(n => {
                    const c = getPointerColor(n);
                    return (
                      <span
                        key={n}
                        className={`text-[9px] font-mono font-semibold px-1 rounded ${c.text}`}
                      >
                        {n} = {i}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
