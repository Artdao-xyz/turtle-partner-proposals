'use client';

import { motion } from 'framer-motion';
import HeroTitle from './HeroTitle';
import CanvasAnimation from './CanvasAnimation';
import { EASING } from '../config/animationTimings';
import HeroDescription from './HeroDescription';
import Header from './Header';


interface HeroSectionProps {
  isScrolled: boolean;
}

export default function HeroSection({ isScrolled }: HeroSectionProps) {
  return (
    <section 
      className="relative w-full h-svh lg:h-[140vh] overflow-x-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      <Header />
      
      {/* MOBILE LAYOUT: Flex Column */}
      <div className="lg:hidden flex flex-col justify-between h-full pt-20">
        {/* Hero Title */}
        <div className="shrink-0 px-4 pt-2">
          <HeroTitle isScrolled={isScrolled} />
        </div>

        {/* Canvas */}
        <div className="flex-1 w-full min-h-[30svh]">
          <CanvasAnimation />
        </div>

        {/* Hero Description */}
        <div className="shrink-0 pb-2 px-4">
          <HeroDescription isVisible={true} />
        </div>
      </div>

      {/* DESKTOP LAYOUT: Absolute Positioning */}
      <div className="hidden lg:block">
        {/* Canvas - Always absolute, full viewport size, background layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <CanvasAnimation />
        </div>

        {/* Hero Title - Centered absolutely in viewport (not in 120vh section), fades based on scroll */}
        <div className="absolute top-[50vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <HeroTitle isScrolled={isScrolled} />
        </div>

        {/* Hero Description - Bottom of viewport, fades in when scrolled */}
        <motion.div
          className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{
            duration: 0.4,
            ease: EASING,
          }}
        >
          <HeroDescription isVisible={isScrolled} />
        </motion.div>
      </div>
    </section>
  );
}
