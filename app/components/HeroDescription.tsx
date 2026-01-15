'use client';

import { motion } from 'framer-motion';

interface HeroDescriptionProps {
  isVisible: boolean;
}

export default function HeroDescription({ isVisible }: HeroDescriptionProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.6,
        delay: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="w-full px-4 pb-10"
    >
      <div className="w-full max-w-5xl mx-auto font-dm-sans text-center">
        <span className="text-lg font-normal leading-6" style={{ color: 'var(--white-turtle)' }}>
          We sit in front of an active base of LPs with on-chain, ready-to-deploy capital and provide a suite of tools for partners to run liquidity and incentive programs end to end. Campaign setup, performance tracking, reward distribution, and reporting are all handled in a single system.<br/><br/>If you want your program in front of the right participants, launched cleanly, and managed without bespoke builds or operational mess,{' '}
        </span>
        <span className="text-lg font-normal leading-6" style={{ color: 'var(--green-turtle)' }}>
          this is the stack.
        </span>
      </div>
    </motion.div>
  );
}
