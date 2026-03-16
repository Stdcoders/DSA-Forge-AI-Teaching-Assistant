import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Difficulty, Language } from '@/data/curriculum';
import { LANGUAGE_IDS, ASSESSMENT_TOPICS } from '@/data/curriculum';
import type {
  AssessmentSession,
  AssessmentQuestion,
  AssessmentStatus,
  EvaluationResult,
  LevelProgress,
  GeneratedProblem,
  LEVEL_REQUIREMENTS,
} from '@/types/assessment';

const JUDGE0_URL = 'https://ce.judge0.com';

const LEVEL_REQS: Record<Difficulty, { required: number; maxAttempts: number }> = {
  easy: { required: 3, maxAttempts: 5 },
  medium: { required: 2, maxAttempts: 3 },
  hard: { required: 1, maxAttempts: Infinity },
};

const NEXT_LEVEL: Record<string, Difficulty | null> = {
  easy: 'medium',
  medium: 'hard',
  hard: null,
};

function determineLevelFromSession(session: AssessmentSession): string {
  const hs = session.hard_solved ?? 0;
  const ms = session.medium_solved ?? 0;
  const ma = session.medium_attempted ?? 0;
  const es = session.easy_solved ?? 0;
  const ea = session.easy_attempted ?? 0;

  if (hs >= 1) return 'master';
  if (ma > 0 && ms >= 2) return 'hard';
  if (ea > 0 && es >= 3) return 'medium';
  if (ea > 0) return 'easy';
  return 'beginner';
}

export function useAssessment() {
  const { user, profile } = useAuth();

  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [status, setStatus] = useState<AssessmentStatus>('loading');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [previousQuestions, setPreviousQuestions] = useState<{ title: string; description: string; difficulty: string; passed: boolean }[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [testResults, setTestResults] = useState<{ input: string; expected: string; got: string; passed: boolean }[]>([]);
  const [output, setOutput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getLevelProgress = useCallback((s: AssessmentSession | null): Record<Difficulty, LevelProgress> => {
    if (!s) return {
      easy: { solved: 0, attempted: 0 },
      medium: { solved: 0, attempted: 0 },
      hard: { solved: 0, attempted: 0 },
    };
    return {
      easy: { solved: s.easy_solved ?? 0, attempted: s.easy_attempted ?? 0 },
      medium: { solved: s.medium_solved ?? 0, attempted: s.medium_attempted ?? 0 },
      hard: { solved: s.hard_solved ?? 0, attempted: s.hard_attempted ?? 0 },
    };
  }, []);

  const runOnJudge0 = useCallback(async (sourceCode: string, stdin: string, language: Language): Promise<string> => {
    const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: LANGUAGE_IDS[language],
        stdin,
      }),
    });
    if (!res.ok) return 'Execution service unavailable.';
    const data = await res.json();
    return data.stdout || data.stderr || data.compile_output || 'No output';
  }, []);

  // Combine user's Solution class with hidden driver code
  const buildFullCode = useCallback((userCode: string, language: Language, question: AssessmentQuestion): string => {
    const driver = question.driver_code?.[language];

    if (!driver) {
      // Fallback: no driver code found, run user code directly
      return userCode;
    }

    const placeholder = language === 'python' ? '# __USER_CODE__' : '// __USER_CODE__';
    return driver.replace(placeholder, userCode);
  }, []);

  const generateQuestion = useCallback(async (
    topicId: string,
    difficulty: Difficulty,
    prevQs: typeof previousQuestions,
    sessionOverride?: AssessmentSession,
  ) => {
    const activeSession = sessionOverride || session;
    if (!activeSession || !user) {
      console.error('generateQuestion called without a valid session or user');
      setStatus('error');
      return;
    }

    setGenerating(true);
    setStatus('generating');
    setEvaluation(null);
    setHintLevel(0);
    setCurrentHint('');
    setTestResults([]);
    setOutput('');

    try {
      const topic = ASSESSMENT_TOPICS.find(t => t.id === topicId);
      const { data, error } = await supabase.functions.invoke('generate-assessment-question', {
        body: {
          topicId,
          topicTitle: topic?.title || topicId,
          difficulty,
          preferredLanguage: profile?.preferred_language || 'python',
          previousQuestions: prevQs,
        },
      });

      if (error) {
        // Extract actual message from Supabase FunctionsHttpError
        let msg = 'Failed to generate question';
        try {
          const body = await (error as any).context?.json?.();
          if (body?.error) msg = body.error;
        } catch {}
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);

      const problem = data as GeneratedProblem;

      // Insert into DB — store both starterCode and driverCode in starter_code JSONB
      const starterCodeWithDriver = {
        ...problem.starterCode,
        pythonDriver: problem.driverCode?.python || '',
        javaDriver: problem.driverCode?.java || '',
        cppDriver: problem.driverCode?.cpp || '',
      };

      const { data: qRow, error: insertErr } = await supabase
        .from('assessment_questions')
        .insert({
          session_id: activeSession.id,
          user_id: user.id,
          topic_id: topicId,
          difficulty,
          title: problem.title,
          description: problem.description,
          examples: problem.examples,
          constraints: problem.constraints,
          starter_code: starterCodeWithDriver,
          test_cases: problem.testCases,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      setCurrentQuestion({
        ...qRow,
        examples: problem.examples,
        constraints: problem.constraints,
        starter_code: problem.starterCode,
        driver_code: problem.driverCode || {},
        test_cases: problem.testCases,
        user_code: null,
        ai_score: null,
        ai_feedback: null,
        passed: null,
        skipped: false,
        hints_used: 0,
        submitted_at: null,
      } as AssessmentQuestion);

      setStatus('solving');
    } catch (e: any) {
      console.error('Question generation failed:', e);
      setErrorMessage(e?.message || String(e));
      setStatus('error');
    } finally {
      setGenerating(false);
    }
  }, [session, user, profile]);

  const startSession = useCallback(async (topicId: string, startLevel: Difficulty) => {
    if (!user) return;
    setStatus('loading');
    setErrorMessage('');

    // Check for existing in-progress session
    const { data: existing } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existing) {
      const sess = existing as unknown as AssessmentSession;

      // Fetch previous questions for this session
      const { data: prevQs } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('session_id', sess.id)
        .order('created_at', { ascending: true });

      // If the session has an unanswered question with proper driver code, resume it.
      // Only abandon if there are no questions at all, or the unanswered question lacks driver code.
      const unansweredQ = (prevQs || []).find((q: any) => q.submitted_at === null && !q.skipped);
      const unansweredHasDriver = unansweredQ
        ? !!(unansweredQ.starter_code as any)?.pythonDriver
        : false;

      if (!unansweredQ || !unansweredHasDriver) {
        await supabase
          .from('assessment_sessions')
          .update({ status: 'abandoned', completed_at: new Date().toISOString() })
          .eq('id', sess.id);
        // Fall through to create new session below
      } else {
        setSession(sess);

        const prev = (prevQs || []).map((q: any) => ({
          title: q.title,
          description: q.description,
          difficulty: q.difficulty,
          passed: q.passed ?? false,
        }));
        setPreviousQuestions(prev);

        // Check if there's an unanswered question
        const unanswered = (prevQs || []).find((q: any) => q.submitted_at === null && !q.skipped);
        if (unanswered) {
          const sc = unanswered.starter_code as any;
          setCurrentQuestion({
            ...unanswered,
            examples: unanswered.examples as any,
            constraints: unanswered.constraints as any,
            starter_code: { python: sc?.python, java: sc?.java, cpp: sc?.cpp } as any,
            driver_code: { python: sc?.pythonDriver || '', java: sc?.javaDriver || '', cpp: sc?.cppDriver || '' } as any,
            test_cases: unanswered.test_cases as any,
          } as AssessmentQuestion);
          setStatus('solving');
        } else {
          await generateQuestion(topicId, sess.current_level as Difficulty, prev, sess);
        }
        return;
      }
    }

    // Create new session
    const { data: newSession, error } = await supabase
      .from('assessment_sessions')
      .insert({
        user_id: user.id,
        topic_id: topicId,
        current_level: startLevel,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create session:', error);
      setStatus('error');
      return;
    }

    const sess = newSession as unknown as AssessmentSession;
    setSession(sess);
    setPreviousQuestions([]);

    await generateQuestion(topicId, startLevel, [], sess);
  }, [user, generateQuestion]);

  const submitCode = useCallback(async (code: string, language: Language) => {
    if (!session || !currentQuestion || !user) return;

    setEvaluating(true);
    setStatus('evaluating');

    try {
      // Combine user code with hidden driver code
      const fullCode = buildFullCode(code, language, currentQuestion);

      // Run against test cases via Judge0
      const tcs = currentQuestion.test_cases as { input: string; expectedOutput: string }[];
      const results: { input: string; expected: string; got: string; passed: boolean }[] = [];

      for (let i = 0; i < tcs.length; i++) {
        if (i > 0) await new Promise(r => setTimeout(r, 600));
        const got = await runOnJudge0(fullCode, tcs[i].input, language);
        results.push({
          input: tcs[i].input,
          expected: tcs[i].expectedOutput,
          got: got.trim(),
          passed: got.trim() === tcs[i].expectedOutput.trim(),
        });
      }
      setTestResults(results);

      // AI evaluation
      const { data: evalData, error: evalErr } = await supabase.functions.invoke('evaluate-assessment', {
        body: {
          code,
          language,
          questionTitle: currentQuestion.title,
          questionDescription: currentQuestion.description,
          difficulty: currentQuestion.difficulty,
          testResults: results,
          topicId: session.topic_id,
        },
      });

      if (evalErr) throw evalErr;
      if (evalData?.error) throw new Error(evalData.error);

      const evalResult: EvaluationResult = {
        score: evalData.score,
        passed: evalData.passed,
        feedback: evalData.feedback,
        correctnessScore: evalData.correctnessScore,
        algorithmScore: evalData.algorithmScore,
        codeQualityScore: evalData.codeQualityScore,
        suggestion: evalData.suggestion,
      };
      setEvaluation(evalResult);

      // Update question in DB
      await supabase
        .from('assessment_questions')
        .update({
          user_code: code,
          ai_score: evalResult.score,
          ai_feedback: evalResult.feedback,
          passed: evalResult.passed,
          hints_used: hintLevel,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', currentQuestion.id);

      // Update session counters
      const diff = currentQuestion.difficulty as Difficulty;
      const solvedKey = `${diff}_solved` as keyof AssessmentSession;
      const attemptedKey = `${diff}_attempted` as keyof AssessmentSession;

      const newSolved = ((session[solvedKey] as number) || 0) + (evalResult.passed ? 1 : 0);
      const newAttempted = ((session[attemptedKey] as number) || 0) + 1;

      const updatedSession = {
        ...session,
        [solvedKey]: newSolved,
        [attemptedKey]: newAttempted,
      };

      await supabase
        .from('assessment_sessions')
        .update({
          [solvedKey]: newSolved,
          [attemptedKey]: newAttempted,
        })
        .eq('id', session.id);

      setSession(updatedSession);

      // Update previous questions
      const updatedPrev = [...previousQuestions, {
        title: currentQuestion.title,
        description: currentQuestion.description,
        difficulty: currentQuestion.difficulty,
        passed: evalResult.passed,
      }];
      setPreviousQuestions(updatedPrev);

      // Check progression
      const req = LEVEL_REQS[diff];
      if (newSolved >= req.required) {
        const nextLevel = NEXT_LEVEL[diff];
        if (nextLevel) {
          setStatus('level-up');
        } else {
          // Hard completed
          setStatus('mastered');
        }
      } else if (newAttempted >= req.maxAttempts && newSolved < req.required) {
        // Exhausted attempts at this level without meeting threshold
        // Complete the session with current level
        setStatus('mastered');
      } else {
        setStatus('solving');
      }
    } catch (e: any) {
      console.error('Submission failed:', e);
      setStatus('error');
    } finally {
      setEvaluating(false);
    }
  }, [session, currentQuestion, user, hintLevel, previousQuestions, runOnJudge0, buildFullCode]);

  const runCode = useCallback(async (code: string, language: Language, stdin: string) => {
    setOutput('Running...');
    try {
      // Combine user code with driver if available
      const fullCode = currentQuestion ? buildFullCode(code, language, currentQuestion) : code;
      const result = await runOnJudge0(fullCode, stdin, language);
      setOutput(result);
    } catch {
      setOutput('Execution failed.');
    }
  }, [runOnJudge0, currentQuestion, buildFullCode]);

  const skipQuestion = useCallback(async () => {
    if (!session || !currentQuestion || !user) return;

    // Mark as skipped in DB
    await supabase
      .from('assessment_questions')
      .update({ skipped: true, submitted_at: new Date().toISOString() })
      .eq('id', currentQuestion.id);

    // Update attempt counter
    const diff = currentQuestion.difficulty as Difficulty;
    const attemptedKey = `${diff}_attempted` as keyof AssessmentSession;
    const newAttempted = ((session[attemptedKey] as number) || 0) + 1;

    const updatedSession = { ...session, [attemptedKey]: newAttempted };
    await supabase
      .from('assessment_sessions')
      .update({ [attemptedKey]: newAttempted })
      .eq('id', session.id);

    setSession(updatedSession);
    setPreviousQuestions(prev => [...prev, {
      title: currentQuestion.title,
      description: currentQuestion.description,
      difficulty: currentQuestion.difficulty,
      passed: false,
    }]);

    // Check if exhausted attempts
    const req = LEVEL_REQS[diff];
    const solved = (updatedSession[`${diff}_solved` as keyof AssessmentSession] as number) || 0;
    if (newAttempted >= req.maxAttempts && solved < req.required) {
      setStatus('mastered');
    } else {
      await generateQuestion(session.topic_id, diff, [...previousQuestions, {
        title: currentQuestion.title,
        description: currentQuestion.description,
        difficulty: currentQuestion.difficulty,
        passed: false,
      }]);
    }
  }, [session, currentQuestion, user, previousQuestions, generateQuestion]);

  const requestHint = useCallback(async (code: string, language: string) => {
    if (!currentQuestion || hintLevel >= 3) return;

    const newHintLevel = hintLevel + 1;
    setHintLevel(newHintLevel);
    setHintLoading(true);
    setCurrentHint('');

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assessment-hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          questionTitle: currentQuestion.title,
          questionDescription: currentQuestion.description,
          difficulty: currentQuestion.difficulty,
          userCode: code,
          language,
          hintLevel: newHintLevel,
          topicId: session?.topic_id,
        }),
      });

      if (!resp.ok) throw new Error('Hint request failed');

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hintContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              hintContent += content;
              setCurrentHint(hintContent);
            }
          } catch {}
        }
      }

      // Update hints_used in question
      await supabase
        .from('assessment_questions')
        .update({ hints_used: newHintLevel })
        .eq('id', currentQuestion.id);
    } catch (e) {
      console.error('Hint request failed:', e);
      setCurrentHint('Failed to generate hint. Please try again.');
    } finally {
      setHintLoading(false);
    }
  }, [currentQuestion, hintLevel, session]);

  const advanceToNextLevel = useCallback(async () => {
    if (!session) return;
    const current = session.current_level as Difficulty;
    const next = NEXT_LEVEL[current];
    if (!next) return;

    await supabase
      .from('assessment_sessions')
      .update({ current_level: next })
      .eq('id', session.id);

    const updatedSession = { ...session, current_level: next };
    setSession(updatedSession);
    setEvaluation(null);

    await generateQuestion(session.topic_id, next, previousQuestions);
  }, [session, previousQuestions, generateQuestion]);

  const nextQuestion = useCallback(async () => {
    if (!session || !currentQuestion) return;
    const diff = currentQuestion.difficulty as Difficulty;
    await generateQuestion(session.topic_id, diff, previousQuestions);
  }, [session, currentQuestion, previousQuestions, generateQuestion]);

  const completeSession = useCallback(async () => {
    if (!session || !user) return;

    const determinedLevel = determineLevelFromSession(session);

    // Update session as completed
    await supabase
      .from('assessment_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', session.id);

    // Compute stats
    const totalAttempted = (session.easy_attempted ?? 0) + (session.medium_attempted ?? 0) + (session.hard_attempted ?? 0);
    const totalPassed = (session.easy_solved ?? 0) + (session.medium_solved ?? 0) + (session.hard_solved ?? 0);

    // Compute average score from question records
    const { data: qs } = await supabase
      .from('assessment_questions')
      .select('ai_score')
      .eq('session_id', session.id)
      .not('ai_score', 'is', null);

    const scores = (qs || []).map((q: any) => q.ai_score as number);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const easyPassRate = (session.easy_attempted ?? 0) > 0
      ? ((session.easy_solved ?? 0) / session.easy_attempted!) * 100 : 0;
    const medPassRate = (session.medium_attempted ?? 0) > 0
      ? ((session.medium_solved ?? 0) / session.medium_attempted!) * 100 : 0;
    const hardPassRate = (session.hard_attempted ?? 0) > 0
      ? ((session.hard_solved ?? 0) / session.hard_attempted!) * 100 : 0;

    // Upsert topic level
    await supabase
      .from('assessment_topic_levels')
      .upsert({
        user_id: user.id,
        topic_id: session.topic_id,
        determined_level: determinedLevel,
        easy_pass_rate: easyPassRate,
        medium_pass_rate: medPassRate,
        hard_pass_rate: hardPassRate,
        total_questions_attempted: totalAttempted,
        total_questions_passed: totalPassed,
        average_score: avgScore,
        last_assessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,topic_id' });

    setSession({ ...session, status: 'completed' });
  }, [session, user]);

  const abandonSession = useCallback(async () => {
    if (!session) return;

    await supabase
      .from('assessment_sessions')
      .update({ status: 'abandoned', completed_at: new Date().toISOString() })
      .eq('id', session.id);

    // Still save level determination based on what was achieved
    if (user) {
      const determinedLevel = determineLevelFromSession(session);
      const totalAttempted = (session.easy_attempted ?? 0) + (session.medium_attempted ?? 0) + (session.hard_attempted ?? 0);
      if (totalAttempted > 0) {
        const totalPassed = (session.easy_solved ?? 0) + (session.medium_solved ?? 0) + (session.hard_solved ?? 0);
        await supabase
          .from('assessment_topic_levels')
          .upsert({
            user_id: user.id,
            topic_id: session.topic_id,
            determined_level: determinedLevel,
            total_questions_attempted: totalAttempted,
            total_questions_passed: totalPassed,
            last_assessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,topic_id' });
      }
    }
  }, [session, user]);

  return {
    session,
    currentQuestion,
    status,
    evaluation,
    previousQuestions,
    hintLevel,
    currentHint,
    hintLoading,
    generating,
    evaluating,
    testResults,
    output,
    errorMessage,
    levelProgress: getLevelProgress(session),
    startSession,
    submitCode,
    runCode,
    skipQuestion,
    requestHint,
    advanceToNextLevel,
    nextQuestion,
    completeSession,
    abandonSession,
  };
}
