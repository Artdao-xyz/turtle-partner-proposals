'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';
import HeroTitle from './HeroTitle';
import HeroDescription from './HeroDescription';
import CircleText from '../elements/CircleText';

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <section className={`relative w-full min-h-screen overflow-hidden ${isAuthenticated ? 'flex flex-col justify-between py-10' : ''}`}>
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
      <AuthForm isVisible={!isAuthenticated} onAuthSuccess={handleAuthSuccess} />

      {/* Texto descriptivo */}
      <AnimatePresence mode="wait">
        {isAuthenticated && <HeroDescription key="description" isVisible={isAuthenticated} />}
      </AnimatePresence>
    </section>
  );
}
