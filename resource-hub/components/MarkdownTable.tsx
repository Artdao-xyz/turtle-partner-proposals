interface MarkdownTableProps {
  children?: React.ReactNode;
  className?: string;
}

export default function MarkdownTable({ children, className = "" }: MarkdownTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl my-[30px] ${className}`}
    >
      <table className="w-full min-w-[400px] border-collapse [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-medium [&_th]:text-wise-white/80 [&_th]:border-b [&_th]:border-white/5 [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-wise-white/90 [&_tr]:bg-[#f9f9f9]/5 [&_tr]:border-b [&_tr]:border-white/5">
        {children}
      </table>
    </div>
  );
}
