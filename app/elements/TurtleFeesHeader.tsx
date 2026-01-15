'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import GreenDot from './GreenDot';

export default function TurtleFeesHeader() {
  return (
    <div className="w-full max-w-72 mx-auto p-2.5 pr-5 mb-12 bg-black-highlight/2 rounded-full outline outline-black-highlight/10">
      {/* Header with icon and button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        {/* Green dollar sign icon with glow */}
        <div className="relative">
          <div 
            className="rounded-full flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: 'rgba(115, 243, 108, 0.1)',
              boxShadow: '0 0 20px rgba(115, 243, 108, 0.3)',
            }}
          >
            <Image
              src="/media/dollar-sign.png"
              alt="Dollar sign"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Turtle Fees button */}
        <div
          className="px-4 py-2 rounded-full border border-green-turtle/50 bg-transparent flex items-center gap-2"
          style={{ 
            color: 'var(--white-turtle)',
            boxShadow: 'var(--shadow-green-turtle), var(--shadow-black-turtle)'
          }}
        >
          <GreenDot />
          <span className="text-sm text-green-turtle font-medium">Turtle Fees</span>
        </div>
      </motion.div>
    </div>
  );
}
