import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { TOPICS } from '@/data/curriculum';

export interface TopicProgress {
  topic_id: string;
  mastery_score: number;
  attempts: number;
  correct_attempts: number;
  completed: boolean;
  unlocked: boolean;
  last_attempted_at: string | null;
}

export function useTopicProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const map: Record<string, TopicProgress> = {};
      data.forEach((row: any) => {
        map[row.topic_id] = row;
      });
      setProgress(map);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Initialize progress for new user — unlock first topic
  const initializeProgress = useCallback(async () => {
    if (!user) return;
    const firstTopic = TOPICS.find(t => t.prerequisites.length === 0);
    if (!firstTopic) return;

    const { data: existing } = await supabase
      .from('user_topic_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', firstTopic.id)
      .single();

    if (!existing) {
      await supabase.from('user_topic_progress').insert({
        user_id: user.id,
        topic_id: firstTopic.id,
        unlocked: true,
        mastery_score: 0,
        attempts: 0,
        correct_attempts: 0,
        completed: false,
      });
      await fetchProgress();
    }
  }, [user, fetchProgress]);

  const updateProgress = useCallback(async (
    topicId: string,
    update: Partial<TopicProgress>
  ) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_topic_progress')
      .upsert({
        user_id: user.id,
        topic_id: topicId,
        ...update,
      }, { onConflict: 'user_id,topic_id' });

    if (!error) {
      setProgress(prev => ({
        ...prev,
        [topicId]: { ...prev[topicId], topic_id: topicId, ...update } as TopicProgress,
      }));

      // Check if topic completed and unlock next topics
      if (update.completed) {
        const topic = TOPICS.find(t => t.id === topicId);
        if (topic) {
          for (const nextTopicId of topic.nextTopics) {
            // Check if all prerequisites of next topic are completed
            const nextTopic = TOPICS.find(t => t.id === nextTopicId);
            if (nextTopic) {
              const allPrereqsDone = nextTopic.prerequisites.every(prereqId => {
                const prereqProgress = progress[prereqId];
                return prereqProgress?.completed || (update.completed && prereqId === topicId);
              });
              if (allPrereqsDone) {
                await supabase.from('user_topic_progress').upsert({
                  user_id: user.id,
                  topic_id: nextTopicId,
                  unlocked: true,
                }, { onConflict: 'user_id,topic_id' });
              }
            }
          }
          await fetchProgress();
        }
      }
    }
  }, [user, progress, fetchProgress]);

  const getTopicStatus = (topicId: string): 'locked' | 'unlocked' | 'in-progress' | 'completed' => {
    const p = progress[topicId];
    if (!p) {
      // Check if it has no prerequisites
      const topic = TOPICS.find(t => t.id === topicId);
      if (topic?.prerequisites.length === 0) return 'unlocked';
      return 'locked';
    }
    if (p.completed) return 'completed';
    if (p.unlocked && p.attempts > 0) return 'in-progress';
    if (p.unlocked) return 'unlocked';
    return 'locked';
  };

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const totalTopics = TOPICS.length;
  const overallProgress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const weakTopics = TOPICS.filter(topic => {
    const p = progress[topic.id];
    return p && p.attempts > 0 && !p.completed && (p.correct_attempts / p.attempts) < 0.5;
  });

  const suggestedNextTopic = TOPICS.find(topic => {
    const status = getTopicStatus(topic.id);
    return status === 'unlocked' || status === 'in-progress';
  });

  return {
    progress,
    loading,
    fetchProgress,
    initializeProgress,
    updateProgress,
    getTopicStatus,
    completedCount,
    totalTopics,
    overallProgress,
    weakTopics,
    suggestedNextTopic,
  };
}
