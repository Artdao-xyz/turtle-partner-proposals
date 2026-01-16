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
    <section className="relative w-full min-h-screen flex flex-col gap-8">
      

      
      {/* Top section with Logo, Partnership, and Title */}
      <div className="grow flex flex-col justify-start items-center pt-4">
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
            className="w-full flex justify-center mb-6"
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
            className="w-full flex justify-center mt-6"
          >
            <div className="text-green-turtle text-lg font-normal font-dm-sans leading-5">
              Partnership Proposal
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Título - aparece cuando está autenticado */}
        <AnimatePresence mode="wait">
          {isAuthenticated && <HeroTitle key="title" isVisible={isAuthenticated} />}
        </AnimatePresence>

        {/* Formulario de autenticación */}
        {!isAuthenticated && <AuthForm isVisible={!isAuthenticated} />}
      </div>

      {/* Canvas - 50% of screen height */}
      <div className="relative w-full h-[60vh] shrink-0 overflow-hidden">
        <CanvasAnimation />
      </div>

      {/* Bottom section with Text */}
      <div className="grow flex flex-col justify-center items-center py-4">
        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <HeroDescription key="description" isVisible={isAuthenticated} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
