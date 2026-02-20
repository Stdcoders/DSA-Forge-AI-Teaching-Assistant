import { useNavigate } from 'react-router-dom';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { TOPICS } from '@/data/curriculum';
import { Button } from '@/components/ui/button';

const TOPIC_COLORS: Record<string, string> = {
  cyan: 'hsl(var(--cyan))',
  purple: 'hsl(var(--purple))',
  amber: 'hsl(var(--amber))',
  green: 'hsl(var(--green))',
};

export default function CurriculumPage() {
  const navigate = useNavigate();
  const { getTopicStatus, progress } = useTopicProgress();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">DSA Curriculum</h1>
        <p className="text-muted-foreground mt-1">Master each topic in order — prerequisites unlock as you progress</p>
      </div>

      {/* Dependency flow visualization */}
      <div className="rounded-xl border border-border p-5 overflow-x-auto"
        style={{ background: 'var(--gradient-card)' }}>
        <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Learning Path</h3>
        <div className="flex items-center gap-2 flex-nowrap min-w-max">
          {TOPICS.map((topic, i) => {
            const status = getTopicStatus(topic.id);
            const color = TOPIC_COLORS[topic.color] || 'hsl(var(--primary))';
            return (
              <div key={topic.id} className="flex items-center gap-2">
                <button onClick={() => status !== 'locked' && navigate(`/curriculum/${topic.id}`)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 min-w-[80px]
                    ${status === 'locked' ? 'opacity-50 cursor-not-allowed border-border' : 'cursor-pointer hover:scale-105'}
                    ${status === 'completed' ? 'topic-node-completed' : ''}
                    ${status === 'unlocked' || status === 'in-progress' ? 'topic-node-active' : ''}
                  `}
                  style={status !== 'locked' ? { borderColor: color + '60' } : {}}>
                  <span className="text-xl">{topic.icon}</span>
                  <span className="text-xs font-medium text-center leading-tight">{topic.title}</span>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    status === 'completed' ? 'bg-dsa-green/20 text-dsa-green' :
                    status === 'in-progress' ? 'bg-primary/20 text-primary' :
                    status === 'unlocked' ? 'bg-amber/20 text-amber' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {status === 'completed' ? '✓ Done' :
                     status === 'in-progress' ? '▶ Active' :
                     status === 'unlocked' ? 'Start' : '🔒'}
                  </div>
                </button>
                {i < TOPICS.length - 1 && (
                  <div className="text-muted-foreground text-lg">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TOPICS.map(topic => {
          const status = getTopicStatus(topic.id);
          const p = progress[topic.id];
          const color = TOPIC_COLORS[topic.color] || 'hsl(var(--primary))';
          const accuracy = p && p.attempts > 0 ? Math.round((p.correct_attempts / p.attempts) * 100) : null;

          return (
            <div key={topic.id}
              className={`rounded-xl border p-5 flex flex-col gap-4 transition-all duration-200
                ${status === 'locked' ? 'opacity-60' : 'card-hover'}
              `}
              style={{
                background: 'var(--gradient-card)',
                borderColor: status === 'locked' ? 'hsl(var(--border))' : color + '40',
              }}>
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: color + '20', border: `1px solid ${color}40` }}>
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      status === 'completed' ? 'bg-dsa-green/20 text-dsa-green' :
                      status === 'in-progress' ? 'bg-primary/20 text-primary' :
                      status === 'unlocked' ? 'bg-amber/20 text-amber' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'completed' ? '✓ Completed' :
                       status === 'in-progress' ? '▶ In Progress' :
                       status === 'unlocked' ? 'Ready' : '🔒 Locked'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{topic.definition}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>⏱ {topic.estimatedHours}h</span>
                <span>·</span>
                <span>{topic.problems.length} problems</span>
                {topic.prerequisites.length > 0 && (
                  <>
                    <span>·</span>
                    <span>Requires: {topic.prerequisites.map(id => TOPICS.find(t => t.id === id)?.title).join(', ')}</span>
                  </>
                )}
              </div>

              {/* Mastery Bar */}
              {p && p.attempts > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mastery</span>
                    <span>{p.mastery_score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.mastery_score}%`, background: color }} />
                  </div>
                  {accuracy !== null && (
                    <div className="text-xs text-muted-foreground">
                      {p.attempts} attempts · {accuracy}% accuracy
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Button size="sm" className="flex-1"
                  disabled={status === 'locked'}
                  onClick={() => navigate(`/curriculum/${topic.id}`)}
                  style={status !== 'locked' ? { background: color + 'dd', color: '#0a0f1e' } : {}}>
                  {status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : status === 'unlocked' ? 'Start' : 'Locked'}
                </Button>
                <Button size="sm" variant="outline"
                  disabled={status === 'locked'}
                  onClick={() => navigate(`/practice?topic=${topic.id}`)}>
                  Practice
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
