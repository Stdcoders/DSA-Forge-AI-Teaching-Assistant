-- Assessment Sessions: tracks each assessment attempt per topic
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  current_level TEXT NOT NULL CHECK (current_level IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  easy_solved INTEGER DEFAULT 0,
  easy_attempted INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  medium_attempted INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  hard_attempted INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_assessment_sessions_user ON assessment_sessions(user_id, topic_id);

ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessment sessions" ON assessment_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment sessions" ON assessment_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessment sessions" ON assessment_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Assessment Questions: stores every AI-generated question and evaluation
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  examples JSONB NOT NULL DEFAULT '[]',
  constraints JSONB NOT NULL DEFAULT '[]',
  starter_code JSONB NOT NULL DEFAULT '{}',
  test_cases JSONB NOT NULL DEFAULT '[]',
  user_code TEXT,
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
  ai_feedback TEXT,
  passed BOOLEAN,
  skipped BOOLEAN DEFAULT false,
  hints_used INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_assessment_questions_session ON assessment_questions(session_id);
CREATE INDEX idx_assessment_questions_user_topic ON assessment_questions(user_id, topic_id);

ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessment questions" ON assessment_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessment questions" ON assessment_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessment questions" ON assessment_questions FOR UPDATE USING (auth.uid() = user_id);

-- Assessment Topic Levels: stores determined skill level per user per topic
CREATE TABLE assessment_topic_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  determined_level TEXT NOT NULL CHECK (determined_level IN ('beginner', 'easy', 'medium', 'hard', 'master')),
  easy_pass_rate NUMERIC(5,2) DEFAULT 0,
  medium_pass_rate NUMERIC(5,2) DEFAULT 0,
  hard_pass_rate NUMERIC(5,2) DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  total_questions_passed INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  last_assessed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

CREATE INDEX idx_assessment_topic_levels_user ON assessment_topic_levels(user_id);

ALTER TABLE assessment_topic_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own topic levels" ON assessment_topic_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own topic levels" ON assessment_topic_levels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own topic levels" ON assessment_topic_levels FOR UPDATE USING (auth.uid() = user_id);
