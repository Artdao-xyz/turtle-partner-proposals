'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import Button from "./Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  // Detectar dirección del scroll y inactividad
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si scrolleamos hacia abajo y no estamos en el top
      if (window.innerWidth > 768 && currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsIdle(false);
      }
      // Si scrolleamos hacia arriba o estamos cerca del top
      else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
        setIsIdle(false);
      }
      
      setLastScrollY(currentScrollY);
      
      // Resetear el timer de inactividad solo si estamos scrolleados
      if (window.innerWidth > 768 && currentScrollY > 100) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          setIsIdle(true);
          setIsVisible(false);
        }, 2000);
      }
    };

    // Función unificada para mostrar el navbar
    const showNavbar = () => {
      if (window.innerWidth > 768 && window.scrollY > 100) {
        setIsVisible(true);
        setIsIdle(false);
        
        // Resetear el timer
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          setIsIdle(true);
          setIsVisible(false);
        }, 2000);
      }
    };

    // Detectar movimiento del mouse para mostrar el navbar
    const handleMouseMove = (event: MouseEvent) => {
      // Solo mostrar el navbar si el mouse está dentro de los 40px superiores
      if (event.clientY <= 40) {
        showNavbar();
      }
    };

    // Detectar touch para mobile
    const handleTouch = () => {
      showNavbar();
    };

    // Inicializar timer si ya estamos scrolleados
    if (window.innerWidth > 768 && window.scrollY > 100) {
      idleTimer = setTimeout(() => {
        setIsIdle(true);
        setIsVisible(false);
      }, 2000);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      clearTimeout(idleTimer);
    };
  }, [lastScrollY]);

  // Determinar si el navbar debe estar visible
  const shouldBeVisible = isVisible && !isIdle;

  // Variants para animaciones
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.08 } },
    exit: { opacity: 0, transition: { when: "afterChildren" } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: easeInOut } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.15, ease: easeInOut } },
  };

  // Variants para el header auto-hide
  const headerVariants = {
    visible: { 
      y: 0,
      transition: { 
        duration: 0.1, 
        ease: easeInOut 
      }
    },
    hidden: { 
      y: -100,
      transition: { 
        duration: 0.075, 
        ease: easeInOut 
      }
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 h-25 left-0 w-full flex justify-between items-center px-8 lg:px-40 z-50 backdrop-blur-xs"
      variants={headerVariants}
      animate={shouldBeVisible ? "visible" : "hidden"}
      initial="visible"
    >
    <div className="flex justify-between items-center w-full">
        <Link href="/">
          <Image className="h-7" src="media/turtle-logo.svg" alt="Logo" width={127} height={50} />
        </Link>

        {/* Desktop menu - Centered with absolute positioning */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-10">
          <Link className="font-dm-sans font-medium hover:underline text-wise-white hover:opacity-60 underline-offset-2" href="/">Home</Link>
          <a className="font-dm-sans font-medium hover:underline text-wise-white hover:opacity-60 underline-offset-2" href="https://turtle.club/about-us" target="_blank" rel="noopener noreferrer">About Us</a>
          <Link className="font-dm-sans font-medium hover:underline text-wise-white hover:opacity-60 underline-offset-2" href="/">Incentivise Liquidity</Link>
          <a className="font-dm-sans font-medium hover:underline text-wise-white hover:opacity-60 underline-offset-2" href="https://docs.turtle.club/" target="_blank" rel="noopener noreferrer">Docs</a>
        </div>
        <Button
          href="https://app.turtle.club/campaigns"
          className="hidden md:flex"
        >
          Open App
        </Button>

        {/* Mobile hamburger icon */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors shadow-green-turtle outline -outline-offset-1 outline-green-turtle"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-6 h-6 text-green-turtle" />
        </button>
      </div>
      
      {/* Mobile menu overlay con animación */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed h-screen inset-0 z-50 bg-background flex flex-col justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
          >
            <div className="relative w-full px-8 lg:px-40 flex flex-col items-center justify-center h-full">
              {/* Top bar: logo + close (sin animación) */}
              
              <Link className="absolute top-8 left-8" href="/">
                <Image className="w-20 h-10" src="media/turtle-logo.svg" alt="Logo" width={127} height={50} />
              </Link>
              <button
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors z-50 shadow-green-turtle outline -outline-offset-1 outline-green-turtle"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-6 h-6 text-green-turtle" />
              </button>
              {/* Menu links (animados) */}
              <div className="flex flex-col items-center gap-8 mt-12 mb-10">
                <motion.div variants={itemVariants}>
                  <Link
                    href="/"
                    className="text-lg font-dm-sans font-medium text-wise-white active:underline active:underline-offset-2 active:opacity-60"
                    onClick={() => setMobileOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <a
                    href="https://turtle.club/about-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-dm-sans font-medium text-wise-white active:underline active:underline-offset-2 active:opacity-60"
                    onClick={() => setMobileOpen(false)}
                  >
                    About Us
                  </a>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/"
                    className="text-lg font-dm-sans font-medium text-wise-white active:underline active:underline-offset-2 active:opacity-60"
                    onClick={() => setMobileOpen(false)}
                  >
                    Incentivise Liquidity
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://docs.turtle.club/"
                    className="text-lg font-dm-sans font-medium text-wise-white active:underline active:underline-offset-2 active:opacity-60"
                    onClick={() => setMobileOpen(false)}
                  >
                    Docs
                  </a>
                </motion.div>
              </div>
              {/* Open App button (animado) */}
              <motion.div variants={itemVariants} className="w-full flex justify-center">
                <Button
                  href="https://app.turtle.club/campaigns"
                  className="mt-4"
                >
                  Open App
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}