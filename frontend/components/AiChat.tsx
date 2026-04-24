'use client';

import { useEffect, useRef, useState } from 'react';
import { NdaFormData } from '@/lib/types';
import { chatApi } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  fields: NdaFormData;
  onFieldsChange: (fields: NdaFormData) => void;
}

const OPENING_MESSAGE =
  "Hi! I'll help you fill in your Mutual NDA. Let's start — what is the purpose of this agreement? For example: evaluating a potential business partnership.";

export default function AiChat({ fields, onFieldsChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      // Skip the hardcoded opening message — it's a UI artifact the AI never generated
      const data = await chatApi.message(updated.slice(1), fields as unknown as Record<string, unknown>);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.fields) {
        const merged = { ...fields };
        for (const [k, v] of Object.entries(data.fields as Record<string, unknown>)) {
          if (v !== null && v !== undefined) {
            (merged as Record<string, unknown>)[k] = v;
          }
        }
        onFieldsChange(merged);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-[#209dd7] text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-200 p-3 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#209dd7] focus:outline-none focus:ring-1 focus:ring-[#209dd7] disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-md bg-[#753991] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50 flex-shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}
