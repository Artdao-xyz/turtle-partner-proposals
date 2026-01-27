'use client';

import { motion } from 'framer-motion';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroDescriptionProps {
  isVisible: boolean;
}

export default function HeroDescription({ isVisible }: HeroDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.3,
        ease: EASING,
      }}
      className="w-full px-4 lg:block"
    >
      <div className="w-full max-w-3xl mx-auto font-dm-sans text-center">
        <span className="lg:text-lg font-normal leading-6" style={{ color: 'var(--white-turtle)' }}>
          Turtle runs customizable incentive and liquidity programs end-to-end. Connecting protocols to an active LP network to optimize capital efficiency.
        </span>
      </div>
    </motion.div>
  );
}
