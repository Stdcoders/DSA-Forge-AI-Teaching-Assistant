import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById, type Language } from '@/data/curriculum';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import LevelQuiz from '@/components/LevelQuiz';
import { toast } from 'sonner';

const TOPIC_COLORS: Record<string, string> = {
  cyan: 'hsl(var(--cyan))',
  purple: 'hsl(var(--purple))',
  amber: 'hsl(var(--amber))',
  green: 'hsl(var(--green))',
};

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
type Level = typeof LEVELS[number];

const LEVEL_META: Record<Level, { label: string; emoji: string; step: number; difficulty: string; borderClass: string }> = {
  beginner: { label: 'Beginner', emoji: '🟢', step: 1, difficulty: 'easy', borderClass: 'border-l-4 border-l-dsa-green' },
  intermediate: { label: 'Intermediate', emoji: '🟡', step: 2, difficulty: 'medium', borderClass: 'border-l-4 border-l-amber' },
  advanced: { label: 'Advanced', emoji: '🔴', step: 3, difficulty: 'hard', borderClass: 'border-l-4 border-l-destructive' },
};

export default function TheoryLevelPage() {
  const { topicId, level } = useParams<{ topicId: string; level: string }>();
  const navigate = useNavigate();
  const topic = getTopicById(topicId || '');
  const { user } = useAuth();
  const { updateProgress } = useTopicProgress();
  const { profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';

  const [selectedLang, setSelectedLang] = useState<Language>(preferredLang);
  const [markingComplete, setMarkingComplete] = useState(false);

  if (!topic || !level || !LEVELS.includes(level as Level)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Page not found</h1>
        <Button className="mt-4" onClick={() => navigate('/curriculum')}>Back to Curriculum</Button>
      </div>
    );
  }

  const currentLevel = level as Level;
  const meta = LEVEL_META[currentLevel];
  const theoryLevel = topic.theoryLevels?.[currentLevel];
  const accentColor = TOPIC_COLORS[topic.color] || 'hsl(var(--primary))';
  const currentIndex = LEVELS.indexOf(currentLevel);
  const prevLevel = currentIndex > 0 ? LEVELS[currentIndex - 1] : null;
  const nextLevel = currentIndex < 2 ? LEVELS[currentIndex + 1] : null;
  const problems = topic.problems.filter((p: any) => p.difficulty === meta.difficulty);

  if (!theoryLevel) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">No content for this level</h1>
        <Button className="mt-4" onClick={() => navigate(`/curriculum/${topicId}`)}>Back to Overview</Button>
      </div>
    );
  }

  const handleComplete = async () => {
    if (!user) { toast.error('Sign in to save progress'); return; }
    setMarkingComplete(true);
    await updateProgress(topic.id, { completed: true, mastery_score: 100, unlocked: true });
    toast.success(`🎉 ${topic.title} completed!`);
    setMarkingComplete(false);
    navigate(`/curriculum/${topicId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate('/curriculum')} className="hover:text-primary transition-colors">Curriculum</button>
        <span>→</span>
        <button onClick={() => navigate(`/curriculum/${topicId}`)} className="hover:text-primary transition-colors">{topic.title}</button>
        <span>→</span>
        <span className="text-foreground">{meta.label}</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-0">
        {LEVELS.map((l, i) => {
          const m = LEVEL_META[l];
          const isActive = l === currentLevel;
          const isPast = i < currentIndex;
          return (
            <div key={l} className="flex items-center">
              <button
                onClick={() => navigate(`/curriculum/${topicId}/${l}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'text-primary-foreground' : isPast ? 'text-foreground opacity-80' : 'text-muted-foreground opacity-50'
                }`}
                style={isActive ? { background: accentColor } : {}}
              >
                <span>{isPast ? '✓' : m.step}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
              {i < LEVELS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${i < currentIndex ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Level Header */}
      <div className={`rounded-xl border p-6 ${meta.borderClass}`} style={{ background: 'var(--gradient-card)', borderColor: accentColor + '40' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold">{meta.label} — {theoryLevel.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">Step {meta.step} of 3 · {topic.title}</p>
          </div>
        </div>
      </div>

      {/* Theory Content */}
      <div className="rounded-xl border border-border p-6 space-y-4 stagger-fade" style={{ background: 'var(--gradient-card)', animationDelay: '0.1s' }}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: accentColor + '20', color: accentColor }}>📖</span>
          Theory
        </h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{theoryLevel.content}</p>
      </div>

      {/* Code Example */}
      <div className="rounded-xl border border-border p-6 space-y-4 code-reveal stagger-fade" style={{ background: 'var(--gradient-card)', animationDelay: '0.15s' }}>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: accentColor + '20', color: accentColor }}>&lt;/&gt;</span>
          Code Example
        </h2>
        <div className="flex gap-2 mb-3">
          {(['python', 'java', 'cpp'] as Language[]).map(lang => (
            <button key={lang} onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                selectedLang === lang ? 'text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
              style={selectedLang === lang ? { background: accentColor } : {}}>
              {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
          <button onClick={() => navigate(`/editor?lang=${selectedLang}&topicId=${topic.id}`)}
            className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary transition-colors text-muted-foreground hover:text-primary">
            Open in Editor →
          </button>
        </div>
        <div className="code-block overflow-auto">
          <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
            {theoryLevel.codeExample[selectedLang]}
          </pre>
        </div>
      </div>

      {/* Practice Problems */}
      {problems.length > 0 && (
        <div className="rounded-xl border border-border p-6 space-y-4 stagger-fade" style={{ background: 'var(--gradient-card)', animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: accentColor + '20', color: accentColor }}>⚡</span>
            Practice Problems
          </h2>
          {problems.map((problem: any, idx: number) => (
            <div key={problem.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border problem-card-glow stagger-fade"
              style={{
                animationDelay: `${0.25 + idx * 0.06}s`,
                '--glow-color': accentColor.replace(')', ' / 0.3)').replace('hsl(', 'hsl('),
                '--glow-border': accentColor.replace(')', ' / 0.5)').replace('hsl(', 'hsl('),
              } as React.CSSProperties}>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  problem.difficulty === 'easy' ? 'badge-easy' :
                  problem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                }`}>{problem.difficulty}</span>
                <span className="font-medium">{problem.title}</span>
              </div>
              <button onClick={() => navigate(`/practice?topic=${topic.id}&problem=${problem.id}`)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors">
                Solve →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Complexity Table (advanced only) */}
      {currentLevel === 'advanced' && (
        <div className="rounded-xl border border-border p-6 space-y-4 stagger-fade" style={{ background: 'var(--gradient-card)', animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: accentColor + '20', color: accentColor }}>O</span>
            Time & Space Complexity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground">Operation</th>
                  <th className="text-center py-2 px-3 text-muted-foreground">Best</th>
                  <th className="text-center py-2 px-3 text-muted-foreground">Average</th>
                  <th className="text-center py-2 px-3 text-muted-foreground">Worst</th>
                </tr>
              </thead>
              <tbody>
                {topic.timeComplexity.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium">{row.operation}</td>
                    <td className="py-2 px-3 text-center font-mono text-dsa-green">{row.best}</td>
                    <td className="py-2 px-3 text-center font-mono text-amber">{row.average}</td>
                    <td className="py-2 px-3 text-center font-mono text-destructive">{row.worst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 rounded-lg bg-muted text-sm">
            <span className="text-muted-foreground">Space Complexity: </span>
            <span className="font-mono" style={{ color: accentColor }}>{topic.spaceComplexity}</span>
          </div>
        </div>
      )}

      {/* AI Quiz */}
      <div className="stagger-fade" style={{ animationDelay: '0.35s' }}>
        <LevelQuiz
          topicTitle={topic.title}
          level={currentLevel}
          theoryContent={theoryLevel.content}
          accentColor={accentColor}
        />
      </div>

      {/* Navigation Footer */}
      <div className="flex gap-3 pt-2 stagger-fade" style={{ animationDelay: '0.4s' }}>
        {prevLevel ? (
          <Button variant="outline" onClick={() => navigate(`/curriculum/${topicId}/${prevLevel}`)} className="flex-1">
            ← {LEVEL_META[prevLevel].label}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => navigate(`/curriculum/${topicId}`)} className="flex-1">
            ← Overview
          </Button>
        )}

        {nextLevel ? (
          <Button onClick={() => navigate(`/curriculum/${topicId}/${nextLevel}`)} style={{ background: accentColor, color: '#0a0f1e' }} className="flex-1">
            {LEVEL_META[nextLevel].label} →
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={markingComplete} style={{ background: accentColor, color: '#0a0f1e' }} className="flex-1">
            {markingComplete ? 'Saving...' : '✓ Complete Topic'}
          </Button>
        )}
      </div>
    </div>
  );
}
