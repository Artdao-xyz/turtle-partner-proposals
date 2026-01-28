'use client';

import HeroSection from './components/HeroSection';
import HeroDescription from './components/HeroDescription';
import ScrollSection from './components/ScrollSection';
import LiquidityPrograms from './components/LiquidityPrograms';
import VideoPlayer from './components/VideoPlayer';
import AuthFormV2 from './components/AuthFormV2';
import { useScrollThreshold } from './hooks/useScrollThreshold';

export default function Home() {
  const isScrolled = useScrollThreshold(30);

  return (
    <main className="w-full">
      <HeroSection isScrolled={isScrolled} />

      {/* Bottom section with Text - Natural size, no shrinking */}
      <div className='hidden lg:block'>
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
