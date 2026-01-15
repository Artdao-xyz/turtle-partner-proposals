'use client';

import { motion } from 'framer-motion';

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
      transition={{
        duration: 0.6,
        delay: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full px-4 pt-10 relative"
    >
      <div className="relative flex items-center justify-center w-full py-6">
        {/* Horizontal line container */}
        <div className="hidden lg:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px items-center">
          {/* Left outer gray line */}
          <div 
            className="flex-1 h-px"
            style={{ backgroundColor: 'rgba(107, 114, 128, 0.6)' }}
          ></div>
          
          {/* Left green glowing segment */}
          <div className="relative w-48 h-[5px] -my-[2px]">
            {/* Glow layer */}
            <div 
              className="absolute inset-0 h-[5px]"
              style={{
                background: 'linear-gradient(to right, rgba(115, 243, 108, 0.3), rgba(115, 243, 108, 0.9), rgba(115, 243, 108, 1))',
                filter: 'blur(4px)',
              }}
            ></div>
            {/* Main green line */}
            <div 
              className="absolute inset-0 h-[2px] top-[1.5px]"
              style={{
                background: `linear-gradient(to right, rgba(115, 243, 108, 0.8), var(--green-turtle), var(--green-turtle))`,
              }}
            ></div>
          </div>
          
          {/* Center spacer for text */}
          <div className="w-0"></div>
          
          {/* Right green glowing segment */}
          <div className="relative w-48 h-[5px] -my-[2px]">
            {/* Glow layer */}
            <div 
              className="absolute inset-0 h-[5px]"
              style={{
                background: 'linear-gradient(to left, rgba(115, 243, 108, 0.3), rgba(115, 243, 108, 0.9), rgba(115, 243, 108, 1))',
                filter: 'blur(4px)',
              }}
            ></div>
            {/* Main green line */}
            <div 
              className="absolute inset-0 h-[2px] top-[1.5px]"
              style={{
                background: `linear-gradient(to left, rgba(115, 243, 108, 0.8), var(--green-turtle), var(--green-turtle))`,
              }}
            ></div>
          </div>
          
          {/* Right outer gray line */}
          <div 
            className="flex-1 h-px"
            style={{ backgroundColor: 'rgba(107, 114, 128, 0.6)' }}
          ></div>
        </div>
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-8 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-4xl font-normal leading-9 lg:leading-[48px]" style={{ color: 'var(--white-turtle)' }}>
            The Central Coordination Layer for Liquidity
          </span>
        </h1>
      </div>
    </motion.div>
  );
}
