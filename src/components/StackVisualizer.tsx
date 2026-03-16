import { useEffect, useState } from 'react';

export interface StackState {
  name: string;
  values: (string | number)[];
  pointers?: Record<string, number>;
  highlightIndices?: number[];
  operation?: 'push' | 'pop' | 'peek' | 'none';
  operationValue?: string | number;
}

export default function StackVisualizer({ state }: { state: StackState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!state || !state.values) return null;

  const { name, values, pointers = {}, highlightIndices = [], operation, operationValue } = state;
  const topIdx = values.length - 1;

  // Find where top pointer is (from pointers or infer from values)
  const topPointerIdx = pointers['top'] ?? topIdx;

  // Build operation label
  const getOperationLabel = () => {
    if (!operation || operation === 'none') return null;
    if (operation === 'push') return `Push Element ${operationValue ?? ''} Into Stack`;
    if (operation === 'pop') return `Pop Element ${operationValue ?? ''} From Stack`;
    if (operation === 'peek') return `Peek Top Element: ${operationValue ?? ''}`;
    return null;
  };

  const opLabel = getOperationLabel();

  return (
    <div className={`flex flex-col gap-3 select-none transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {/* Operation label */}
      {opLabel && (
        <div className="font-semibold text-sm text-foreground/90 border-l-2 border-primary pl-3">
          {opLabel}
        </div>
      )}

      {/* Stack name */}
      <div className="font-mono text-sm font-semibold text-primary">{name}</div>

      {values.length === 0 ? (
        <div className="flex items-center justify-center h-14 border-2 border-border rounded-lg bg-card/50">
          <span className="text-muted-foreground text-sm font-mono">Empty Stack</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {/* Top pointer arrow */}
          <div className="flex items-end gap-0">
            {values.map((_, i) => (
              <div key={i} className="w-16 flex flex-col items-center">
                {i === topPointerIdx && (
                  <div className="flex flex-col items-center animate-fade-in">
                    <span className="text-[11px] font-mono font-bold text-primary mb-0.5">top = {topPointerIdx}</span>
                    <svg width="12" height="14" viewBox="0 0 12 14">
                      <line x1="6" y1="0" x2="6" y2="9" stroke="hsl(185, 100%, 55%)" strokeWidth="2" />
                      <polygon points="2,9 6,14 10,9" fill="hsl(185, 100%, 55%)" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Stack cells - horizontal */}
          <div className="flex items-stretch border-2 border-border rounded-lg overflow-hidden">
            {values.map((val, i) => {
              const isHighlighted = highlightIndices.includes(i);
              const isTop = i === topPointerIdx;
              const isPushed = operation === 'push' && isTop;
              const isPopped = operation === 'pop' && isTop;

              return (
                <div
                  key={`${i}-${val}`}
                  className={`w-16 h-14 flex items-center justify-center font-mono text-base font-bold
                    border-r border-border/50 last:border-r-0 transition-all duration-400
                    ${isPushed
                      ? 'bg-dsa-green/20 text-dsa-green shadow-[inset_0_0_12px_hsl(145_70%_50%/0.25)] animate-stack-push'
                      : isPopped
                      ? 'bg-destructive/15 text-destructive animate-stack-pop'
                      : isHighlighted || isTop
                      ? 'bg-primary/15 text-primary shadow-[inset_0_0_10px_hsl(185_100%_55%/0.2)]'
                      : 'bg-card text-foreground/80'
                    }`}
                >
                  {String(val)}
                </div>
              );
            })}
          </div>

          {/* Index labels */}
          <div className="flex items-start gap-0">
            {values.map((_, i) => (
              <div key={i} className="w-16 text-center text-[10px] text-muted-foreground font-mono pt-0.5">
                {i}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
