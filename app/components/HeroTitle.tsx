'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Line from '../elements/Line';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroTitleProps {
  isScrolled: boolean;
}

export default function HeroTitle({ isScrolled }: HeroTitleProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // In mobile, always visible and full size, fade in on load
  const shouldHide = isMobile ? false : isScrolled;
  const shouldScale = isMobile ? false : isScrolled;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: shouldHide ? 0 : 1, scale: shouldScale ? 0.7 : 1 }}
      layout
      transition={{
        duration: 0.6,
        delay: isMobile ? 0.2 : 0,
        ease: EASING,
        layout: {
          duration: 0.3,
          ease: EASING,
        },
      }}
      className="w-full px-4 lg:px-0 relative"
    >
      <div className="relative flex flex-row items-center justify-center w-full pt-4 lg:pt-0">
        <Line /> 
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-20 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-6xl 2xl:text-8xl font-normal leading-9 lg:leading-[60px] 2xl:leading-[90px]" style={{ color: 'var(--white-turtle)' }}>
            <span className="lg:hidden whitespace-nowrap">
              The Coordination Layer<br />for Liquidity Incentives
            </span>
            <span className="hidden lg:inline whitespace-nowrap">
              The Coordination Layer for<br />Liquidity Incentives
            </span>
          </span>
        </h1>

        <Line className='scale-x-[-1]'/>
      </div>
      
      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: isMobile ? 0.3 : 0,
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
