import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  currentTopicId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({ currentTopicId, isOpen, onClose }: AIChatProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your DSA learning assistant 🤖\n\nI know your profile and can help you:\n- Explain DSA concepts and doubts\n- Suggest what to study next\n- Guide you through problems step-by-step\n- Review your approach before you code\n\n${currentTopicId ? `I see you're studying **${currentTopicId.replace(/-/g, ' ')}**. What would you like to know?` : 'What would you like to learn today?'}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          userProfile: {
            experience_level: profile?.experience_level,
            preferred_language: profile?.preferred_language,
            learning_goal: profile?.learning_goal,
          },
          currentTopicId,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        if (resp.status === 429) toast.error('Rate limit reached. Please wait a moment.');
        else if (resp.status === 402) toast.error('AI credits exhausted. Please add credits.');
        else toast.error(err.error || 'AI request failed');
        setLoading(false);
        return;
      }

      let assistantContent = '';

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

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
              assistantContent += content;
              setMessages(prev =>
                prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m)
              );
            }
          } catch {}
        }
      }
    } catch (e) {
      toast.error('Failed to connect to AI service');
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_PROMPTS = [
    'What should I study next?',
    'Explain the time complexity',
    'Give me a hint for this problem',
    'What are common patterns?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 max-h-[70vh] rounded-2xl border border-border shadow-2xl flex flex-col z-50 animate-slide-in-right"
      style={{ background: 'hsl(var(--card))', boxShadow: '0 25px 60px hsl(222 47% 2% / 0.8), var(--glow-cyan)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0"
        style={{ background: 'hsl(var(--secondary))' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'var(--gradient-cyan)' }}>
            🤖
          </div>
          <div>
            <div className="font-semibold text-sm">DSA Assistant</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="ai-pulse text-dsa-green">●</span> Online
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-lg">
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'rounded-br-sm text-primary-foreground'
                : 'rounded-bl-sm border border-border'
            }`}
              style={msg.role === 'user'
                ? { background: 'var(--gradient-cyan)' }
                : { background: 'hsl(var(--muted))' }}>
              {msg.role === 'assistant' ? (
                <div className="prose-dark prose prose-sm max-w-none">
                  <ReactMarkdown>{msg.content || (loading && i === messages.length - 1 ? '●' : '')}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl rounded-bl-sm border border-border bg-muted">
              <span className="ai-pulse text-primary">● ● ●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => { setInput(p); inputRef.current?.focus(); }}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2 p-3 border-t border-border flex-shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about DSA..."
          className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[36px] max-h-24"
          rows={1}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 flex-shrink-0"
          style={{ background: 'var(--gradient-cyan)' }}>
          <span className="text-primary-foreground text-sm">↑</span>
        </button>
      </div>
    </div>
  );
}
