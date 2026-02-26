interface CalloutProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Callout({ children, className = "" }: CalloutProps) {
  return (
    <div
      className={`px-4 py-3 rounded-2xl font-mono text-sm md:text-base text-wise-white/95 overflow-x-auto my-[30px] bg-[#f9f9f9]/5 border border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}
