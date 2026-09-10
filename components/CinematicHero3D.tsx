import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ChevronDown, 
  ArrowRight, 
  Building2, 
  Zap, 
  Sparkles,
  Compass,
  Clock
} from 'lucide-react';
import { SYMPOSIUM_DATE, SYMPOSIUM_DATES_DISPLAY } from '../constants';

interface CinematicHero3DProps {
  onScrollDown?: () => void;
}

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DAYS', val: timeLeft.days, sub: 'Until Conclave' },
    { label: 'HOURS', val: timeLeft.hours, sub: 'Standard Time' },
    { label: 'MINUTES', val: timeLeft.minutes, sub: 'Realtime Sync' },
    { label: 'SECONDS', val: timeLeft.seconds, sub: 'Live Ticking' }
  ];

  return (
    <div className="flex flex-col items-center my-4 sm:my-6 md:my-7 w-full max-w-4xl mx-auto px-2">
      {/* Chronometer Overhead Kicker */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="h-[1px] w-8 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-black/80 border border-gold/40 text-gold text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <Clock size={12} className="text-gold animate-spin" style={{ animationDuration: '10s' }} />
          <span>OFFICIAL COUNTDOWN TO INAUGURATION</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping hidden xs:inline-block"></span>
        </div>
        <div className="h-[1px] w-8 sm:w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
      </div>

      {/* Chronograph Dials Strip */}
      <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6">
        {units.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center group">
              {/* Dial Chamber Box */}
              <div className="w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 h-20 xs:h-24 sm:h-28 md:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#141622]/95 via-[#0b0c13]/95 to-[#050508]/98 border-2 border-gold/40 group-hover:border-gold transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.2),inset_0_1px_1px_rgba(255,215,0,0.35)] relative overflow-hidden flex flex-col justify-between p-2 sm:p-3">
                {/* Metallic Gold Top Accent Rim */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                
                {/* Horizontal Mechanical Split Line (Flip Chrono Aesthetic) */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/90 border-t border-gold/20 pointer-events-none" />

                {/* Subtle Radial Ambient Gold Core Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 sm:w-16 h-12 sm:h-16 bg-gold/15 rounded-full blur-xl pointer-events-none group-hover:bg-gold/25 transition-colors" />

                {/* Micro corner accent pins */}
                <div className="flex items-center justify-between w-full opacity-60">
                  <span className="w-1 h-1 rounded-full bg-gold/60"></span>
                  <span className="w-1 h-1 rounded-full bg-gold/60"></span>
                </div>

                {/* Numeric Display Value */}
                <div className="my-auto text-center z-10">
                  <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FFF0B3] to-[#D4AF37] tracking-wider drop-shadow-[0_4px_16px_rgba(255,215,0,0.45)] select-none">
                    {String(item.val).padStart(2, '0')}
                  </span>
                </div>

                {/* Integrated Bottom Gold Bezel Label */}
                <div className="w-full bg-gold/10 border-t border-gold/30 rounded-lg py-0.5 text-center z-10 group-hover:bg-gold/20 transition-colors">
                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-cinzel font-black tracking-[0.2em] text-gold uppercase block">
                    {item.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Pulsating Glowing Separator Diamonds */}
            {index < units.length - 1 && (
              <div className="hidden xs:flex flex-col items-center justify-center gap-2 sm:gap-3 text-gold/70 text-xs sm:text-sm animate-pulse select-none pb-2">
                <span className="text-gold font-bold">◆</span>
                <span className="text-gold/50 font-bold text-[9px]">◆</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const CinematicHero3D: React.FC<CinematicHero3DProps> = ({ 
  onScrollDown
}) => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[88vh] flex flex-col items-center justify-center text-center px-3 xs:px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-14 z-10 overflow-hidden">
      {/* Background Architectural Canvas Blend & Atmospheric Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070709]/50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] md:w-[900px] h-[500px] sm:h-[750px] md:h-[900px] bg-gradient-radial from-amber-500/15 via-transparent to-transparent blur-[120px] rounded-full"></div>
      </div>

      {/* Foreground Interactive Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        
        {/* Institutional Heraldry Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-3 sm:mb-4 max-w-full"
        >
          <div className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-3.5 xs:px-4 sm:px-6 md:px-7 py-1.5 sm:py-2.5 rounded-xl sm:rounded-full bg-black/60 border border-gold/50 shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-md max-w-[95vw] sm:max-w-none">
            <Building2 size={15} className="text-gold shrink-0 sm:scale-110" />
            <span className="text-[11px] xs:text-xs sm:text-sm md:text-base font-cinzel font-bold text-gray-100 tracking-wider uppercase text-center">
              Government College of Engineering, Erode
            </span>
          </div>
        </motion.div>

        {/* Department Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-2 sm:mb-4 max-w-full px-2"
        >
          <p className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-cinzel text-gold font-bold tracking-[0.08em] sm:tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 sm:gap-3 text-center">
            <Zap size={14} className="text-amber-400 shrink-0 hidden xs:inline sm:scale-110" />
            <span>Department of Electrical and Electronics Engineering</span>
            <Zap size={14} className="text-amber-400 shrink-0 hidden xs:inline sm:scale-110" />
          </p>
        </motion.div>

        {/* Main Symposium Title with Animated Aura & Particle Accents */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative my-2 sm:my-4 group cursor-default max-w-full"
        >
          {/* Animated Radial Energy Glows */}
          <div 
            className="absolute -inset-x-12 sm:-inset-x-16 -inset-y-6 sm:-inset-y-8 bg-gradient-radial from-amber-400/35 via-gold/20 to-transparent blur-3xl -z-10 rounded-full animate-pulse" 
            style={{ animationDuration: '3s' }}
          />
          <div className="absolute -inset-x-6 sm:-inset-x-10 -inset-y-3 sm:-inset-y-5 bg-gold/30 blur-2xl -z-10 rounded-full" />
          
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-cinzel font-black tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFE27A] to-[#D4AF37] drop-shadow-[0_12px_35px_rgba(255,215,0,0.55)] leading-tight uppercase select-none whitespace-nowrap">
            ELIXIR'26
          </h1>

          {/* Animated Symmetric Gold Particle Sparkle Line */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-3 text-gold/80">
            <div className="h-[1.5px] w-10 xs:w-14 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <Sparkles size={15} className="text-amber-300 animate-spin sm:scale-110" style={{ animationDuration: '6s' }} />
            <div className="h-[1.5px] w-10 xs:w-14 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </motion.div>

        {/* Symposium Motto */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-xs xs:text-sm sm:text-base md:text-xl lg:text-2xl font-cinzel text-white/95 mt-1.5 sm:mt-2 mb-3 sm:mb-4 tracking-[0.14em] sm:tracking-[0.25em] font-semibold uppercase italic px-2 text-center"
        >
          A National Level Technical Symposium
        </motion.p>

        {/* Date & Location Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col items-center justify-center gap-2.5 max-w-[95vw] sm:max-w-none text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 bg-black/85 border border-gold/45 px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl sm:rounded-full backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.15)] group hover:border-gold/70 transition-colors">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-gold" />
              </div>
              <span className="font-cinzel font-bold text-white text-sm sm:text-base tracking-wider">
                {SYMPOSIUM_DATES_DISPLAY}
              </span>
            </div>

            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-gold/50" />

            <div className="flex items-center gap-2 text-gray-200">
              <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                <Compass size={15} className="text-gold" />
              </div>
              <span className="font-medium text-xs sm:text-sm text-gray-200 tracking-wide">
                Campus Auditorium &amp; EEE Hub
              </span>
            </div>
          </div>

          {/* 2-Day Structure Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-mono">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Day 1: Solar 2.0 Workshop &amp; Project Display
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Day 2: 4 Technical &amp; 4 Non-Technical Events
            </span>
          </div>
        </motion.div>

        {/* Live Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CountdownTimer targetDate={SYMPOSIUM_DATE} />
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-5 w-full px-4 sm:px-0 max-w-sm sm:max-w-none mx-auto"
        >
          <Link
            to="/register"
            className="w-full xs:w-auto text-center group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-cinzel font-black px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-4.5 rounded-full text-sm sm:text-base md:text-lg shadow-[0_0_35px_rgba(251,191,36,0.7),0_0_60px_rgba(234,179,8,0.4)] hover:shadow-[0_0_45px_rgba(251,191,36,0.9),0_0_75px_rgba(234,179,8,0.6)] transform hover:-translate-y-1 active:scale-95 transition-all duration-300 tracking-wider uppercase border-2 border-yellow-200"
          >
            <Sparkles size={18} className="text-slate-950 fill-slate-950 animate-pulse" />
            <span className="drop-shadow-sm font-black">Register Now</span>
            <ArrowRight size={19} className="group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
          </Link>

          {/* Direct link to Events Page */}
          <Link
            to="/events"
            className="w-full xs:w-auto text-center inline-flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-gold/20 border-2 border-gold/70 hover:border-gold text-amber-300 font-cinzel font-black px-7 sm:px-9 md:px-10 py-3.5 sm:py-4 md:py-4.5 rounded-full text-xs sm:text-sm md:text-base backdrop-blur-md transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] group tracking-wider uppercase"
          >
            <Sparkles size={16} className="text-amber-400 group-hover:rotate-12 transition-transform sm:scale-110" />
            <span>Explore Events</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:scale-110" />
          </Link>
        </motion.div>
      </div>

      {/* Downward Scroll Indicator */}
      {onScrollDown && (
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-1.5 text-gold/70 hover:text-gold cursor-pointer select-none z-10"
          onClick={onScrollDown}
        >
          <span className="text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] uppercase text-gray-300 font-semibold">
            Scroll for Event Guidelines
          </span>
          <ChevronDown size={20} className="text-gold animate-bounce md:scale-110" />
        </motion.div>
      )}
    </section>
  );
};
