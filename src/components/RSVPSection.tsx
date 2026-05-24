import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserCheck, Phone, CheckCircle2, AlertCircle, FileSpreadsheet, Search, Check, X, ShieldAlert, Image as ImageIcon, Upload, RotateCcw, Youtube } from "lucide-react";
import { RSVPResponse } from "../types";

// Table starts completely empty to ensure no fake/simulated guest examples are present
const SEED_GUESTS: RSVPResponse[] = [];

export default function RSVPSection() {
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  
  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  
  // Custom Photo uploads managed in state
  const [localPhoto1, setLocalPhoto1] = useState<string | null>(null);
  const [localPhoto2, setLocalPhoto2] = useState<string | null>(null);

  // YouTube Playlist state
  const [youtubeTracks, setYoutubeTracks] = useState<{ id: string; name: string; genre: string }[]>([]);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState("");
  const [newYoutubeName, setNewYoutubeName] = useState("");
  const [newYoutubeGenre, setNewYoutubeGenre] = useState("");

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMess, setErrorMess] = useState("");

  // Managing responses and drawer
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Sync with local storage and filter out any ancient seed/mock guest samples
    const saved = localStorage.getItem("ouaga_50_rsvps");
    let initialRsvps: RSVPResponse[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Exclude any fallback seeds with legacy ids: "g-1", "g-2", etc.
          initialRsvps = parsed.filter((g: any) => g && g.id && !g.id.startsWith("g-"));
        }
      } catch (e) {
        initialRsvps = [];
      }
    }
    localStorage.setItem("ouaga_50_rsvps", JSON.stringify(initialRsvps));
    setRsvps(initialRsvps);

    // Load active custom photos
    setLocalPhoto1(localStorage.getItem("custom_photo_1"));
    setLocalPhoto2(localStorage.getItem("custom_photo_2"));

    // Sync YouTube playlist, cleaning out any legacy mock soundtracks
    const storedTracks = localStorage.getItem("custom_youtube_tracks");
    let initialTracks: { id: string; name: string; genre: string }[] = [];
    if (storedTracks) {
      try {
        const parsed = JSON.parse(storedTracks);
        if (Array.isArray(parsed)) {
          // Exclude legacy seed youtube videos
          const legacyIds = ["y4PtN9L-78g", "ukLoF8u8C0E", "B8pA6-e8pBM"];
          initialTracks = parsed.filter((t: any) => t && t.id && !legacyIds.includes(t.id));
        }
      } catch (e) {
        initialTracks = [];
      }
    }
    localStorage.setItem("custom_youtube_tracks", JSON.stringify(initialTracks));
    setYoutubeTracks(initialTracks);
  }, []);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddYoutubeTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYoutubeId(newYoutubeUrl);
    if (!videoId) {
      alert("Lien YouTube invalide. Exemples valides : https://www.youtube.com/watch?v=y4PtN9L-78g ou https://youtu.be/y4PtN9L-78g");
      return;
    }

    const newTrack = {
      id: videoId,
      name: newYoutubeName.trim() || `Morceau ${youtubeTracks.length + 1}`,
      genre: newYoutubeGenre.trim() || "Jazz d'Afrique",
    };

    const updated = [...youtubeTracks, newTrack];
    setYoutubeTracks(updated);
    localStorage.setItem("custom_youtube_tracks", JSON.stringify(updated));
    window.dispatchEvent(new Event("custom-youtube-update"));

    setNewYoutubeUrl("");
    setNewYoutubeName("");
    setNewYoutubeGenre("");
  };

  const handleDeleteYoutubeTrack = (idToDelete: string) => {
    const updated = youtubeTracks.filter(t => t.id !== idToDelete);
    setYoutubeTracks(updated);
    localStorage.setItem("custom_youtube_tracks", JSON.stringify(updated));
    window.dispatchEvent(new Event("custom-youtube-update"));
  };

  const handleResetYoutubeTracks = () => {
    const SEED_TRACKS: { id: string; name: string; genre: string }[] = [];
    setYoutubeTracks(SEED_TRACKS);
    localStorage.setItem("custom_youtube_tracks", JSON.stringify(SEED_TRACKS));
    window.dispatchEvent(new Event("custom-youtube-update"));
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMess("S'il vous plaît, saisissez votre nom complet.");
      return;
    }
    if (!phone.trim()) {
      setErrorMess("S'il vous plaît, saisissez votre numéro de téléphone.");
      return;
    }
    if (attending === null) {
      setErrorMess("S'il vous plaît, indiquez si vous serez présent ou absent.");
      return;
    }

    setSubmitting(true);
    setErrorMess("");

    // Simulate luxury API response lag for visual polish
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newRSVP: RSVPResponse = {
      id: "rsvp-" + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      numberOfGuests: attending ? 1 : 0,
      attending,
      notes: notes.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    const updated = [newRSVP, ...rsvps];
    localStorage.setItem("ouaga_50_rsvps", JSON.stringify(updated));
    setRsvps(updated);

    setSubmitting(false);
    setSuccess(true);
    
    // Clear form
    setName("");
    setPhone("");
    setNotes("");
    setAttending(null);
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Event code is 50 or 2026
    if (adminPin.trim() === "50" || adminPin.trim() === "2026") {
      setAdminAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Code d’accès incorrect.");
    }
  };

  // Image Upload logic inside Organizer VIP Space
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, photoKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      localStorage.setItem(photoKey, base64String);
      window.dispatchEvent(new Event("custom-photo-update"));
      if (photoKey === "custom_photo_1") setLocalPhoto1(base64String);
      if (photoKey === "custom_photo_2") setLocalPhoto2(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (photoKey: string) => {
    localStorage.removeItem(photoKey);
    window.dispatchEvent(new Event("custom-photo-update"));
    if (photoKey === "custom_photo_1") setLocalPhoto1(null);
    if (photoKey === "custom_photo_2") setLocalPhoto2(null);
  };

  const handleDownloadCSV = () => {
    const headers = ["Nom", "Téléphone", "Présence", "Notes / Vœux", "Date de Soumission"];
    const rows = rsvps.map((r) => [
      r.name,
      r.phone,
      r.attending ? "PRÉSENT" : "ABSENT",
      r.notes || "",
      new Date(r.submittedAt).toLocaleDateString("fr-FR"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invitations_50_ans_grace_ouaga.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSubmissions = rsvps.length;
  const totalPresence = rsvps.filter((r) => r.attending).length;
  const totalNotesWithWishes = rsvps.filter((r) => r.notes?.trim()).length;

  const filteredRsvps = rsvps.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.includes(searchTerm)
  );

  return (
    <section id="rsvp" className="relative py-24 px-6 bg-[#0D0D0D] overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#4A2C1A]/10 filter blur-[150px] -top-64 -right-12 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#D4AF37]/3 filter blur-[150px] -bottom-64 -left-12 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#D4AF37] tracking-[0.35em] uppercase">
            Confirmer Votre Présence
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#F8F5F0] mt-3 tracking-wide">
            Assister au Jubilé
          </h2>
          <p className="font-sans text-sm text-[#F8F5F0]/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Pour nous aider à organiser au mieux cette soirée mémorable à l'Azalaï Hôtel, merci de bien vouloir remplir le formulaire de RSVP ci-dessous.
          </p>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {/* Success / Form Layout */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="glass-panel border-2 border-[#D4AF37]/30 rounded-2xl p-8 md:p-12 text-center"
              >
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/40">
                  <Check className="w-8 h-8 text-[#D4AF37]" />
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl text-gold-gradient font-semibold">
                  Votre réponse a été enregistrée !
                </h3>
                
                <p className="text-sm text-[#F8F5F0]/70 mt-4 leading-relaxed max-w-md mx-auto">
                  Nous vous remercions chaleureusement de votre courtoisie. Cet événement d'exception sera sublimé par votre présence distinguée.
                </p>

                <div className="mt-8 border-t border-[#D4AF37]/10 pt-6">
                  <p className="font-mono text-xs tracking-widest text-[#D4AF37] uppercase">
                    Rendez-vous à l'Azalaï Hôtel
                  </p>
                  <p className="text-xs text-[#F8F5F0]/50 mt-1">
                    Mardi 26 Mai 2026 à partir de 18h00 - Salle KADIOGO
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-[#131313] hover:bg-[#1c1c1c] text-[#F8F5F0] border border-neutral-800 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Modifier / Nouvelle réponse
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("lieu");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#D4AF37]/10 hover:brightness-110 cursor-pointer"
                  >
                    Voir le Lieu
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleRSVPSubmit}
                className="glass-panel rounded-2xl p-8 md:p-10 border border-[#D4AF37]/20 shadow-2xl relative"
              >
                {/* Visual Borders Accent */}
                <span className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#D4AF37]/40" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#D4AF37]/40" />

                {errorMess && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex items-start gap-3 p-4 bg-red-950/40 border border-red-500/20 text-red-200 text-xs sm:text-sm rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{errorMess}</span>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[#F8F5F0]/80 font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Nom Complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mme Fatou Ouédraogo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#131313]/90 border border-neutral-800 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 text-[#F8F5F0] rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[#F8F5F0]/80 font-mono text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +226 70 00 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#131313]/90 border border-neutral-800 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 text-[#F8F5F0] rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                    />
                  </div>

                  {/* Presence Selector */}
                  <div>
                    <label className="block text-[#F8F5F0]/80 font-mono text-xs uppercase tracking-widest mb-3">
                      Serez-vous présent(e) ? *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setAttending(true)}
                        className={`py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                          attending === true
                            ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] shadow-xl shadow-[#D4AF37]/5"
                            : "bg-[#131313]/90 border-neutral-800 text-[#F8F5F0]/65 hover:border-neutral-700 hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                        Oui, Présent(e)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttending(false)}
                        className={`py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                          attending === false
                            ? "bg-neutral-800/10 border-neutral-600 text-[#F8F5F0] shadow-sm"
                            : "bg-[#131313]/90 border-neutral-800 text-[#F8F5F0]/65 hover:border-neutral-700 hover:text-white"
                        }`}
                      >
                        <X className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                        Non, Absent(e)
                      </button>
                    </div>
                  </div>

                  {/* Notes / Wishes */}
                  <div>
                    <label className="block text-[#F8F5F0]/80 font-mono text-xs uppercase tracking-widest mb-2">
                      Vœux & Mots Personnels (Optionnel)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Laissez un message de bénédiction ou de félicitations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#131313]/90 border border-neutral-800 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 text-[#F8F5F0] rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-extrabold uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/10 border border-[#D4AF37]/30 cursor-pointer disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Enregistrement prestigieux...
                      </>
                    ) : (
                      "Confirmer mon RSVP"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Dashboard drawer for invitation management */}
        <div className="mt-16 text-center border-t border-neutral-900 pt-10">
          <button
            onClick={() => {
              setShowAdmin(!showAdmin);
              setAdminAuthenticated(false);
              setAdminPin("");
              setAuthError("");
            }}
            className="inline-flex items-center gap-2 text-xs text-[#F8F5F0]/40 hover:text-[#D4AF37] transition-colors font-mono uppercase tracking-widest"
          >
            <ShieldAlert className="w-4 h-4" />
            Espace Organisateur VIP
          </button>

          <AnimatePresence>
            {showAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="mt-8 max-w-2xl mx-auto glass-panel border border-[#D4AF37]/15 rounded-xl p-6 text-left"
              >
                {!adminAuthenticated ? (
                  <form onSubmit={handleAdminVerify} className="max-w-md mx-auto py-4">
                    <h4 className="font-serif text-lg text-gold-gradient font-medium mb-2 uppercase tracking-wide">
                      Vérification Superviseur
                    </h4>
                    <p className="text-xs text-[#F8F5F0]/50 mb-5 leading-normal">
                      Veuillez entrer le code de sécurité pour accéder à la liste des invités confirmés et exporter l'état des RSVPs.
                    </p>
                    
                    {authError && (
                      <p className="text-xs text-red-400 mb-3 ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        {authError}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Entrez le code..."
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value)}
                        className="flex-1 bg-black border border-neutral-800 focus:border-[#D4AF37]/40 rounded-lg px-3 py-2 text-sm outline-none text-[#F8F5F0]"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg hover:brightness-105 cursor-pointer"
                      >
                        Entrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {/* Header Admin stats */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-800">
                      <div>
                        <h4 className="font-serif text-xl text-[#F8F5F0] tracking-wide font-medium">
                          Tableau de Bord des Invitations
                        </h4>
                        <p className="text-xs text-[#F8F5F0]/40 mt-1">
                          Consolidation en temps réel des réponses d'invités
                        </p>
                      </div>

                      <button
                        onClick={handleDownloadCSV}
                        className="inline-flex items-center gap-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-xs font-mono font-medium transition-all cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Exporter (.CSV)
                      </button>
                    </div>

                    {/* Stats Tiles */}
                    <div className="grid grid-cols-3 gap-3 my-6">
                      <div className="bg-[#131313] p-4 rounded-lg border border-neutral-800 text-center">
                        <span className="block font-mono text-2xl font-bold text-white">
                          {totalSubmissions}
                        </span>
                        <span className="text-[10px] text-[#F8F5F0]/40 uppercase tracking-widest font-mono">
                          Soumissions
                        </span>
                      </div>
                      <div className="bg-[#131313] p-4 rounded-lg border border-neutral-800 text-center">
                        <span className="block font-mono text-2xl font-bold text-[#D4AF37]">
                          {totalPresence}
                        </span>
                        <span className="text-[10px] text-[#F8F5F0]/40 uppercase tracking-widest font-mono">
                          Présents
                        </span>
                      </div>
                      <div className="bg-[#131313] p-4 rounded-lg border border-neutral-800 text-center">
                        <span className="block font-mono text-2xl font-bold text-[#D4AF37]">
                          {totalNotesWithWishes}
                        </span>
                        <span className="text-[10px] text-[#F8F5F0]/40 uppercase tracking-widest font-mono">
                          Mots de Vœux
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Image Manager inside Admin Space */}
                    <div className="bg-[#131313] border border-[#D4AF37]/15 rounded-xl p-5 my-6">
                      <div className="flex items-center gap-2 mb-3 text-gold-gradient font-serif font-medium uppercase tracking-wider text-sm">
                        <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                        Gestion des Photos Personnelles de l'Invitation
                      </div>
                      <p className="text-[11px] text-[#F8F5F0]/60 mb-5 leading-relaxed">
                        Ajoutez ou modifiez vous-même les portraits de l'invitation. Les photos que vous chargerez remplaceront instantanément les visuels par défaut sur tout le site.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Photo 1: Chic Doré / Noir */}
                        <div className="bg-black/60 border border-neutral-800/80 rounded-lg p-3 flex flex-col justify-between">
                          <div>
                            <span className="block text-[11px] font-semibold uppercase tracking-widest font-mono text-[#D4AF37]/80">Portrait 1 (Accueil Chic)</span>
                            <span className="text-[9px] text-[#F8F5F0]/40 block mb-3">Photo d'honneur du haut (fond sombre)</span>
                            {localPhoto1 ? (
                              <div className="relative w-full h-32 rounded bg-neutral-950 overflow-hidden mb-3 border border-[#D4AF37]/10 flex items-center justify-center">
                                <img src={localPhoto1} alt="Preview 1" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-full h-32 rounded bg-neutral-950/60 border border-dashed border-neutral-800 mb-3 flex flex-col items-center justify-center gap-1.5 text-center px-2">
                                <ImageIcon className="w-6 h-6 text-neutral-700" />
                                <span className="text-[9px] text-neutral-500 font-mono">Photo par défaut active</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <label className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/20 rounded py-1.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              Charger une photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "custom_photo_1")}
                                className="hidden"
                              />
                            </label>
                            {localPhoto1 && (
                              <button
                                onClick={() => handleResetPhoto("custom_photo_1")}
                                className="px-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded cursor-pointer transition-colors"
                                title="Réinitialiser à l'image par défaut"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Photo 2: Bento Denim */}
                        <div className="bg-black/60 border border-neutral-800/80 rounded-lg p-3 flex flex-col justify-between">
                          <div>
                            <span className="block text-[11px] font-semibold uppercase tracking-widest font-mono text-[#D4AF37]/80">Portrait 2 (Bento Détente)</span>
                            <span className="text-[9px] text-[#F8F5F0]/40 block mb-3">Deuxième photo de la grille bento (fond blanc)</span>
                            {localPhoto2 ? (
                              <div className="relative w-full h-32 rounded bg-neutral-950 overflow-hidden mb-3 border border-[#D4AF37]/10 flex items-center justify-center">
                                <img src={localPhoto2} alt="Preview 2" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-full h-32 rounded bg-neutral-950/60 border border-dashed border-neutral-800 mb-3 flex flex-col items-center justify-center gap-1.5 text-center px-2">
                                <ImageIcon className="w-6 h-6 text-neutral-700" />
                                <span className="text-[9px] text-neutral-500 font-mono">Photo par défaut active</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <label className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/20 rounded py-1.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              Charger une photo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "custom_photo_2")}
                                className="hidden"
                              />
                            </label>
                            {localPhoto2 && (
                              <button
                                onClick={() => handleResetPhoto("custom_photo_2")}
                                className="px-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded cursor-pointer transition-colors"
                                title="Réinitialiser à l'image par défaut"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* YouTube Playlist Manager */}
                    <div className="bg-[#131313] border border-neutral-800 rounded-xl p-5 my-6">
                      <div className="flex items-center gap-2 mb-3 text-gold-gradient font-serif font-medium uppercase tracking-wider text-sm">
                        <Youtube className="w-4 h-4 text-[#D4AF37]" />
                        Gestionnaire de Playlist YouTube de l'Invitation
                      </div>
                      <p className="text-[11px] text-[#F8F5F0]/65 mb-5 leading-relaxed">
                        Configurez les morceaux d'ambiance de l'invitation. Ajoutez directement des liens YouTube de morceaux de jazz ou de musique de fond : ils apparaîtront instantanément dans le tourne-disque de tous vos invités !
                      </p>

                      {/* Tracks list */}
                      <div className="space-y-2 mb-5 max-h-[180px] overflow-y-auto pr-1">
                        {youtubeTracks.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-xs">
                            Aucune musique dans la playlist. Ajoutez un lien YouTube ci-dessous !
                          </div>
                        ) : (
                          youtubeTracks.map((track, idx) => (
                            <div key={track.id + idx} className="flex items-center justify-between bg-black/60 border border-neutral-800/80 rounded-lg p-2.5 text-xs">
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <span className="font-mono text-[10px] text-[#D4AF37]/60">#{idx + 1}</span>
                                <div className="truncate">
                                  <span className="block font-medium text-white truncate text-[11px]">{track.name}</span>
                                  <span className="text-[9px] text-neutral-500 block truncate leading-none mt-1">{track.genre}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                  href={`https://youtube.com/watch?v=${track.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neutral-500 hover:text-white transition-all p-1"
                                  title="Tester le lien YouTube"
                                >
                                  <Youtube className="w-3.5 h-3.5 text-[#D4AF37]/80 hover:text-red-500" />
                                </a>
                                <button
                                  onClick={() => handleDeleteYoutubeTrack(track.id)}
                                  className="text-red-400/80 hover:text-red-400 transition-all p-1 cursor-pointer"
                                  title="Supprimer du lecteur"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Form adding track */}
                      <form onSubmit={handleAddYoutubeTrack} className="bg-black/40 border border-neutral-800/40 rounded-lg p-3.5 space-y-3">
                        <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest font-mono">Ajouter un nouveau morceau</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10.5px] text-neutral-500 mb-1">Nom du morceau</label>
                            <input
                              type="text"
                              placeholder="Ex: Manu Dibango - Soul Makossa"
                              value={newYoutubeName}
                              onChange={(e) => setNewYoutubeName(e.target.value)}
                              required
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37]/35 rounded px-2.5 py-1.5 text-xs outline-none text-[#F8F5F0]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10.5px] text-neutral-500 mb-1">Style de jazz / Tag</label>
                            <input
                              type="text"
                              placeholder="Ex: Afrobeat Jazz Vibe"
                              value={newYoutubeGenre}
                              onChange={(e) => setNewYoutubeGenre(e.target.value)}
                              className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37]/35 rounded px-2.5 py-1.5 text-xs outline-none text-[#F8F5F0]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10.5px] text-neutral-500 mb-1">Lien YouTube (ou ID de la vidéo)</label>
                          <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=y4PtN9L-78g"
                            value={newYoutubeUrl}
                            onChange={(e) => setNewYoutubeUrl(e.target.value)}
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37]/35 rounded px-2.5 py-1.5 text-xs outline-none text-[#F8F5F0]"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={handleResetYoutubeTracks}
                            className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded text-[10px] uppercase font-semibold font-mono tracking-wider cursor-pointer"
                            title="Restaurer la liste par défaut"
                          >
                            Défaut
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-amber-400 text-black rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Ajouter
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Search guest bar */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input
                        type="text"
                        placeholder="Rechercher un invité par nom ou téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:border-[#D4AF37]/40 rounded-lg pl-9 pr-4 py-2 text-xs outline-none text-[#F8F5F0]"
                      />
                    </div>

                    {/* RSVPs Table list */}
                    <div className="max-h-60 overflow-y-auto border border-neutral-800/80 rounded-lg bg-black">
                      <table className="w-full text-left text-xs text-[#F8F5F0]/80">
                        <thead className="bg-[#131313] text-[#F8F5F0]/50 font-mono text-[10px] uppercase tracking-wider sticky top-0 border-b border-neutral-800">
                          <tr>
                            <th className="p-3">Nom</th>
                            <th className="p-3">Statut</th>
                            <th className="p-3">Téléphone</th>
                            <th className="p-3">Vœux / Message</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900">
                          {filteredRsvps.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-[#F8F5F0]/40">
                                Aucun invité trouvé.
                              </td>
                            </tr>
                          ) : (
                            filteredRsvps.map((guest) => (
                              <tr key={guest.id} className="hover:bg-neutral-900/40">
                                <td className="p-3 font-medium text-white max-w-[150px] truncate">
                                  {guest.name}
                                </td>
                                <td className="p-3">
                                  {guest.attending ? (
                                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">
                                      <Check className="w-2.5 h-2.5" /> OUI
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold">
                                      <X className="w-2.5 h-2.5" /> NON
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-[#F8F5F0]/50">{guest.phone}</td>
                                <td className="p-3 text-neutral-400 max-w-[200px] truncate italic">{guest.notes || "—"}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
