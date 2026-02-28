import { useEffect, useRef, useState } from 'react';

export interface ArrayState {
  name: string;
  values: (string | number | boolean)[];
  highlightIndices?: number[];
  swappedIndices?: number[];
  sortedIndices?: number[];
  pointers?: Record<string, number>;
  keyValue?: string | number;
  keyPointer?: number | null;
}

interface AlgoArrayProps {
  arrayState: ArrayState;
  prevArrayState?: ArrayState;
  stepIndex?: number;
}

const POINTER_COLORS: Record<string, { text: string; dot: string }> = {
  low:   { text: 'text-dsa-green',   dot: 'bg-dsa-green' },
  left:  { text: 'text-dsa-green',   dot: 'bg-dsa-green' },
  mid:   { text: 'text-primary',     dot: 'bg-primary' },
  high:  { text: 'text-destructive', dot: 'bg-destructive' },
  right: { text: 'text-destructive', dot: 'bg-destructive' },
  i:     { text: 'text-cyan',        dot: 'bg-cyan' },
  j:     { text: 'text-purple',      dot: 'bg-purple' },
  k:     { text: 'text-amber',       dot: 'bg-amber' },
};
function getPColor(name: string) {
  return POINTER_COLORS[name.toLowerCase()] || { text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
}

function buildPointerMap(pointers: Record<string, number>): Record<number, string[]> {
  const map: Record<number, string[]> = {};
  for (const [name, idx] of Object.entries(pointers)) {
    const i = Number(idx);
    if (!map[i]) map[i] = [];
    map[i].push(name);
  }
  return map;
}

const MAX_CELLS = 14;

export default function AlgoArray({ arrayState, prevArrayState, stepIndex = 0 }: AlgoArrayProps) {
  const {
    name, values,
    highlightIndices = [],
    swappedIndices = [],
    sortedIndices = [],
    pointers = {},
    keyValue,
    keyPointer,
  } = arrayState;

  const display = values.slice(0, MAX_CELLS);
  const truncated = values.length > MAX_CELLS;
  const pointerMap = buildPointerMap(pointers);

  // Find index of key in array
  const keyIdx = keyPointer != null ? keyPointer : (keyValue != null ? values.indexOf(keyValue) : -1);

  function getCellStyle(i: number): string {
    if (sortedIndices.includes(i))    return 'bg-dsa-green/25 text-dsa-green border-dsa-green/60 shadow-[inset_0_0_8px_hsl(145_70%_50%/0.2)]';
    if (keyIdx === i)                  return 'bg-dsa-green/20 text-dsa-green border-dsa-green/50';
    if (swappedIndices.includes(i))    return 'bg-amber/25 text-amber border-amber/60 shadow-[inset_0_0_8px_hsl(38_92%_60%/0.2)]';
    if (highlightIndices.includes(i))  return 'bg-primary/25 text-primary border-primary/60 shadow-[inset_0_0_8px_hsl(185_100%_55%/0.2)]';
    return 'bg-card text-foreground/80 border-border/40';
  }

  function getCellAnimation(i: number): string {
    if (swappedIndices.includes(i)) return 'animate-cell-swap';
    if (highlightIndices.includes(i)) return 'animate-cell-pulse';
    return '';
  }

  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Key bubble */}
      {keyValue != null && keyIdx >= 0 && keyIdx < MAX_CELLS && (
        <div className="flex" style={{ paddingLeft: `calc(${keyIdx} * 44px + 4px)` }}>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-dsa-green font-bold tracking-wide">Key</span>
            <div className="relative w-8 h-8 rounded-full border-2 border-dsa-green bg-dsa-green/15 flex items-center justify-center text-xs font-bold text-dsa-green transition-all duration-500"
              style={{ boxShadow: '0 0 14px hsl(145 70% 50% / 0.45)' }}>
              {String(keyValue)}
              <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0"
                style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '9px solid hsl(145 70% 50%)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Index labels */}
      <div className="flex items-center gap-0">
        <span className="text-[11px] font-mono font-bold text-foreground/50 w-10 text-right mr-1 flex-shrink-0">{name}[]</span>
        <div className="flex">
          {display.map((_, i) => (
            <div key={i} className="w-10 text-center text-[10px] text-muted-foreground font-mono">{i}</div>
          ))}
          {truncated && <div className="w-6 text-center text-[10px] text-muted-foreground">…</div>}
        </div>
      </div>

      {/* Cells */}
      <div className="flex items-stretch gap-0">
        <span className="text-xs font-mono font-bold text-foreground/40 w-10 text-right mr-1 flex-shrink-0 self-center">=</span>
        <div className="flex border border-border/60 rounded-lg overflow-hidden">
          {display.map((val, i) => {
            const needsAnimKey = swappedIndices.includes(i) || highlightIndices.includes(i);
            return (
              <div
                key={needsAnimKey ? `${stepIndex}-${i}` : i}
                className={`w-10 h-10 flex items-center justify-center text-sm font-mono font-bold border-r border-border/40 last:border-r-0 transition-all duration-300 ${getCellStyle(i)} ${getCellAnimation(i)}`}
              >
                {String(val)}
              </div>
            );
          })}
          {truncated && (
            <div className="w-6 h-10 flex items-center justify-center text-xs text-muted-foreground bg-card border-r border-border/40">…</div>
          )}
        </div>
      </div>

      {/* Pointer labels */}
      {Object.keys(pointers).length > 0 && (
        <div className="flex items-start gap-0">
          <div className="w-11 flex-shrink-0" />
          <div className="flex">
            {display.map((_, i) => {
              const names = pointerMap[i] || [];
              return (
                <div key={i} className="w-10 flex flex-col items-center gap-0.5 pt-0.5">
                  {names.map(n => {
                    const c = getPColor(n);
                    return (
                      <span key={n} className={`text-[9px] font-mono font-semibold ${c.text} flex items-center gap-0.5`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} />
                        {n}={i}
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
