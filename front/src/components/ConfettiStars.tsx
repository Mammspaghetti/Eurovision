import { motion } from "framer-motion";
import { useMemo } from "react";

const PARTICLE_COUNT = 30;

const ConfettiStars = () => {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      emoji: ["✨", "⭐", "🌟", "💜", "💫", "🎵", "🎶", "🎤"][i % 8],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 10 + Math.random() * 14,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: -20,
            fontSize: p.size,
          }}
          animate={{
            y: ["-5vh", "105vh"],
            x: [0, Math.sin(p.id) * 40],
            rotate: [0, 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default ConfettiStars;
