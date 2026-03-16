import type { EvaluationResult } from '@/types/assessment';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface Props {
  evaluation: EvaluationResult;
  difficulty: string;
}

const SCORE_SEGMENTS = [
  { key: 'correctnessScore', label: 'Correctness', max: 40 },
  { key: 'algorithmScore', label: 'Algorithm', max: 25 },
  { key: 'codeQualityScore', label: 'Code Quality', max: 15 },
];

export default function EvaluationResultCard({ evaluation, difficulty }: Props) {
  const passed = evaluation.passed;

  return (
    <div className="p-4 space-y-4">
      {/* Main score */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border ${
        passed
          ? 'border-dsa-green/30 bg-dsa-green/5'
          : 'border-destructive/30 bg-destructive/5'
      }`}>
        <div className="relative">
          <svg className="w-16 h-16" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={passed ? 'hsl(var(--green))' : 'hsl(var(--destructive))'}
              strokeWidth="4"
              strokeDasharray={`${(evaluation.score / 100) * 176} 176`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {evaluation.score}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {passed ? (
              <CheckCircle2 className="w-5 h-5 text-dsa-green" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-bold text-lg ${passed ? 'text-dsa-green' : 'text-destructive'}`}>
              {passed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {difficulty} threshold: {difficulty === 'easy' ? 60 : difficulty === 'medium' ? 55 : 50}/100
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score Breakdown</h4>
        {SCORE_SEGMENTS.map(seg => {
          const value = (evaluation as any)[seg.key] ?? 0;
          const pct = (value / seg.max) * 100;
          return (
            <div key={seg.key}>
              <div className="flex justify-between text-xs mb-1">
                <span>{seg.label}</span>
                <span className="font-mono">{value}/{seg.max}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 70 ? 'hsl(var(--green))' : pct >= 40 ? 'hsl(var(--amber))' : 'hsl(var(--destructive))',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <div className="rounded-lg border border-border p-3" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
        <h4 className="text-xs font-semibold mb-2">Feedback</h4>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {evaluation.feedback}
        </p>
      </div>

      {evaluation.suggestion && (
        <div className="flex items-start gap-2 text-xs text-primary/80 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{evaluation.suggestion}</span>
        </div>
      )}
    </div>
  );
}
