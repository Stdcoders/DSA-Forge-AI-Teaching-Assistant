import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TOPICS } from '@/data/curriculum';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface DailyActivity {
  activity_date: string;
  problems_solved: number;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { overallProgress, completedCount, totalTopics, weakTopics, suggestedNextTopic, progress } = useTopicProgress();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState<DailyActivity[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchActivity = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data } = await supabase
        .from('daily_activity')
        .select('activity_date, problems_solved')
        .eq('user_id', user.id)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('activity_date');
      setActivityData(data || []);
    };
    fetchActivity();
  }, [user]);

  // Build 7-day chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const activity = activityData.find(a => a.activity_date === dateStr);
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      solved: activity?.problems_solved || 0,
    };
  });

  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + p.attempts, 0);
  const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.correct_attempts, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="gradient-text-brand">{profile?.username || 'Coder'}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {profile?.experience_level && (
            <span className="capitalize">{profile.experience_level}</span>
          )} · {profile?.preferred_language?.toUpperCase()} · {profile?.learning_goal || 'Learning DSA'}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress Ring */}
        <div className="rounded-xl border border-border p-5 flex flex-col items-center gap-2 card-hover"
          style={{ background: 'var(--gradient-card)' }}>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none"
                stroke="hsl(var(--cyan))" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallProgress / 100)}`}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px hsl(var(--cyan) / 0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{overallProgress}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm">Overall Progress</div>
            <div className="text-xs text-muted-foreground">{completedCount}/{totalTopics} topics</div>
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-1 card-hover"
          style={{ background: 'var(--gradient-card)' }}>
          <div className="text-3xl">🔥</div>
          <div className="text-2xl font-bold text-amber">{profile?.streak_count || 0}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>

        {/* Accuracy */}
        <div className="rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-1 card-hover"
          style={{ background: 'var(--gradient-card)' }}>
          <div className="text-3xl">🎯</div>
          <div className="text-2xl font-bold text-primary">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>

        {/* Total Attempts */}
        <div className="rounded-xl border border-border p-5 flex flex-col items-center justify-center gap-1 card-hover"
          style={{ background: 'var(--gradient-card)' }}>
          <div className="text-3xl">⚡</div>
          <div className="text-2xl font-bold" style={{ color: 'hsl(var(--purple))' }}>{totalAttempts}</div>
          <div className="text-xs text-muted-foreground">Problems Attempted</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Suggested Next Topic */}
        <div className="lg:col-span-2 space-y-4">
          {suggestedNextTopic && (
            <div className="rounded-xl border p-5 card-hover"
              style={{ background: 'var(--gradient-card)', borderColor: 'hsl(var(--cyan) / 0.3)', boxShadow: 'var(--glow-cyan)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Suggested Next</div>
                  <h3 className="text-lg font-bold">{suggestedNextTopic.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{suggestedNextTopic.definition}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span>⏱ {suggestedNextTopic.estimatedHours}h estimated</span>
                    <span>·</span>
                    <span>{suggestedNextTopic.problems.length} problems</span>
                  </div>
                </div>
                <div className="text-4xl">{suggestedNextTopic.icon}</div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => navigate(`/curriculum/${suggestedNextTopic.id}`)}
                  style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
                  Start Learning →
                </Button>
                <Button variant="outline" onClick={() => navigate(`/practice?topic=${suggestedNextTopic.id}`)}>
                  Practice
                </Button>
              </div>
            </div>
          )}

          {/* Activity Chart */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-4">7-Day Activity</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} barSize={24}>
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={chartData[i].solved > 0 ? 'hsl(var(--cyan))' : 'hsl(var(--border))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Completed Topics */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-dsa-green">✓</span> Completed Topics
            </h3>
            {completedCount === 0 ? (
              <p className="text-sm text-muted-foreground">No topics completed yet. Start learning!</p>
            ) : (
              <div className="space-y-2">
                {TOPICS.filter(t => progress[t.id]?.completed).map(topic => (
                  <div key={topic.id} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'hsl(var(--green) / 0.2)', color: 'hsl(var(--green))' }}>✓</span>
                    <span>{topic.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <div className="rounded-xl border p-5"
              style={{ background: 'var(--gradient-card)', borderColor: 'hsl(var(--amber) / 0.3)' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-amber">⚠</span> Needs Attention
              </h3>
              <div className="space-y-2">
                {weakTopics.slice(0, 3).map(topic => (
                  <button key={topic.id} onClick={() => navigate(`/curriculum/${topic.id}`)}
                    className="w-full flex items-center gap-2 text-sm text-left hover:text-primary transition-colors">
                    <span className="text-amber">{topic.icon}</span>
                    <span>{topic.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {progress[topic.id] ? Math.round((progress[topic.id].correct_attempts / progress[topic.id].attempts) * 100) : 0}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: '📚', label: 'View Curriculum', path: '/curriculum' },
                { icon: '💻', label: 'Open Code Editor', path: '/editor' },
                { icon: '🧪', label: 'Practice Problems', path: '/practice' },
                { icon: '📊', label: 'View Progress', path: '/progress' },
              ].map(action => (
                <button key={action.path} onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                  <span className="ml-auto text-muted-foreground">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
