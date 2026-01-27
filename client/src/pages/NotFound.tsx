import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#0000AA] text-white font-mono p-8 flex flex-col items-center justify-center selection:bg-white selection:text-[#0000AA]">
      <div className="max-w-3xl w-full space-y-8">
        <div className="bg-white text-[#0000AA] inline-block px-2 font-bold mb-8">
          WINDOWS_FATAL_EXCEPTION
        </div>
        
        <h1 className="text-4xl md:text-6xl mb-8">404_ERROR</h1>
        
        <p className="text-xl md:text-2xl leading-relaxed">
          A fatal exception 404 has occurred at <span className="uppercase">{window.location.pathname}</span>. The current application will be terminated.
        </p>

        <ul className="list-disc pl-8 space-y-2 text-lg">
          <li>Press any key to terminate the current application.</li>
          <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
          <li>Actually, just click the button below to go home.</li>
        </ul>

        <div className="pt-8 text-center">
          <p className="mb-4 animate-pulse">Press any key to continue _</p>
          
          <Button 
            onClick={() => setLocation("/")}
            className="bg-white text-[#0000AA] hover:bg-gray-200 font-mono rounded-none border-2 border-white px-8 py-6 text-lg"
          >
            RETURN_TO_SAFETY
          </Button>
        </div>

        <div className="mt-16 text-sm opacity-70 text-center">
          Technical Information:
          <br />
          *** STOP: 0x00000404 (0xDEADBEEF, 0xBAADF00D, 0x00000000, 0x00000000)
        </div>
      </div>
    </div>
  );
}
