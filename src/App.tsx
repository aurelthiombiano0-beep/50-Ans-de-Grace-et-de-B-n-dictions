import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Clock, Sparkles, Heart, Quote, ArrowRight, Music, BellRing } from "lucide-react";

// Import images to resolve correctly under Vite's production hashing
import africanGoldPattern from "./assets/images/african_gold_pattern_1779581748779.png";
import portraitBlackGold from "./assets/images/portrait_black_gold_1779630997847.png";
import portraitBlueDenim from "./assets/images/portrait_blue_denim_1779631012523.png";
import celebratedPortrait from "./assets/images/celebrated_portrait_1779581730348.png";

// Components
import Loader from "./components/Loader";
import GoldParticles from "./components/GoldParticles";
import CustomCursor from "./components/CustomCursor";
import Countdown from "./components/Countdown";
import DressCode from "./components/DressCode";
import RSVPSection from "./components/RSVPSection";
import AudioPlayer from "./components/AudioPlayer";

// Smart Image component with multiple source fallback to support user uploaded images cleanly
function SmartImage({ src, alt, className }: { src: string[]; alt: string; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = () => {
    if (currentIndex < src.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={src[currentIndex]}
      alt={alt}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);

  // Smooth scroll helper
  const scrollToRSVP = () => {
    const el = document.getElementById("rsvp");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleUpdate = () => {
      setPhoto1(localStorage.getItem("custom_photo_1"));
      setPhoto2(localStorage.getItem("custom_photo_2"));
    };
    handleUpdate();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("custom-photo-update", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("custom-photo-update", handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F8F5F0] overflow-x-hidden font-sans select-none antialiased">
      {/* Cinematic Loader overlay */}
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Custom Trail Cursor - Only active on pointer:fine (Desktops) */}
          <CustomCursor />

          {/* Floating Gold Sparkle Canvas */}
          <GoldParticles />

          {/* Floating African Jazz Music Loop Player */}
          <AudioPlayer />

          {/* BACKGROUND DECORATIVE PATTERN */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15 mix-blend-color-dodge z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${africanGoldPattern}')`,
              backgroundAttachment: "fixed",
            }}
          />

          {/* TOP HEADER NAVIGATION FROM BOLD TYPOGRAPHY */}
          <header className="relative flex justify-between items-center px-6 md:px-12 py-8 z-30">
            <div className="text-[#D4AF37] font-serif italic text-2xl tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              A<span className="text-xs align-top">50</span>
            </div>
            <div className="flex space-x-4 md:space-x-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]/80">
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Invitation</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => document.getElementById("dress-code")?.scrollIntoView({ behavior: "smooth" })}>Dress Code</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => document.getElementById("lieu")?.scrollIntoView({ behavior: "smooth" })}>Lieu</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={scrollToRSVP}>RSVP</span>
            </div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-semibold border border-[#D4AF37]/30 px-4 py-1.5 rounded-full text-[#D4AF37]">
              Ouagadougou, BF
            </div>
          </header>

          {/* 1. HERO SECTION */}
          <section className="relative min-h-[85vh] lg:min-h-[calc(100vh-100px)] flex items-center justify-center pb-16 px-6 overflow-hidden">
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/40 via-transparent to-[#0D0D0D] z-10 pointer-events-none" />

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-20">
              
              {/* Left Column: Hero Content with Bold, Majestic Typography */}
              <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37] opacity-30 hidden lg:block"></div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4A2C1A]/50 border border-[#D4AF37]/35 rounded-full text-xs text-[#D4AF37] tracking-[0.25em] uppercase"
                >
                  <Sparkles className="w-3.5 h-3.5 gold-sparkle" />
                  <span>Invitation Anniversaire</span>
                </motion.div>

                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="font-script text-4xl md:text-5xl text-[#D4AF37] leading-none mb-2"
                  >
                    La célébration d'un jubilé de gloire
                  </motion.h3>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="font-serif italic text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-gold-gradient mb-4 drop-shadow-2xl"
                  >
                    Grâce &<br />Bénédictions
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-sm uppercase tracking-[0.2em] font-light text-[#D4AF37] mt-3"
                  >
                    Célébration des 50 ans de OUEDRAOGO Alimata
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-sm w-full max-w-lg"
                >
                  <p className="font-serif italic text-md md:text-lg leading-relaxed text-[#F8F5F0]/90">
                    « À l'occasion de ses 50 ans, OUEDRAOGO Alimata vous invite chaleureusement à une soirée exceptionnelle placée sous le sceau de la grâce divine, de l'élégance et de la reconnaissance. »
                  </p>
                </motion.div>

                {/* Event Location Quick Details */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="grid grid-cols-2 gap-4 w-full max-w-md"
                >
                  <div className="flex items-center gap-3 bg-[#131313]/70 backdrop-blur-md p-3.5 rounded-xl border border-[#D4AF37]/10">
                    <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <div className="text-left">
                      <p className="font-mono text-[9px] text-[#D4AF37] uppercase tracking-wider">Date officielle</p>
                      <p className="text-xs font-semibold text-white">Mardi 26 Mai 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#131313]/70 backdrop-blur-md p-3.5 rounded-xl border border-[#D4AF37]/10">
                    <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <div className="text-left">
                      <p className="font-mono text-[9px] text-[#D4AF37] uppercase tracking-wider">Lieu de prestige</p>
                      <p className="text-xs font-semibold text-white">Azalaï Ouagadougou</p>
                    </div>
                  </div>
                </motion.div>

                {/* High-End Confirmation Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="w-full sm:w-auto"
                >
                  <button
                    onClick={scrollToRSVP}
                    className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-extrabold uppercase tracking-[0.2em] rounded-sm hover:bg-[#F8F5F0] hover:from-[#F8F5F0] hover:to-[#F8F5F0] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Confirmer ma Présence</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </button>
                </motion.div>

              </div>

              {/* Right Column: Beautiful Invitation Flyer Postcard (Image 4CDD) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                  className="relative w-full max-w-[340px] md:max-w-[380px] aspect-[3/4] rounded-2xl border-2 border-[#D4AF37]/35 p-1 bg-[#131313] shadow-2xl overflow-hidden group hover:border-[#D4AF37] transition-all duration-500"
                >
                  {/* Glowing gold back aura */}
                  <div className="absolute -inset-10 bg-[#D4AF37]/10 filter blur-[40px] pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all duration-700" />
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-[#4A2C1A]/20 to-[#0D0D0D] flex items-center justify-center overflow-hidden rounded-xl">
                    <SmartImage
                      src={photo1 ? [photo1, portraitBlackGold, portraitBlueDenim, celebratedPortrait] : [
                        portraitBlackGold,
                        portraitBlueDenim,
                        celebratedPortrait
                      ]}
                      alt="Invitation de OUEDRAOGO Alimata"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-[1.03] transition-transform duration-700 pointer-events-none"
                    />
                    {/* Ring-inset decoration */}
                    <div className="absolute inset-0 ring-inset ring-1 ring-[#D4AF37]/35 rounded-xl pointer-events-none"></div>
                  </div>
                </motion.div>

                {/* Subtitle Label beneath invitation */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-6 text-center"
                >
                  <h2 className="text-2xl font-serif tracking-widest uppercase text-gold-gradient">OUEDRAOGO Alimata</h2>
                  <p className="text-[10px] tracking-[0.3em] uppercase opacity-60 text-[#D4AF37] mt-1.5 flex items-center justify-center gap-1.5 font-semibold">
                    <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                    26 Mai 2026
                  </p>
                </motion.div>
              </div>

            </div>
          </section>

          {/* 2. SECTION INTRODUCTION */}
          <section className="relative py-20 px-6 bg-[#090909]/90 border-t border-neutral-900 overflow-hidden text-center">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#4A2C1A]/10 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6 bg-[#131313]"
              >
                <Heart className="w-5 h-5 text-[#D4AF37]" />
              </motion.div>

              <motion.h4
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-serif text-lg md:text-2xl text-[#D4AF37] italic font-medium"
              >
                « Rendons grâce à l'Éternel car Il est bon, et Sa miséricorde dure à toujours. »
              </motion.h4>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-sans text-sm md:text-md text-[#F8F5F0]/85 mt-6 leading-relaxed max-w-xl mx-auto"
              >
                À l’occasion de ses 50 ans, OUEDRAOGO Alimata a l’immense joie de vous convier à une soirée exceptionnelle placée sous le signe de l’élégance, de la joie et du partage. Cinquante années de vie méritent d'être célébrées entourées d'affection et de reconnaissance.
              </motion.p>
            </div>
          </section>

          {/* 3. SECTION INFORMATIONS ÉVÉNEMENT */}
          <section className="relative py-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-6xl mx-auto relative z-10">
              
              <div className="text-center mb-16">
                <span className="font-mono text-xs text-[#D4AF37] tracking-[0.3em] uppercase">
                  Pour votre Agenda
                </span>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#F8F5F0] mt-3 tracking-wide">
                  Détails de la Célébration
                </h2>
                <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
              </div>

              {/* Event Cards Information & Alimata Portrait Bento Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left Side: Alimata Portrait Photo Card (Blue Denim Shirt) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="lg:col-span-4 rounded-xl border border-[#D4AF37]/20 p-2.5 bg-[#131313] hover:border-[#D4AF37]/45 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[360px] lg:min-h-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#4A2C1A]/10 to-[#0D0D0D] z-0" />
                  
                  {/* Portrait photo of Alimata (Blue Denim Shirt) */}
                  <div className="relative w-full h-full min-h-[260px] lg:min-h-0 flex-1 rounded-lg overflow-hidden border border-[#D4AF37]/15">
                    <SmartImage
                      src={photo2 ? [photo2, portraitBlueDenim, portraitBlackGold, celebratedPortrait] : [
                        portraitBlueDenim,
                        portraitBlackGold,
                        celebratedPortrait
                      ]}
                      alt="OUEDRAOGO Alimata"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10 pointer-events-none" />
                    
                    {/* Minimal decorative element inside */}
                    <div className="absolute bottom-4 left-4 right-4 text-center z-20">
                      <p className="font-serif italic text-[#D4AF37] text-md font-semibold tracking-wide">« Cinquante années de grâce divine & d'élégance »</p>
                    </div>
                  </div>
                </motion.div>

                {/* Right Side: Informational Detail Cards */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* DATE & TIME CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel group border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/45 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37] mb-5">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg text-white font-medium tracking-wide">Date & Heure</h3>
                      <div className="mt-3 space-y-1.5">
                        <p className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Jour de prestige</p>
                        <p className="text-sm text-[#F8F5F0]/80 font-medium">
                          Mardi 26 Mai 2026
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[#F8F5F0]/50 mt-4 flex items-center gap-1.5 pt-2 border-t border-white/5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Festivités à 18h00 précises
                    </p>
                  </motion.div>

                  {/* THE VENUE CARD */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="glass-panel group border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/45 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37] mb-5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg text-white font-medium tracking-wide">Lieu d'Honneur</h3>
                      <div className="mt-3 space-y-1.5">
                        <p className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Cadre Somptueux</p>
                        <p className="text-sm text-[#F8F5F0]/80 leading-snug font-semibold">
                          Salle KADIOGO
                        </p>
                        <p className="text-xs text-[#F8F5F0]/60">
                          Azalaï Hôtel Ouagadougou
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#D4AF37]/75 font-mono uppercase tracking-wider mt-4 pt-2 border-t border-white/5">
                      Burkina Faso • Ouagadougou
                    </p>
                  </motion.div>

                  {/* THEME & DRESS CODE SUMMARY */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass-panel group border border-[#D4AF37]/15 rounded-2xl p-6 hover:border-[#D4AF37]/45 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37] mb-5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg text-white font-medium tracking-wide">Thème & Style</h3>
                      <div className="mt-3 space-y-1.5">
                        <p className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">Matières & Couleurs</p>
                        <p className="text-sm text-white font-semibold flex items-center gap-1.5">
                          AFRICAIN CHIC
                        </p>
                        <p className="text-[11px] text-[#F8F5F0]/65 leading-normal">
                          Faso Danfani, Bazin, Blanc, & Or majestueux.
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/40 italic mt-4 pt-2 border-t border-white/5">
                      Rentrée VIP d'exception
                    </p>
                  </motion.div>

                </div>

              </div>

              {/* Interactive Map Block */}
              <motion.div
                id="lieu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-16 glass-panel border border-[#D4AF37]/20 rounded-2xl p-6 lg:p-8 hover:border-[#D4AF37]/45 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative border decoration */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-5 text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4A2C1A]/40 border border-[#D4AF37]/35 rounded-full text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase">
                      <MapPin className="w-3.5 h-3.5 gold-sparkle" />
                      <span>Localisation Officielle</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl text-white font-medium tracking-wide">
                        Azalaï Hôtel
                      </h3>
                      <p className="text-xs text-[#D4AF37] tracking-[0.15em] uppercase font-mono font-semibold">
                        Secteur 15, Ouagadougou
                      </p>
                    </div>
                    <p className="text-sm text-[#F8F5F0]/75 leading-relaxed">
                      La prestigieuse <strong>Salle KADIOGO</strong> de l'Azalaï Hôtel de Ouagadougou abritera notre célébration. Pour votre plus grand confort, la résidence hôtelière offre un parking parfaitement sécurisé ainsi qu'un accueil raffiné digne de cet événement exceptionnel.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href="https://maps.google.com/?q=Azalai+Hotel+Ouagadougou"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] px-5 py-3 rounded-sm transition-all duration-300 uppercase cursor-pointer"
                      >
                        Ouvrir l'itinéraire
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="lg:col-span-7 h-[340px] md:h-[400px] rounded-xl overflow-hidden border border-[#D4AF37]/20 relative group">
                    <iframe
                      title="Plan interactif Azalaï Hôtel Ouagadougou"
                      src="https://maps.google.com/maps?q=Azala%C3%AF%20H%C3%B4tel%20Ouagadougou&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      className="w-full h-full border-0 grayscale invert opacity-75 contrast-[1.1] brightness-[0.85] group-hover:opacity-95 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                      allowFullScreen
                      loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#D4AF37]/25 rounded-xl" />
                  </div>
                </div>
              </motion.div>

            </div>
          </section>

          {/* 4. COMPTE À REBOURS COMPONENT */}
          <Countdown />

          {/* 5. GALA DRESS CODE GUIDELINES */}
          <DressCode />

          {/* 7. FAMILY INSPIRED CITATION */}
          <section className="relative py-28 px-6 bg-[#0D0D0D] overflow-hidden text-center border-t border-neutral-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full filter blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
              
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/15 flex items-center justify-center mx-auto mb-8">
                <Quote className="w-6 h-6 text-[#D4AF37] opacity-60" />
              </div>

              <h3 className="font-serif text-2xl md:text-4xl text-[#F8F5F0] italic font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                « La grâce d’une femme d’art et de foi est un trésor inestimable pour sa famille et sa communauté. À l’aube de ses 50 ans, sa sagesse est couronne de gloire, et ses bénédictions éclairent le chemin de tous ses proches. »
              </h3>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-8 h-[1px] bg-[#D4AF37]/50" />
                <span className="font-mono text-xs text-[#D4AF37] uppercase tracking-[0.2em] font-medium">La Famille Célébrante</span>
                <div className="w-8 h-[1px] bg-[#D4AF37]/50" />
              </div>

            </div>
          </section>

          {/* 8. RSVP FORM SECTION */}
          <RSVPSection />

          {/* 9. FOOTER */}
          <footer className="relative bg-[#090909] text-[#F8F5F0]/50 text-center py-12 px-6 border-t border-[#D4AF37]/15">
            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* Monogram branding element */}
              <div className="font-serif text-3xl font-extrabold text-gold-gradient tracking-widest uppercase">
                A50
              </div>

              <p className="font-serif text-md text-[#FFF3D1] italic tracking-wide">
                « Votre présence généreuse rendra cette soirée encore plus mémorable. »
              </p>

              <div className="w-16 h-[1px] bg-[#D4AF37]/30 mx-auto my-4" />

              <p className="font-mono text-[9px] uppercase tracking-widest text-[#F8F5F0]/30 leading-normal">
                Jubilé d'Or & de Grâce — Ouagadougou 2026 <br />
                Invitation Privée • Conçue avec Élégance et Respect
              </p>

            </div>
          </footer>

        </motion.div>
      )}
    </div>
  );
}
