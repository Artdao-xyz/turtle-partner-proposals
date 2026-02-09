'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import HeroTitle from './HeroTitle';
import TurtleLogo from '../elements/TurtleLogo';
import CanvasAnimation from './CanvasAnimation';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';
import HeroDescription from './HeroDescription';
import Header from './Header';


interface HeroSectionProps {
  isScrolled: boolean;
}

export default function HeroSection({ isScrolled }: HeroSectionProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <section className="relative w-full h-svh lg:h-full flex flex-col justify-evenly lg:justify-center overflow-hidden">

      <Header />
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <motion.div 
        className="shrink-0 relative flex flex-col justify-between lg:justify-evenly items-center lg:h-[70vh]"
        layout
        transition={{
          duration: 0.4,
          ease: EASING,
        }}
      >
          <div className="lg:self-start lg:px-10 invisible">
            {/* Logo - aparece siempre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: EASING,
              }}
            >
              <TurtleLogo />
            </motion.div>
          </div>

          {/* Título - se achica cuando se hace scroll */}
          <HeroTitle isScrolled={isScrolled} />
      </motion.div>

      {/* Canvas - Changes height based on scroll state only on desktop */}
      <motion.div 
        className="relative w-full h-[40vh] lg:h-[30vh] overflow-hidden"
        initial={false}
        animate={isDesktop ? { 
          height: isScrolled ? '70vh' : 'calc(100vh - 30vh)'
        } : {}}
        transition={{
          duration: 0.3,
          ease: EASING,
        }}
        style={{
          flexShrink: 0,
          ...(isDesktop ? { marginTop: 'auto' } : {}) // Only apply marginTop on desktop
        }}
      >
        <CanvasAnimation />
      </motion.div>

      <div className='lg:hidden'>
        <HeroDescription isVisible={true} />
      </div>
    </section>
  );
}
