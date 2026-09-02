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
  /**
   * ═══ WHICH HALF OF THE ROW THE PARTICLES BELONG IN ═══
   *
   * `ServiceSection` reserves half its row for them — an empty `lg:w-1/2` spacer that
   * swaps sides on alternate sections. The canvas never used it: it was `fixed inset-0`,
   * so it painted across the whole viewport while that reserved half sat empty and the
   * particles ran straight through the body copy beside it.
   *
   * The side follows the same alternation the sections use, so the cloud lands in the gap
   * that was always meant for it.
   */
  const [side, setSide] = useState<'left' | 'right' | 'center'>('center');

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
            setSide('center');
          } else {
            setActiveShape(SERVICES[i - 1].shape);
            //: ServiceSection renders even indices as `lg:flex-row` (spacer first, so the
            //: particles are on the left) and odd as `lg:flex-row-reverse`.
            setSide((i - 1) % 2 === 0 ? 'left' : 'right');
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
      
      {/*
        Still fixed, so the morph between shapes runs continuously rather than restarting
        as sections scroll past — but no longer full-bleed. On a wide screen it occupies
        the half the current section leaves empty. Below `lg` there are no halves: the
        layout stacks, so the cloud goes back behind the content and drops to a third
        opacity, where it reads as texture instead of competing with the words on top of it.
      */}
      <ParticleScene
        activeShape={activeShape}
        className={[
          'fixed inset-y-0 z-0 pointer-events-none transition-[left,right,opacity] duration-700 ease-out',
          'inset-x-0 opacity-30',
          'lg:opacity-100',
          side === 'left' ? 'lg:left-0 lg:right-1/2' : '',
          side === 'right' ? 'lg:left-1/2 lg:right-0' : '',
          side === 'center' ? 'lg:inset-x-0' : '',
        ]
          .filter(Boolean)
          .join(' ')}
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
