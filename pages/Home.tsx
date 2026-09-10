import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Zap, 
  Mic2, 
  ShieldCheck, 
  Scroll, 
  Utensils, 
  Info, 
  Smartphone, 
  Code2, 
  Sparkles
} from 'lucide-react';
import { CAMPUS_IMAGE_URL, CAMPUS_IMAGE_FALLBACK, OFFICIAL_COORDINATORS } from '../constants';
import { CinematicHero3D } from '../components/CinematicHero3D';
import { Tilt3DCard } from '../components/Tilt3DCard';

const Home: React.FC = () => {
  const essentialsRef = useRef<HTMLDivElement>(null);

  const handleScrollToEssentials = () => {
    if (essentialsRef.current) {
      essentialsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const essentials = [
    { 
      icon: <ShieldCheck className="text-gold" />, 
      title: "ID Card Mandatory", 
      desc: "College ID card is strictly mandatory for all participants at the venue." 
    },
    { 
      icon: <Smartphone className="text-gold" />, 
      title: "Registration QR Code", 
      desc: "Keep your digital registration confirmation QR code ready for instant spot entry." 
    },
    { 
      icon: <Scroll className="text-gold" />, 
      title: "Official Certificates", 
      desc: "Hard-copy certificates will be awarded to all registered attendees." 
    },
    { 
      icon: <Utensils className="text-gold" />, 
      title: "Food & Refreshments", 
      desc: "Wholesome lunch and refreshing tea breaks will be served to all delegates." 
    }
  ];

  return (
    <div className="overflow-hidden relative bg-[#070709] text-white selection:bg-gold/30 selection:text-gold min-h-screen">
      
      {/* Full-Page Background: GCE Erode Campus Architectural Backdrop (Bright & Clear) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${CAMPUS_IMAGE_URL})` }}
      >
        <img 
          src={CAMPUS_IMAGE_URL} 
          alt="GCE Erode Campus"
          className="w-full h-full object-cover object-center opacity-90 sm:opacity-95 filter brightness-[1.05] contrast-[1.02] saturate-[1.1]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = CAMPUS_IMAGE_FALLBACK;
          }}
        />
        {/* Balanced Atmospheric Vignette allowing the campus architecture to shine bright and clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-[#070709]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      {/* SECTION 1: CINEMATIC HERO (SCALED & PROPORTIONED) */}
      <CinematicHero3D 
        onScrollDown={handleScrollToEssentials}
      />

      {/* SECTION 2: PARTICIPANT PROTOCOL WITH INTERACTIVE 3D TILT CARDS */}
      <section 
        ref={essentialsRef} 
        className="py-12 sm:py-18 md:py-24 lg:py-28 bg-[#070709]/85 relative z-20 border-b border-white/5 backdrop-blur-md"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8 sm:mb-14 md:mb-16 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm md:text-base font-mono font-semibold uppercase tracking-widest mb-2.5 sm:mb-4">
              <Info size={15} className="text-gold shrink-0 sm:scale-110" />
              <span>Event Protocol</span>
            </div>
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-black text-white uppercase tracking-wider sm:tracking-widest leading-tight">
              PARTICIPANT ESSENTIALS
            </h3>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-300 mt-2 sm:mt-4 max-w-2xl mx-auto font-normal leading-relaxed px-2">
              Guidelines and amenities guaranteed for every registered symposium delegate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {essentials.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                className="h-full flex"
              >
                <Tilt3DCard className="w-full bg-[#0e0f16]/90 p-5 sm:p-7 md:p-8 lg:p-9 rounded-2xl border border-white/10 group hover:border-gold/50 transition-colors text-center shadow-lg backdrop-blur-md h-full flex flex-col justify-between min-h-[190px] sm:min-h-[220px]">
                  <div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-gold/30 group-hover:scale-105 transition-transform shadow-inner">
                      {React.cloneElement(item.icon, { size: 24, className: 'text-gold sm:scale-110' })}
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-cinzel font-bold text-white mb-2 sm:mb-2.5 uppercase tracking-wider leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-base leading-relaxed font-normal max-w-[45ch] mx-auto">
                      {item.desc}
                    </p>
                  </div>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SYMPOSIUM HIGHLIGHTS & CORE TECHNICAL PILLARS */}
      <section className="py-12 sm:py-18 md:py-24 lg:py-28 bg-transparent relative z-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-8 sm:mb-14 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm md:text-base font-mono font-semibold uppercase tracking-widest mb-2.5 sm:mb-4">
              <Sparkles size={15} className="text-amber-400 shrink-0 sm:scale-110" />
              <span>Core Technical Pillars</span>
            </div>
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cinzel font-black text-white mb-2.5 sm:mb-4 uppercase tracking-[0.1em] sm:tracking-[0.15em] leading-tight">
              WHY ATTEND ELIXIR'26
            </h3>
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
              Empowering technical acumen through peer competition and institutional excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
              className="h-full flex"
            >
              <Tilt3DCard className="w-full bg-[#0e0f16]/90 backdrop-blur-md p-6 sm:p-8 md:p-9 lg:p-10 rounded-2xl border border-white/10 group hover:border-gold/50 shadow-xl h-full flex flex-col justify-between min-h-[220px] sm:min-h-[260px]">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-gold/30 group-hover:scale-105 transition-transform">
                    <Zap className="text-gold" size={26} />
                  </div>
                  <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-cinzel font-bold mb-2 sm:mb-3 text-white">Innovation</h4>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-normal max-w-[50ch] mx-auto">
                    Pioneering electrical breakthroughs, cutting-edge paper presentations, and novel circuit project displays judged by expert faculty.
                  </p>
                </div>
              </Tilt3DCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
              className="h-full flex"
            >
              <Tilt3DCard className="w-full bg-[#0e0f16]/90 backdrop-blur-md p-6 sm:p-8 md:p-9 lg:p-10 rounded-2xl border border-white/10 group hover:border-gold/50 shadow-xl h-full flex flex-col justify-between min-h-[220px] sm:min-h-[260px]">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-gold/30 group-hover:scale-105 transition-transform">
                    <Trophy className="text-gold" size={26} />
                  </div>
                  <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-cinzel font-bold mb-2 sm:mb-3 text-white">Competitions</h4>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-normal max-w-[50ch] mx-auto">
                    High-stakes competitive tracks including PaperXpose, Tech Spark, QuizTech 360°, and Trace & Find featuring instant cash prize pools.
                  </p>
                </div>
              </Tilt3DCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
              className="h-full flex"
            >
              <Tilt3DCard className="w-full bg-[#0e0f16]/90 backdrop-blur-md p-6 sm:p-8 md:p-9 lg:p-10 rounded-2xl border border-white/10 group hover:border-gold/50 shadow-xl h-full flex flex-col justify-between min-h-[220px] sm:min-h-[260px]">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-gold/30 group-hover:scale-105 transition-transform">
                    <Mic2 className="text-gold" size={26} />
                  </div>
                  <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-cinzel font-bold mb-2 sm:mb-3 text-white">Guest Talks</h4>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-normal max-w-[50ch] mx-auto">
                    Insightful keynote presentations, career mentorship, and technical wisdom delivered by accomplished alumni and industry leaders.
                  </p>
                </div>
              </Tilt3DCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: OFFICIAL SYMPOSIUM COORDINATORS */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#090a0f]/90 relative z-20 border-t border-gold/20 backdrop-blur-md">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
              <ShieldCheck size={14} className="text-gold" />
              <span>Official Student Representatives</span>
            </div>
            <h2 className="text-white font-cinzel text-2xl sm:text-3xl md:text-4xl font-black tracking-wider uppercase mb-2">
              Symposium Coordinators
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-3"></div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mt-3">
              Department of Electrical &amp; Electronics Engineering, Government College of Engineering, Erode
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {OFFICIAL_COORDINATORS.map((coord, idx) => (
              <motion.div
                key={coord.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full flex"
              >
                <div className="w-full bg-[#0e0f16]/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gold/30 hover:border-gold transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(255,215,0,0.15)] flex flex-col justify-center group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1 rounded-full bg-gold/10 border border-gold/40 text-gold text-xs font-black uppercase tracking-wider">
                      {coord.role}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">ELIXIR'26 Core</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white mb-2 group-hover:text-gold transition-colors tracking-wide">
                    {coord.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium group-hover:text-gray-300 transition-colors">
                    Department of EEE, GCE Erode
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: DIGITAL ARCHITECTS */}
      <section className="py-10 sm:py-16 md:py-24 bg-[#090a0f]/85 relative z-20 border-t border-white/10 backdrop-blur-md">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-gold font-cinzel text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-6 sm:mb-12 flex items-center justify-center gap-2">
              <Code2 size={17} className="shrink-0 sm:scale-110" /> Architects of the Digital Stage
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-14 md:gap-20"
          >
            <div className="group text-center min-w-0 sm:min-w-[240px]">
              <h4 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-cinzel font-black text-white group-hover:text-gold transition-colors tracking-wider sm:tracking-widest uppercase">
                Madhan A
              </h4>
              <p className="text-gold text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] mt-1 sm:mt-2">
                Department of EEE
              </p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gold/30 self-center"></div>
            <div className="group text-center min-w-0 sm:min-w-[240px]">
              <h4 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-cinzel font-black text-white group-hover:text-gold transition-colors tracking-wider sm:tracking-widest uppercase">
                Chinnasami M
              </h4>
              <p className="text-gold text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] mt-1 sm:mt-2">
                Department of EEE
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
