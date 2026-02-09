// components/AnimatedLine.tsx
'use client'

import { motion } from 'framer-motion'

interface LineProps {
  className?: string
}

export default function Line({ className }: LineProps) {
  return (
    <div className={`hidden md:block max-w-[400px] w-full h-[10px] ${className}`}>
      {/* Línea base gris */}
      <div 
        className="absolute top-1/2 left-0 w-full max-w-[400px] h-px transform -translate-y-1/2"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 80%, transparent 100%)'
        }}
      />
      
      {/* Línea verde animada con glow */}
      <motion.div
        className="absolute top-1/2 left-0 w-[100px] h-[2px] bg-linear-to-r to-[#73F36C] from-transparent transform -translate-y-1/2 rounded-full"
        animate={{
          x: [0, 310], // 400 - 100 (para que no se salga)
          opacity: [1, 1, 0], // Cambio de opacidad
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeOut',
          repeatDelay: 2,
        }}
      />
    </div>
  )
}
