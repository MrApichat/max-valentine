"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import canvasConfetti from "canvas-confetti";
import Typewriter from "./Typewriter";

interface ScratchCardProps {
  imageSrc: string; // The image to reveal
  onComplete?: () => void;
}

export default function ScratchCard({
  imageSrc,
  onComplete,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const updateSize = () => {
      if (!containerRef.current) return;
      // Use offsetWidth/Height to get the layout size, ignoring transforms (scale)
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      canvas.width = width;
      canvas.height = height;

      // Fill with grey overlay
      ctx.fillStyle = "#CCCCCC";
      ctx.fillRect(0, 0, width, height);

      // Add text instruction on the scratch layer
      ctx.fillStyle = "#999999";
      ctx.font = 'bold 24px "Kanit", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ขูดตรงนี้เลย! ✨", width / 2, height / 2);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const lastCheckTime = useRef<number>(0);

  const getPosition = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPosition(e, canvas);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 60; // Increased size for better coverage
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    if (lastPosition.current) {
      ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosition.current = { x, y };

    // Throttle the expensive check to run at most every 200ms
    const now = Date.now();
    if (now - lastCheckTime.current > 200) {
      checkRevealProgress(canvas);
      lastCheckTime.current = now;
    }
  };

  const handleScratchStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsScratching(true);
    if (canvasRef.current) {
      lastPosition.current = getPosition(e, canvasRef.current);
    }
  };

  const handleScratchEnd = () => {
    setIsScratching(false);
    lastPosition.current = null;
  };

  const checkRevealProgress = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sample pixels to check reveal percentage
    // Optimization: check every 20th pixel (increased from 10) to save performance
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;
    const totalPixels = data.length / 4;

    for (let i = 3; i < data.length; i += 4 * 20) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    // If > 70% revealed, consider it done
    if (transparentPixels / (totalPixels / 20) > 0.7) {
      setIsRevealed(true);
      triggerConfetti();
      if (onComplete) onComplete();
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      canvasConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      canvasConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
      <motion.div
        ref={containerRef}
        className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-rose-200 bg-white"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Helper text when revealed */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
          >
            {/* Optional overlay or text upon completion */}
          </motion.div>
        )}

        {/* The hidden image */}
        <img
          src={imageSrc}
          alt="Hidden Surprise"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        />

        {/* The scratch canvas */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-1000 ${isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onMouseMove={(e) => isScratching && handleScratch(e)}
          onTouchMove={(e) => {
            // Prevent default touch behavior (scrolling)
            handleScratch(e);
          }}
          onMouseDown={handleScratchStart}
          onTouchStart={handleScratchStart}
          onMouseUp={handleScratchEnd}
          onTouchEnd={handleScratchEnd}
          onMouseLeave={handleScratchEnd}
        />
      </motion.div>

      <div className="mt-8 h-12 flex items-center justify-center">
        {isRevealed ? (
          <Typewriter
            text="Happy Valentine's Day ❤️"
            className="text-2xl text-rose-600 font-bold text-center drop-shadow-md"
            delay={100}
          />
        ) : (
          <motion.p
            className="text-xl text-rose-500 font-bold text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            ขูดเลยยย!
          </motion.p>
        )}
      </div>
    </div>
  );
}
