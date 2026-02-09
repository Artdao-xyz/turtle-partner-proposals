'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroDescriptionProps {
  isVisible: boolean;
}

export default function HeroDescription({ isVisible }: HeroDescriptionProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.6,
        delay: isMobile && isVisible ? 0.4 : 0,
        ease: EASING,
      }}
      className="w-full px-4 lg:block shrink-0 flex flex-col justify-center items-center lg:mt-6 border-2 border-red-500"
    >
      <div className="w-full max-w-3xl mx-auto text-center" style={{ fontFamily: 'var(--font-montserrat)' }}>
        <span className="lg:text-xl font-normal leading-6" style={{ color: 'var(--wise-white)' }}>
          Turtle runs customizable incentive and liquidity programs end-to-end.<br />Connecting protocols to an active LP network to optimize capital efficiency.
        </span>
      </div>
    </motion.div>
  );
}
