interface SourceCitationProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SourceCitation({ children, className = "" }: SourceCitationProps) {
  return (
    <blockquote
      className={`text-white/50 text-sm italic mt-[12px] mb-[30px] [&_p]:!text-white/50 [&_p]:!text-sm [&_p]:!leading-relaxed ${className}`}
    >
      {children}
    </blockquote>
  );
}
