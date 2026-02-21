import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopicById, type Language } from '@/data/curriculum';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

const TOPIC_COLORS: Record<string, string> = {
  cyan: 'hsl(var(--cyan))',
  purple: 'hsl(var(--purple))',
  amber: 'hsl(var(--amber))',
  green: 'hsl(var(--green))',
};

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
    if (!user) {
      toast.error('Sign in to save your progress');
      return;
    }
    setMarkingComplete(true);
    await updateProgress(topic.id, {
      completed: true,
      mastery_score: 100,
      unlocked: true,
    });
    toast.success(`🎉 ${topic.title} completed!`);
    setMarkingComplete(false);
  };

  const hasTheoryLevels = topic.theoryLevels;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => navigate('/curriculum')} className="hover:text-primary transition-colors">Curriculum</button>
        <span>→</span>
        <span className="text-foreground">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl border p-6"
        style={{ background: 'var(--gradient-card)', borderColor: accentColor + '40' }}>
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
                status === 'in-progress' ? 'bg-primary/20 text-primary' :
                'bg-amber/20 text-amber'
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
        <AccordionItem value="what" className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--gradient-card)' }}>
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
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                💡 Real-World Analogy
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.analogy}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why" className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--gradient-card)' }}>
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

      {/* Theory Levels: Beginner / Intermediate / Advanced */}
      {hasTheoryLevels && (
        <div className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--gradient-card)' }}>
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: accentColor + '20', color: accentColor }}>&lt;/&gt;</span>
              Theory & Code Examples
            </h2>
          </div>
          <Tabs defaultValue="beginner" className="p-5">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="beginner" className="text-xs sm:text-sm">🟢 Beginner</TabsTrigger>
              <TabsTrigger value="intermediate" className="text-xs sm:text-sm">🟡 Intermediate</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs sm:text-sm">🔴 Advanced</TabsTrigger>
            </TabsList>

            {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
              <TabsContent key={level} value={level} className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{topic.theoryLevels![level].title}</h3>
                  <p className="text-muted-foreground leading-relaxed mt-2 whitespace-pre-line">
                    {topic.theoryLevels![level].content}
                  </p>
                </div>

                {/* Language selector + code */}
                <div>
                  <div className="flex gap-2 mb-3">
                    {(['python', 'java', 'cpp'] as Language[]).map(lang => (
                      <button key={lang} onClick={() => setSelectedLang(lang)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                          selectedLang === lang
                            ? 'text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
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
                      {topic.theoryLevels![level].codeExample[selectedLang]}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Fallback: old-style single code example if no theoryLevels */}
      {!hasTheoryLevels && (
        <Accordion type="multiple" defaultValue={['code']} className="space-y-3">
          <AccordionItem value="code" className="rounded-xl border border-border overflow-hidden"
            style={{ background: 'var(--gradient-card)' }}>
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
                      selectedLang === lang
                        ? 'text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
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
      <Accordion type="multiple" defaultValue={['complexity', 'problems']} className="space-y-3">
        <AccordionItem value="complexity" className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--gradient-card)' }}>
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
                  {topic.timeComplexity.map((row, i) => (
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

        {/* Practice Problems */}
        <AccordionItem value="problems" className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--gradient-card)' }}>
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: accentColor + '20', color: accentColor }}>⚡</span>
              <span className="font-semibold">Practice Problems ({topic.problems.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-3">
              {topic.problems.map(problem => (
                <div key={problem.id} className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      problem.difficulty === 'easy' ? 'badge-easy' :
                      problem.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="font-medium">{problem.title}</span>
                  </div>
                  <button onClick={() => navigate(`/practice?topic=${topic.id}&problem=${problem.id}`)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors">
                    Solve →
                  </button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* CTA */}
      <div className="flex gap-3 pt-2">
        <Button onClick={() => navigate(`/practice?topic=${topic.id}`)}
          style={{ background: accentColor, color: '#0a0f1e' }} className="flex-1">
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
