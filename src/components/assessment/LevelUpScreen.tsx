import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Difficulty } from '@/data/curriculum';
import type { LevelProgress } from '@/types/assessment';
import { ArrowRight, Trophy } from 'lucide-react';

interface Props {
  open: boolean;
  fromLevel: Difficulty;
  toLevel: Difficulty;
  levelProgress: Record<Difficulty, LevelProgress>;
  topicTitle: string;
  onContinue: () => void;
  onBack: () => void;
}

const LEVEL_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const LEVEL_COLORS: Record<Difficulty, string> = {
  easy: 'hsl(var(--green))',
  medium: 'hsl(var(--amber))',
  hard: 'hsl(var(--destructive))',
};

export default function LevelUpScreen({ open, fromLevel, toLevel, levelProgress, topicTitle, onContinue, onBack }: Props) {
  const prog = levelProgress[fromLevel];
  const accuracy = prog.attempted > 0 ? Math.round((prog.solved / prog.attempted) * 100) : 0;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md border-primary/20" onPointerDownOutside={e => e.preventDefault()}>
        <div className="text-center space-y-5 py-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-1">Level Up!</h2>
            <p className="text-sm text-muted-foreground">
              You cleared <span style={{ color: LEVEL_COLORS[fromLevel] }}>{LEVEL_LABELS[fromLevel]}</span> for {topicTitle}!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span
              className="text-sm font-bold px-3 py-1 rounded-full border"
              style={{ color: LEVEL_COLORS[fromLevel], borderColor: LEVEL_COLORS[fromLevel] }}
            >
              {LEVEL_LABELS[fromLevel]}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span
              className="text-sm font-bold px-3 py-1 rounded-full border"
              style={{ color: LEVEL_COLORS[toLevel], borderColor: LEVEL_COLORS[toLevel] }}
            >
              {LEVEL_LABELS[toLevel]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
              <div className="text-lg font-bold" style={{ color: LEVEL_COLORS[fromLevel] }}>
                {prog.solved}/{prog.attempted}
              </div>
              <div className="text-[10px] text-muted-foreground">Solved</div>
            </div>
            <div className="rounded-lg border border-border p-3" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
              <div className="text-lg font-bold" style={{ color: LEVEL_COLORS[fromLevel] }}>
                {accuracy}%
              </div>
              <div className="text-[10px] text-muted-foreground">Accuracy</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onBack}>
              Back to Hub
            </Button>
            <Button className="flex-1" onClick={onContinue}>
              Continue to {LEVEL_LABELS[toLevel]}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
