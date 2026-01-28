import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  className?: string;
  initialLines?: string[];
}

export function Terminal({ className, initialLines = [] }: TerminalProps) {
  const [lines, setLines] = useState<string[]>(initialLines);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    const newLines = [...lines, `> ${cmd}`];

    switch (command) {
      case "help":
        newLines.push(
          "Available commands:",
          "  help     - Show this help message",
          "  about    - Who is Dheeraj?",
          "  skills   - List technical capabilities",
          "  contact  - Display contact info",
          "  clear    - Clear terminal screen"
        );
        break;
      case "about":
        newLines.push(
          "Dheeraj Yadla:",
          "Software Engineer turned AI Whisperer.",
          "Building the bridge between human intent and machine execution."
        );
        break;
      case "skills":
        newLines.push(
          "Technical Capabilities:",
          "  [Frontend]  React, TypeScript, Tailwind",
          "  [Backend]   Node.js, Python, PostgreSQL",
          "  [AI/LLM]    Prompt Engineering, RAG, Agents"
        );
        break;
      case "contact":
        newLines.push(
          "Contact Information:",
          "  Email: dheerajyadla@gmail.com",
          "  Status: Open to opportunities"
        );
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "":
        break;
      default:
        newLines.push(`Command not found: ${command}. Type 'help' for available commands.`);
    }

    setLines(newLines);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
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
      
      <div ref={containerRef} className="space-y-1 h-[300px] overflow-y-auto scrollbar-hide cursor-text">
        {lines.map((line, i) => (
          <div key={i} className="text-primary/80 break-words whitespace-pre-wrap">
            {line.startsWith(">") ? (
              <>
                <span className="text-green-500 mr-2">$</span>
                {line.substring(2)}
              </>
            ) : (
              <span className="text-primary/70">{line}</span>
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
          />
        </div>
      </div>
      
      {/* Quick Commands */}
      <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-primary/30">
        {["help", "about", "skills", "contact", "clear"].map((cmd) => (
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
    </div>
  );
}
