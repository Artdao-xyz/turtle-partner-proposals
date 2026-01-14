'use client';

import { useState } from 'react';
import AuthForm from './AuthForm';

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden">
      {/* Contenedor para la imagen animada */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Contenedor principal para la imagen con animación */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Círculo central - se agregará aquí */}
          <div className="relative">
            {/* Placeholder para el círculo central con glow */}
          </div>
          
          {/* Círculos pequeños alrededor - se agregarán aquí */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Placeholder para los 6 círculos pequeños con texto relativo */}
          </div>
        </div>
      </div>
      
      {/* Formulario de autenticación */}
      <AuthForm isVisible={!isAuthenticated} onAuthSuccess={handleAuthSuccess} />
    </section>
  );
}
