"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import ScratchCard from "@/components/ScratchCard";
import MouseTrail from "@/components/MouseTrail";

export default function Home() {
  const [stage, setStage] = useState<"welcome" | "scratch">("welcome");

  const handleStart = () => {
    setStage("scratch");
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-rose-50 cursor-crosshair">
      <MouseTrail />

      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.div
            key="welcome"
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0"
          >
            <WelcomeScreen onStart={handleStart} />
          </motion.div>
        )}

        {stage === "scratch" && (
          <motion.div
            key="scratch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ScratchCard imageSrc="/valentine_bear_1771049788605.png" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
