import { useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  useEffect(() => {
    // Auto-complete loader after 2.5 seconds for flawless transition
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] text-white"
    >
      {/* Decorative Traditional Border Patterns */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4A2C1A] via-[#D4AF37] to-[#4A2C1A] opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4A2C1A] via-[#D4AF37] to-[#4A2C1A] opacity-80" />

      {/* Ambient background glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#D4AF37]/10 filter blur-[100px] animate-pulse" />

      {/* Content wrapper */}
      <div className="relative flex flex-col items-center max-w-lg px-6 text-center">
        {/* Elegant circle ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 360,
          }}
          transition={{
            scale: { duration: 1.2, ease: "easeOut" },
            opacity: { duration: 1 },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          }}
          className="relative flex items-center justify-center w-36 h-36 rounded-full border-2 border-dashed border-[#D4AF37]/40 p-2"
        >
          {/* Inner solid gold ring */}
          <div className="w-full h-full rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#131313]">
            <span className="font-serif text-4xl font-extrabold tracking-widest text-gold-gradient">
              50
            </span>
          </div>
        </motion.div>

        {/* Monogram or Name */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 font-serif text-3xl md:text-4xl text-gold-gradient tracking-wide font-medium"
        >
          Grâce & Bénédictions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-3 font-sans text-sm uppercase tracking-[0.25em] text-[#F8F5F0]"
        >
          Ouagadougou, Burkina Faso
        </motion.p>

        {/* Cinematic progress bar or sparkle */}
        <div className="mt-8 relative w-48 h-[1px] bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-4 flex items-center gap-2 text-xs text-[#D4AF37]/70 uppercase tracking-widest font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 gold-sparkle" />
          <span>AFRICAIN CHIC</span>
          <Sparkles className="w-3.5 h-3.5 gold-sparkle" />
        </motion.div>
      </div>
    </motion.div>
  );
}
