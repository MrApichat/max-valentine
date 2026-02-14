"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export default function Typewriter({
  text,
  delay = 50,
  className = "",
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [index, text, delay, onComplete]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-1 h-[1em] bg-current ml-1 align-middle"
      />
    </motion.div>
  );
}
