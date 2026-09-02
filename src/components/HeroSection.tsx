import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/*
        ═══ A SCRIM, BECAUSE THE GLOW ABOVE IS NOT ONE ═══

        `bg-gradient-radial` adds cyan light at the centre. It is decoration, and against
        the particle cloud it makes the contrast WORSE — the headline and the sentence
        under it were being read through both a trophy and a glow.

        This is the background colour itself, densest exactly where the copy sits and gone
        by the edges, so the cloud stays fully visible around the text and disappears
        behind it. The particles are the thing people notice; the sentence is the thing
        they have to be able to read.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 42% at 50% 48%, hsl(220 30% 3% / 0.92) 0%, hsl(220 30% 3% / 0.75) 45%, transparent 78%)',
        }}
      />
      
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 mt-16">
        
        {/* Company label */}
        <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-primary/20 bg-primary/5 animate-fade-in-up">
          <span className="text-xs font-body text-primary tracking-[0.2em] uppercase">
            Yener Solutions
          </span>
        </div>
        
        {/* Main title */}
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          Building Digital
          <br />
          <span className="gradient-text">Products & Solutions</span>
        </h1>
        
        {/* Description */}
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          We are a technology agency creating applications, websites, and scalable digital products.
        </p>
        
        {/* Contact button (Apple-friendly) */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = "mailto:emre@yenersolutions.com"}
          >
            Contact Us
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-pulse-glow">
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    </section>
  );
}