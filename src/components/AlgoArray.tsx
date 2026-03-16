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
  passLabel?: string; // e.g., "i=0", "Pass 1"
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
  'j+1': { text: 'text-amber',      dot: 'bg-amber' },
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
const CELL_W = 44; // px width per cell including gap

export default function AlgoArray({ arrayState, prevArrayState, stepIndex = 0 }: AlgoArrayProps) {
  const {
    name, values,
    highlightIndices = [],
    swappedIndices = [],
    sortedIndices = [],
    pointers = {},
    keyValue,
    keyPointer,
    passLabel,
  } = arrayState;

  const display = values.slice(0, MAX_CELLS);
  const truncated = values.length > MAX_CELLS;
  const pointerMap = buildPointerMap(pointers);

  const keyIdx = keyPointer != null ? keyPointer : (keyValue != null ? values.indexOf(keyValue) : -1);

  // Swap arrow: if exactly 2 swapped indices, draw an arrow between them
  const showSwapArrow = swappedIndices.length === 2;
  const swapFrom = swappedIndices[0];
  const swapTo = swappedIndices[1];

  function getCellStyle(i: number): string {
    if (sortedIndices.includes(i))    return 'bg-dsa-green/25 text-dsa-green border-dsa-green/60 shadow-[inset_0_0_8px_hsl(145_70%_50%/0.2)]';
    if (keyIdx === i)                  return 'bg-dsa-green/20 text-dsa-green border-dsa-green/50';
    if (swappedIndices.includes(i))    return 'bg-amber/25 text-amber border-amber/60 shadow-[inset_0_0_8px_hsl(38_92%_60%/0.2)]';
    if (highlightIndices.includes(i))  return 'bg-primary/25 text-primary border-primary/60 shadow-[inset_0_0_8px_hsl(185_100%_55%/0.2)]';
    return 'bg-card text-foreground/80 border-border/40';
  }

  function getCellBgColor(i: number): string {
    if (sortedIndices.includes(i))    return 'hsl(145 70% 50% / 0.15)';
    if (swappedIndices.includes(i))    return 'hsl(38 92% 60% / 0.12)';
    if (highlightIndices.includes(i))  return 'hsl(185 100% 55% / 0.1)';
    return 'transparent';
  }

  function getCellAnimation(i: number): string {
    if (swappedIndices.includes(i)) return 'animate-cell-swap';
    if (highlightIndices.includes(i)) return 'animate-cell-pulse';
    return '';
  }

  // Last sorted index for "Sorted Element" label
  const newlySorted = sortedIndices.length > 0 ? sortedIndices[sortedIndices.length - 1] : -1;
  const showSortedLabel = newlySorted >= 0 && newlySorted < display.length;

  // Compute swap arrow SVG metrics
  const NAME_LABEL_W = 44; // px for the name[] label + margin
  const arrowSvgWidth = display.length * CELL_W + 20;

  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Pass label */}
      {passLabel && (
        <div className="text-[11px] font-mono font-bold text-muted-foreground/80 mb-0.5">
          {passLabel}
        </div>
      )}

      {/* Swap arrow above cells */}
      {showSwapArrow && swapFrom < MAX_CELLS && swapTo < MAX_CELLS && (
        <div className="flex items-end gap-0">
          <div className="flex-shrink-0" style={{ width: `${NAME_LABEL_W}px` }} />
          <svg
            width={arrowSvgWidth}
            height="28"
            viewBox={`0 0 ${arrowSvgWidth} 28`}
            className="animate-swap-arrow"
          >
            {(() => {
              const fromX = swapFrom * CELL_W + CELL_W / 2;
              const toX = swapTo * CELL_W + CELL_W / 2;
              const midX = (fromX + toX) / 2;
              const curveY = 4;
              const startY = 24;
              return (
                <g>
                  {/* Curved arrow path */}
                  <path
                    d={`M ${fromX} ${startY} Q ${midX} ${curveY}, ${toX} ${startY}`}
                    fill="none"
                    stroke="hsl(38, 92%, 60%)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  {/* Arrow tip on destination */}
                  <polygon
                    points={`${toX - 4},${startY - 5} ${toX},${startY} ${toX + 4},${startY - 5}`}
                    fill="hsl(38, 92%, 60%)"
                  />
                  {/* Arrow tip on source (bidirectional) */}
                  <polygon
                    points={`${fromX - 4},${startY - 5} ${fromX},${startY} ${fromX + 4},${startY - 5}`}
                    fill="hsl(38, 92%, 60%)"
                  />
                  {/* "Swap" label */}
                  <text
                    x={midX}
                    y={curveY + 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="hsl(38, 92%, 60%)"
                  >
                    Swap
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      )}

      {/* Key bubble */}
      {keyValue != null && keyIdx >= 0 && keyIdx < MAX_CELLS && (
        <div className="flex" style={{ paddingLeft: `calc(${keyIdx} * ${CELL_W}px + 4px)` }}>
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
            <div key={i} className="w-11 text-center text-[10px] text-muted-foreground font-mono">{i}</div>
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
                className={`w-11 h-11 flex items-center justify-center text-sm font-mono font-bold border-r border-border/40 last:border-r-0 transition-all duration-300 ${getCellStyle(i)} ${getCellAnimation(i)}`}
              >
                {String(val)}
              </div>
            );
          })}
          {truncated && (
            <div className="w-6 h-11 flex items-center justify-center text-xs text-muted-foreground bg-card border-r border-border/40">…</div>
          )}
        </div>
      </div>

      {/* Pointer labels + Sorted Element label */}
      <div className="flex items-start gap-0">
        <div className="w-11 flex-shrink-0" />
        <div className="flex">
          {display.map((_, i) => {
            const names = pointerMap[i] || [];
            const isSortedLabel = showSortedLabel && i === newlySorted;
            return (
              <div key={i} className="w-11 flex flex-col items-center gap-0.5 pt-0.5">
                {names.map(n => {
                  const c = getPColor(n);
                  return (
                    <span key={n} className={`text-[9px] font-mono font-semibold ${c.text} flex items-center gap-0.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} inline-block`} />
                      {n}={i}
                    </span>
                  );
                })}
                {isSortedLabel && (
                  <span className="text-[8px] font-mono font-bold text-dsa-green bg-dsa-green/10 border border-dashed border-dsa-green/40 px-1 py-0.5 rounded mt-0.5 whitespace-nowrap">
                    Sorted
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
