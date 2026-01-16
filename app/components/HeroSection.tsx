'use client';

import { AnimatePresence, motion } from 'framer-motion';
import AuthForm from './AuthForm';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import CircleText from '../elements/CircleText';
import TurtleLogo from '../elements/TurtleLogo';
import { useAuth } from '../contexts/AuthContext';
import CanvasAnimation from './CanvasAnimation';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full h-screen max-h-screen flex flex-col overflow-hidden">
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <motion.div 
        className="shrink-0 relative"
        layout
        transition={{
          duration: 0.4,
          ease: EASING,
        }}
      >
          <div className="h-20 flex justify-between items-center px-10">
          <AnimatePresence mode="wait">
            {/* Logo - aparece siempre */}
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: ANIMATION_TIMINGS.unauthenticated.header.duration,
                delay: isAuthenticated ? 0.6 : ANIMATION_TIMINGS.unauthenticated.header.delay,
                ease: EASING,
              }}
            >
              <TurtleLogo />
            </motion.div>

            {/* Partnership Proposal text - aparece siempre */}
            <motion.div
              key="partnership-proposal"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: ANIMATION_TIMINGS.unauthenticated.header.duration,
                delay: isAuthenticated ? 0.7 : ANIMATION_TIMINGS.unauthenticated.header.delay,
                ease: EASING,
              }}
            >
              <div className="text-green-turtle text-lg font-normal font-dm-sans whitespace-nowrap">
                Partnership Proposal
              </div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Título - aparece cuando está autenticado */}
          <AnimatePresence mode="wait">
            {isAuthenticated && <HeroTitle key="title" isVisible={isAuthenticated} />}
          </AnimatePresence>
      </motion.div>

      {/* Canvas - Dynamic height, grows/shrinks based on available space */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        <CanvasAnimation />
      </div>

      {/* Bottom section with Text - Natural size, no shrinking */}
      <div className="shrink-0 flex flex-col justify-center items-center pb-4">
        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <HeroDescription key="description" isVisible={isAuthenticated} />
          )}
        </AnimatePresence>
      </div>

      {/* Formulario de autenticación */}
      {!isAuthenticated && <AuthForm isVisible={!isAuthenticated} />}
    </section>
  );
}
