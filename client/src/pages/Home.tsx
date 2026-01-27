import { GlitchCard } from "@/components/GlitchCard";
import { Terminal } from "@/components/Terminal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [terminalLines, setTerminalLines] = useState([
    "Initializing system...",
    "Loading developer_skills.json...",
    "Error: Java.exe stopped working.",
    "Rebooting into AI_Mode...",
    "Success! Welcome to the future."
  ]);

  const addLog = (msg: string) => {
    setTerminalLines(prev => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-primary/20 bg-black/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="font-display text-2xl text-primary glitch-text" data-text="DHEERAJ_YADLA">
            DHEERAJ_YADLA
          </div>
          <div className="hidden md:flex gap-8 font-mono text-sm">
            <a href="#about" className="hover:text-primary transition-colors">[ ABOUT ]</a>
            <a href="#projects" className="hover:text-primary transition-colors">[ PROJECTS ]</a>
            <a href="#contact" className="hover:text-primary transition-colors">[ CONTACT ]</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="/images/hero-bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 border border-primary/50 text-xs font-mono text-primary bg-primary/10">
              SYSTEM_STATUS: ONLINE
            </div>
            <h1 className="text-5xl md:text-7xl font-display leading-none">
              SOFTWARE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">ENGINEER</span><br />
              TURNED<br />
              <span className="glitch-text text-pink-500" data-text="AI_WHISPERER">AI_WHISPERER</span>
            </h1>
            <p className="text-lg text-muted-foreground font-mono max-w-xl">
              I used to write thousands of lines of code to center a div. 
              Now I ask the AI nicely and it builds me a spaceship.
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-primary text-black hover:bg-primary/90 font-mono rounded-none border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition-all"
                onClick={() => addLog("Executing: contact_me.sh")}
              >
                INITIATE_CONTACT
              </Button>
              <Button 
                variant="outline" 
                className="font-mono rounded-none border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => addLog("Loading: resume.pdf... File corrupted. Just kidding.")}
              >
                VIEW_LOGS
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <Terminal initialLines={terminalLines} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-primary/20 bg-black/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-pink-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              <img 
                src="/images/avatar.jpg" 
                alt="Dheeraj Avatar" 
                className="relative w-full max-w-md mx-auto border-2 border-primary/50 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Floating Badges */}
              <img 
                src="/images/badge-java.png" 
                alt="Java Badge"
                className="absolute -top-8 -right-8 w-24 h-24 animate-bounce delay-100 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]"
              />
              <img 
                src="/images/badge-ai.png" 
                alt="AI Badge"
                className="absolute -bottom-8 -left-8 w-24 h-24 animate-bounce drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"
              />
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl text-primary">
                <span className="text-pink-500">01.</span> THE_TRANSFORMATION
              </h2>
              <div className="space-y-4 font-mono text-muted-foreground">
                <p>
                  <strong className="text-white">Day 1:</strong> I graduated with a degree in Computer Science. I thought I was ready to change the world with Java.
                </p>
                <p>
                  <strong className="text-white">Day 1,402:</strong> After debugging a NullPointerException for 6 hours, I realized there had to be a better way.
                </p>
                <p>
                  <strong className="text-white">Day 1,403:</strong> I discovered LLMs. I typed "Fix my code" and it worked. I felt like a wizard.
                </p>
                <p>
                  Now, I bridge the gap between human intent and machine execution. I don't just write code; I curate intelligence.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-primary/20 bg-primary/5">
                  <h3 className="text-primary mb-2 font-display">OLD_SKILLS</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Java / Spring Boot</li>
                    <li>React (The hard way)</li>
                    <li>Centering Divs</li>
                    <li>Crying over AWS</li>
                  </ul>
                </div>
                <div className="p-4 border border-pink-500/20 bg-pink-500/5">
                  <h3 className="text-pink-500 mb-2 font-display">NEW_POWERS</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Prompt Engineering</li>
                    <li>AI Agent Orchestration</li>
                    <li>RAG Pipelines</li>
                    <li>Talking to Robots</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24">
        <div className="container">
          <h2 className="text-4xl text-primary mb-16 text-center">
            <span className="text-pink-500">02.</span> SELECTED_WORKS
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlitchCard title="The Lazy Coder" className="h-full">
              <p className="text-muted-foreground mb-4">
                An AI agent that detects when I'm procrastinating and automatically generates the boilerplate code I was avoiding.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Python</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">OpenAI API</span>
              </div>
            </GlitchCard>

            <GlitchCard title="Meme Generator 9000" className="h-full">
              <p className="text-muted-foreground mb-4">
                A RAG-based system that indexes my entire life's failures and turns them into relatable memes for LinkedIn.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">LangChain</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Vector DB</span>
              </div>
            </GlitchCard>

            <GlitchCard title="Infinite Portfolio" className="h-full">
              <p className="text-muted-foreground mb-4">
                This website. It's actually being updated in real-time by an AI that thinks it's me. (Just kidding... or am I?)
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">React</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Tailwind</span>
              </div>
            </GlitchCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 border-t border-primary/20 bg-black/50">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl text-primary mb-8">
            <span className="text-pink-500">03.</span> ESTABLISH_UPLINK
          </h2>
          <p className="text-xl text-muted-foreground mb-12 font-mono">
            Whether you need a software engineer who understands the metal, or an AI specialist who understands the magic, I'm your guy.
          </p>
          
          <div className="inline-block p-1 bg-gradient-to-r from-primary to-pink-500">
            <div className="bg-black p-8">
              <p className="text-2xl font-display text-white mb-6">dheeraj.yadla@example.com</p>
              <div className="flex justify-center gap-4">
                <Button className="bg-primary text-black hover:bg-primary/90 font-mono rounded-none w-full">
                  SEND_EMAIL
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-mono rounded-none w-full">
                  COPY_PGP_KEY
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-primary/10 text-center text-sm text-muted-foreground font-mono">
        <p>
          © 2026 Dheeraj Yadla. Built with <span className="text-pink-500">♥</span> and a lot of prompts.
        </p>
      </footer>
    </div>
  );
}
