import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface InlineTutorProps {
  problemTitle: string;
  problemDescription: string;
  topicTitle: string;
  topicId: string;
  examples: { input: string; output: string; explanation?: string }[];
}

export default function InlineTutor({ problemTitle, problemDescription, topicTitle, topicId, examples }: InlineTutorProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'Explain this problem simply',
    'What pattern should I use?',
    'Give me a hint without the answer',
    'What are edge cases?',
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const contextPrompt = `You are helping with the problem "${problemTitle}" in the topic "${topicTitle}".\n\nProblem: ${problemDescription}\n\nExamples:\n${examples.map(e => `Input: ${e.input} → Output: ${e.output}`).join('\n')}\n\nAnswer concisely. Use code examples when helpful.`;

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: contextPrompt },
            ...newMessages,
          ],
          userProfile: profile,
          currentTopicId: topicId,
        }),
      });

      if (!resp.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t respond right now. Please try again.' }]);
        setLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';

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
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center gap-2">
        <Bot className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold">AI Tutor — Ask anything about "{problemTitle}"</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <Bot className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Ask me anything about this problem!</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted border border-border'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose-dark text-xs leading-relaxed">
                  <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-muted border border-border rounded-lg px-3 py-2">
              <span className="ai-pulse text-xs">●</span>
              <span className="text-xs text-muted-foreground ml-1">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about this problem..."
          className="flex-1 text-xs bg-muted border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={loading}
        />
        <Button size="sm" className="h-7 w-7 p-0" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
