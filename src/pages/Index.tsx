import { useState, useEffect, useCallback } from 'react';
import ParticleScene from '@/components/ParticleScene';
import HeroSection from '@/components/HeroSection';
import ServiceSection from '@/components/ServiceSection';
import Navbar from '@/components/Navbar';
import FooterSection from '@/components/FooterSection';
import type { ShapeKey } from '@/lib/shapes';

const SERVICES = [
  {
    id: 'digital-marketing',
    shape: 'chart' as ShapeKey,
    title: 'Digital Marketing',
    description: 'Drive measurable results with data-driven campaigns across every digital channel.',
    bullets: [
      'SEO optimization & organic growth',
      'Paid advertising campaigns (PPC, Display)',
      'Social media strategy & management',
      'Performance analytics & reporting',
    ],
  },
  {
    id: 'creative-design',
    shape: 'pen' as ShapeKey,
    title: 'Creative Design',
    description: 'Craft visual experiences that captivate audiences and elevate your brand identity.',
    bullets: [
      'Brand identity & visual systems',
      'UI/UX design for web & mobile',
      'Visual storytelling & content',
      'Motion graphics & animation',
    ],
  },
  {
    id: 'consulting',
    shape: 'chat' as ShapeKey,
    title: 'Consulting',
    description: 'Expert guidance to identify opportunities, optimize operations, and accelerate growth.',
    bullets: [
      'Business analysis & diagnostics',
      'Growth opportunity mapping',
      'Operational optimization',
      'Revenue strategy & monetization',
    ],
  },
  {
    id: 'strategic-planning',
    shape: 'chess' as ShapeKey,
    title: 'Strategic Planning',
    description: 'Long-term vision meets tactical execution — positioning your business for sustained success.',
    bullets: [
      'Market positioning & competitive analysis',
      'Digital transformation strategy',
      'Product roadmap development',
      'Long-term growth planning',
    ],
  },
];

const SECTION_IDS = ['hero', ...SERVICES.map(s => s.id)];

export default function Index() {
  const [activeShape, setActiveShape] = useState<ShapeKey>('trophy');

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Determine which section is most visible
    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTION_IDS[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.6) {
          if (i === 0) {
            setActiveShape('trophy');
          } else {
            setActiveShape(SERVICES[i - 1].shape);
          }
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* Fixed particle canvas */}
      <ParticleScene
        activeShape={activeShape}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Content overlay */}
      <div className="relative z-10">
        <HeroSection />
        
        {SERVICES.map((service, i) => (
          <ServiceSection
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            bullets={service.bullets}
            index={i}
          />
        ))}
        
        <FooterSection />
      </div>
    </div>
  );
}
