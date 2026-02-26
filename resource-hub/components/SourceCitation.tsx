interface SourceCitationProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SourceCitation({ children, className = "" }: SourceCitationProps) {
  return (
    <blockquote
      className={`text-white/50 text-sm italic mt-[15px] mb-[30px] ${className}`}
    >
      {children}
    </blockquote>
  );
}
