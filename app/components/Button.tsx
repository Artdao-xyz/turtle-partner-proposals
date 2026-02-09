interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    target?: string;
    className?: string;
}

export default function Button({ children, href, target, className = "" }: ButtonProps) {
    return (
        <a href={href} target={target} className={`relative p-[1.5px] rounded-[100px] shadow-green-turtle ${className} cursor-pointer group overflow-hidden w-auto md:w-auto`}>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-green-turtle to-background rounded-[100px]"></div>
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-green-turtle to-background rounded-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
            <span className="relative flex items-center justify-center gap-[5px] rounded-[100px] bg-background px-7 py-3 text-green-turtle text-base font-medium font-dm-sans leading-tight whitespace-nowrap">
                {children}
            </span>
        </a>
    );
} 