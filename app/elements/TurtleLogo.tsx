'use client';

import Image from 'next/image';

interface TurtleLogoProps {
  className?: string;
}

export default function TurtleLogo({ className = '' }: TurtleLogoProps) {
  return (
    <Image
      src="/media/turtle-logo.svg"
      alt="Turtle Logo"
      width={145}
      height={35}
      className={`object-contain ${className}`}
      loading="eager"
      priority
    />
  );
}
