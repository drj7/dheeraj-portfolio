import { Menu, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const socialLinks = [
  { icon: Github, href: "https://github.com/drj7", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/dheerajyadla", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/dherj", label: "Twitter" },
];

const navLinks = [
  { href: "#about", label: "ABOUT" },
  { href: "#projects", label: "PROJECTS" },
  { href: "#contact", label: "CONTACT" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-primary hover:bg-primary/10"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] border-primary/20 bg-background/95 backdrop-blur-md px-6"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-primary glitch-text" data-text="MENU">
            MENU
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 mt-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="font-mono text-lg text-foreground hover:text-primary transition-colors py-2 border-b border-primary/10"
            >
              [ {link.label} ]
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-primary/20">
          <p className="font-mono text-xs text-muted-foreground mb-4">CONNECT</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
