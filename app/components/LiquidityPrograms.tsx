'use client';

import { motion } from 'framer-motion';
import GreenDot from '../elements/GreenDot';
import Image from 'next/image';

export default function LiquidityPrograms() {
  return (
    <section className="w-full py-10 lg:py-[60px] border-2 border-blue-500/50" style={{ backgroundColor: 'var(--black-turtle)' }}>
      <div className="w-full max-w-[1180px] mx-auto px-4 lg:px-20">
        {/* Title Section */}
        <div className="flex flex-col lg:flex-row gap-2.5 items-center justify-between mb-15 lg:mb-[60px]">
          <h2 className="text-3xl lg:text-[30px] font-normal font-dm-sans text-white-turtle text-center tracking-[-0.15px] leading-[1.2]">
            End-to-End Liquidity Programs
          </h2>
          <p className="text-lg lg:text-[18px] font-normal font-dm-sans text-white/50 text-center tracking-[-0.216px] leading-[1.2]">
            A single stack for execution
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6 lg:gap-[40px]">
          {/* Section 1: Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10"
          >
            {/* Card - Left */}
            <div className="w-full lg:w-[580px] bg-white/2 border border-white/10 rounded-[20px] p-10 flex flex-col gap-5">
              <div className="flex gap-3 items-center">
                <GreenDot className="w-[15px] h-[15px]" />
                <h3 className="text-[28px] font-medium font-dm-sans text-white-turtle tracking-[-0.336px] leading-[1.2]">
                  Design
                </h3>
              </div>
              <p className="text-lg font-normal font-dm-sans text-white-turtle leading-[1.4] tracking-[-0.216px]">
                Define incentive mechanics, targeting, and optional leaderboard logic
              </p>
            </div>

            {/* Graph - Right */}
            <div 
              className="w-full lg:w-[500px] h-56 lg:h-80 rounded-[20px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom right, rgba(249, 249, 249, 0.1), rgba(115, 243, 108, 0.08))'
              }}
            >
              <Image
                src="/media/liquidity/graph-1.svg"
                alt="Design flow graph"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
          </motion.div>

          {/* Section 2: Launch and track */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10"
          >
            {/* Graph - Left (dashboard) */}
            <div 
              className="w-full lg:w-[500px] h-56 lg:h-80 rounded-[20px] relative overflow-hidden order-2 lg:order-1"
              style={{
                background: 'linear-gradient(to bottom right, rgba(249, 249, 249, 0.1), rgba(115, 243, 108, 0.08))'
              }}
            >
              <Image
                src="/media/liquidity/graph-2.svg"
                alt="Launch and track dashboard"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>

            {/* Card - Right */}
            <div className="w-full lg:w-[580px] bg-white/2 border border-white/10 rounded-[20px] p-10 flex flex-col gap-5 order-1 lg:order-2">
              <div className="flex gap-3 items-center">
                <GreenDot className="w-[15px] h-[15px]" />
                <h3 className="text-[28px] font-medium font-dm-sans text-white-turtle tracking-[-0.336px] leading-[1.2]">
                  Launch and track
                </h3>
              </div>
              <p className="text-lg font-normal font-dm-sans text-white-turtle leading-[1.4] tracking-[-0.216px]">
                Deploy via Turtle infrastructure with real-time visibility on LPs, TVL, and incentives.
              </p>
            </div>
          </motion.div>

          {/* Section 3: Aligned economics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10"
          >
            {/* Card - Left */}
            <div className="w-full lg:w-[580px] bg-white/2 border border-white/10 rounded-[20px] p-10 flex flex-col gap-5">
              <div className="flex gap-3 items-center">
                <GreenDot className="w-[15px] h-[15px]" />
                <h3 className="text-[28px] font-medium font-dm-sans text-white-turtle tracking-[-0.336px] leading-[1.2]">
                  Aligned economics
                </h3>
              </div>
              <p className="text-lg font-normal font-dm-sans text-white-turtle leading-[1.4] tracking-[-0.216px]">
                Performance-based fees. Incentives only earn once liquidity is live and measurable.
              </p>
            </div>

            {/* Graph - Right (Fee structure) */}
            <div 
              className="w-full lg:w-[500px] h-56 lg:h-80 rounded-[20px] relative overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom right, rgba(249, 249, 249, 0.1), rgba(115, 243, 108, 0.08))'
              }}
            >
              <Image
                src="/media/liquidity/graph-3.svg"
                alt="Aligned economics fee structure"
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
