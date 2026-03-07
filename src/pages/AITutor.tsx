import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Bot, 
  User, 
  Sparkles,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Explain photosynthesis simply",
  "Help me with algebra quadratic formulas",
  "Generate a quiz from my history notes",
  "Summarize Romeo and Juliet"
];

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hi! I'm your AI Tutor. I can help you with homework, explain complex topics, or quiz you. What are we learning today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: "You are a helpful, encouraging, and fun AI tutor for a high school student. Keep answers concise, engaging, and use markdown for formatting. " + input
                    }
                ]
            }
        ],
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.text || "I'm having trouble thinking right now. Try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            AI Tutor
          </h1>
          <p className="text-muted-foreground">Your personal study companion, available 24/7.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-secondary/20 border-border/50 backdrop-blur-sm">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'ai' ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'ai' 
                  ? 'bg-card border border-border/50 text-card-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code({node, className, children, ...props}) {
                        return (
                          <code className={`${className} bg-black/30 rounded px-1 py-0.5`} {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <span className="text-[10px] opacity-50 mt-2 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background/50">
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:bg-primary/10 hover:border-primary/50 text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  {prompt}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
