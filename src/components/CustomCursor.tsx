import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  
  // Motion values for smooth trailing performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touchscreen or mobile to skip custom cursor
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasMouse) return;

    setVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Outer Glowing Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3.5 h-3.5 rounded-full pointer-events-none z-50 mix-blend-screen bg-gradient-to-tr from-[#FFF7D6] via-[#D4AF37] to-[#8C6A0D] opacity-90Shadow"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          boxShadow: "0 0 12px #D4AF37, 0 0 4px #AA7C11",
        }}
      />
      {/* Small Core Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-50 bg-white"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        transition={{ type: "just" }}
      />
    </>
  );
}
