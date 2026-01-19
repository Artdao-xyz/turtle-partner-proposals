'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const scrollPreventedRef = useRef<boolean>(false);
  const scrollPositionRef = useRef<number>(0);
  const preventScrollHandlerRef = useRef<((e: Event) => void) | null>(null);

  // Prevent scroll when keyboard appears on mobile and Safari password manager
  useEffect(() => {
    // Only apply on mobile devices
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isMobile) return;

    let savedScrollPosition = 0;
    let scrollPreventionActive = false;

    // Prevent Safari password manager from causing scroll
    const preventSafariPasswordManagerScroll = (e: Event) => {
      if (scrollPreventionActive) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo(0, savedScrollPosition);
        return false;
      }
    };

    const handleFocus = () => {
      // Store current scroll position
      savedScrollPosition = window.scrollY || window.pageYOffset;
      scrollPositionRef.current = savedScrollPosition;
      
      // Prevent scroll by fixing body position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollPosition}px`;
      document.body.style.width = '100%';
      
      // Prevent Safari password manager scroll
      if (isSafari) {
        scrollPreventionActive = true;
        window.addEventListener('scroll', preventSafariPasswordManagerScroll, { passive: false });
        window.addEventListener('touchmove', preventSafariPasswordManagerScroll, { passive: false });
        // Also prevent scroll events
        window.addEventListener('wheel', preventSafariPasswordManagerScroll, { passive: false });
      }
    };

    const handleBlur = () => {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Remove Safari password manager scroll prevention
      if (isSafari) {
        scrollPreventionActive = false;
        window.removeEventListener('scroll', preventSafariPasswordManagerScroll);
        window.removeEventListener('touchmove', preventSafariPasswordManagerScroll);
        window.removeEventListener('wheel', preventSafariPasswordManagerScroll);
      }
      
      if (scrollY) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        });
      }
    };

    const emailInput = emailInputRef.current;
    const passwordInput = passwordInputRef.current;

    if (emailInput) {
      emailInput.addEventListener('focus', handleFocus);
      emailInput.addEventListener('blur', handleBlur);
    }
    if (passwordInput) {
      passwordInput.addEventListener('focus', handleFocus);
      passwordInput.addEventListener('blur', handleBlur);
    }

    return () => {
      if (emailInput) {
        emailInput.removeEventListener('focus', handleFocus);
        emailInput.removeEventListener('blur', handleBlur);
      }
      if (passwordInput) {
        passwordInput.removeEventListener('focus', handleFocus);
        passwordInput.removeEventListener('blur', handleBlur);
      }
      // Cleanup styles if component unmounts while input is focused
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Cleanup Safari password manager scroll prevention
      if (isSafari) {
        scrollPreventionActive = false;
        window.removeEventListener('scroll', preventSafariPasswordManagerScroll);
        window.removeEventListener('touchmove', preventSafariPasswordManagerScroll);
        window.removeEventListener('wheel', preventSafariPasswordManagerScroll);
      }
    };
  }, [isVisible]); // Re-run when form visibility changes to ensure refs are available

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Prevent scroll jump on form submit (especially Safari)
    const scrollPosition = window.scrollY || window.pageYOffset;
    scrollPositionRef.current = scrollPosition;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Prevent automatic scroll to form/button (Safari specific)
    const preventScroll = (e: Event) => {
      if (scrollPreventedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    preventScrollHandlerRef.current = preventScroll;
    
    if (isMobile && isSafari) {
      // Lock scroll position during submit
      scrollPreventedRef.current = true;
      window.addEventListener('scroll', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      // Force scroll position
      window.scrollTo(0, scrollPosition);
    }

    // Validación básica del cliente
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      // Restore scroll position
      if (isMobile) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
      return;
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      // Restore scroll position
      if (isMobile) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
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
      
      // Restore scroll position before authentication state changes
      if (isMobile && isSafari) {
        // Remove scroll prevention
        scrollPreventedRef.current = false;
        const handler = preventScrollHandlerRef.current;
        if (handler) {
          window.removeEventListener('scroll', handler);
          window.removeEventListener('touchmove', handler);
        }
        // Restore scroll position
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
          // Double check after a brief delay
          setTimeout(() => {
            window.scrollTo(0, scrollPositionRef.current);
          }, 50);
        });
      } else if (isMobile) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
      
      setIsAuthenticated(true);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Auth error:', err);
      // Restore scroll position on error
      if (isMobile && isSafari) {
        scrollPreventedRef.current = false;
        const handler = preventScrollHandlerRef.current;
        if (handler) {
          window.removeEventListener('scroll', handler);
          window.removeEventListener('touchmove', handler);
        }
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      } else if (isMobile) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
    } finally {
      setIsLoading(false);
      // Cleanup scroll prevention if still active
      if (isMobile && isSafari && scrollPreventedRef.current) {
        scrollPreventedRef.current = false;
        const handler = preventScrollHandlerRef.current;
        if (handler) {
          window.removeEventListener('scroll', handler);
          window.removeEventListener('touchmove', handler);
        }
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current);
        });
      }
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
              <h2 className="text-2xl md:text-3xl font-normal text-white-turtle leading-7 md:leading-9 text-left">
                Unlock content to continue
              </h2>
              <p className="text-xs font-normal text-white leading-4 text-left">
                Enter the password to view the full proposal
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <input
                ref={emailInputRef}
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

              <div className="w-full relative">
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'error-message' : undefined}
                  className="w-full h-11 md:h-12 px-4 md:px-6 pr-12 md:pr-12 bg-black-highlight/2 rounded-full text-white placeholder-white/50 text-base md:text-xs font-medium focus:outline-none"
                  placeholder="Password"
                  disabled={isLoading}
                  onFocus={(e) => {
                    // Prevent Safari password manager from scrolling
                    const scrollPos = window.scrollY || window.pageYOffset;
                    scrollPositionRef.current = scrollPos;
                    // Force scroll position immediately to prevent password manager scroll
                    requestAnimationFrame(() => {
                      window.scrollTo(0, scrollPos);
                      // Double check after a brief delay
                      setTimeout(() => {
                        window.scrollTo(0, scrollPos);
                      }, 10);
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

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
                onClick={() => {
                  // Prevent scroll jump when clicking submit button (especially Safari)
                  const scrollPosition = window.scrollY || window.pageYOffset;
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
                  if (isMobile) {
                    // Maintain scroll position immediately
                    requestAnimationFrame(() => {
                      window.scrollTo(0, scrollPosition);
                    });
                  }
                }}
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
