'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ANIMATION_TIMINGS, EASING } from '../config/animationTimings';

interface AuthFormProps {
  isVisible: boolean;
}

interface AuthErrorResponse {
  error?: string;
}

export default function AuthForm({ isVisible }: AuthFormProps) {
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validación básica del cliente
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data: AuthErrorResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed. Please try again.');
        return;
      }

      // Autenticación exitosa - limpiar formulario y actualizar estado global
      setEmail('');
      setPassword('');
      setIsAuthenticated(true);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{
            duration: ANIMATION_TIMINGS.unauthenticated.authForm.duration,
            delay: ANIMATION_TIMINGS.unauthenticated.authForm.delay,
            ease: EASING,
          }}
          className="absolute bottom-8 md:bottom-[10%] left-1/2 -translate-x-1/2 z-10 w-full px-4"
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto p-6 md:p-9 rounded-[30px] shadow-lg outline outline-white/10 flex flex-col items-start gap-4 md:gap-6"
            style={{ backgroundColor: 'var(--black-turtle)' }}
          >
            <div className="w-full flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-normal text-white leading-7 md:leading-9 text-left">
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
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'error-message' : undefined}
                className="w-full h-11 md:h-12 px-4 md:px-6 bg-black-highlight/2 rounded-full text-white placeholder-white/50 text-base md:text-xs font-medium focus:outline-none"
                placeholder="Email"
                disabled={isLoading}
              />

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-label="Password"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'error-message' : undefined}
                className="w-full h-11 md:h-12 px-4 md:px-6 bg-black-highlight/2 rounded-full text-white placeholder-white/50 text-base md:text-xs font-medium focus:outline-none"
                placeholder="Password"
                disabled={isLoading}
              />

              {error && (
                <div
                  id="error-message"
                  role="alert"
                  aria-live="polite"
                  className="w-full px-4 py-2 text-xs text-red-400 bg-red-400/10 rounded-full"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 md:h-12 px-2.5 bg-black-highlight/2 rounded-full outline outline-white/10 flex items-center justify-center gap-5 font-medium hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
