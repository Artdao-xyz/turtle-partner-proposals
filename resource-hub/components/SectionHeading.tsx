interface SectionHeadingProps extends React.ComponentPropsWithoutRef<"h2"> {
  level?: 2 | 3;
}

function renderTitleWithBreak(children: React.ReactNode): React.ReactNode {
  const text =
    typeof children === "string"
      ? children
      : Array.isArray(children) && children.length === 1 && typeof children[0] === "string"
        ? children[0]
        : null;
  if (text && text.includes(":")) {
    const colonIndex = text.indexOf(":");
    return (
      <>
        {text.slice(0, colonIndex + 1)}
        <br />
        {text.slice(colonIndex + 1).trim()}
      </>
    );
  }
  return children;
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
        {renderTitleWithBreak(children)}
      </h2>
    );
  }

  return (
    <h3 className={`${baseClass} ${sizeClass} ${className}`} {...props}>
      {renderTitleWithBreak(children)}
    </h3>
  );
}
