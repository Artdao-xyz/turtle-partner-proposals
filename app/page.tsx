'use client';

import HeroSection from './components/HeroSection';
import ScrollSection from './components/ScrollSection';
import LiquidityPrograms from './components/LiquidityPrograms';
import VideoPlayer from './components/VideoPlayer';
import AuthFormV2 from './components/AuthFormV2';
import HeroDescription from './components/HeroDescription';
import { motion } from 'framer-motion';


import { useState, useEffect } from 'react';
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener to trigger animation at ~5% scroll (works both ways)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      setIsScrolled(scrollPercent >= 5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <main className="w-full h-svh lg:h-screen">
      <HeroSection />

      {/* Bottom section with Text - Natural size, no shrinking */}
      <div className="shrink-0 flex flex-col justify-center items-center lg:mt-24">
        {/* Descripción - aparece cuando se hace scroll */}
        <HeroDescription isVisible={isScrolled} />
      </div>
      <ScrollSection />
      <LiquidityPrograms />
      <section className="w-full lg:min-h-screen flex justify-center items-center py-10 lg:py-0" style={{ backgroundColor: 'var(--black-turtle)' }}>
        <VideoPlayer
          loomId="https://www.loom.com/share/3a48bed3d1db4b888eaec015625d9f5e"
          title="Turtle Product Suite Overview"
          description="CTO Nick Thoma gives a full overview of the turtle product suite and how we are building the future of onchain liquidity provisioning"
        />
      </section>
      <AuthFormV2 />
    </main>
  );
}
