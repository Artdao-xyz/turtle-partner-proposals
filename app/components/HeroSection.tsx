'use client';

import { motion } from 'framer-motion';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import TurtleLogo from '../elements/TurtleLogo';
import CanvasAnimation from './CanvasAnimation';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

export default function HeroSection() {
  return (
    <section className="relative w-full lg:h-screen lg:max-h-screen flex flex-col overflow-hidden">
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <motion.div 
        className="shrink-0 relative space-y-8 lg:space-y-0"
        layout
        transition={{
          duration: 0.4,
          ease: EASING,
        }}
      >
          <div className="h-20 flex items-center px-10 py-4">
            {/* Logo - aparece siempre */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: ANIMATION_TIMINGS.unauthenticated.header.duration,
                delay: ANIMATION_TIMINGS.unauthenticated.header.delay,
                ease: EASING,
              }}
            >
              <TurtleLogo />
            </motion.div>
          </div>

          {/* Título - siempre visible con animación on load */}
          <HeroTitle isVisible={true} />
      </motion.div>

      {/* Canvas - Dynamic height, grows/shrinks based on available space */}
      <div className="relative w-full flex-1 min-h-[350px] lg:min-h-0 overflow-hidden">
        <CanvasAnimation />
      </div>

      {/* Bottom section with Text - Natural size, no shrinking */}
      <div className="shrink-0 flex flex-col justify-center items-center lg:pb-8">
        {/* Descripción - siempre visible con animación on load */}
        <HeroDescription isVisible={true} />
      </div>
    </section>
  );
}
