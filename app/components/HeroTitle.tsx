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
  
  // In mobile, always visible, fade in on load
  // In desktop, fade out when scrolled
  const shouldHide = isMobile ? false : isScrolled;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ 
        opacity: shouldHide ? 0 : 1,
        scale: shouldHide ? 0.95 : 1
      }}
      transition={{
        duration: 0.4,
        delay: isMobile ? 0.2 : 0,
        ease: EASING,
      }}
      className="relative w-full lg:w-screen lg:px-0"
    >
      <div className="lg:mt-10 relative flex flex-row items-center justify-between lg:gap-10 w-full pt-4 lg:pt-0">
        {/* Left Line */}
        <Line className="hidden lg:block" /> 
        
        {/* Center Content - Title + Subtitle in column */}
        <div className="flex flex-col w-full items-center justify-center lg:min-w-[600px]">
          {/* Title */}
          <h1 className="relative z-10 font-montserrat text-center">
            <span className="text-center font-montserrat text-5xl text-wise-white lg:text-7xl 2xl:text-8xl" style={{ lineHeight: '1.05', margin: 0, padding: 0 }}>
              Liquidity<br />Incentive<br />Toolkit
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: shouldHide ? 0 : 1 }}
            transition={{
              duration: 0.4,
              delay: isMobile ? 0.3 : 0,
              ease: EASING,
            }}
            className="w-full mt-4 lg:mt-6"
          >
            <div className="text-center font-montserrat text-xl leading-tight font-light text-white/50 lg:text-3xl">
              Design, launch, & distribute<br />incentives to the right LPs, at scale.
            </div>
          </motion.div>
        </div>

        {/* Right Line */}
        <Line className='scale-x-[-1] hidden lg:block'/>
      </div>
    </motion.div>
  );
}
