"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Point {
  x: number;
  y: number;
  id: number;
}

export default function MouseTrail() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
      setPoints((prev) => [...prev.slice(-15), newPoint]); // Keep last 15 points
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Use a separate effect to cleanup old points (optional optimization)
  // But for simple trails, just letting them fade out via AnimatePresence is easier.

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute text-pink-500"
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            💖
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
