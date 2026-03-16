import type { AssessmentQuestion } from '@/types/assessment';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Props {
  question: AssessmentQuestion;
}

export default function AssessmentQuestionPanel({ question }: Props) {
  const examples = question.examples as { input: string; output: string; explanation?: string }[];
  const constraints = question.constraints as string[];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold">{question.title}</h2>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              question.difficulty === 'easy'
                ? 'bg-dsa-green/10 text-dsa-green border border-dsa-green/30'
                : question.difficulty === 'medium'
                ? 'bg-amber/10 text-amber border border-amber/30'
                : 'bg-destructive/10 text-destructive border border-destructive/30'
            }`}>
              {question.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {question.description}
          </p>
        </div>

        {examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Examples</h3>
            {examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-border p-3 text-xs space-y-1.5" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                <div>
                  <span className="text-muted-foreground">Input: </span>
                  <code className="font-mono">{ex.input}</code>
                </div>
                <div>
                  <span className="text-muted-foreground">Output: </span>
                  <code className="font-mono">{ex.output}</code>
                </div>
                {ex.explanation && (
                  <div className="text-muted-foreground pt-1 border-t border-border">
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {constraints.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Constraints</h3>
            <ul className="space-y-1">
              {constraints.map((c, i) => (
                <li key={i} className="text-xs text-muted-foreground font-mono flex items-start gap-1.5">
                  <span className="text-primary/60 mt-0.5">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
