"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  isPlaying: boolean;
}

export default function AudioPlayer({ isPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.2); // Start with low volume

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.log("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src="/bgm.mp3" loop />
      {isPlaying && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setVolume((v) => (v === 0 ? 0.2 : 0))}
          className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-md text-xl"
        >
          {volume > 0 ? "🔊" : "🔇"}
        </motion.button>
      )}
    </div>
  );
}
