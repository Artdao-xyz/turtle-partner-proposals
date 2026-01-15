'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AuthFormProps {
  isVisible: boolean;
  onAuthSuccess?: () => void;
}

export default function AuthForm({ isVisible, onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Autenticación exitosa
      onAuthSuccess?.();
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-10"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl p-9 rounded-[30px] shadow-lg outline outline-white/10 flex flex-col items-start gap-6"
            style={{ backgroundColor: 'var(--black-turtle)' }}
          >
            <div className="w-full flex flex-col gap-1">
              <h2 className="text-3xl font-normal text-white leading-9 text-left">
                Unlock content to continue
              </h2>
              <p className="text-xs font-normal text-white leading-4 text-left">
                Enter the password to view the full proposal
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-6 bg-black-highlight/2 rounded-full text-white placeholder-white/50 text-xs font-medium focus:outline-none"
                placeholder="Email"
              />

              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-6 bg-black-highlight/2 rounded-full text-white placeholder-white/50 text-xs font-medium focus:outline-none"
                placeholder="Password"
              />

              {error && (
                <div className="w-full px-4 py-2 text-xs text-red-400 bg-red-400/10 rounded-full">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 px-2.5 bg-black-highlight/2 rounded-full outline outline-white/10 flex items-center justify-center gap-5 text-xs font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: 'var(--green-turtle)' }}
              >
                <span>{isLoading ? 'Verifying...' : 'Unlock'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
