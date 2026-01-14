'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import Controller from './Controller';

interface InfoRowProps {
  title: string;
  items: string[];
}

function InfoRow({ title, items }: InfoRowProps) {
  return (
    <div className="bg-black-highlight/2 rounded-5xl p-6 outline outline-black-highlight/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-turtle"></div>
        <h3 className="text-white-turtle text-3xl font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-white-turtle text-lg leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ScrollSectionItemProps {
  image: string;
  info: {
    row1: { title: string; items: string[] };
    row2: { title: string; items: string[] };
  };
  opacity: any;
}

function ScrollSectionItem({ image, info, opacity, zIndex = 1 }: ScrollSectionItemProps & { zIndex?: number }) {
  return (
    <motion.div
      style={{ opacity, zIndex }}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 items-center justify-center gap-6">
          {/* Left Column - Info (1/3) */}
          <div className="col-span-2 space-y-2.5">
            <InfoRow title={info.row1.title} items={info.row1.items} />
            <InfoRow title={info.row2.title} items={info.row2.items} />
          </div>

          {/* Right Column - Image (2/3) */}
          <div className="col-span-3 w-full flex items-center justify-center" style={{ height: '600px' }}>
            <Image
              src={image}
              alt={info.row1.title}
              width={1200}
              height={600}
              className="object-contain rounded-xl w-full h-full"
              unoptimized
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Dividir el scroll en 3 secciones sin superposiciones
  // Sección 1: visible desde el inicio (0) hasta 0.3, fade out de 0.3 a 0.35
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35],
    [1, 1, 0],
    { clamp: false }
  );
  
  // Sección 2: fade in de 0.3 a 0.35, visible de 0.35 a 0.65, fade out de 0.65 a 0.7
  const opacity2 = useTransform(
    scrollYProgress,
    [0.3, 0.35, 0.65, 0.7],
    [0, 1, 1, 0],
    { clamp: false }
  );
  
  // Sección 3: fade in de 0.65 a 0.7, visible hasta el final
  const opacity3 = useTransform(
    scrollYProgress,
    [0.65, 0.7, 1],
    [0, 1, 1],
    { clamp: false }
  );

  const section1Info = {
    row1: {
      title: 'Key Features',
      items: [
        'Deal listing and discovery via Turtle',
        'Coordination with Turtle\'s LP and distribution network',
        'Optional advisory support around program structure and rollout',
      ],
    },
    row2: {
      title: 'Value add',
      items: [
        'Broader reach',
        'Coordinated launch timing',
        'Reduced multi-party coordination cost',
      ],
    },
  };

  const section2Info = {
    row1: {
      title: 'Key Features',
      items: [
        'Incentive and reward distribution via Turtle Streams',
        'Transparent, auditable distribution events',
        'Supports multiple assets and reward schedules',
      ],
    },
    row2: {
      title: 'Value add',
      items: [
        'Turnkey incentive distribution',
        'No bespoke contract or ops overhead',
        'Clean accounting and reporting',
      ],
    },
  };

  const section3Info = {
    row1: {
      title: 'Key Features',
      items: [
        'Public-facing incentive leaderboard',
        'Supports standard metrics (TVL, deposits, participation)',
        'Configurable scoring logic, metrics and weighting',
      ],
    },
    row2: {
      title: 'Value add',
      items: [
        'Gamified participation',
        'Clear Visibility into performance',
        'Reduced need for custom front-end work',
      ],
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] w-full"
      style={{ backgroundColor: 'var(--black-turtle)' }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full max-w-6xl mx-auto overflow-hidden">
        {/* Controller - positioned absolutely at the top */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
          <Controller />
        </div>
        {/* Section 1 */}
        <ScrollSectionItem
          image="/media/images/image-1.png"
          info={section1Info}
          opacity={opacity1}
          zIndex={3}
        />

        {/* Section 2 */}
        <ScrollSectionItem
          image="/media/images/image-2.png"
          info={section2Info}
          opacity={opacity2}
          zIndex={2}
        />

        {/* Section 3 */}
        <ScrollSectionItem
          image="/media/images/image-3.png"
          info={section3Info}
          opacity={opacity3}
          zIndex={1}
        />
      </div>
    </section>
  );
}
