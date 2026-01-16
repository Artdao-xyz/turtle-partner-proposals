'use client';

import { AnimatePresence, motion } from 'framer-motion';
import AuthForm from './AuthForm';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import CircleText from '../elements/CircleText';
import TurtleLogo from '../elements/TurtleLogo';
import { useAuth } from '../contexts/AuthContext';
import CanvasAnimation from './CanvasAnimation';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full h-screen max-h-screen flex flex-col overflow-hidden">
      
      {/* Top section with Logo, Partnership, and Title - Dynamic height */}
      <div className="shrink-0">
          <div className="h-20 flex justify-between items-center px-10">
          <AnimatePresence mode="wait">
            {/* Logo - aparece siempre */}
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
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
                duration: 0.6,
                delay: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
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

          {/* Formulario de autenticación */}
          {!isAuthenticated && <AuthForm isVisible={!isAuthenticated} />}
      </div>

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
    </section>
  );
}
