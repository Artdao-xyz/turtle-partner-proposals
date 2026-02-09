'use client';

import { motion } from 'framer-motion';
import TurtleFeesHeader from '../elements/TurtleFeesHeader';
import GreenDot from '../elements/GreenDot';

interface FeeCardProps {
  title: string;
  description: string;
  price: string | string[];
  optional?: boolean | string;
  maxHeight?: number | null;
}

function FeeCard({ title, description, price, optional, maxHeight }: FeeCardProps) {
  const prices = Array.isArray(price) ? price : [price];
  const resolvedMaxHeight = maxHeight === undefined ? 256 : maxHeight;
  
  return (
    <div 
      className="bg-black-highlight/2 rounded-5xl p-6 outline outline-black-highlight/10 h-full flex flex-col overflow-hidden"
      style={
        typeof resolvedMaxHeight === 'number'
          ? { maxHeight: `${resolvedMaxHeight}px` }
          : undefined
      }
    >
      <div className="mb-2 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-start gap-2">
          <h3 className="text-[#eff8ed] font-medium text-2xl leading-7 tracking-tight">{title}</h3>
          {optional && (
            <span className="px-2 py-1 text-xs rounded-full bg-black-highlight/10 text-wise-white whitespace-nowrap self-start lg:self-auto">
              {typeof optional === 'string' ? optional : 'Optional'}
            </span>
          )}
        </div>
      </div>
      <p className="text-white/50 text-sm mb-2 leading-6 lg:leading-relaxed grow tracking-tight">{description}</p>
      <div className="space-y-1 shrink-0">
        {prices.map((p, idx) => (
          <p key={idx} className="text-[#eff8ed] font-semibold text-xl tracking-tight">
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
  maxCardHeight?: number;
}

function FeeSection({ title, subtitle, tag, cards, maxCardHeight = 256 }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 h-auto lg:h-full flex flex-col"
    >
      <div className="text-center mb-8 shrink-0 px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-2 mb-2">
          <div className="flex items-center gap-2 lg:gap-3" style={{ width: 'fit-content' }}>
            <GreenDot className='shrink-0'/>
            <h2 className="text-wise-white text-xl lg:text-2xl font-semibold tracking-tight">{title}</h2>
          </div>
          {tag && (
            <span className="px-3 py-1 text-xs rounded-full bg-black-highlight/10 text-wise-white mt-2 lg:mt-0">
              {tag}
            </span>
          )}
        </div>
        <p className="text-black-highlight/50 text-base max-w-5xl mx-auto">{subtitle}</p>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 items-center justify-items-center ${
        cards.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
      }`}>
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`h-full w-full ${cards.length === 2 ? '' : 'max-w-[380px]'}`}
          >
            <FeeCard
              {...card}
              maxHeight={card.maxHeight === undefined ? maxCardHeight : card.maxHeight}
            />
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
      price: ['0.30% - 1% / First 30 Days', '0.50% - 1.5% / Annualized Thereafter'],
      optional: 'Variable Rates According to Asset Type',
      // Let this one grow (mobile was clipping due to maxHeight + overflow-hidden)
      maxHeight: null,
    },
    {
      title: 'Distribution Emissions Fee',
      description: 'Fee on total rewards distributed via Streams',
      price: '1.5%',
    },
  ];

  return (
    <section className="w-full mt-10" style={{ backgroundColor: 'var(--black-turtle)' }}>
      <TurtleFeesHeader />

      {/* Sections */}
      <div className="grid grid-cols-1 gap-12 auto-rows-auto">
        <FeeSection
          title="Activation & Alignment Deposits"
          subtitle="Upfront Deposits That Align Incentives And Are Fully Rebated Against Performance."
          tag="One-Time Credited"
          cards={activationCards}
          maxCardHeight={190}
        />

        <FeeSection
          title="Platform Access & Ongoing Operations"
          subtitle="Baseline Access That Ensures Continuous Execution And Support."
          cards={platformAccessCards}
          maxCardHeight={256}
        />

        <FeeSection
          title="Platform-Based Fees"
          subtitle="We Win When You Win. The Majority Of Turtle's Economics Are Earned Only Once Liquidity Is Live, Measurable, And Distributed."
          tag="Only Paid When Value is Created"
          cards={platformBasedCards}
          maxCardHeight={200}
        />
      </div>
    </section>
  );
}
