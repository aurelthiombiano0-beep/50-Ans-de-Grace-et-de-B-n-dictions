import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ConfettiParticle {
  id: number;
  x: number; // target horizontal distance
  y: number; // peak vertical drift
  rotate: number; // rotation degree
  size: number;
  color: string;
  shape: "circle" | "rect" | "star";
  delay: number;
  duration: number;
}

export default function CelebrationConfetti() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const COLORS = [
      "#D4AF37", // Elegant Royal Gold
      "#FFF2CC", // Shimmering light gold
      "#AA7C11", // Deep bronze
      "#FFFFFF", // Pure celebratory white
      "#F3E5AB", // Warm ivory vanilla
      "#C0C0C0", // Sparkling silver
    ];
    const SHAPES: Array<"circle" | "rect" | "star"> = ["circle", "rect", "star"];

    const count = 90;
    const generated: ConfettiParticle[] = Array.from({ length: count }).map((_, i) => {
      // Angle in radians (mostly pointing upwards and outwards)
      const angle = (Math.random() * 360 * Math.PI) / 180;
      // Distance of explosion speed
      const speed = Math.random() * 180 + 120;
      const targetX = Math.cos(angle) * speed + (Math.random() * 80 - 40);
      const targetY = Math.sin(angle) * speed - 180; // Negative because upward is less in screen space coordinates

      return {
        id: i,
        x: targetX,
        y: targetY,
        rotate: Math.random() * 720 - 360,
        size: Math.random() * 9 + 6, // 6px to 15px size range
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: Math.random() * 0.12, // rapid staggered ripple wave
        duration: Math.random() * 1.6 + 1.8, // 1.8 to 3.4 seconds of flight
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => {
        let borderRadius = "0px";
        if (p.shape === "circle") borderRadius = "50%";
        else if (p.shape === "rect") borderRadius = "1px";

        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 120, scale: 0.1, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: [120, p.y, p.y + 400], // sequence layout: starts at button, blasts up, gracefully falls down
              opacity: [1, 1, 0.8, 0],
              scale: [0.1, 1.3, 1, 0.5],
              rotate: p.rotate,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.1, 0.8, 0.25, 1], // cinematic smooth blast-and-glide curve
            }}
            style={{
              position: "absolute",
              width: `${p.size}px`,
              height: p.shape === "rect" ? `${p.size * 0.55}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: borderRadius,
              boxShadow: p.color === "#D4AF37" || p.color === "#FFF2CC" ? "0 0 10px #D4AF37" : "none",
              clipPath: p.shape === "star" ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}
