import { useState, useEffect } from "react";

export function SystemFooter() {
  const [uptime, setUptime] = useState(0);
  const [memory, setMemory] = useState(42);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
      // Fluctuate memory between 30-60%
      setMemory((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next > 60 ? 60 : next < 30 ? 30 : next;
      });
      // Fluctuate latency between 15-45ms
      setLatency((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        const next = prev + change;
        return next > 45 ? 45 : next < 15 ? 15 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-primary/20 text-[10px] md:text-xs font-mono text-primary/60 py-1 px-4 flex justify-between items-center z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
          <span>SYSTEM_ONLINE</span>
        </div>
        <div className="hidden md:block">
          UPTIME: <span className="text-primary">{formatTime(uptime)}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          HEAP: <span className="text-primary">{memory}%</span>
        </div>
        <div>
          LATENCY: <span className="text-primary">{latency}ms</span>
        </div>
        <div className="hidden sm:block text-primary/40">
          v2.0.4
        </div>
      </div>
    </div>
  );
}
