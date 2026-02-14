"use client";

import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100/50 text-center p-4">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-rose-500 mb-4 drop-shadow-sm">
          Hey You! 💖
        </h1>
        <p className="text-xl text-rose-400 font-medium">
          มีอะไรให้ดู...
        </p>
      </motion.div>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        }}
        className="px-8 py-4 bg-rose-500 text-white rounded-full text-xl font-bold shadow-lg shadow-rose-300 transform transition-colors hover:bg-rose-600"
      >
        จิ้มตรงนี้เลย 💌
      </motion.button>
    </div>
  );
}
