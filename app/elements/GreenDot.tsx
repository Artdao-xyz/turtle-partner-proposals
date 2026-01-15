import Image from 'next/image';

interface GreenDotProps {
  className?: string;
}

export default function GreenDot({ className = '' }: GreenDotProps) {
  return (
    <Image
      src="/media/dot.svg"
      alt=""
      width={12}
      height={12}
      className={className}
      style={{
        filter: 'drop-shadow(0px 0px 4px rgba(115, 243, 108, 1.00))',
      }}
    />
  );
}
