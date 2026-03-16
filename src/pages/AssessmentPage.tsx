import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ASSESSMENT_TOPICS } from '@/data/curriculum';
import type { Difficulty } from '@/data/curriculum';
import type { AssessmentTopicLevel } from '@/types/assessment';
import { ClipboardCheck, Trophy, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'hsl(var(--muted-foreground))',
  easy: 'hsl(var(--green))',
  medium: 'hsl(var(--amber))',
  hard: 'hsl(var(--destructive))',
  master: 'hsl(var(--purple))',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  master: 'Master',
};

export default function AssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topicLevels, setTopicLevels] = useState<Record<string, AssessmentTopicLevel>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchLevels = async () => {
      const { data } = await supabase
        .from('assessment_topic_levels')
        .select('*')
        .eq('user_id', user.id);
      if (data) {
        const map: Record<string, AssessmentTopicLevel> = {};
        data.forEach((row: any) => {
          map[row.topic_id] = row as AssessmentTopicLevel;
        });
        setTopicLevels(map);
      }
      setLoading(false);
    };
    fetchLevels();
  }, [user]);

  const handleStart = (topicId: string, difficulty: Difficulty) => {
    if (!user) {
      toast.error('Please sign in to take assessments');
      return;
    }
    navigate(`/assessment/${topicId}?level=${difficulty}`);
  };

  const totalAssessed = Object.keys(topicLevels).length;
  const mastered = Object.values(topicLevels).filter(l => l.determined_level === 'master').length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-primary" />
          Assessment Hub
        </h1>
        <p className="text-muted-foreground mt-1">
          Test your DSA skills with AI-generated adaptive challenges
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4" style={{ background: 'var(--gradient-card)' }}>
          <Target className="w-5 h-5 text-primary mb-2" />
          <div className="text-2xl font-bold">{totalAssessed}/{ASSESSMENT_TOPICS.length}</div>
          <div className="text-xs text-muted-foreground">Topics Assessed</div>
        </div>
        <div className="rounded-xl border border-border p-4" style={{ background: 'var(--gradient-card)' }}>
          <Trophy className="w-5 h-5 mb-2" style={{ color: 'hsl(var(--purple))' }} />
          <div className="text-2xl font-bold">{mastered}</div>
          <div className="text-xs text-muted-foreground">Topics Mastered</div>
        </div>
        <div className="rounded-xl border border-border p-4" style={{ background: 'var(--gradient-card)' }}>
          <Zap className="w-5 h-5 mb-2" style={{ color: 'hsl(var(--amber))' }} />
          <div className="text-2xl font-bold">
            {Object.values(topicLevels).reduce((s, l) => s + (l.total_questions_passed || 0), 0)}
          </div>
          <div className="text-xs text-muted-foreground">Questions Passed</div>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border p-5" style={{ background: 'var(--gradient-card)' }}>
        <h3 className="font-semibold mb-3">How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <span className="text-primary font-bold min-w-6">1.</span>
            <span>Pick a topic and starting difficulty. AI generates fresh coding problems.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold min-w-6">2.</span>
            <span>Solve problems in the code editor. Easy: 3/5, Medium: 2/3, Hard: 1 to advance.</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold min-w-6">3.</span>
            <span>AI evaluates your code (0-100). Your performance determines your skill level.</span>
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ASSESSMENT_TOPICS.map(topic => {
          const level = topicLevels[topic.id];
          const determinedLevel = level?.determined_level || 'beginner';
          const hasLevel = !!level;

          return (
            <div
              key={topic.id}
              className="rounded-xl border border-border p-5 card-hover transition-all"
              style={{ background: 'var(--gradient-card)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{topic.icon}</span>
                  <h3 className="font-semibold text-sm">{topic.title}</h3>
                </div>
                {hasLevel && (
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: LEVEL_COLORS[determinedLevel],
                      borderColor: LEVEL_COLORS[determinedLevel],
                    }}
                  >
                    {LEVEL_LABELS[determinedLevel]}
                  </span>
                )}
              </div>

              {hasLevel && (
                <div className="mb-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Passed: {level.total_questions_passed}/{level.total_questions_attempted}</span>
                    <span>Avg: {Math.round(level.average_score || 0)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${level.total_questions_attempted > 0 ? Math.round(((level.total_questions_passed || 0) / level.total_questions_attempted) * 100) : 0}%`,
                        background: LEVEL_COLORS[determinedLevel],
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                  <Button
                    key={diff}
                    size="sm"
                    variant="outline"
                    className={`flex-1 text-xs capitalize ${
                      diff === 'easy'
                        ? 'hover:bg-dsa-green/10 hover:text-dsa-green hover:border-dsa-green/30'
                        : diff === 'medium'
                        ? 'hover:bg-amber/10 hover:text-amber hover:border-amber/30'
                        : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30'
                    }`}
                    onClick={() => handleStart(topic.id, diff)}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
