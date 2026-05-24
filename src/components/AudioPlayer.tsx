import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Music, Heart, Sparkles, ChevronRight, Youtube, X } from "lucide-react";

interface Track {
  id: string;
  name: string;
  genre: string;
}

const SEED_TRACKS: Track[] = [];

const getStoredTracks = (): Track[] => {
  const stored = localStorage.getItem("custom_youtube_tracks");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const legacyIds = ["y4PtN9L-78g", "ukLoF8u8C0E", "B8pA6-e8pBM"];
        return parsed.filter((t: any) => t && t.id && !legacyIds.includes(t.id));
      }
    } catch (e) {
      console.warn("Failed parsing custom_youtube_tracks, falling back to seeds.");
    }
  }
  return SEED_TRACKS;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function AudioPlayer() {
  const [tracks, setTracks] = useState<Track[]>(getStoredTracks());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem("bg_music_hidden") === "true";
  });
  
  const audioRef = useRef<any | null>(null);

  // Sync state when playlist is updated from RSVP Admin space in real-time
  useEffect(() => {
    const handleUpdate = () => {
      const refreshed = getStoredTracks();
      setTracks(refreshed);
    };
    window.addEventListener("custom-youtube-update", handleUpdate);
    return () => window.removeEventListener("custom-youtube-update", handleUpdate);
  }, []);

  // Safeguard index boundaries if tracks list dimensions change
  useEffect(() => {
    if (currentTrackIndex >= tracks.length && tracks.length > 0) {
      setCurrentTrackIndex(0);
    }
  }, [tracks, currentTrackIndex]);

  // Load YouTube script on initial mount
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);

  // Create or swap YouTube Player instance on active video ID changes
  useEffect(() => {
    let ytPlayer: any = null;
    let intervalId: any = null;
    const activeVideoId = tracks[currentTrackIndex]?.id || "";

    if (!activeVideoId) {
      setPlayerReady(false);
      return;
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return false;

      try {
        ytPlayer = new window.YT.Player("youtube-player-iframe", {
          height: "12",
          width: "12",
          videoId: activeVideoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              try {
                event.target.setVolume(isMuted ? 0 : volume * 100);
                if (isPlaying) {
                  event.target.playVideo();
                }
              } catch (e) {
                console.warn("Failed safe config inside onReady loop: " + (e instanceof Error ? e.message : String(e)));
              }
            },
            onStateChange: (event: any) => {
              // States: ENDED (0), PLAYING (1), PAUSED (2)
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                handleNextTrack();
              }
            },
            onError: (err: any) => {
              console.warn("YouTube player warning (possibly embedding restricted): " + (err?.data !== undefined ? err.data : String(err)));
              // Auto-advance to next track on video error
              setTimeout(() => {
                handleNextTrack();
              }, 1500);
            }
          }
        });
        audioRef.current = ytPlayer;
        return true;
      } catch (err) {
        console.error("Error creating YouTube player instance: " + (err instanceof Error ? err.message : String(err)));
        return false;
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      intervalId = setInterval(() => {
        if (window.YT && window.YT.Player) {
          const loaded = initPlayer();
          if (loaded) clearInterval(intervalId);
        }
      }, 500);
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
        if (intervalId) clearInterval(intervalId);
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (ytPlayer && ytPlayer.destroy) {
        try {
          ytPlayer.destroy();
        } catch (e) {}
      }
      audioRef.current = null;
      setPlayerReady(false);
    };
  }, [currentTrackIndex, tracks]);

  // Sync Pause/Play triggers from control wheel
  useEffect(() => {
    const yt = audioRef.current;
    if (!yt || !playerReady) return;

    try {
      if (isPlaying) {
        if (yt.playVideo) yt.playVideo();
      } else {
        if (yt.pauseVideo) yt.pauseVideo();
      }
    } catch (e) {
      console.warn("Playstate sync error: " + (e instanceof Error ? e.message : String(e)));
    }
  }, [isPlaying, playerReady]);

  // Sync volume slider configurations
  useEffect(() => {
    const yt = audioRef.current;
    if (!yt || !playerReady) return;

    try {
      if (yt.setVolume) {
        yt.setVolume(isMuted ? 0 : volume * 100);
      }
    } catch (e) {}
    localStorage.setItem("bg_music_volume", volume.toString());
  }, [volume, isMuted, playerReady]);

  // Periodic visual progress & timers checker
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && playerReady) {
      timer = setInterval(() => {
        const yt = audioRef.current;
        if (yt) {
          try {
            if (yt.getCurrentTime) {
              setCurrentTime(yt.getCurrentTime());
            }
            if (yt.getDuration) {
              setTrackDuration(yt.getDuration());
            }
          } catch (e) {}
        }
      }, 500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playerReady]);

  // Autoplay bypass support on human gesture
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      const savedPlayState = localStorage.getItem("bg_music_playing") === "true";
      if (savedPlayState && !isPlaying) {
        setIsPlaying(true);
        setShowTooltip(false);
      }
      document.removeEventListener("click", handleFirstUserInteraction);
      document.removeEventListener("touchstart", handleFirstUserInteraction);
    };

    document.addEventListener("click", handleFirstUserInteraction);
    document.addEventListener("touchstart", handleFirstUserInteraction);

    return () => {
      document.removeEventListener("click", handleFirstUserInteraction);
      document.removeEventListener("touchstart", handleFirstUserInteraction);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    localStorage.setItem("bg_music_playing", nextState ? "true" : "false");
    if (nextState) {
      setShowTooltip(false);
    }
  };

  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    localStorage.setItem("bg_music_playing", "true");
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    localStorage.setItem("bg_music_playing", "true");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0;
  const currentTrack = tracks[currentTrackIndex];

  if (tracks.length === 0) return null;

  if (isHidden) {
    return (
      <div className="fixed bottom-6 left-6 z-50 flex items-center justify-center">
        {/* Hidden YouTube Target Elements */}
        <div className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden">
          <div id="youtube-player-iframe" className="w-[10px] h-[10px]" />
        </div>

        <motion.button
          id="restore-jazz-player"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsHidden(false);
            localStorage.setItem("bg_music_hidden", "false");
          }}
          className="p-3.5 rounded-full bg-black/90 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-neutral-900 transition-all shadow-2xl flex items-center justify-center hover:shadow-[#D4AF37]/20 relative group"
          title="Afficher le lecteur de musique"
        >
          <Music className="w-5 h-5 animate-pulse" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black border border-neutral-800 text-neutral-300 text-[10px] rounded px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
            Afficher la musique d'ambiance
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <div id="african-jazz-player" className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 select-none">
      
      {/* Hidden YouTube Target Elements */}
      <div className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden">
        <div id="youtube-player-iframe" className="w-[10px] h-[10px]" />
      </div>

      {/* Expansive Tooltip Bubble */}
      <AnimatePresence>
        {showTooltip && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-black/90 border border-[#D4AF37]/30 text-[#F8F5F0] rounded-xl px-4 py-3 shadow-2xl max-w-[270px] backdrop-blur-md relative"
          >
            <div className="absolute left-6 -bottom-2 w-3 h-3 bg-black/90 border-r border-b border-[#D4AF37]/30 rotate-45" />
            <div className="flex gap-2.5 items-start">
              <span className="text-lg">🎷</span>
              <div>
                <p className="text-[11px] font-semibold text-white tracking-wide uppercase font-mono">Ambiance African Jazz</p>
                <p className="text-[10px] text-[#F8F5F0]/70 mt-1 leading-relaxed">
                  Lancez la playlist YouTube exclusive configurée par l'administrateur de l'invitation !
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="inline-flex items-center gap-1.5 cursor-pointer bg-[#D4AF37] hover:bg-amber-400 text-black px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#D4AF37]/20"
                  >
                    <Play className="w-2.5 h-2.5 fill-black" />
                    Écouter
                  </button>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="text-[9px] cursor-pointer text-[#F8F5F0]/40 hover:text-white uppercase tracking-wider"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating player */}
      <div className="flex items-center gap-3.5">
        
        {/* Floating vinyl button & progress circle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-2xl z-25 group"
          onClick={togglePlay}
        >
          {/* Outer glowing border ring */}
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8C6D2B] opacity-40 blur-[2px] ${isPlaying ? "animate-pulse" : "group-hover:opacity-60"} transition-all`} />

          {/* Core circular button container */}
          <div className="absolute inset-0.5 rounded-full bg-neutral-950 border border-[#D4AF37]/25 flex items-center justify-center overflow-hidden">
            
            {/* Spinning Groove lines styled as luxury black vinyl record */}
            <div className={`absolute inset-1 rounded-full border border-dashed border-neutral-900 overflow-hidden flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "14s" }}>
              <div className="absolute inset-2.5 rounded-full bg-[#111111] border border-[#222222]">
                <div className="absolute inset-2 rounded-full border border-dashed border-neutral-800">
                  {/* African Gold central record label */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#8C6D2B] to-[#D4AF37] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Backdrop filter over vinyl */}
            <div className={`absolute inset-0 bg-black/10 mix-blend-color-dodge transition-opacity ${isPlaying ? "opacity-30" : "opacity-0"}`} />

            {/* Play/Pause centered icons visible on top */}
            <div className="relative z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 translate-x-0.5 fill-current" />
              )}
            </div>
          </div>

          {/* Simple circular path progress ring */}
          <svg className="absolute -inset-0.5 w-[61px] h-[61px] -rotate-90 pointer-events-none">
            <circle
              cx="30.5"
              cy="30.5"
              r="28.5"
              stroke="#D4AF37"
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 28.5}
              strokeDashoffset={2 * Math.PI * 28.5 * (1 - progressPercent / 100)}
              className="transition-all duration-300 opacity-80"
            />
          </svg>

          {/* Tiny live visualizer bars pulsing outside label */}
          {isPlaying && (
            <div className="absolute bottom-[-1px] right-[-1px] bg-black border border-[#D4AF37]/35 rounded-full px-1.5 py-0.5 flex gap-0.5 items-end justify-center h-4 shadow-lg">
              <span className="w-0.5 bg-[#D4AF37] animate-[pulseHeight_0.8s_ease-in-out_infinite] h-1.5" />
              <span className="w-0.5 bg-[#D4AF37] animate-[pulseHeight_1.1s_ease-in-out_infinite_0.1s] h-2.5" />
              <span className="w-0.5 bg-[#D4AF37] animate-[pulseHeight_0.9s_ease-in-out_infinite_0.2s] h-2" />
            </div>
          )}
        </motion.div>

        {/* Small floating status text block / trigger dropdown */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-neutral-800/80 hover:border-[#D4AF37]/25 rounded-full px-3.5 py-1.5 shadow-xl cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              {isPlaying ? "YouTube Live" : "Ambiance Off"}
            </span>
            <span className="text-[11px] font-semibold text-white/90 max-w-[120px] truncate font-sans">
              {currentTrack?.name || "Pas de morceau"}
            </span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
        </motion.div>

        {/* Discreet minimize/hide button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsHidden(true);
            localStorage.setItem("bg_music_hidden", "true");
          }}
          className="w-7 h-7 rounded-full bg-black/85 border border-[#D4AF37]/20 flex items-center justify-center text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 cursor-pointer transition-colors shadow-lg animate-fade-in"
          title="Masquer le lecteur"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Styled African Lounge Dropdown Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="w-72 bg-gradient-to-b from-[#141414] to-black border border-neutral-800/85 rounded-xl p-4 shadow-2xl backdrop-blur-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-[#D4AF37] uppercase tracking-widest font-mono">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                Live Playlist YouTube
              </div>
              <span className="text-[10px] font-mono text-neutral-500 font-normal">
                {formatTime(currentTime)} / {formatTime(trackDuration)}
              </span>
            </div>

            {/* Track Selector List */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto mb-3.5 scrollbar-thin scrollbar-thumb-neutral-800">
              {tracks.map((track, idx) => (
                <button
                  key={track.id + idx}
                  onClick={() => handleTrackChange(idx)}
                  className={`w-full flex items-center justify-between text-left p-2 rounded-lg text-xs cursor-pointer transition-all ${
                    currentTrackIndex === idx
                      ? "bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]"
                      : "hover:bg-neutral-900 text-neutral-400 border border-transparent hover:text-white"
                  }`}
                >
                  <div className="truncate pr-2 w-full">
                    <span className="block font-medium truncate text-[11px] text-[#F8F5F0]/95">{track.name}</span>
                    <span className="text-[9px] text-neutral-500 block truncate leading-tight">{track.genre}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Volume slider & general settings */}
            <div className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-900 rounded-lg p-2.5">
              <button
                onClick={toggleMute}
                className="text-neutral-400 hover:text-[#D4AF37] cursor-pointer transition-colors"
                title={isMuted ? "Réactiver le son" : "Couper le son"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (val > 0) setIsMuted(false);
                }}
                className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-[#D4AF37]/75" /> Alimata Ouedraogo
              </span>
              <span className="flex items-center gap-0.5 italic">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> 50 ans
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes pulseHeight {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
