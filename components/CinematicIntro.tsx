import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

interface Char3DSpec {
  char: string;
  id: string;
  delay: number; // in seconds
  duration: number; // in seconds
  fromX: number;
  fromY: number;
  fromZ: number;
  fromRotateX: number;
  fromRotateY: number;
  fromRotateZ: number;
  fromScale: number;
  fromBlur: number;
  baseCurvatureY: number; // Subtle panoramic 3D screen curvature
  type: 'emerge' | 'sweep' | 'drop' | 'heavy' | 'smooth' | 'spark' | 'apostrophe' | 'digit1' | 'digit2';
}

const CHARACTERS: Char3DSpec[] = [
  {
    char: 'E',
    id: 'char-e1',
    delay: 0.25,
    duration: 0.42,
    fromX: -35,
    fromY: -20,
    fromZ: 280,
    fromRotateX: 25,
    fromRotateY: -28,
    fromRotateZ: -6,
    fromScale: 1.6,
    fromBlur: 12,
    baseCurvatureY: -6,
    type: 'emerge'
  },
  {
    char: 'L',
    id: 'char-l',
    delay: 0.60,
    duration: 0.38,
    fromX: -65,
    fromY: -30,
    fromZ: 210,
    fromRotateX: -18,
    fromRotateY: -24,
    fromRotateZ: -10,
    fromScale: 1.4,
    fromBlur: 10,
    baseCurvatureY: -4.5,
    type: 'sweep'
  },
  {
    char: 'I',
    id: 'char-i1',
    delay: 0.95,
    duration: 0.34,
    fromX: 0,
    fromY: -80,
    fromZ: 170,
    fromRotateX: 40,
    fromRotateY: -10,
    fromRotateZ: 0,
    fromScale: 1.25,
    fromBlur: 8,
    baseCurvatureY: -3,
    type: 'drop'
  },
  {
    char: 'X',
    id: 'char-x',
    delay: 1.30,
    duration: 0.40,
    fromX: 0,
    fromY: 0,
    fromZ: 360,
    fromRotateX: -22,
    fromRotateY: 20,
    fromRotateZ: 20,
    fromScale: 2.5,
    fromBlur: 14,
    baseCurvatureY: -1,
    type: 'heavy'
  },
  {
    char: 'I',
    id: 'char-i2',
    delay: 1.65,
    duration: 0.34,
    fromX: 30,
    fromY: 30,
    fromZ: 160,
    fromRotateX: 18,
    fromRotateY: 18,
    fromRotateZ: 0,
    fromScale: 1.2,
    fromBlur: 8,
    baseCurvatureY: 0.5,
    type: 'smooth'
  },
  {
    char: 'R',
    id: 'char-r',
    delay: 1.95,
    duration: 0.36,
    fromX: 75,
    fromY: -20,
    fromZ: 220,
    fromRotateX: -14,
    fromRotateY: 28,
    fromRotateZ: -8,
    fromScale: 1.4,
    fromBlur: 10,
    baseCurvatureY: 2,
    type: 'spark'
  },
  {
    char: "'",
    id: 'char-apo',
    delay: 2.25,
    duration: 0.26,
    fromX: 10,
    fromY: -35,
    fromZ: 150,
    fromRotateX: -25,
    fromRotateY: 12,
    fromRotateZ: 0,
    fromScale: 1.4,
    fromBlur: 6,
    baseCurvatureY: 3.5,
    type: 'apostrophe'
  },
  {
    char: '2',
    id: 'char-d2',
    delay: 2.50,
    duration: 0.32,
    fromX: -15,
    fromY: 15,
    fromZ: -240,
    fromRotateX: 18,
    fromRotateY: -15,
    fromRotateZ: 0,
    fromScale: 0.5,
    fromBlur: 8,
    baseCurvatureY: 4.8,
    type: 'digit1'
  },
  {
    char: '6',
    id: 'char-d6',
    delay: 2.80,
    duration: 0.38,
    fromX: 0,
    fromY: -25,
    fromZ: 380,
    fromRotateX: -24,
    fromRotateY: 15,
    fromRotateZ: 0,
    fromScale: 2.3,
    fromBlur: 14,
    baseCurvatureY: 6.2,
    type: 'digit2'
  }
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Asset Loading State
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Main Intro Animation States
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeLocks, setActiveLocks] = useState<Record<string, boolean>>({});
  const [subtitlesVisible, setSubtitlesVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  // Parallax mouse position
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Persistent references to guarantee the animation loop runs EXACTLY ONCE
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Track milestones in ref so state updates NEVER re-trigger or cancel the loop
  const flagsRef = useRef({
    subtitlesShown: false,
    pulseTriggered: false,
    flashTriggered: false,
    transitionTriggered: false,
    completed: false
  });
  const activeLocksRef = useRef<Record<string, boolean>>({});

  // Sound synthesizer callback (silent by default)
  const playSound = useCallback((_type: 'hum' | 'hit' | 'spark' | 'pulse' | 'flash') => {
    // Sound disabled for clean cinematic playback
  }, []);

  const playSoundRef = useRef(playSound);
  useEffect(() => {
    playSoundRef.current = playSound;
  }, [playSound]);

  // ASSET LOADING PROGRESS TRACKER
  // Real asset check (document.fonts.ready & document readiness) combined with smooth progress ring
  useEffect(() => {
    let isMounted = true;
    let realAssetsReady = false;

    const checkRealAssets = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Fallback gracefully
      }
      realAssetsReady = true;
    };
    checkRealAssets();

    const interval = setInterval(() => {
      if (!isMounted) return;

      setLoadProgress((prev) => {
        let step = 0;
        if (prev < 40) {
          step = Math.random() * 9 + 6;
        } else if (prev < 80) {
          step = Math.random() * 6 + 4;
        } else if (prev < 95) {
          step = realAssetsReady ? Math.random() * 8 + 5 : 1;
        } else {
          if (realAssetsReady) {
            step = 5;
          } else {
            return 95; // Wait momentarily for font verification
          }
        }

        const next = Math.min(100, prev + step);
        if (next >= 100) {
          clearInterval(interval);
          setLoadingComplete(true);
          playSoundRef.current('spark');

          // Synchronize transition into the 'ELIXIR'26' letter animation
          setTimeout(() => {
            if (isMounted) {
              setAssetsLoading(false);
            }
          }, 320);
          return 100;
        }
        return next;
      });
    }, 42);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Track mouse for dynamic 3D perspective parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // HTML5 Canvas 3D Space Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      size: number;
      vx: number;
      vy: number;
      vz: number;
      alpha: number;
    }

    const count = 75;
    const particles: Particle3D[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 50,
        size: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: -Math.random() * 1.6 - 0.4,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    let frameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep volumetric radial glow
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
      gradient.addColorStop(0.35, 'rgba(180, 130, 30, 0.03)');
      gradient.addColorStop(0.75, 'rgba(12, 10, 20, 0.4)');
      gradient.addColorStop(1, 'rgba(3, 3, 4, 0.98)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 3D Particles
      const fov = 450;
      const centerX = width / 2;
      const centerY = height / 2;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z <= 10) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.5;
        }

        const scale = fov / (fov + p.z);
        const screenX = centerX + p.x * scale;
        const screenY = centerY + p.y * scale;

        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          const depthAlpha = p.alpha * (1 - p.z / 900);
          ctx.fillStyle = `rgba(255, 230, 150, ${Math.max(0.08, depthAlpha)})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.5, p.size * scale * 1.8), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // SYNCHRONIZED TITLE ANIMATION TIMELINE
  // Only starts once assetsLoading is false (assets 100% synchronized)
  useEffect(() => {
    if (assetsLoading) return;

    const startTime = performance.now();
    let animationFrameId: number;

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setElapsedTime(elapsed);

      // 1. Check letter locks (E -> EL -> ELI -> ELIX -> ELIXI -> ELIXIR -> ELIXIR' -> ELIXIR'2 -> ELIXIR'26)
      CHARACTERS.forEach((c) => {
        const lockTime = c.delay + c.duration * 0.85;
        if (elapsed >= lockTime && !activeLocksRef.current[c.id]) {
          activeLocksRef.current[c.id] = true;
          setActiveLocks((prev) => ({ ...prev, [c.id]: true }));
        }
      });

      // 2. At 3.35s: Reveal subtitles (EEE TECHNICAL SYMPOSIUM & COLLEGE NAME)
      if (elapsed >= 3.35 && !flagsRef.current.subtitlesShown) {
        flagsRef.current.subtitlesShown = true;
        setSubtitlesVisible(true);
      }

      // 3. At 3.90s: Electric pulse sweep across title
      if (elapsed >= 3.90 && !flagsRef.current.pulseTriggered) {
        flagsRef.current.pulseTriggered = true;
        setPulseActive(true);
        playSoundRef.current('pulse');
      }

      // 4. At 4.25s: Subtle cinematic optical flash
      if (elapsed >= 4.25 && !flagsRef.current.flashTriggered) {
        flagsRef.current.flashTriggered = true;
        setFlashActive(true);
        playSoundRef.current('flash');
      }

      // 5. At 4.45s: Hyperspace forward push & dissolve
      if (elapsed >= 4.45 && !flagsRef.current.transitionTriggered) {
        flagsRef.current.transitionTriggered = true;
        setIsTransitioningOut(true);
      }

      // 6. At 4.85s: Sequence fully completed -> Transition reliably to home page
      if (elapsed >= 4.85 && !flagsRef.current.completed) {
        flagsRef.current.completed = true;
        onCompleteRef.current();
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Guaranteed fallback safety timeout (5.2s)
    const safetyTimeout = setTimeout(() => {
      if (!flagsRef.current.completed) {
        flagsRef.current.completed = true;
        onCompleteRef.current();
      }
    }, 5200);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimeout);
    };
  }, [assetsLoading]); // Synchronized start upon asset readiness

  // Continuous subtle 3D camera drift & mouse tilt
  const camRotateX = Math.sin(elapsedTime * 1.8) * 2.2 - mouseOffset.y * 5;
  const camRotateY = Math.cos(elapsedTime * 1.5) * 3.2 + mouseOffset.x * 6;
  const camTranslateZ = Math.min(90, elapsedTime * 20);

  // SVG Progress Ring calculations (Radius: 40, Circumference: 2 * pi * 40 = 251.327)
  const ringCircumference = 251.327;
  const strokeOffset = ringCircumference - (loadProgress / 100) * ringCircumference;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#030304] overflow-hidden flex flex-col items-center justify-center select-none"
      style={{
        perspective: '1400px',
        perspectiveOrigin: '50% 50%'
      }}
    >
      {/* HTML5 Canvas Background Particle & Glow System */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Cinematic Anamorphic Letterbox Bars */}
      <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-black/95 z-30 pointer-events-none border-b border-white/5" />
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-black/95 z-30 pointer-events-none border-t border-white/5" />

      {/* Skip Intro Button */}
      <button
        onClick={() => {
          if (!flagsRef.current.completed) {
            flagsRef.current.completed = true;
            onCompleteRef.current();
          }
        }}
        className="absolute top-3 sm:top-4 right-4 sm:right-6 z-40 inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/70 hover:bg-gold/20 text-gray-300 hover:text-gold border border-white/20 hover:border-gold/60 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
      >
        <span>Skip Intro</span>
        <SkipForward size={13} className="text-gold" />
      </button>

      {/* Radial Atmospheric Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_95%)] pointer-events-none z-10" />

      {/* CIRCULAR SVG PROGRESS RING (Asset Loading & Synchronization) */}
      <AnimatePresence>
        {assetsLoading && (
          <motion.div
            key="asset-loader"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.2, 
              filter: 'blur(8px)',
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* SVG Progress Ring */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="goldRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#FFE27A" />
                    <stop offset="70%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                  <filter id="goldRingGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Background Track Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(212, 175, 55, 0.15)"
                  strokeWidth="3.2"
                  fill="none"
                />

                {/* Outer Orbiting Tick Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke="rgba(255, 215, 0, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="2.5 5"
                  fill="none"
                  className="animate-[spin_10s_linear_infinite]"
                />

                {/* Dynamic SVG Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#goldRingGradient)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeOffset}
                  filter="url(#goldRingGlow)"
                  className="transition-all duration-100 ease-out"
                />
              </svg>

              {/* Center Percentage Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_0_12px_rgba(255,215,0,0.65)]">
                  {Math.round(loadProgress)}%
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <motion.div 
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-5 flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.28em] text-amber-200/90 uppercase"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${loadingComplete ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-gold shadow-[0_0_8px_#FFD700]'}`} />
              <span>{loadingComplete ? 'SYSTEM READY' : 'SYNCHRONIZING ASSETS...'}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subdued Background Electrical Hum Aura */}
      <motion.div
        animate={{ 
          opacity: elapsedTime >= 0.2 && !assetsLoading ? [0.2, 0.45, 0.25] : 0,
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[650px] h-[320px] rounded-full bg-gradient-to-r from-amber-500/25 via-gold/35 to-amber-600/25 blur-[110px] pointer-events-none z-10"
      />

      {/* MAIN 3D TITLE STAGE WITH REAL PERSPECTIVE & CAMERA MOTION */}
      <div 
        className={`relative z-20 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto transition-opacity duration-300 ${
          assetsLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isTransitioningOut 
            ? 'translateZ(750px) scale(1.35)' 
            : `translateZ(${camTranslateZ}px) rotateX(${camRotateX}deg) rotateY(${camRotateY}deg)`,
          opacity: isTransitioningOut ? 0 : assetsLoading ? 0 : 1,
          transition: isTransitioningOut 
            ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out' 
            : 'transform 0.15s ease-out, opacity 0.3s ease-out'
        }}
      >
        
        {/* CHARACTER CONTAINER IN 3D SPACE */}
        <div 
          className="relative flex items-center justify-center text-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          
          {/* Traveling Electric Pulse Beam across title (At 3.90s - 4.35s) */}
          {pulseActive && (
            <motion.div
              initial={{ left: '-15%', opacity: 0 }}
              animate={{ left: '115%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-30 blur-[3px] mix-blend-overlay"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-20 bg-amber-200 rounded-full blur-sm shadow-[0_0_30px_#FFD700]" />
            </motion.div>
          )}

          {/* Letter Slots with Dynamic 3D Perspective Tilt Entrances & Rebound Locks */}
          <div 
            className="flex items-center justify-center tracking-tight sm:tracking-wider md:tracking-widest relative"
            style={{ 
              transformStyle: 'preserve-3d',
              perspective: '1200px'
            }}
          >
            {CHARACTERS.map((charSpec) => {
              const hasStarted = !assetsLoading && elapsedTime >= charSpec.delay;
              const isLocked = activeLocks[charSpec.id];

              return (
                <div 
                  key={charSpec.id} 
                  className="relative inline-flex items-center justify-center select-none"
                  style={{
                    marginRight: charSpec.char === "'" ? '0.02em' : '0.05em',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Ghost spacer preserving 100% exact kerning */}
                  <span 
                    aria-hidden="true" 
                    className="opacity-0 pointer-events-none font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black select-none"
                  >
                    {charSpec.char}
                  </span>

                  {/* 3D Animated Entering Letter with Dynamic Tilt and Physical Lock Rebound */}
                  <AnimatePresence>
                    {hasStarted && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          x: charSpec.fromX,
                          y: charSpec.fromY,
                          z: charSpec.fromZ,
                          transformPerspective: 1000,
                          rotateX: charSpec.fromRotateX,
                          rotateY: charSpec.fromRotateY,
                          rotateZ: charSpec.fromRotateZ,
                          scale: charSpec.fromScale,
                          filter: `blur(${charSpec.fromBlur}px)`
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          y: 0,
                          // Dynamic 3D Perspective Tilt & Settle Rebound with transformPerspective & rotateY
                          z: [charSpec.fromZ, 25, -6, 0],
                          transformPerspective: 1000,
                          rotateX: [charSpec.fromRotateX, -charSpec.fromRotateX * 0.22, 0],
                          rotateY: [
                            charSpec.fromRotateY,
                            -charSpec.fromRotateY * 0.24 + charSpec.baseCurvatureY,
                            charSpec.baseCurvatureY * 1.15,
                            charSpec.baseCurvatureY
                          ],
                          rotateZ: [charSpec.fromRotateZ, 0],
                          scale: [charSpec.fromScale, 1.05, 1],
                          filter: 'blur(0px)'
                        }}
                        transition={{
                          duration: charSpec.duration,
                          times: [0, 0.72, 0.88, 1],
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className={`absolute inset-0 flex items-center justify-center font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black select-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFE27A] to-[#B8860B] ${
                          isLocked ? 'glow-text-gold' : ''
                        }`}
                        style={{
                          transformPerspective: 1000,
                          transformStyle: 'preserve-3d',
                          willChange: 'transform, opacity, filter',
                          textShadow: isLocked 
                            ? '0 1px 0 #FFF4CC, 0 2px 0 #E2BE57, 0 3px 0 #B8860B, 0 4px 1px rgba(0,0,0,0.7), 0 0 25px rgba(255,215,0,0.5)'
                            : '0 4px 15px rgba(0,0,0,0.8)'
                        }}
                      >
                        {charSpec.char}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* 3D Shockwave burst ring for heavy letters */}
                  {isLocked && (charSpec.type === 'heavy' || charSpec.type === 'digit2') && (
                    <motion.div
                      initial={{ scale: 0.2, opacity: 0.9, z: 20, rotateY: charSpec.baseCurvatureY }}
                      animate={{ scale: 2.4, opacity: 0, z: 80, rotateY: charSpec.baseCurvatureY }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      style={{ transformPerspective: 1000, transformStyle: 'preserve-3d' }}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full border-2 border-amber-300 shadow-[0_0_25px_rgba(255,215,0,0.85)] pointer-events-none"
                    />
                  )}

                  {/* Electrical spark when locked */}
                  {isLocked && (charSpec.type === 'spark' || charSpec.type === 'sweep') && (
                    <motion.div
                      initial={{ opacity: 0.9, scale: 0.5, z: 40 }}
                      animate={{ opacity: 0, scale: 1.6, z: 70 }}
                      transition={{ duration: 0.35 }}
                      className="absolute -top-3 right-0 w-2.5 h-2.5 bg-amber-200 rounded-full blur-[1px] shadow-[0_0_15px_#FFD700] pointer-events-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SUBTITLES REVEAL: EEE TECHNICAL SYMPOSIUM & COLLEGE NAME (AT 3.35s) */}
        <div 
          className="mt-6 sm:mt-8 flex flex-col items-center justify-center text-center space-y-2 h-16"
          style={{ transform: 'translateZ(25px)' }}
        >
          <AnimatePresence>
            {subtitlesVisible && (
              <motion.div
                initial={{ opacity: 0, y: 15, z: -40, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, z: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center space-y-1.5"
              >
                {/* Line 1: EEE TECHNICAL SYMPOSIUM */}
                <h2 className="font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-[0.38em] sm:tracking-[0.45em] text-amber-200/95 uppercase drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]">
                  EEE TECHNICAL SYMPOSIUM
                </h2>

                {/* Subtle Gold Divider */}
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent my-1" />

                {/* Line 2: GOVERNMENT COLLEGE OF ENGINEERING, ERODE */}
                <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.32em] font-light text-gray-300/85 uppercase">
                  GOVERNMENT COLLEGE OF ENGINEERING, ERODE
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FINAL CINEMATIC FLASH BLOOM (At 4.25s) */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-b from-[#FFFBEA] via-[#FFEBB0] to-[#E6C265] pointer-events-none z-40 mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Subdued Bottom Edge Light Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent z-40" />
    </div>
  );
};
