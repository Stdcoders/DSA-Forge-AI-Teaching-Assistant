import { useEffect, useState } from 'react';

export interface LinkedListNode {
  value: string | number;
  id: string;
  highlight?: 'active' | 'visited' | 'inserted' | 'removed';
}

export interface LinkedListState {
  name: string;
  nodes: LinkedListNode[];
  pointers?: Record<string, number>; // pointer name → node index
  highlightIndices?: number[];
}

const POINTER_COLORS: Record<string, { text: string; dot: string }> = {
  head:  { text: 'text-dsa-green',   dot: 'bg-dsa-green' },
  curr:  { text: 'text-primary',     dot: 'bg-primary' },
  prev:  { text: 'text-amber',       dot: 'bg-amber' },
  next:  { text: 'text-purple',      dot: 'bg-purple' },
  slow:  { text: 'text-dsa-green',   dot: 'bg-dsa-green' },
  fast:  { text: 'text-destructive', dot: 'bg-destructive' },
  temp:  { text: 'text-cyan',        dot: 'bg-cyan' },
  tail:  { text: 'text-destructive', dot: 'bg-destructive' },
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

function getNodeHighlightClasses(highlight?: string): string {
  switch (highlight) {
    case 'active':
      return 'border-primary bg-primary/15 shadow-[0_0_12px_hsl(185_100%_55%/0.3)]';
    case 'visited':
      return 'border-dsa-green bg-dsa-green/15 shadow-[0_0_10px_hsl(145_70%_50%/0.25)]';
    case 'inserted':
      return 'border-dsa-green bg-dsa-green/20 shadow-[0_0_14px_hsl(145_70%_50%/0.35)] animate-node-insert';
    case 'removed':
      return 'border-destructive/60 bg-destructive/10 opacity-50 animate-node-remove';
    default:
      return 'border-border bg-card';
  }
}

export default function LinkedListVisualizer({ state }: { state: LinkedListState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!state || !state.nodes || state.nodes.length === 0) return null;

  const { name, nodes, pointers = {}, highlightIndices = [] } = state;
  const pointerMap = buildPointerMap(pointers);

  return (
    <div className={`flex flex-col gap-3 select-none transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {/* Title */}
      <div className="font-mono text-sm font-semibold text-primary">{name}</div>

      {/* Linked List Chain */}
      <div className="flex items-center gap-0 overflow-x-auto py-2">
        {/* head label */}
        <div className="flex items-center gap-1.5 mr-1 flex-shrink-0">
          <span className="text-sm font-mono font-bold text-dsa-green">head</span>
          <svg width="24" height="16" viewBox="0 0 24 16" className="flex-shrink-0">
            <line x1="0" y1="8" x2="18" y2="8" stroke="hsl(145, 70%, 50%)" strokeWidth="2" />
            <polygon points="18,4 24,8 18,12" fill="hsl(145, 70%, 50%)" />
          </svg>
        </div>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isHighlighted = highlightIndices.includes(i);
          const effectiveHighlight = node.highlight || (isHighlighted ? 'active' : undefined);
          const pointersAtNode = pointerMap[i] || [];

          return (
            <div key={node.id} className="flex items-center gap-0 flex-shrink-0">
              {/* Node box */}
              <div className="flex flex-col items-center gap-1">
                <div className={`flex items-stretch rounded-lg border-2 transition-all duration-400 ${getNodeHighlightClasses(effectiveHighlight)}`}>
                  {/* Value cell */}
                  <div className="w-12 h-11 flex items-center justify-center font-mono text-sm font-bold border-r border-border/40">
                    {String(node.value)}
                  </div>
                  {/* Next pointer cell */}
                  <div className="w-8 h-11 flex items-center justify-center text-muted-foreground">
                    {i < nodes.length - 1 ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground/60" />
                    ) : (
                      <span className="text-[9px] font-mono text-muted-foreground/60">•</span>
                    )}
                  </div>
                </div>

                {/* Pointer labels below node */}
                {pointersAtNode.length > 0 && (
                  <div className="flex flex-col items-center gap-0.5">
                    {pointersAtNode.map(p => {
                      const c = getPColor(p);
                      return (
                        <div key={p} className="flex items-center gap-1">
                          <svg width="8" height="12" viewBox="0 0 8 12">
                            <line x1="4" y1="0" x2="4" y2="8" stroke="currentColor" strokeWidth="1.5" className={c.text} />
                            <polygon points="1,6 4,12 7,6" fill="currentColor" className={c.text} />
                          </svg>
                          <span className={`text-[10px] font-mono font-bold ${c.text}`}>{p}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Arrow to next node */}
              {i < nodes.length - 1 && (
                <svg width="28" height="16" viewBox="0 0 28 16" className="flex-shrink-0 mx-0.5">
                  <line x1="0" y1="8" x2="22" y2="8" stroke="hsl(var(--foreground) / 0.4)" strokeWidth="2" />
                  <polygon points="22,4 28,8 22,12" fill="hsl(var(--foreground) / 0.4)" />
                </svg>
              )}
            </div>
          );
        })}

        {/* NULL terminator */}
        <svg width="28" height="16" viewBox="0 0 28 16" className="flex-shrink-0 mx-0.5">
          <line x1="0" y1="8" x2="22" y2="8" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="2" />
          <polygon points="22,4 28,8 22,12" fill="hsl(var(--foreground) / 0.3)" />
        </svg>
        <span className="text-sm font-mono font-bold text-muted-foreground/60 ml-1">NULL</span>
      </div>
    </div>
  );
}
