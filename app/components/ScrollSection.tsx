'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Controller from './Controller';
import GreenDot from '../elements/GreenDot';

interface InfoRowProps {
  title: string;
  items: readonly string[] | string[];
}

function InfoRow({ title, items, isSecond = false }: InfoRowProps & { isSecond?: boolean }) {
  return (
    <div 
      className={`w-xs h-full lg:h-auto lg:w-full rounded-5xl p-6 outline outline-black-highlight/10 ${
        isSecond ? '' : 'bg-black-highlight/2'
      }`}
      style={isSecond ? {
        background: 'linear-gradient(to bottom right, rgba(115, 243, 108, 0.0) 0%, rgba(115, 243, 108, 0.07) 35%, rgba(115, 243, 108, 0.1) 50%, rgba(115, 243, 108, 0.07) 65%, rgba(115, 243, 108, 0.0) 100%)'
      } : undefined}
    >
      <div className="flex items-center gap-3 mb-4">
        <GreenDot />
        <h3 className="text-[#eff8ed] text-lg lg:text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-white-turtle text-sm lg:text-base leading-6 lg:leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ScrollSectionItemProps {
  image: string;
  info: {
    row1: { title: string; items: string[] };
    row2: { title: string; items: string[] };
  };
  opacity: any;
}

function ScrollSectionItem({ image, info, opacity, zIndex = 1 }: ScrollSectionItemProps & { zIndex?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Listen to opacity changes to enable/disable pointer events
  useEffect(() => {
    const unsubscribe = opacity.on('change', (latest: any) => {
      setIsVisible(latest > 0.5);
    });
    
    // Initial check
    setIsVisible(opacity.get() > 0.5);
    
    return () => unsubscribe();
  }, [opacity]);
  
  return (
    <motion.div
      style={{ opacity, zIndex }}
      className={`absolute inset-0 w-full h-full flex items-center justify-center ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div className="w-full max-w-6xl mx-auto px-4 pointer-events-none">
        <div className="flex flex-col justify-center lg:grid lg:grid-cols-5 items-center lg:gap-6">
          {/* Image - First on mobile, Right on desktop */}
          <div className="w-full lg:col-span-3 lg:col-start-3 order-1 lg:order-2 flex items-center justify-center h-[40vh] lg:h-[600px]">
            <Image
              src={image}
              alt={info.row1.title}
              width={800}
              height={400}
              className="object-contain rounded-xl w-full h-full max-w-[90vw] lg:max-w-full"
              sizes="(max-width: 1024px) 90vw, 1200px"
              unoptimized
            />
          </div>

          {/* Info - Second on mobile, Left on desktop */}
          <div 
            className="w-screen lg:w-full lg:col-span-2 lg:col-start-1 order-2 lg:order-1 flex flex-row lg:flex-col p-4 lg:p-0 gap-4 lg:gap-2.5 overflow-x-scroll lg:overflow-x-visible snap-x snap-mandatory"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
              pointerEvents: isVisible ? 'auto' : 'none',
              position: 'relative',
              zIndex: isVisible ? 1000 : zIndex
            }}
          >
            <div className="shrink-0 lg:shrink min-w-[180px] lg:min-w-0">
              <InfoRow title={info.row1.title} items={info.row1.items} isSecond={false} />
            </div>
            <div className="shrink-0 lg:shrink min-w-[180px] lg:min-w-0">
              <InfoRow title={info.row2.title} items={info.row2.items} isSecond={true} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Datos estáticos movidos fuera del componente para evitar recreación
const SECTION_DATA: {
  section1: { image: string; info: { row1: { title: string; items: string[] }; row2: { title: string; items: string[] } } };
  section2: { image: string; info: { row1: { title: string; items: string[] }; row2: { title: string; items: string[] } } };
  section3: { image: string; info: { row1: { title: string; items: string[] }; row2: { title: string; items: string[] } } };
} = {
  section1: {
    image: "/media/images/image-1.png",
    info: {
      row1: {
        title: 'Key Features',
        items: [
          'Deal listing and discovery via Turtle',
          'Coordination with Turtle\'s LP and distribution network',
          'Optional advisory support around program structure and rollout',
        ],
      },
      row2: {
        title: 'Value Add',
        items: [
          'Broader reach',
          'Coordinated launch timing',
          'Reduced multi-party coordination cost',
        ],
      },
    },
  },
  section2: {
    image: "/media/images/image-2.png",
    info: {
      row1: {
        title: 'Key Features',
        items: [
          'Incentive and reward distribution via Turtle Streams',
          'Transparent, auditable distribution events',
          'Supports multiple assets and reward schedules',
        ],
      },
      row2: {
        title: 'Value add',
        items: [
          'Turnkey incentive distribution',
          'No bespoke contract or ops overhead',
          'Clean accounting and reporting',
        ],
      },
    },
  },
  section3: {
    image: "/media/images/image-3.png",
    info: {
      row1: {
        title: 'Key Features',
        items: [
          'Public-facing incentive leaderboard',
          'Supports standard metrics (TVL, deposits, participation)',
          'Configurable scoring logic, metrics and weighting',
        ],
      },
      row2: {
        title: 'Value add',
        items: [
          'Gamified participation',
          'Clear Visibility into performance',
          'Reduced need for custom front-end work',
        ],
      },
    },
  },
};

export default function ScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeSection, setActiveSection] = useState<'Visibility' | 'Streams' | 'Leaderboard'>('Visibility');

  // Detectar qué sección está activa basado en el scroll (ajustado a los nuevos thresholds)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.34) {
      setActiveSection('Visibility');
    } else if (latest < 0.68) {
      setActiveSection('Streams');
    } else {
      setActiveSection('Leaderboard');
    }
  });

  // Función para hacer scroll suave a una sección específica
  const scrollToSection = (section: 'Visibility' | 'Streams' | 'Leaderboard') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const containerHeight = container.offsetHeight;
    
    // Calcular posiciones de scroll basadas en los puntos de transición (ajustados)
    // Para Leaderboard, usamos un porcentaje ligeramente menor para alinear mejor con el contenido
    let targetScroll = 0;
    if (section === 'Visibility') {
      targetScroll = containerTop;
    } else if (section === 'Streams') {
      targetScroll = containerTop + (containerHeight * 0.34);
    } else if (section === 'Leaderboard') {
      targetScroll = containerTop + (containerHeight * 0.66);
    }
    
    // Scroll suave personalizado con mayor duración
    const startScroll = window.pageYOffset;
    const distance = targetScroll - startScroll;
    const duration = 1200; // 1.2 segundos para scroll más suave
    let startTime: number | null = null;
    
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      window.scrollTo(0, startScroll + distance * easeInOutCubic(progress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  // Dividir el scroll en 3 secciones con transiciones más rápidas para evitar imágenes a mitad de fade
  // Sección 1: visible desde el inicio hasta 0.32, fade out rápido de 0.32 a 0.34
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.32, 0.34],
    [1, 1, 0],
    { clamp: true }
  );
  
  // Sección 2: fade in rápido de 0.32 a 0.34, visible de 0.34 a 0.66, fade out rápido de 0.66 a 0.68
  const opacity2 = useTransform(
    scrollYProgress,
    [0.32, 0.34, 0.66, 0.68],
    [0, 1, 1, 0],
    { clamp: true }
  );
  
  // Sección 3: fade in rápido de 0.66 a 0.68, visible hasta el final
  const opacity3 = useTransform(
    scrollYProgress,
    [0.66, 0.68, 1],
    [0, 1, 1],
    { clamp: true }
  );


  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] w-full mt-32"
      style={{ backgroundColor: 'var(--black-turtle)' }}
    >
      {/* Sticky container */}
      <motion.div 
        className="sticky top-0 h-screen w-full max-w-6xl mx-auto overflow-hidden flex flex-col"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-250px' }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        {/* Controller with text - positioned at the top */}
        <div className="shrink-0 pt-8 pb-4 px-4 lg:px-8 lg:py-14 z-50">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-4 lg:gap-0">
            {/* Text on the left */}
            <p className="hidden lg:block text-3xl font-normal font-dm-sans text-white-turtle">
              Everything you need to run a liquidity campaign
            </p>
            {/* Controller on the right */}
            <Controller selectedMenu={activeSection} onMenuChange={scrollToSection} />
          </div>
        </div>
        
        {/* Content container - centered vertically */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Section 1 */}
          <ScrollSectionItem
            image={SECTION_DATA.section1.image}
            info={SECTION_DATA.section1.info}
            opacity={opacity1}
            zIndex={3}
          />

          {/* Section 2 */}
          <ScrollSectionItem
            image={SECTION_DATA.section2.image}
            info={SECTION_DATA.section2.info}
            opacity={opacity2}
            zIndex={2}
          />

          {/* Section 3 */}
          <ScrollSectionItem
            image={SECTION_DATA.section3.image}
            info={SECTION_DATA.section3.info}
            opacity={opacity3}
            zIndex={1}
          />
        </div>
      </motion.div>
    </section>
  );
}
