interface FormulaBlockProps {
  formula: string;
  className?: string;
}

export default function FormulaBlock({ formula, className = "" }: FormulaBlockProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg font-mono text-sm md:text-base text-wise-white/95 overflow-x-auto ${className}`}
      style={{
        backgroundColor: "rgba(115, 243, 108, 0.08)",
        border: "1px solid rgba(115, 243, 108, 0.2)",
      }}
    >
      <code>{formula}</code>
    </div>
  );
}
