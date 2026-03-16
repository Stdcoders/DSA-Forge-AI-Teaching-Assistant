import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Difficulty } from '@/data/curriculum';
import type { LevelProgress } from '@/types/assessment';
import { Crown, ArrowLeft, RotateCcw } from 'lucide-react';

interface Props {
  open: boolean;
  levelProgress: Record<Difficulty, LevelProgress>;
  topicTitle: string;
  determinedLevel: string;
  onBack: () => void;
  onKeepPracticing: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  master: 'Master',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'hsl(var(--muted-foreground))',
  easy: 'hsl(var(--green))',
  medium: 'hsl(var(--amber))',
  hard: 'hsl(var(--destructive))',
  master: 'hsl(var(--purple))',
};

export default function TopicMasteredScreen({ open, levelProgress, topicTitle, determinedLevel, onBack, onKeepPracticing }: Props) {
  const levels: Difficulty[] = ['easy', 'medium', 'hard'];
  const totalSolved = levels.reduce((s, l) => s + levelProgress[l].solved, 0);
  const totalAttempted = levels.reduce((s, l) => s + levelProgress[l].attempted, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md border-purple/20" onPointerDownOutside={e => e.preventDefault()}>
        <div className="text-center space-y-5 py-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: LEVEL_COLORS[determinedLevel], background: `${LEVEL_COLORS[determinedLevel]}15` }}>
              <Crown className="w-10 h-10" style={{ color: LEVEL_COLORS[determinedLevel] }} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1">Assessment Complete!</h2>
            <p className="text-sm text-muted-foreground">{topicTitle}</p>
          </div>

          {/* Determined Level */}
          <div className="py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Your Level</div>
            <span
              className="text-2xl font-bold px-4 py-1.5 rounded-full border-2 inline-block"
              style={{ color: LEVEL_COLORS[determinedLevel], borderColor: LEVEL_COLORS[determinedLevel] }}
            >
              {LEVEL_LABELS[determinedLevel]}
            </span>
          </div>

          {/* Per-level breakdown */}
          <div className="space-y-2 text-left">
            {levels.map(level => {
              const prog = levelProgress[level];
              if (prog.attempted === 0) return null;
              const acc = Math.round((prog.solved / prog.attempted) * 100);
              return (
                <div key={level} className="flex items-center gap-3 rounded-lg border border-border p-2.5" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                  <span className={`text-[10px] font-bold uppercase w-14 text-center ${
                    level === 'easy' ? 'text-dsa-green' : level === 'medium' ? 'text-amber' : 'text-destructive'
                  }`}>
                    {level}
                  </span>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${acc}%`,
                        background: level === 'easy' ? 'hsl(var(--green))' : level === 'medium' ? 'hsl(var(--amber))' : 'hsl(var(--destructive))',
                      }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono min-w-12 text-right">{prog.solved}/{prog.attempted}</span>
                </div>
              );
            })}
          </div>

          {/* Overall stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
              <div className="text-lg font-bold">{totalSolved}/{totalAttempted}</div>
              <div className="text-[10px] text-muted-foreground">Overall Solved</div>
            </div>
            <div className="rounded-lg border border-border p-3" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
              <div className="text-lg font-bold">{overallAccuracy}%</div>
              <div className="text-[10px] text-muted-foreground">Overall Accuracy</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Hub
            </Button>
            {determinedLevel === 'master' && (
              <Button className="flex-1" onClick={onKeepPracticing}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Keep Practicing
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
