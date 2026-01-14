import HeroSection from './components/HeroSection';
import TurtleFees from './components/TurtleFees';
import VideoPlayer from './components/VideoPlayer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TurtleFees />
      <section className="w-full py-20" style={{ backgroundColor: 'var(--black-turtle)' }}>
        <VideoPlayer
          loomId="https://www.loom.com/share/3a48bed3d1db4b888eaec015625d9f5e"
          title="Turtle Product Suite Overview"
          description="CTO Nick Thoma gives a full overview of the turtle product suite and how we are building the future of onchain liquidity provisioning"
        />
      </section>
    </main>
  );
}
