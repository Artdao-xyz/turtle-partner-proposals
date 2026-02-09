// components/AnimatedLine.tsx
'use client'

import { motion } from 'framer-motion'

interface LineProps {
  className?: string
}

export default function Line({ className }: LineProps) {
  return (
    <div className={`relative lg:w-full lg:max-w-[400px] h-[10px] ${className}`}>
      {/* Línea base gris */}
      <div 
        className="absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)'
        }}
      />
      
      {/* Línea verde animada con glow */}
      <motion.div
        className="absolute top-1/2 left-0 w-[60px] lg:w-[80px] h-[2px] bg-linear-to-r to-[#73F36C] from-transparent transform -translate-y-1/2 rounded-full"
        style={{ boxShadow: '0 0 8px rgba(115, 243, 108, 0.8)' }}
        animate={{
          x: [0, 350], // Travels across line (adjust based on expected line length)
          opacity: [1, 0], // Fade out at the end
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeOut',
          repeatDelay: 2,
        }}
      />
    </div>
  )
}
