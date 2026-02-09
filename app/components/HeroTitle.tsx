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
        <h1 className="relative z-10 lg:px-20 text-center" style={{ backgroundColor: 'var(--black-turtle)', fontFamily: 'var(--font-montserrat)' }}>
          <span className="text-center font-montserrat text-5xl font-medium text-wise-white lg:text-7xl 2xl:text-8xl" style={{ color: 'var(--wise-white)' }}>
            Liquidity <br />Incentives Toolkit
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
        <div className="mt-4 text-center font-montserrat text-xl leading-tight text-white/50 lg:text-3xl">
          Design, launch, and distribute incentives <br/>to the right LPs, at scale.
        </div>
      </motion.div>
    </motion.div>
  );
}
