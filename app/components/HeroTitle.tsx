'use client';

import { motion } from 'framer-motion';
import Line from '../elements/Line';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroTitleProps {
  isVisible: boolean;
}

export default function HeroTitle({ isVisible }: HeroTitleProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
      transition={{
        duration: ANIMATION_TIMINGS.authenticated.title.duration,
        delay: ANIMATION_TIMINGS.authenticated.title.delay,
        ease: EASING,
        layout: {
          duration: 0.4,
          ease: EASING,
        },
      }}
      className="w-full px-4 relative"
    >
      <div className="relative flex items-center justify-center w-full pt-4">
          <Line /> 
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-20 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-4xl font-normal leading-9 lg:leading-[48px] whitespace-nowrap" style={{ color: 'var(--white-turtle)' }}>
            The Central Coordination Layer for Liquidity
          </span>
        </h1>

        <Line className='scale-x-[-1]'/>
      </div>
    </motion.div>
  );
}
