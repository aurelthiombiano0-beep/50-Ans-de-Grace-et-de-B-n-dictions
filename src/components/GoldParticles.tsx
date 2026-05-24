import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function GoldParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate static particle metadata on mount to prevent server differences or excessive CPU load
    const count = 25;
    const generated: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage left
      y: Math.random() * 100, // percentage top
      size: Math.random() * 4 + 2, // size in px
      duration: Math.random() * 10 + 10, // speed in seconds
      delay: Math.random() * -10, // negative delay so they start immediately at different phases
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "105vh", opacity: 0 }}
          animate={{
            y: "-5vh",
            opacity: [0, 0.7, 0.7, 0],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 8 - 4)}vw`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFF2CC 0%, #D4AF37 60%, #8C6A0D 100%)",
            boxShadow: `0 0 ${p.size * 2}px #D4AF37`,
          }}
        />
      ))}
    </div>
  );
}
