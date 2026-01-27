'use client';

import { motion } from 'framer-motion';
import HeroTitle from './HeroTitle';
import TurtleLogo from '../elements/TurtleLogo';
import CanvasAnimation from './CanvasAnimation';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';
import { useScrollThreshold } from '../hooks/useScrollThreshold';

interface HeroSectionProps {
  isScrolled: boolean;
}

export default function HeroSection({ isScrolled }: HeroSectionProps) {

  return (
    <section className="relative w-full lg:h-screen lg:max-h-screen flex flex-col overflow-hidden">
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <motion.div 
        className="shrink-0 relative space-y-8 lg:space-y-4"
        layout
        transition={{
          duration: 0.4,
          ease: EASING,
        }}
      >
          <div className="h-20 flex items-center px-10 py-4">
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

      {/* Canvas - Dynamic height, grows/shrinks based on available space */}
      <div className="relative w-full flex-1 min-h-[350px] lg:min-h-0 overflow-hidden">
        <CanvasAnimation />
      </div>
    </section>
  );
}
