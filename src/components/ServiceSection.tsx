import { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ServiceSectionProps {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  index: number;
}

export default function ServiceSection({ id, title, description, bullets, index }: ServiceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  return (
    <section
      id={id}
      ref={ref}
      className="min-h-screen flex items-center py-24"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          {/* Particle side - placeholder space, particle canvas is fixed */}
          <div className="w-full lg:w-1/2 aspect-square max-w-lg" />
          
          {/* Content side */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <span className="text-sm font-body text-primary tracking-wider uppercase">
                0{index + 1} — Service
              </span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              <span className="gradient-text">{title}</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              {description}
            </p>
            
            <ul className="space-y-3 pt-2">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <Button variant="outline" className="glow-border border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                Learn More →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
