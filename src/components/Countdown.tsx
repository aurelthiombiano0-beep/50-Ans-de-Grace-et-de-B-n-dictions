import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Calendar } from "lucide-react";
import { CountdownTime } from "../types";

export default function Countdown() {
  const targetDate = new Date("2026-05-26T18:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    completed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, completed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { value: timeLeft.days, label: "Jours", id: "days" },
    { value: timeLeft.hours, label: "Heures", id: "hours" },
    { value: timeLeft.minutes, label: "Minutes", id: "minutes" },
    { value: timeLeft.seconds, label: "Secondes", id: "seconds" },
  ];

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-[#0D0D0D] to-[#090909] text-center overflow-hidden border-y border-[#D4AF37]/10">
      {/* Delicate background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs text-[#D4AF37] tracking-[0.3em] uppercase mb-4"
        >
          L’Événement Approche
        </motion.p>

        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl md:text-4xl text-[#F8F5F0] tracking-wide mb-10"
        >
          Compte à Rebours de la Grâce
        </motion.h3>

        {timeLeft.completed ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-8 py-5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl text-xl font-serif text-[#D4AF37]"
          >
            <Calendar className="w-6 h-6 animate-pulse" />
            La célébration a commencé à Ouagadougou !
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
            {timeBlocks.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="relative bg-[#131313]/90 border border-neutral-800/80 hover:border-[#D4AF37]/25 rounded-2xl p-5 md:p-6 shadow-xl"
              >
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-[#D4AF37]/2 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="font-serif text-4xl md:text-6xl font-extrabold text-gold-gradient tracking-tight mb-2">
                  {block.value.toString().padStart(2, "0")}
                </div>

                <div className="font-mono text-[10px] md:text-xs text-[#F8F5F0]/55 uppercase tracking-widest font-medium">
                  {block.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-[#F8F5F0]/50 font-sans">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Mardi 26 Mai 2026</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>18:00 (GMT)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
