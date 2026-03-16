import type { Language, Difficulty } from '@/data/curriculum';

// ── Database row types ──

export interface AssessmentSession {
  id: string;
  user_id: string;
  topic_id: string;
  current_level: Difficulty;
  status: 'in_progress' | 'completed' | 'abandoned';
  easy_solved: number;
  easy_attempted: number;
  medium_solved: number;
  medium_attempted: number;
  hard_solved: number;
  hard_attempted: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  session_id: string;
  user_id: string;
  topic_id: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starter_code: Record<Language, string>;
  driver_code: Record<Language, string>;
  test_cases: { input: string; expectedOutput: string }[];
  user_code: string | null;
  ai_score: number | null;
  ai_feedback: string | null;
  passed: boolean | null;
  skipped: boolean;
  hints_used: number;
  submitted_at: string | null;
  created_at: string;
}

export interface AssessmentTopicLevel {
  id: string;
  user_id: string;
  topic_id: string;
  determined_level: 'beginner' | 'easy' | 'medium' | 'hard' | 'master';
  easy_pass_rate: number;
  medium_pass_rate: number;
  hard_pass_rate: number;
  total_questions_attempted: number;
  total_questions_passed: number;
  average_score: number;
  last_assessed_at: string;
  updated_at: string;
}

// ── UI / hook state types ──

export interface LevelRequirement {
  required: number;
  maxAttempts: number;
}

export const LEVEL_REQUIREMENTS: Record<Difficulty, LevelRequirement> = {
  easy: { required: 3, maxAttempts: 5 },
  medium: { required: 2, maxAttempts: 3 },
  hard: { required: 1, maxAttempts: Infinity },
};

export interface LevelProgress {
  solved: number;
  attempted: number;
}

export type AssessmentStatus =
  | 'loading'
  | 'generating'
  | 'solving'
  | 'evaluating'
  | 'level-up'
  | 'mastered'
  | 'error';

export interface EvaluationResult {
  score: number;
  passed: boolean;
  feedback: string;
  correctnessScore: number;
  algorithmScore: number;
  codeQualityScore: number;
  suggestion?: string;
}

export interface GeneratedProblem {
  title: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  testCases: { input: string; expectedOutput: string }[];
  starterCode: Record<Language, string>;
  driverCode: Record<Language, string>;
}
