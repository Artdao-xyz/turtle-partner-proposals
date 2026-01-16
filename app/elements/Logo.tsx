'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Image
      src="/media/partner-logo.png"
      alt="Partner Logo"
      width={225}
      height={75}
      className={`object-contain ${className}`}
    />
  );
}
