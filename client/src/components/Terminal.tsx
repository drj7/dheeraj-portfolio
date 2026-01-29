import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ChatMode } from "./ChatMode";

interface TerminalProps {
  className?: string;
  initialLines?: string[];
}

interface TerminalLine {
  text: string;
  color?: string;
}

export function Terminal({ className, initialLines = [] }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines.map(text => ({ text, color: "text-primary/80" })));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isChatMode, setIsChatMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_HISTORY = 50;
  const MAX_LINES = 100;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    if (command) {
      setHistory(prev => [...prev.slice(-MAX_HISTORY + 1), cmd]);
      setHistoryIndex(-1);
    }
    
    const newLines = [...lines, { text: `> ${cmd}`, color: "text-white" }];

    switch (command) {
      case "help":
        newLines.push(
          { text: "Available commands:", color: "text-cyan-400" },
          { text: "  help     - Show this help message", color: "text-cyan-400/80" },
          { text: "  about    - Who is Dheeraj?", color: "text-cyan-400/80" },
          { text: "  skills   - List technical capabilities", color: "text-cyan-400/80" },
          { text: "  contact  - Display contact info", color: "text-cyan-400/80" },
          { text: "  chat     - Talk to Dheeraj-AI", color: "text-cyan-400/80" },
          { text: "  clear    - Clear terminal screen", color: "text-cyan-400/80" }
        );
        break;
      case "about":
        newLines.push(
          { text: "Dheeraj Yadla:", color: "text-green-400" },
          { text: "Software Engineer turned AI Whisperer.", color: "text-green-400/80" },
          { text: "Building the bridge between human intent and machine execution.", color: "text-green-400/80" }
        );
        break;
      case "skills":
        newLines.push(
          { text: "Technical Capabilities:", color: "text-yellow-400" },
          { text: "  [Frontend]  React, TypeScript, Tailwind", color: "text-yellow-400/80" },
          { text: "  [Backend]   Node.js, Python, PostgreSQL", color: "text-yellow-400/80" },
          { text: "  [AI/LLM]    Prompt Engineering, RAG, Agents", color: "text-yellow-400/80" }
        );
        break;
      case "contact":
        newLines.push(
          { text: "Contact Information:", color: "text-pink-400" },
          { text: "  Email: dheerajyadla@gmail.com", color: "text-pink-400/80" },
          { text: "  Status: Open to opportunities", color: "text-pink-400/80" }
        );
        break;
      case "chat":
        setIsChatMode(true);
        return;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "":
        break;
      default:
        newLines.push({ text: `Command not found: ${command}. Type 'help' for available commands.`, color: "text-red-400" });
    }

    // Limit the number of displayed lines
    if (newLines.length > MAX_LINES) {
      newLines.splice(0, newLines.length - MAX_LINES);
    }

    setLines(newLines);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div 
      className={cn(
        "bg-black border-2 border-primary/50 p-4 font-mono text-sm md:text-base shadow-[0_0_20px_rgba(0,255,0,0.2)]",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between mb-4 border-b border-primary/30 pb-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="text-primary/50 text-xs">user@dheeraj-pc:~</div>
      </div>
      
      {isChatMode ? (
        <div className="h-[300px]">
          <ChatMode onExit={() => setIsChatMode(false)} />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="space-y-1 h-[300px] overflow-y-auto scrollbar-hide cursor-text"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {lines.map((line, i) => (
            <div key={i} className={cn("break-words whitespace-pre-wrap", line.color || "text-primary/80")}>
              {line.text.startsWith(">") ? (
                <>
                  <span className="text-green-500 mr-2">$</span>
                  {line.text.substring(2)}
                </>
              ) : (
                <span>{line.text}</span>
              )}
            </div>
          ))}
          
          <div className="flex items-center text-primary">
            <span className="text-green-500 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-primary placeholder-primary/30"
              placeholder="Type 'help'..."
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
            />
          </div>
        </div>
      )}
      
      {/* Quick Commands */}
      {!isChatMode && (
        <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-primary/30">
          {["help", "about", "skills", "contact", "chat", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={(e) => {
                e.stopPropagation();
                handleCommand(cmd);
              }}
              className="text-xs font-mono px-2 py-1 border border-primary/30 text-primary/70 hover:bg-primary/20 hover:text-primary hover:border-primary transition-colors uppercase"
            >
              [{cmd}]
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
