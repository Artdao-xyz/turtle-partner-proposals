"use client";

import { motion } from "framer-motion";

interface ScrollRevealBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollRevealBlock({
  children,
  className = "",
}: ScrollRevealBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px -40px 0px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
