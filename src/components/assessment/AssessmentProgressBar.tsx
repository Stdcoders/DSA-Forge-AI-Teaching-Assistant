import type { Difficulty } from '@/data/curriculum';
import type { LevelProgress } from '@/types/assessment';

const LEVEL_REQS: Record<Difficulty, { required: number; maxAttempts: number; label: string }> = {
  easy: { required: 3, maxAttempts: 5, label: 'Easy' },
  medium: { required: 2, maxAttempts: 3, label: 'Medium' },
  hard: { required: 1, maxAttempts: Infinity, label: 'Hard' },
};

interface Props {
  currentLevel: Difficulty;
  levelProgress: Record<Difficulty, LevelProgress>;
}

export default function AssessmentProgressBar({ currentLevel, levelProgress }: Props) {
  const levels: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-border" style={{ background: 'var(--gradient-card)' }}>
      {levels.map((level, idx) => {
        const prog = levelProgress[level];
        const req = LEVEL_REQS[level];
        const isActive = level === currentLevel;
        const isPassed = prog.solved >= req.required;
        const isFuture = levels.indexOf(level) > levels.indexOf(currentLevel);

        return (
          <div key={level} className="flex items-center flex-1">
            {idx > 0 && (
              <div className={`w-6 h-0.5 mx-1 ${isPassed || (levels.indexOf(level) <= levels.indexOf(currentLevel)) ? 'bg-primary/50' : 'bg-muted'}`} />
            )}
            <div className={`flex-1 rounded-lg p-2 text-xs transition-all ${
              isActive ? 'border border-primary/50 bg-primary/5' :
              isPassed ? 'border border-dsa-green/30 bg-dsa-green/5' :
              'border border-border bg-background/50'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-semibold uppercase text-[10px] tracking-wider ${
                  isActive ? 'text-primary' :
                  isPassed ? 'text-dsa-green' :
                  'text-muted-foreground'
                }`}>
                  {req.label}
                </span>
                <span className={`font-mono text-[10px] ${
                  isPassed ? 'text-dsa-green' :
                  isActive ? 'text-primary' :
                  'text-muted-foreground'
                }`}>
                  {prog.solved}/{req.required}
                  {req.maxAttempts !== Infinity && ` (${prog.attempted}/${req.maxAttempts})`}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (prog.solved / req.required) * 100)}%`,
                    background: isPassed
                      ? 'hsl(var(--green))'
                      : isActive
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--muted-foreground))',
                  }}
                />
              </div>
              {isActive && !isFuture && (
                <div className="flex gap-1 mt-1.5">
                  {Array.from({ length: Math.min(req.maxAttempts, 10) }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < prog.solved
                          ? 'bg-dsa-green'
                          : i < prog.attempted
                          ? 'bg-destructive/70'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
