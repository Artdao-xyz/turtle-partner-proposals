'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';
import CircleText from '../elements/CircleText';

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden">
      {/* Contenedor para la imagen animada */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <HeroVisual />
      </div> */}

      <CircleText isActive={false} className="absolute left-1/2 -translate-x-1/2 top-[10%]" />
      
      {/* Formulario de autenticación */}
      <AuthForm isVisible={!isAuthenticated} onAuthSuccess={handleAuthSuccess} />
    </section>
  );
}
