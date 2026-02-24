import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LevelQuizProps {
  topicTitle: string;
  level: string;
  theoryContent: string;
  accentColor: string;
}

export default function LevelQuiz({ topicTitle, level, theoryContent, accentColor }: LevelQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    setQuestions([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topicTitle, level, theoryContent },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setQuestions(data.questions || []);
    } catch (e: any) {
      console.error('Quiz generation failed:', e);
      toast.error('Failed to generate quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
  };

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;

  if (questions.length === 0 && !loading) {
    return (
      <div className="rounded-xl border border-border p-6 text-center space-y-4" style={{ background: 'var(--gradient-card)' }}>
        <div className="text-2xl">🧠</div>
        <h3 className="text-lg font-semibold">Test Your Understanding</h3>
        <p className="text-sm text-muted-foreground">Generate an AI-powered quiz based on this level's content.</p>
        <Button onClick={generateQuiz} style={{ background: accentColor, color: '#0a0f1e' }}>
          Generate Quiz
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Generating Quiz…</h3>
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl border border-border p-5 space-y-3" style={{ background: 'var(--gradient-card)' }}>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🧠 Quiz</h3>
        {submitted && (
          <span className="text-sm font-mono px-3 py-1 rounded-lg" style={{
            background: score === questions.length ? 'hsl(var(--green) / 0.15)' : 'hsl(var(--amber) / 0.15)',
            color: score === questions.length ? 'hsl(var(--green))' : 'hsl(var(--amber))',
          }}>
            {score}/{questions.length} correct
          </span>
        )}
      </div>

      {questions.map((q, qi) => {
        const isCorrect = submitted && answers[qi] === q.correctIndex;
        const isWrong = submitted && answers[qi] !== undefined && answers[qi] !== q.correctIndex;

        return (
          <div
            key={qi}
            className={`rounded-xl border p-5 space-y-3 transition-colors ${
              isCorrect ? 'quiz-correct' : isWrong ? 'quiz-incorrect' : 'border-border'
            }`}
            style={{ background: 'var(--gradient-card)' }}
          >
            <p className="font-medium">
              <span className="text-muted-foreground mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <RadioGroup
              value={answers[qi]?.toString()}
              onValueChange={(v) => !submitted && setAnswers(prev => ({ ...prev, [qi]: parseInt(v) }))}
              className="space-y-2"
            >
              {q.options.map((opt, oi) => {
                const isThisCorrect = submitted && oi === q.correctIndex;
                const isThisWrong = submitted && oi === answers[qi] && oi !== q.correctIndex;
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isThisCorrect ? 'border-dsa-green bg-dsa-green/10' :
                      isThisWrong ? 'border-destructive bg-destructive/10' :
                      'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <RadioGroupItem value={oi.toString()} disabled={submitted} />
                    <span className="text-sm">{opt}</span>
                  </label>
                );
              })}
            </RadioGroup>
            {submitted && isWrong && (
              <p className="text-sm text-muted-foreground mt-2 p-3 rounded-lg bg-muted border border-border">
                💡 {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex gap-3">
        {!submitted ? (
          <Button onClick={handleSubmit} style={{ background: accentColor, color: '#0a0f1e' }} className="flex-1">
            Submit Answers
          </Button>
        ) : (
          <Button onClick={generateQuiz} variant="outline" className="flex-1">
            🔄 Regenerate Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
