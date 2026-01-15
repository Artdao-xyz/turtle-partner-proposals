'use client';

import { motion } from 'framer-motion';
import Line from '../elements/Line';

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
      className="w-full px-4 relative"
    >
      <div className="relative flex items-center justify-center w-full py-6">
        {/* Lines container - hidden on mobile */}
        {/* <div className="hidden lg:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 items-center justify-center gap-8 z-0 border border-blue-200"> */}
          {/* Left Line */}
          <Line />
          
          {/* Right Line (inverted) */}

           
        
        {/* Text overlay */}
        <h1 className="relative z-10 lg:px-8 font-dm-sans text-center" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <span className="text-3xl lg:text-4xl font-normal leading-9 lg:leading-[48px]" style={{ color: 'var(--white-turtle)' }}>
            The Central Coordination Layer for Liquidity
          </span>
        </h1>

        <Line className='scale-x-[-1]'/>
      </div>
    </motion.div>
  );
}
