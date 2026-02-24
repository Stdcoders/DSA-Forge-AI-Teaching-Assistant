import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById, type Language } from '@/data/curriculum';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

const TOPIC_COLORS: Record<string, string> = {
  cyan: 'hsl(var(--cyan))',
  purple: 'hsl(var(--purple))',
  amber: 'hsl(var(--amber))',
  green: 'hsl(var(--green))',
};

const LEVEL_CONFIG = {
  beginner: { label: '🟢 Beginner', difficulty: 'easy' as const, borderClass: 'border-l-4 border-l-dsa-green' },
  intermediate: { label: '🟡 Intermediate', difficulty: 'medium' as const, borderClass: 'border-l-4 border-l-amber' },
  advanced: { label: '🔴 Advanced', difficulty: 'hard' as const, borderClass: 'border-l-4 border-l-destructive' },
} as const;

function LevelSection({
  level,
  topic,
  accentColor,
  selectedLang,
  setSelectedLang,
  navigate,
  animDelay,
}: {
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: any;
  accentColor: string;
  selectedLang: Language;
  setSelectedLang: (l: Language) => void;
  navigate: (path: string) => void;
  animDelay: string;
}) {
  const config = LEVEL_CONFIG[level];
  const theoryLevel = topic.theoryLevels?.[level];
  const problems = topic.problems.filter((p: any) => p.difficulty === config.difficulty);

  if (!theoryLevel) return null;

  return (
    <AccordionItem
      value={level}
      className={`rounded-xl border border-border overflow-hidden stagger-fade ${config.borderClass}`}
      style={{ background: 'var(--gradient-card)', animationDelay: String(animDelay) }}
    >
      <AccordionTrigger className="px-5 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{config.label} — {theoryLevel.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-5 pb-5 space-y-5">
        {/* Theory */}
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{theoryLevel.content}</p>

        {/* Code */}
        <div className="code-reveal">
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

        {/* Practice problems */}
        {problems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Practice Problems</h4>
            {problems.map((problem: any, idx: number) => (
              <div key={problem.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border problem-card-glow stagger-fade"
                style={{
                  animationDelay: `${idx * 0.06}s`,
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
      </AccordionContent>
    </AccordionItem>
  );
}

export default function TheoryPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topic = getTopicById(topicId || '');
  const { getTopicStatus, updateProgress } = useTopicProgress();
  const { user, profile } = useAuth();
  const preferredLang = (profile?.preferred_language as Language) || 'python';

  const [selectedLang, setSelectedLang] = useState<Language>(preferredLang);
  const [markingComplete, setMarkingComplete] = useState(false);

  if (!topic) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Topic not found</h1>
        <Button className="mt-4" onClick={() => navigate('/curriculum')}>Back to Curriculum</Button>
      </div>
    );
  }

  const status = getTopicStatus(topic.id);
  const accentColor = TOPIC_COLORS[topic.color] || 'hsl(var(--primary))';

  const handleMarkComplete = async () => {
    if (!user) { toast.error('Sign in to save your progress'); return; }
    setMarkingComplete(true);
    await updateProgress(topic.id, { completed: true, mastery_score: 100, unlocked: true });
    toast.success(`🎉 ${topic.title} completed!`);
    setMarkingComplete(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate('/curriculum')} className="hover:text-primary transition-colors">Curriculum</button>
        <span>→</span>
        <span className="text-foreground">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl border p-6 stagger-fade" style={{ background: 'var(--gradient-card)', borderColor: accentColor + '40' }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background: accentColor + '20', border: `1px solid ${accentColor}40` }}>
            {topic.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">{topic.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${
                status === 'completed' ? 'bg-dsa-green/20 text-dsa-green' :
                status === 'in-progress' ? 'bg-primary/20 text-primary' : 'bg-amber/20 text-amber'
              }`}>
                {status === 'completed' ? '✓ Completed' : status === 'in-progress' ? '▶ In Progress' : 'Ready to Start'}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>⏱ {topic.estimatedHours}h estimated</span>
              <span>·</span>
              <span>{topic.problems.length} problems</span>
            </div>
          </div>
        </div>
      </div>

      {/* What & Why */}
      <Accordion type="multiple" defaultValue={['what', 'why']} className="space-y-3">
        <AccordionItem value="what" className="rounded-xl border border-border overflow-hidden stagger-fade"
          style={{ background: 'var(--gradient-card)', animationDelay: '0.1s' }}>
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: accentColor + '20', color: accentColor }}>?</span>
              <span className="font-semibold">What is {topic.title}?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <p className="text-muted-foreground leading-relaxed">{topic.definition}</p>
            <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: accentColor }}>💡 Real-World Analogy</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.analogy}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why" className="rounded-xl border border-border overflow-hidden stagger-fade"
          style={{ background: 'var(--gradient-card)', animationDelay: '0.15s' }}>
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: accentColor + '20', color: accentColor }}>★</span>
              <span className="font-semibold">Why use {topic.title}?</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <p className="text-muted-foreground leading-relaxed">{topic.whyUseIt}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Beginner / Intermediate / Advanced levels */}
      {topic.theoryLevels && (
        <Accordion type="multiple" defaultValue={['beginner', 'intermediate', 'advanced']} className="space-y-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level, i) => (
            <LevelSection
              key={level}
              level={level}
              topic={topic}
              accentColor={accentColor}
              selectedLang={selectedLang}
              setSelectedLang={setSelectedLang}
              navigate={navigate}
              animDelay={`${0.2 + i * 0.05}s`}
            />
          ))}
        </Accordion>
      )}

      {/* Fallback: old-style single code example if no theoryLevels */}
      {!topic.theoryLevels && (
        <Accordion type="multiple" defaultValue={['code']} className="space-y-3">
          <AccordionItem value="code" className="rounded-xl border border-border overflow-hidden" style={{ background: 'var(--gradient-card)' }}>
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: accentColor + '20', color: accentColor }}>&lt;/&gt;</span>
                <span className="font-semibold">Code Example</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
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
              </div>
              <div className="code-block overflow-auto">
                <pre className="p-4 text-sm font-mono text-foreground/90 leading-relaxed overflow-x-auto">
                  {topic.codeExamples[selectedLang]}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Complexity */}
      <Accordion type="multiple" defaultValue={['complexity']} className="space-y-3">
        <AccordionItem value="complexity" className="rounded-xl border border-border overflow-hidden stagger-fade"
          style={{ background: 'var(--gradient-card)', animationDelay: '0.35s' }}>
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: accentColor + '20', color: accentColor }}>O</span>
              <span className="font-semibold">Time & Space Complexity</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
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
            <div className="mt-4 p-3 rounded-lg bg-muted text-sm">
              <span className="text-muted-foreground">Space Complexity: </span>
              <span className="font-mono" style={{ color: accentColor }}>{topic.spaceComplexity}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* CTA */}
      <div className="flex gap-3 pt-2 stagger-fade" style={{ animationDelay: '0.4s' }}>
        <Button onClick={() => navigate(`/practice?topic=${topic.id}`)} style={{ background: accentColor, color: '#0a0f1e' }} className="flex-1">
          Start Practice →
        </Button>
        {status !== 'completed' && (
          <Button variant="outline" onClick={handleMarkComplete} disabled={markingComplete}>
            {markingComplete ? 'Saving...' : '✓ Mark Complete'}
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate('/curriculum')}>← Back</Button>
      </div>
    </div>
  );
}
