import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : ''}`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <a href="#" className="font-display text-xl font-bold tracking-tight">
          <span className="gradient-text">Yener</span>
          <span className="text-foreground ml-1 opacity-70">Solutions</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#digital-marketing" className="hover:text-foreground transition-colors">Services</a>
          <a href="#consulting" className="hover:text-foreground transition-colors">Consulting</a>
          <a href="#strategic-planning" className="hover:text-foreground transition-colors">Strategy</a>
          <a href="#" className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm font-medium">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
