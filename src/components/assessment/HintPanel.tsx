import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  hintLevel: number;
  currentHint: string;
  hintLoading: boolean;
  onRequestHint: () => void;
}

export default function HintPanel({ hintLevel, currentHint, hintLoading, onRequestHint }: Props) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber" />
          <span className="text-sm font-semibold">Hints</span>
          <span className="text-[10px] text-muted-foreground font-mono">({hintLevel}/3 used)</span>
        </div>
        {hintLevel < 3 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRequestHint}
            disabled={hintLoading}
            className="text-xs h-7"
          >
            {hintLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <Lightbulb className="w-3 h-3 mr-1" />
            )}
            Get Hint {hintLevel + 1}
          </Button>
        )}
      </div>

      {/* Hint level indicators */}
      <div className="flex gap-2">
        {[1, 2, 3].map(level => (
          <div key={level} className={`flex-1 rounded-md p-2 text-center text-[10px] border ${
            level <= hintLevel
              ? 'border-amber/30 bg-amber/5 text-amber'
              : 'border-border bg-muted/30 text-muted-foreground'
          }`}>
            {level === 1 ? 'Conceptual' : level === 2 ? 'Approach' : 'Detailed'}
          </div>
        ))}
      </div>

      {/* Hint content */}
      {currentHint ? (
        <div className="rounded-lg border border-amber/20 bg-amber/5 p-3">
          <div className="text-xs text-amber/80 font-semibold mb-1.5">
            Level {hintLevel} Hint
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {currentHint}
          </p>
        </div>
      ) : hintLevel === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          Stuck? Request a hint to get a nudge in the right direction.
        </p>
      ) : null}

      {hintLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" />
          Generating hint...
        </div>
      )}
    </div>
  );
}
