import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  className?: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const INITIAL_PROMPTS = [
  "Who is Dheeraj?",
  "What are his skills?",
  "Tell me about his experience",
];

export function Terminal({ className }: TerminalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "dheeraj-ai" },
    {
      role: "assistant",
      content:
        "Hey! I'm Dheeraj's AI assistant. Ask me anything about his background, skills, or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] =
    useState<string[]>(INITIAL_PROMPTS);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages
        .filter(m => m.role !== "system")
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      // Update suggested prompts with new suggestions from API
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedPrompts(data.suggestions.slice(0, 3));
      }

      typeWriterEffect(data.response);
    } catch {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops, something went wrong. Try again or reach out directly at dheerajyadla@gmail.com",
        },
      ]);
    }
  };

  const typeWriterEffect = (text: string) => {
    let i = 0;
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const interval = setInterval(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = text.substring(0, i + 1);
        return newMessages;
      });

      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        inputRef.current?.focus();
      }
    }, 15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className={cn(
        "bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden font-mono text-sm",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-[#1a1a1a]">
        <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
        <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
        <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
        <span className="text-[#4a4a4a] text-xs ml-1">dheeraj-ai</span>
      </div>

      {/* Messages - tighter spacing */}
      <div
        ref={containerRef}
        className="h-[260px] overflow-y-auto px-3 py-2 space-y-2 scrollbar-hide"
      >
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2">
            {msg.role === "system" ? (
              <div className="text-[#333] text-[10px] w-full text-center py-0.5">
                {msg.content}
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "w-4 h-4 rounded flex items-center justify-center text-[9px] font-medium flex-shrink-0 mt-0.5",
                    msg.role === "user"
                      ? "bg-[#1a1a1a] text-[#666]"
                      : "bg-[#0a1a0a] text-[#4a9a4a]"
                  )}
                >
                  {msg.role === "user" ? "Y" : "D"}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-[10px] mb-0.5",
                      msg.role === "user" ? "text-[#555]" : "text-[#4a9a4a]"
                    )}
                  >
                    {msg.role === "user" ? "you" : "dheeraj-ai"}
                  </div>
                  <div className="text-[#999] text-[13px] whitespace-pre-wrap leading-snug">
                    {msg.content}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded bg-[#0a1a0a] flex items-center justify-center text-[9px] text-[#4a9a4a] font-medium">
              D
            </div>
            <div className="flex items-center gap-0.5 text-[#444] text-xs">
              <span className="animate-pulse">•</span>
              <span className="animate-pulse delay-100">•</span>
              <span className="animate-pulse delay-200">•</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area - compact */}
      <div className="border-t border-[#1a1a1a] p-2 bg-[#0a0a0a]">
        {/* Suggested prompts - always visible */}
        {!isTyping && (
          <div className="flex flex-wrap gap-1 mb-2">
            {suggestedPrompts.map((prompt: string, i: number) => (
              <button
                key={`${prompt}-${i}`}
                onClick={e => {
                  e.stopPropagation();
                  sendMessage(prompt);
                }}
                className="text-[10px] px-2 py-0.5 rounded border border-[#222] text-[#555] hover:border-[#333] hover:text-[#777] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask about Dheeraj..."
            className="flex-1 bg-[#111] border border-[#222] rounded px-2.5 py-1.5 text-[#999] text-[13px] placeholder:text-[#333] focus:outline-none focus:border-[#333] transition-colors disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-2.5 py-1.5 rounded bg-[#1a1a1a] text-[#666] hover:bg-[#222] hover:text-[#888] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
        {messages.length > 2 && !isTyping && (
          <button
            onClick={e => {
              e.stopPropagation();
              setMessages([
                { role: "system", content: "dheeraj-ai" },
                {
                  role: "assistant",
                  content:
                    "Hey! I'm Dheeraj's AI assistant. Ask me anything about his background, skills, or experience.",
                },
              ]);
              setInput("");
              setSuggestedPrompts(INITIAL_PROMPTS);
            }}
            className="text-[10px] text-[#444] hover:text-[#666] transition-colors mt-1.5 text-center w-full"
          >
            clear chat
          </button>
        )}
      </div>
    </div>
  );
}
