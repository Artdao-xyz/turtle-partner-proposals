'use client';

import { motion } from 'framer-motion';
import TurtleFeesHeader from '../elements/TurtleFeesHeader';
import GreenDot from '../elements/GreenDot';

interface FeeCardProps {
  title: string;
  description: string;
  price: string | string[];
  optional?: boolean;
}

function FeeCard({ title, description, price, optional }: FeeCardProps) {
  const prices = Array.isArray(price) ? price : [price];
  
  return (
    <div className="bg-black-highlight/2 rounded-5xl p-6 outline outline-black-highlight/10 h-full flex flex-col">
      <div className="flex items-start justify-between mb-2 shrink-0">
        <h3 className="text-white font-semibold text-lg pr-2">{title}</h3>
        {optional && (
          <span className="px-2 py-1 text-xs rounded-full bg-black-highlight/10 text-white-turtle whitespace-nowrap">
            Optional
          </span>
        )}
      </div>
      <p className="text-white-turtle/50 text-sm mb-3 leading-relaxed grow">{description}</p>
      <div className="space-y-1 shrink-0">
        {prices.map((p, idx) => (
          <p key={idx} className="text-white font-semibold text-xl">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  tag?: string;
  cards: FeeCardProps[];
}

function FeeSection({ title, subtitle, tag, cards }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto px-4 h-full flex flex-col"
    >
      <div className="text-center mb-8 shrink-0">
        <div className="flex items-center justify-center gap-3 mb-2">
          <GreenDot />
          <h2 className="text-white text-2xl font-semibold">{title}</h2>
          {tag && (
            <span className="px-3 py-1 text-xs rounded-full bg-black-highlight/10 text-white-turtle">
              {tag}
            </span>
          )}
        </div>
        <p className="text-black-highlight/50 text-base max-w-3xl mx-auto">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grow items-stretch">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="h-full"
          >
            <FeeCard {...card} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function TurtleFees() {
  const activationCards: FeeCardProps[] = [
    {
      title: 'Streams & Distribution Infrastructure',
      description: 'Credited against distribution emissions fees',
      price: '$2,500',
    },
    {
      title: 'Leaderboard & Attribution Setup',
      description: 'Credited against leaderboard access fee',
      price: '$2,500',
    },
    {
      title: 'Custom Metrics',
      description: 'Custom incentive parameters',
      price: '$500 / metric',
      optional: true,
    },
  ];

  const platformAccessCards: FeeCardProps[] = [
    {
      title: 'Turtle Platform Minimum & Active Outreach',
      description: 'Credited against TVL fees, Turtle will reach out to minimum 10% of active Turtle LPs, any feedback on the deal will be summarized and shared with you',
      price: '$10,000 / month',
    },
    {
      title: 'Leaderboard Access',
      description: 'Gain access to our liquidity leaderboard to actively promote your deal and incentivise mindshare',
      price: ['$1,000 / month', '$10,000 / year'],
    },
    {
      title: 'Advisory Support',
      description: 'Dedicated end to end advisory by our world leading experts to ensure the best possible outcomes for your campaign',
      price: ['$2,500 / 10hrs month', '$10,000 / 60hrs month'],
      optional: true,
    },
  ];

  const platformBasedCards: FeeCardProps[] = [
    {
      title: 'TVL Coordination Fee',
      description: 'Baseline fee for turtle liquidity provisioning services',
      price: ['0.30% / First 30 Days', '0.50% / Annualized Thereafter'],
    },
    {
      title: 'Distribution Emissions Fee',
      description: 'Fee on total rewards distributed via Streams',
      price: '1.5%',
    },
  ];

  return (
    <section className="w-full py-20" style={{ backgroundColor: 'var(--black-turtle)' }}>
      <TurtleFeesHeader />

      {/* Sections */}
      <div className="grid grid-cols-1 gap-16 auto-rows-fr">
        <FeeSection
          title="Activation & Alignment Deposits"
          subtitle="Upfront Deposits That Align Incentives And Are Fully Rebated Against Performance."
          tag="One-Time Credited"
          cards={activationCards}
        />

        <FeeSection
          title="Platform Access & Ongoing Operations"
          subtitle="Baseline Access That Ensures Continuous Execution And Support."
          cards={platformAccessCards}
        />

        <FeeSection
          title="Platform-Based Fees"
          subtitle="We Win When You Win. The Majority Of Turtle's Economics Are Earned Only Once Liquidity Is Live, Measurable, And Distributed."
          tag="Only Paid When Value is Created"
          cards={platformBasedCards}
        />
      </div>
    </section>
  );
}
