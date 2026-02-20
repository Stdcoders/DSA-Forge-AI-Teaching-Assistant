import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import logoImg from '@/assets/dsaforge-logo.jpeg';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/');
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Check your email to confirm, or sign in directly.');
        setMode('signin');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(var(--cyan)) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(var(--purple)) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-border"
            style={{ boxShadow: 'var(--glow-cyan)' }}>
            <img src={logoImg} alt="DSA Forge" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold gradient-text-brand">DSA Forge</h1>
          <p className="text-muted-foreground mt-1">Master Data Structures & Algorithms</p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-border p-8"
          style={{ background: 'var(--gradient-card)', boxShadow: '0 20px 60px hsl(222 47% 2% / 0.6)' }}>
          {/* Tab Switcher */}
          <div className="flex rounded-xl overflow-hidden border border-border mb-6">
            {(['signin', 'signup'] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}>
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="bg-muted border-border focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required
                className="bg-muted border-border focus:border-primary" />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}
              style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Feature highlights */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">What you'll get</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🗺️', text: 'AI Roadmap' },
                { icon: '⚡', text: 'Code Execution' },
                { icon: '🤖', text: 'AI Chatbot' },
                { icon: '📊', text: 'Progress Tracking' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
