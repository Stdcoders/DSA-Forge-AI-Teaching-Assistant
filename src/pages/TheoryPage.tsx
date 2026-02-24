import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById } from '@/data/curriculum';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const TOPIC_COLORS: Record<string, string> = {
  cyan: 'hsl(var(--cyan))',
  purple: 'hsl(var(--purple))',
  amber: 'hsl(var(--amber))',
  green: 'hsl(var(--green))',
};

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const LEVEL_META = {
  beginner: { label: 'Beginner', emoji: '🟢', color: 'hsl(var(--green))' },
  intermediate: { label: 'Intermediate', emoji: '🟡', color: 'hsl(var(--amber))' },
  advanced: { label: 'Advanced', emoji: '🔴', color: 'hsl(var(--destructive))' },
};

export default function TheoryPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topic = getTopicById(topicId || '');
  const { getTopicStatus } = useTopicProgress();

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
              <span>·</span>
              <span>3 levels</span>
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

      {/* Level Roadmap */}
      <div className="rounded-xl border border-border p-6 space-y-4 stagger-fade" style={{ background: 'var(--gradient-card)', animationDelay: '0.2s' }}>
        <h2 className="text-lg font-semibold">Learning Path</h2>
        <div className="space-y-3">
          {LEVELS.map((level, i) => {
            const m = LEVEL_META[level];
            const hasContent = !!topic.theoryLevels?.[level];
            return (
              <button
                key={level}
                onClick={() => hasContent && navigate(`/curriculum/${topicId}/${level}`)}
                disabled={!hasContent}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/40 transition-all text-left card-hover disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'hsl(var(--muted) / 0.3)' }}
              >
                <span className="text-xl">{m.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{topic.theoryLevels?.[level]?.title || 'Coming soon'}</div>
                </div>
                <span className="text-muted-foreground text-sm">→</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-2 stagger-fade" style={{ animationDelay: '0.3s' }}>
        <Button
          onClick={() => navigate(`/curriculum/${topicId}/beginner`)}
          style={{ background: accentColor, color: '#0a0f1e' }}
          className="flex-1"
        >
          Start Learning →
        </Button>
        <Button variant="outline" onClick={() => navigate('/curriculum')}>← Back</Button>
      </div>
    </div>
  );
}
