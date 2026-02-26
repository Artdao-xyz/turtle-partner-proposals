interface SectionHeadingProps extends React.ComponentPropsWithoutRef<"h2"> {
  level?: 2 | 3;
}

export default function SectionHeading({
  level = 2,
  children,
  className = "",
  ...props
}: SectionHeadingProps) {
  const baseClass = "font-dm-sans font-medium text-wise-white mt-[30px] mb-[30px]";
  const sizeClass = level === 2 ? "text-2xl md:text-3xl" : "text-lg md:text-xl";

  if (level === 2) {
    return (
      <h2 className={`${baseClass} ${sizeClass} ${className}`} {...props}>
        {children}
      </h2>
    );
  }

  return (
    <h3 className={`${baseClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </h3>
  );
}
