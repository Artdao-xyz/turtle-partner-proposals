'use client';

import { motion } from 'framer-motion';
import HeroTitle from './HeroTitle';
import TurtleLogo from '../elements/TurtleLogo';
import CanvasAnimation from './CanvasAnimation';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';
import HeroDescription from './HeroDescription';


interface HeroSectionProps {
  isScrolled: boolean;
}

export default function HeroSection({ isScrolled }: HeroSectionProps) {

  return (
    <section className="relative w-full h-svh lg:h-full flex flex-col overflow-hidden">
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <motion.div 
        className="shrink-0 relative lg:space-y-26"
        layout
        transition={{
          duration: 0.4,
          ease: EASING,
        }}
      >
          <div className="h-20 flex items-center justify-center lg:justify-start px-10 py-4">
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

      {/* Canvas - Fixed height at 50vh */}
      <div className="relative w-full h-[75vh] overflow-hidden">
        <CanvasAnimation />
      </div>

      <div className='lg:hidden'>
        <HeroDescription isVisible={true} />
      </div>
    </section>
  );
}
