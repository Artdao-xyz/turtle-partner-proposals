import Link from "next/link";

export default function TalkToUsSection() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-16 border-t border-white/10">
      <div className="flex flex-col items-center text-center gap-6">
        <div>
          <h2 className="text-wise-white text-2xl md:text-4xl font-semibold font-dm-sans leading-tight mb-3">
            Building a liquidity program?
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-md mx-auto">
            Talk to the team that has bootstrapped $5.5B+ in DeFi liquidity across
            60+ protocols.
          </p>
        </div>
        <Link
          href="https://app.turtle.club/campaigns"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-[#292929] border border-white/10 text-green-turtle text-sm font-medium font-dm-sans hover:opacity-90 transition-opacity min-w-56"
        >
          Talk to us
        </Link>
      </div>
    </section>
  );
}
