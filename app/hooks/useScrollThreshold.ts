'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect when scroll passes a threshold percentage
 * @param threshold - Scroll percentage threshold (default: 5)
 * @returns boolean indicating if threshold has been passed
 */
export function useScrollThreshold(threshold: number = 5) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      setIsScrolled(scrollPercent >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
