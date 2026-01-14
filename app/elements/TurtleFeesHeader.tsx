'use client';

import { motion } from 'framer-motion';

export default function TurtleFeesHeader() {
  return (
    <div className="w-full max-w-72 mx-auto px-4 py-2.5 mb-16 bg-black-highlight/2 rounded-5xl outline outline-black-highlight/10">
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
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold"
            style={{
              backgroundColor: 'rgba(115, 243, 108, 0.1)',
              border: '1px solid var(--green-turtle)',
              color: 'var(--green-turtle)',
              boxShadow: '0 0 20px rgba(115, 243, 108, 0.3)',
            }}
          >
            $
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
          <div className="w-2 h-2 rounded-full bg-green-turtle"></div>
          <span className="text-sm text-green-turtle font-medium">Turtle Fees</span>
        </div>
      </motion.div>
    </div>
  );
}
