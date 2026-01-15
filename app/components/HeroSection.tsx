'use client';

import { AnimatePresence, motion } from 'framer-motion';
import AuthForm from './AuthForm';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import CircleText from '../elements/CircleText';
import TurtleLogo from '../elements/TurtleLogo';
import { useAuth } from '../contexts/AuthContext';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  const sectionClassName = isAuthenticated
    ? 'relative w-full min-h-screen overflow-hidden flex flex-col justify-between py-10 max-w-7xl mx-auto'
    : 'relative w-full min-h-screen overflow-hidden max-w-7xl mx-auto';

  return (
    <section className={sectionClassName}>
      {/* Logo (arriba, pero anima DESPUÉS de la imagen) */}
      <AnimatePresence mode="wait">
        {isAuthenticated && (
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
            className="w-full flex justify-center"
          >
            <TurtleLogo />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partnership Proposal text */}
      <AnimatePresence mode="wait">
        {isAuthenticated && (
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
            className="w-full flex justify-center mt-10"
          >
            <div className="text-green-turtle text-lg font-normal font-dm-sans leading-5">
              Partnership Proposal
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Título con líneas decorativas (arriba, pero anima DESPUÉS de la imagen) */}
      <AnimatePresence mode="wait">
        {isAuthenticated && <HeroTitle key="title" isVisible={isAuthenticated} />}
      </AnimatePresence>

      {/* SVG Circle Text con animación de posición y color (PRIMERO en animar, pero visualmente abajo) */}
      <motion.div
        layout
        initial={false}
        className={isAuthenticated 
          ? "relative mx-auto mt-10 w-full" 
          : "absolute left-1/2 -translate-x-1/2 top-[10%] w-full" 
        }
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <CircleText 
          isActive={isAuthenticated} 
        />
      </motion.div>
      
      {/* Formulario de autenticación */}
      <AuthForm isVisible={!isAuthenticated} />

      {/* Texto descriptivo */}
      <AnimatePresence mode="wait">
        {isAuthenticated && <HeroDescription key="description" isVisible={isAuthenticated} />}
      </AnimatePresence>
    </section>
  );
}
