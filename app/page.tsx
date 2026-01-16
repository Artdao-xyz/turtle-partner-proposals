import HeroSection from './components/HeroSection';
import ScrollSection from './components/ScrollSection';
import TurtleFees from './components/TurtleFees';
import VideoPlayer from './components/VideoPlayer';
import AuthenticatedContent from './components/AuthenticatedContent';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <HeroSection />
      <AuthenticatedContent>
        <ScrollSection />
        <TurtleFees />
        <section className="w-full min-h-screen flex justify-center items-center mt-26" style={{ backgroundColor: 'var(--black-turtle)' }}>
          <VideoPlayer
            loomId="https://www.loom.com/share/3a48bed3d1db4b888eaec015625d9f5e"
            title="Turtle Product Suite Overview"
            description="CTO Nick Thoma gives a full overview of the turtle product suite and how we are building the future of onchain liquidity provisioning"
          />
        </section>
      </AuthenticatedContent>
    </main>
  );
}
