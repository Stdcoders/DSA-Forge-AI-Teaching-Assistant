import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { supabase } from '@/integrations/supabase/client';
import { TOPICS } from '@/data/curriculum';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface Submission {
  id: string;
  problem_id: string;
  topic_id: string;
  language: string;
  verdict: string;
  test_cases_passed: number;
  test_cases_total: number;
  created_at: string;
}

export default function ProgressPage() {
  const { user, profile } = useAuth();
  const { progress, completedCount, totalTopics, overallProgress, weakTopics } = useTopicProgress();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [subRes, actRes] = await Promise.all([
        supabase.from('submissions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('daily_activity').select('activity_date, problems_solved').eq('user_id', user.id)
          .gte('activity_date', new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0])
          .order('activity_date'),
      ]);
      setSubmissions(subRes.data || []);
      setActivityData((actRes.data || []).map((a: any) => ({ date: a.activity_date, count: a.problems_solved })));
    };
    fetchData();
  }, [user]);

  const totalAttempts = Object.values(progress).reduce((s, p) => s + p.attempts, 0);
  const totalCorrect = Object.values(progress).reduce((s, p) => s + p.correct_attempts, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const verdictCounts = submissions.reduce((acc: Record<string, number>, s) => {
    acc[s.verdict] = (acc[s.verdict] || 0) + 1;
    return acc;
  }, {});

  // Build 30-day activity heatmap data
  const thirtyDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const activity = activityData.find(a => a.date === dateStr);
    return { date: dateStr, label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), count: activity?.count || 0 };
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Progress Tracker</h1>
        <p className="text-muted-foreground mt-1">Your DSA learning journey at a glance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Completion', value: `${overallProgress}%`, icon: '🎯', color: 'hsl(var(--cyan))' },
          { label: 'Topics Done', value: `${completedCount}/${totalTopics}`, icon: '✅', color: 'hsl(var(--green))' },
          { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: 'hsl(var(--purple))' },
          { label: 'Streak', value: `${profile?.streak_count || 0} days`, icon: '🔥', color: 'hsl(var(--amber))' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-border p-4 card-hover"
            style={{ background: 'var(--gradient-card)' }}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic Progress Bars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-4">Topic Mastery</h3>
            <div className="space-y-3">
              {TOPICS.map(topic => {
                const p = progress[topic.id];
                const score = p?.mastery_score || 0;
                const isCompleted = p?.completed || false;
                const hasAttempts = p && p.attempts > 0;
                const topicAccuracy = hasAttempts ? Math.round((p.correct_attempts / p.attempts) * 100) : 0;
                return (
                  <div key={topic.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{topic.icon}</span>
                        <span className={isCompleted ? 'text-dsa-green' : hasAttempts ? '' : 'text-muted-foreground'}>
                          {topic.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {hasAttempts && <span>{topicAccuracy}% acc</span>}
                        <span className={`font-mono ${isCompleted ? 'text-dsa-green' : 'text-primary'}`}>{score}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${score}%`,
                          background: isCompleted
                            ? 'hsl(var(--green))'
                            : hasAttempts
                            ? 'hsl(var(--cyan))'
                            : 'hsl(var(--border))',
                        }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 30-Day Activity Heatmap */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-4">30-Day Activity</h3>
            <div className="grid grid-cols-10 gap-1">
              {thirtyDays.map(d => (
                <div key={d.date} title={`${d.label}: ${d.count} problems`}
                  className="aspect-square rounded-sm transition-all"
                  style={{
                    background: d.count === 0
                      ? 'hsl(var(--border))'
                      : d.count >= 3
                      ? 'hsl(var(--cyan))'
                      : d.count >= 2
                      ? 'hsl(var(--cyan) / 0.6)'
                      : 'hsl(var(--cyan) / 0.3)',
                  }} />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              {[0.1, 0.3, 0.6, 1].map(op => (
                <div key={op} className="w-3 h-3 rounded-sm"
                  style={{ background: `hsl(var(--cyan) / ${op})` }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Verdict Breakdown */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-4">Submission Results</h3>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet</p>
            ) : (
              <div className="space-y-2">
                {[
                  { key: 'accepted', label: 'Accepted', color: 'hsl(var(--green))' },
                  { key: 'wrong_answer', label: 'Wrong Answer', color: 'hsl(var(--destructive))' },
                  { key: 'runtime_error', label: 'Runtime Error', color: 'hsl(var(--amber))' },
                  { key: 'compile_error', label: 'Compile Error', color: 'hsl(var(--purple))' },
                ].map(v => {
                  const count = verdictCounts[v.key] || 0;
                  const pct = submissions.length > 0 ? Math.round((count / submissions.length) * 100) : 0;
                  return (
                    <div key={v.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{v.label}</span>
                        <span style={{ color: v.color }}>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: v.color }} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 text-xs text-muted-foreground border-t border-border">
                  {submissions.length} total submissions
                </div>
              </div>
            )}
          </div>

          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <div className="rounded-xl border p-5"
              style={{ background: 'var(--gradient-card)', borderColor: 'hsl(var(--amber) / 0.3)' }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-amber">⚠</span> Focus Areas
              </h3>
              <div className="space-y-2">
                {weakTopics.map(topic => {
                  const p = progress[topic.id];
                  const acc = p ? Math.round((p.correct_attempts / p.attempts) * 100) : 0;
                  return (
                    <div key={topic.id} className="flex items-center gap-2 text-sm">
                      <span>{topic.icon}</span>
                      <div className="flex-1">
                        <div>{topic.title}</div>
                        <div className="text-xs text-muted-foreground">{acc}% accuracy · {p?.attempts} attempts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Submissions */}
          <div className="rounded-xl border border-border p-5"
            style={{ background: 'var(--gradient-card)' }}>
            <h3 className="font-semibold mb-3">Recent Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet</p>
            ) : (
              <div className="space-y-2">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 text-sm">
                    <span className={
                      sub.verdict === 'accepted' ? 'verdict-accepted' :
                      sub.verdict === 'wrong_answer' ? 'verdict-wrong' : 'verdict-pending'
                    }>
                      {sub.verdict === 'accepted' ? '✓' : sub.verdict === 'wrong_answer' ? '✗' : '?'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{sub.problem_id.replace(/-/g, ' ')}</div>
                      <div className="text-xs text-muted-foreground">
                        {sub.test_cases_passed}/{sub.test_cases_total} cases · {sub.language}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
