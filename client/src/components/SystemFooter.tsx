import { useState, useEffect } from "react";

export function SystemFooter() {
  const [uptime, setUptime] = useState(0);
  const [memory, setMemory] = useState(42);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      // Fluctuate memory between 30-60%
      setMemory(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next > 60 ? 60 : next < 30 ? 30 : next;
      });
      // Fluctuate latency between 15-45ms
      setLatency(prev => {
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
    <div className="fixed bottom-0 left-0 w-full bg-black border-t-2 border-primary text-xs md:text-sm font-mono text-primary py-3 px-6 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,255,0,0.1)]">
      <div className="flex items-center space-x-6 md:space-x-8">
        <div className="flex items-center font-bold">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          <span className="tracking-wider">SYSTEM_ONLINE</span>
        </div>
        <div className="hidden md:block">
          <span className="text-primary/60 mr-2">UPTIME:</span>
          <span className="font-bold">{formatTime(uptime)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6 md:space-x-8">
        <div className="hidden md:block">
          <span className="text-primary/60 mr-2">HEAP:</span>
          <span className="font-bold">{memory}%</span>
        </div>
        <div>
          <span className="text-primary/60 mr-2">LATENCY:</span>
          <span className="font-bold">{latency}ms</span>
        </div>
        <div className="hidden sm:block text-primary/40 font-bold">v2.0.4</div>
      </div>
    </div>
  );
}
