import { motion } from "motion/react";
import { Sparkles, BadgeHelp, CheckCircle } from "lucide-react";

interface StyleChoice {
  id: string;
  name: string;
  sub: string;
  desc: string;
  accent: string;
  colorHex: string;
  borderClass: string;
}

const STYLE_CHOICES: StyleChoice[] = [
  {
    id: "danfani",
    name: "Faso Danfani",
    sub: "Fierté & Tradition",
    desc: "Le tissu d'honneur tissé à la main, symbole de l’identité Burkinabè noble et souveraine.",
    accent: "text-[#D4AF37]",
    colorHex: "bg-gradient-to-tr from-[#241712] via-[#4A2C1A] to-[#D4AF37]",
    borderClass: "border-[#4A2C1A]/60",
  },
  {
    id: "bazin",
    name: "Bazin Riche",
    sub: "Éclat & Majesté",
    desc: "Tissu damassé brillant et empesé, symbole suprême de la royauté et de la célébration festive en Afrique.",
    accent: "text-[#D4AF37]",
    colorHex: "bg-gradient-to-tr from-[#131313] via-[#D4AF37]/40 to-[#F3E5AB]",
    borderClass: "border-[#D4AF37]/30",
  },
];

export default function DressCode() {
  return (
    <section id="dress-code" className="relative py-24 px-6 bg-[#090909] overflow-hidden border-t border-[#D4AF37]/10">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4A2C1A]/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#D4AF37] tracking-[0.3em] uppercase">
            Inspirations Vestimentaires
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#F8F5F0] mt-3 tracking-wide">
            Dress Code : Africain Chic
          </h2>
          <p className="font-sans text-sm text-[#F8F5F0]/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Pour honorer ce jubilé d’or de façon harmonieuse et somptueuse, nous invitons nos prestigieux convives à revêtir des tenues s’inspirant de nos fils conducteurs.
          </p>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {/* Dress code Cards Grid (Centered grid for 2 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {STYLE_CHOICES.map((choice, index) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`glass-panel border rounded-2xl p-8 flex flex-col justify-between h-[340px] transition-all duration-300 relative group overflow-hidden ${choice.borderClass}`}
            >
              {/* Background gradient glint on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div>
                {/* Visual texture circle representation */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-full ${choice.colorHex} border border-[#D4AF37]/20 shadow-lg flex items-center justify-center`}>
                    <Sparkles className="w-4 h-4 text-white/80 animate-pulse" />
                  </div>
                  
                  <span className="font-mono text-[9px] text-[#D4AF37]/60 tracking-widest uppercase border border-[#D4AF37]/20 rounded-full px-2.5 py-0.5">
                    Premium
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white font-medium tracking-wide">
                  {choice.name}
                </h3>
                <p className={`font-mono text-xs uppercase tracking-wider mt-1.5 font-semibold ${choice.accent}`}>
                  {choice.sub}
                </p>

                <p className="text-sm text-[#F8F5F0]/60 mt-4 leading-relaxed">
                  {choice.desc}
                </p>
              </div>

              {/* Verified checklist indicators */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#D4AF37]/75 font-mono uppercase tracking-widest">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Recommandé</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Info */}
        <div className="mt-12 bg-[#131313]/50 border border-[#D4AF37]/15 rounded-2xl p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
            <BadgeHelp className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-serif text-md text-[#F8F5F0] font-medium tracking-wide">
              Besoin d'un conseil pour votre tenue ?
            </h4>
            <p className="text-xs text-[#F8F5F0]/60 mt-1 leading-relaxed">
              Mélangez librement les matières ! Par exemple, un élégant boubou en Bazin aux broderies dorées avec des accessoires or sera du plus bel effet lors de cette soirée VIP.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
