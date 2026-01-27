import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlitchCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function GlitchCard({ children, className, title }: GlitchCardProps) {
  return (
    <div className={cn(
      "group relative bg-card border border-primary/20 p-6 overflow-hidden hover:border-primary/60 transition-colors duration-300",
      className
    )}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
      
      {title && (
        <h3 className="text-xl font-display text-primary mb-4 uppercase tracking-widest group-hover:text-shadow-neon transition-all">
          {title}
        </h3>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover Glitch Overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-screen" />
    </div>
  );
}
