'use client';

import { motion } from 'framer-motion';
import Line from '../elements/Line';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroTitleProps {
  isVisible: boolean;
}

export default function HeroTitle({ isVisible }: HeroTitleProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
      layout
      transition={{
        duration: isVisible ? ANIMATION_TIMINGS.authenticated.title.duration : 0,
        delay: isVisible ? ANIMATION_TIMINGS.authenticated.title.delay : 0,
        ease: EASING,
        layout: {
          duration: 0.4,
          ease: EASING,
        },
      }}
      className="w-full px-4 relative"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="relative flex items-center justify-center w-full pt-4">
          <Line /> 
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-20 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-4xl font-normal leading-9 lg:leading-[48px] lg:whitespace-nowrap" style={{ color: 'var(--white-turtle)' }}>
            The Central Coordination Layer for Liquidity
          </span>
        </h1>

        <Line className='scale-x-[-1]'/>
      </div>
    </motion.div>
  );
}
