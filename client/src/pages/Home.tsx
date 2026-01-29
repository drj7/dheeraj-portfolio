import { GlitchCard } from "@/components/GlitchCard";
import { NeuralBackground } from "@/components/NeuralBackground";
import { Terminal } from "@/components/Terminal";
import { SystemFooter } from "@/components/SystemFooter";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Copy, Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const socialLinks = [
  { icon: Github, href: "https://github.com/drj7", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/dheerajyadla", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/dherj", label: "Twitter" },
];

export default function Home() {
  const [donationGlitch, setDonationGlitch] = useState(false);
  const [avatarGlitch, setAvatarGlitch] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("dheerajyadla@gmail.com");
    toast.success("Email copied to clipboard!");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:dheerajyadla@gmail.com";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setDonationGlitch(true);
        setTimeout(() => setDonationGlitch(false), 200 + Math.random() * 800);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarGlitch(true);
      setTimeout(() => setAvatarGlitch(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      <nav className="fixed top-0 w-full z-50 border-b border-primary/20 bg-background/95 backdrop-blur-sm transition-colors duration-300">
        <div className="container flex items-center justify-between h-16">
          <div className="font-display text-3xl md:text-4xl text-primary glitch-text font-bold tracking-wider drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" data-text="DHEERAJ_YADLA">
            DHEERAJ_YADLA
          </div>
          <div className="hidden md:flex gap-8 font-mono text-sm items-center">
            <a href="#about" className="hover:text-primary transition-colors">[ ABOUT ]</a>
            <a href="#projects" className="hover:text-primary transition-colors">[ PROJECTS ]</a>
            <a href="#contact" className="hover:text-primary transition-colors">[ CONTACT ]</a>
            <div className="flex gap-3 ml-4 border-l border-primary/20 pl-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-center pt-16">
        <NeuralBackground />
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2 mb-6">
              <div className="font-mono text-sm text-muted-foreground">
                &gt; IDENTIFY_USER
              </div>
              <div className="font-display text-2xl md:text-3xl text-white bg-primary/10 inline-block px-4 py-2 border-l-4 border-primary">
                [ DHEERAJ YADLA ]
              </div>
            </div>
            <div className="inline-block px-3 py-1 border border-primary/50 text-xs font-mono text-primary bg-primary/10">
              SYSTEM_STATUS: ONLINE
            </div>
            <h1 className="text-3xl md:text-5xl font-display leading-tight">
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
                onClick={() => {
                  addLog("Executing: contact_me.sh");
                  scrollToSection("contact");
                }}
              >
                INITIATE_CONTACT
              </Button>
              <Button 
                variant="outline" 
                className="font-mono rounded-none border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => {
                  addLog("Accessing: /var/log/bio.txt");
                  scrollToSection("about");
                }}
              >
                VIEW_LOGS
              </Button>
            </div>
          </div>

          <div className="w-full lg:block mt-8 lg:mt-0">
            <Terminal initialLines={terminalLines} />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-primary/20 bg-black/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className={`absolute -inset-4 bg-gradient-to-r from-primary to-pink-500 blur-xl transition-opacity duration-1000 ${avatarGlitch ? "opacity-60" : "opacity-20"}`} />
              <img
                src="/images/avatar.jpg"
                alt="Dheeraj Yadla"
                className={`relative w-full max-w-md mx-auto border-2 border-primary/50 transition-all duration-700 ease-in-out ${avatarGlitch ? "grayscale-0 scale-[1.02]" : "grayscale"}`}
                loading="lazy"
              />

            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl text-primary">
                <span className="text-pink-500">01.</span> THE_TRANSFORMATION
              </h2>
              <div className="space-y-4 font-mono text-muted-foreground">
                <p>
                  <strong className="text-white">Day 1:</strong> I didn't actually have a degree in Computer Science. But I thought I was ready to change the world with Java anyway.
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
            <GlitchCard title="Enterprise To-Do List" className="h-full">
              <p className="text-muted-foreground mb-4">
                A simple checklist app powered by 12 microservices, a Kafka event bus, and a Kubernetes cluster. Over-engineering at its finest.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">React</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Node.js</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">PostgreSQL</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Docker</span>
              </div>
            </GlitchCard>

            <GlitchCard title="The 'Scale' Social Network" className="h-full">
              <p className="text-muted-foreground mb-4">
                A MERN stack social platform designed to handle millions of users, currently hosting just me and my mom. 99.99% uptime (when I'm awake).
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">MongoDB</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Express</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">React</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Node.js</span>
              </div>
            </GlitchCard>

            <GlitchCard title="E-Commerce for Time Travelers" className="h-full">
              <p className="text-muted-foreground mb-4">
                A Next.js shop where you can buy Bitcoin in 2010. Features a 'Grandfather Paradox' prevention algorithm (it just deletes your account).
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Next.js</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Stripe</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Tailwind</span>
                <span className="text-xs border border-primary/30 px-2 py-1 text-primary">Vercel</span>
              </div>
            </GlitchCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 border-t border-primary/20 bg-black/50">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl text-primary mb-8">
            <span className="text-pink-500">03.</span> INITIATE_UPLINK
          </h2>
          <p className="text-muted-foreground mb-12 font-mono">
            My neural link is always open. Whether you have a question, a project idea, or just want to discuss the inevitable robot uprising, I'll try my best to get back to you.
          </p>
          
          <div className="space-y-6">
            <Button 
              size="lg"
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-mono text-lg px-8 py-6 rounded-none transition-all hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]"
              onClick={handleEmailClick}
            >
              SEND_TRANSMISSION
            </Button>
            
            <div className="flex justify-center gap-4 pt-8">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-muted-foreground hover:text-primary"
                onClick={handleCopyEmail}
              >
                <Copy className="w-4 h-4 mr-2" />
                COPY_PGP_KEY
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SystemFooter />
    </div>
  );
}
