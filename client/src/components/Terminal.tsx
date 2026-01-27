import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  className?: string;
  initialLines?: string[];
}

export function Terminal({ className, initialLines = [] }: TerminalProps) {
  const [lines, setLines] = useState<string[]>(initialLines);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines]);

  return (
    <div className={cn(
      "bg-black border-2 border-primary/50 p-4 font-mono text-sm md:text-base shadow-[0_0_20px_rgba(0,255,0,0.2)]",
      className
    )}>
      <div className="flex items-center justify-between mb-4 border-b border-primary/30 pb-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="text-primary/50 text-xs">user@dheeraj-pc:~</div>
      </div>
      
      <div className="space-y-1 h-[300px] overflow-y-auto scrollbar-hide">
        {lines.map((line, i) => (
          <div key={i} className="text-primary/80 break-words">
            <span className="text-green-500 mr-2">$</span>
            {line}
          </div>
        ))}
        <div className="flex items-center text-primary animate-pulse">
          <span className="text-green-500 mr-2">$</span>
          <span className="w-2 h-4 bg-primary inline-block" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
