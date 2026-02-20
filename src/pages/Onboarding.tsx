import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTopicProgress } from '@/hooks/useTopicProgress';

const STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'experience', label: 'Experience' },
  { id: 'language', label: 'Language' },
  { id: 'goal', label: 'Goal' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'New to DSA, just starting out', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Know basics, want to level up', icon: '⚡' },
  { id: 'advanced', label: 'Advanced', desc: 'Experienced, targeting top companies', icon: '🔥' },
];

const LANGUAGES = [
  { id: 'python', label: 'Python', desc: 'Clean syntax, great for beginners', icon: '🐍' },
  { id: 'java', label: 'Java', desc: 'Popular in enterprise & interviews', icon: '☕' },
  { id: 'cpp', label: 'C++', desc: 'Fastest execution, competitive coding', icon: '⚡' },
];

const GOALS = [
  { id: 'faang', label: 'FAANG/MAANG Interview', icon: '🎯' },
  { id: 'placement', label: 'Campus Placement', icon: '🎓' },
  { id: 'competitive', label: 'Competitive Programming', icon: '🏆' },
  { id: 'fundamentals', label: 'Learn Fundamentals', icon: '📚' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState('');
  const [language, setLanguage] = useState('');
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { initializeProgress } = useTopicProgress();
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      experience_level: experience,
      preferred_language: language,
      learning_goal: goal,
      onboarding_completed: true,
    }).eq('id', user.id);

    if (error) {
      toast.error('Failed to save profile. Please try again.');
    } else {
      await initializeProgress();
      await refreshProfile();
      navigate('/');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? 'hsl(var(--cyan))' : 'hsl(var(--border))' }} />
          ))}
        </div>

        <div className="rounded-2xl border border-border p-8 animate-fade-in"
          style={{ background: 'var(--gradient-card)' }}>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center space-y-4">
              <div className="text-6xl">⚔️</div>
              <h2 className="text-2xl font-bold gradient-text-brand">Welcome to DSA Forge</h2>
              <p className="text-muted-foreground">
                Let's personalize your learning experience. Answer 3 quick questions to generate your custom roadmap.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                {['AI-powered roadmap', 'Live code execution', 'Context-aware chatbot', 'Progress tracking'].map(f => (
                  <div key={f} className="flex items-center gap-2 bg-muted rounded-lg p-3">
                    <span className="text-primary">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" onClick={() => setStep(1)}
                style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
                Let's Get Started →
              </Button>
            </div>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">What's your DSA experience?</h2>
                <p className="text-muted-foreground text-sm mt-1">We'll tailor your roadmap accordingly</p>
              </div>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button key={level.id} onClick={() => setExperience(level.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      experience === level.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted hover:border-primary/50'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.desc}</div>
                      </div>
                      {experience === level.id && <span className="ml-auto text-primary">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button className="flex-1" disabled={!experience} onClick={() => setStep(2)}
                  style={experience ? { background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' } : {}}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Language */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Preferred coding language?</h2>
                <p className="text-muted-foreground text-sm mt-1">Code examples and solutions will be shown in this language</p>
              </div>
              <div className="space-y-3">
                {LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => setLanguage(lang.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      language === lang.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted hover:border-primary/50'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.icon}</span>
                      <div>
                        <div className="font-medium font-mono">{lang.label}</div>
                        <div className="text-sm text-muted-foreground">{lang.desc}</div>
                      </div>
                      {language === lang.id && <span className="ml-auto text-primary">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" disabled={!language} onClick={() => setStep(3)}
                  style={language ? { background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' } : {}}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">What's your learning goal?</h2>
                <p className="text-muted-foreground text-sm mt-1">This helps us prioritize problems and topics</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoal(g.id)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      goal === g.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted hover:border-primary/50'
                    }`}>
                    <div className="text-2xl mb-2">{g.icon}</div>
                    <div className="text-sm font-medium">{g.label}</div>
                    {goal === g.id && <div className="text-xs text-primary mt-1">✓ Selected</div>}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" disabled={!goal || saving} onClick={handleComplete}
                  style={goal ? { background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' } : {}}>
                  {saving ? 'Generating Roadmap...' : '🚀 Start Learning'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
