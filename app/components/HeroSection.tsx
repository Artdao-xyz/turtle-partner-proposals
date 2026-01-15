'use client';

import { AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import CircleText from '../elements/CircleText';
import { useAuth } from '../contexts/AuthContext';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  const sectionClassName = isAuthenticated
    ? 'relative w-full min-h-screen overflow-hidden flex flex-col justify-between py-10'
    : 'relative w-full min-h-screen overflow-hidden';

  return (
    <section className={sectionClassName}>
      {/* Título con líneas decorativas */}
      <AnimatePresence mode="wait">
        {isAuthenticated && <HeroTitle key="title" isVisible={isAuthenticated} />}
      </AnimatePresence>

      {/* SVG Circle Text */}
      <CircleText 
        isActive={isAuthenticated} 
        className={isAuthenticated 
          ? "relative mx-auto mt-10" 
          : "absolute left-1/2 -translate-x-1/2 top-[10%]"
        } 
      />
      
      {/* Formulario de autenticación */}
      <AuthForm isVisible={!isAuthenticated} />

      {/* Texto descriptivo */}
      <AnimatePresence mode="wait">
        {isAuthenticated && <HeroDescription key="description" isVisible={isAuthenticated} />}
      </AnimatePresence>
    </section>
  );
}
