'use client';

import { motion } from 'framer-motion';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface HeroDescriptionProps {
  isVisible: boolean;
}

export default function HeroDescription({ isVisible }: HeroDescriptionProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{
        duration: isVisible ? ANIMATION_TIMINGS.authenticated.heroDescription.duration : 0,
        delay: isVisible ? ANIMATION_TIMINGS.authenticated.heroDescription.delay : 0,
        ease: EASING,
      }}
      className="w-full px-4"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="w-full max-w-3xl mx-auto font-dm-sans text-center">
        <span className="lg:text-lg font-normal leading-6" style={{ color: 'var(--white-turtle)' }}>
        We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end.<br/><br/>

        If you want your program in front of the right participants, launched cleanly, and managed without bespoke builds or operational mess,{' '}
        <span className="text-lg font-normal leading-6" style={{ color: 'var(--green-turtle)' }}>
          this is the stack.
        </span>
        </span>
      </div>
    </motion.div>
  );
}
