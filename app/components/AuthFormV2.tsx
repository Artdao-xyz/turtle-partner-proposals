'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface AuthFormV2Props {
  isVisible?: boolean;
}

type MessageType = 'success' | 'error' | null;

export default function AuthFormV2({ isVisible = true }: AuthFormV2Props) {
  const [email, setEmail] = useState<string>('');
  const [telegramHandle, setTelegramHandle] = useState<string>('');
  const [organisation, setOrganisation] = useState<string>('');
  const [targetTVL, setTargetTVL] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['Custom Campaign', 'Targeted Incentives', 'LP Outreach']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: MessageType; text: string } | null>(null);

  const products = [
    'Custom Campaign',
    'Targeted Incentives',
    'LP Outreach',
    'Leaderboard',
    'Advisory Support',
  ];

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          telegramHandle: telegramHandle.trim(),
          organisation: organisation.trim(),
          targetTVL,
          selectedProducts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Form submission error:', data.error);
        setMessage({
          type: 'error',
          text: data.error || 'Failed to submit form. Please try again.',
        });
        setIsLoading(false);
        return;
      }

      // Éxito - limpiar formulario
      setEmail('');
      setTelegramHandle('');
      setOrganisation('');
      setTargetTVL(0);
      setSelectedProducts(['Custom Campaign', 'Targeted Incentives', 'LP Outreach']);
      
      setMessage({
        type: 'success',
        text: 'Form submitted successfully! A member of the Turtle team will be in touch.',
      });
    } catch (err) {
      console.error('Network error:', err);
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-end justify-center lg:justify-evenly pt-4 lg:pt-8 pointer-events-none px-4 lg:px-0 lg:min-h-screen"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-4xl pointer-events-auto"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-[#141514] border border-white/10 rounded-[20px] lg:rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6 lg:p-9 flex flex-col gap-3 lg:gap-6"
        >
          {/* Title Section */}
          <div className="flex flex-col gap-1">
            <h2 className="text-lg lg:text-[30px] font-normal font-dm-sans text-white-turtle leading-[1.2] tracking-[-0.15px]">
              Launch Your Next Incentive Campaign
            </h2>
            <p className="lg:text-lg font-normal font-dm-sans text-white/50 leading-[1.4] tracking-[-0.216px]">
              Please fill out the information below and a member of the Turtle team will be in touch
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-3 lg:gap-5">
            {/* First Row: Email and Telegram Handle */}
            <div className="flex flex-col lg:flex-row gap-2.5">
              <div className="flex-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-[47px] px-6 bg-white/2 rounded-full text-white placeholder-white/50 text-xs font-medium font-dm-sans focus:outline-none focus:ring-2 focus:ring-green-turtle/50"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  id="telegram"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  placeholder="Telegram Handle"
                  className="w-full h-[47px] px-6 bg-white/2 rounded-full text-white placeholder-white/50 text-xs font-medium font-dm-sans focus:outline-none focus:ring-2 focus:ring-green-turtle/50"
                  required
                />
              </div>
            </div>

            {/* Second Row: Organisation and Target TVL */}
            <div className="flex flex-col lg:flex-row gap-2.5">
              <div className="flex-1">
                <input
                  type="text"
                  id="organisation"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  placeholder="Organisation"
                  className="w-full h-[47px] px-6 bg-white/2 rounded-full text-white placeholder-white/50 text-xs font-medium font-dm-sans focus:outline-none focus:ring-2 focus:ring-green-turtle/50"
                  required
                />
              </div>
              <div className="flex-1">
                <div className="h-[47px] px-6 bg-white/2 rounded-full flex items-center gap-5">
                  <span className="text-xs font-medium font-dm-sans text-white/50 shrink-0 whitespace-nowrap">
                    Target TVL
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={targetTVL}
                        onChange={(e) => setTargetTVL(Number(e.target.value))}
                        className="w-full h-1 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, var(--green-turtle) 0%, var(--green-turtle) ${targetTVL}%, rgba(249, 249, 249, 0.2) ${targetTVL}%, rgba(249, 249, 249, 0.2) 100%)`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium font-dm-sans text-white/50 text-center min-w-[41px] shrink-0">
                      ${targetTVL}M
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex flex-col gap-2.5">
              <p className="text-base font-normal font-dm-sans text-white/50 leading-[1.2]">
                What products are you interested in?
              </p>
              <div className="flex flex-wrap gap-2.5">
                {products.map((product) => {
                  const isSelected = selectedProducts.includes(product);
                  return (
                    <button
                      key={product}
                      type="button"
                      onClick={() => toggleProduct(product)}
                      className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-2.5 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-white/5'
                          : 'bg-transparent hover:bg-white/2'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full border transition-colors flex items-center justify-center ${
                          isSelected
                            ? 'border-green-turtle bg-transparent'
                            : 'border-white/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-turtle" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium font-dm-sans leading-[1.2] ${
                          isSelected ? 'text-[#eff8ed]' : 'text-white/80'
                        }`}
                      >
                        {product}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Notification or Submit Button - Same space, one or the other */}
            <div className="w-full lg:w-fit lg:min-w-md mx-auto lg:min-h-[47px] min-h-[40px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {message ? (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full px-4 py-3 rounded-full text-xs font-medium font-dm-sans text-center ${
                      message.type === 'success'
                        ? 'bg-green-turtle/5 text-green-turtle'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    type="submit"
                    disabled={isLoading}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-[47px] px-6 bg-white/2 border border-white/10 rounded-full flex items-center justify-center gap-5 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span
                      className="text-xs font-medium font-dm-sans text-green-turtle"
                      style={{ color: 'var(--green-turtle)' }}
                    >
                      {isLoading ? 'Submitting...' : 'Submit'}
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>

        {/* Pricing Information */}
        <p className="mt-4 text-sm font-normal font-dm-sans text-white/50 text-center leading-[1.4] px-4 lg:px-8">
          Baseline access starts from $10,000 per month rebated against TVL fees, with TVL fees starting at 0.3% for the first 30days and a 1.5% streams distribution fee
        </p>

        {/* Turtle Logo */}
        <div className="mt-16 2xl:mt-24 flex justify-center">
          <Image
            src="/media/turtle-big.svg"
            alt="Turtle Logo"
            width={200}
            height={200}
            className="w-auto h-auto"
            unoptimized
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
