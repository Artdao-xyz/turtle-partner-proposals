import Image from "next/image";

interface BulletListProps {
  children?: React.ReactNode;
  className?: string;
}

export default function BulletList({ children, className = "" }: BulletListProps) {
  return (
    <ul className={`space-y-3 list-none pl-0 my-[30px] ${className}`}>
      {children}
    </ul>
  );
}

interface BulletListItemProps {
  children?: React.ReactNode;
  className?: string;
}

export function BulletListItem({ children, className = "" }: BulletListItemProps) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <Image
        src="/media/dot.svg"
        alt=""
        width={15}
        height={15}
        className="mt-1.5 shrink-0"
        aria-hidden
      />
      <span className="text-wise-white/90 text-base leading-relaxed">{children}</span>
    </li>
  );
}
