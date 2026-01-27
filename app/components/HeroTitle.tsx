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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
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
      className="w-full px-4 lg:px-0 relative"
    >
      <div className="relative flex flex-row items-center justify-center w-full pt-4 lg:pt-0">
        <Line /> 
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-20 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-5xl font-normal leading-9 lg:leading-[48px]" style={{ color: 'var(--white-turtle)' }}>
            The Coordination Layer for Liquidity Incentives
          </span>
        </h1>

        <Line className='scale-x-[-1]'/>
      </div>
      
      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: ANIMATION_TIMINGS.authenticated.title.duration,
          delay: ANIMATION_TIMINGS.authenticated.title.delay + 0.2,
          ease: EASING,
        }}
        className="w-full max-w-2xl mx-auto mt-4 lg:mt-6"
      >
        <div className="text-center text-white/50 lg:text-2xl font-normal font-dm-sans lg:leading-7">
          Design, launch, and distribute incentives <br/>to the right LPs, at scale.
        </div>
      </motion.div>
    </motion.div>
  );
}
