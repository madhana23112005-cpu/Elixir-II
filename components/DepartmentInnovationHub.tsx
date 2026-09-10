import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Cpu, 
  Zap, 
  SunMedium, 
  Layers, 
  Sparkles 
} from 'lucide-react';

export const DepartmentInnovationHub: React.FC = () => {
  const [activeLab, setActiveLab] = useState(0);

  const labs = [
    {
      title: "Power Systems & Smart Grid Lab",
      icon: <Zap className="text-gold" size={20} />,
      badge: "Power & Energy",
      desc: "Advanced transmission models, protection switchgear relays, and grid-tied solar simulation setups for electrical power research.",
      highlights: ["Relay Testing Benches", "Power Electronics Inverters", "SCADA Simulation"]
    },
    {
      title: "Embedded Systems & Robotics Studio",
      icon: <Cpu className="text-gold" size={20} />,
      badge: "Hardware & IoT",
      desc: "Hands-on workspace with ARM Cortex kits, FPGA development units, autonomous mobile robotics, and digital storage oscilloscopes.",
      highlights: ["ARM & STM32 Workstations", "FPGA Synthesis", "Autonomous Robotics"]
    },
    {
      title: "Renewable Energy & EV Tech Hub",
      icon: <SunMedium className="text-gold" size={20} />,
      badge: "Clean Tech",
      desc: "Electric vehicle powertrain dynamics, regenerative braking systems, and battery management systems (BMS).",
      highlights: ["BMS Diagnostic Suite", "Solar PV Testing", "BLDC Motor Dyno"]
    },
    {
      title: "Simulation & Computing Suite",
      icon: <Layers className="text-gold" size={20} />,
      badge: "Software & Modeling",
      desc: "High-performance lab supporting MATLAB/Simulink, PSPICE, ETAP, LabVIEW, and Ansys Maxwell solvers.",
      highlights: ["ETAP Power Modeling", "MATLAB Real-Time", "Hardware-in-the-Loop"]
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#070709] via-[#0c0d12] to-[#070709] relative z-20 border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-mono uppercase tracking-widest mb-2"
          >
            <Building2 size={13} />
            <span>Academic Excellence & Heritage</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-white tracking-wider uppercase">
            DEPARTMENT OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-300 to-gold">ELECTRICAL & ELECTRONICS</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed font-light">
            Government College of Engineering, Erode — Shaping visionary electrical engineers through cutting-edge laboratories and technical excellence.
          </p>
        </div>

        {/* Panoramic Campus Display + Interactive Lab Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Cinematic Campus Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div className="relative rounded-2xl overflow-hidden border border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.7)] group h-full min-h-[280px] sm:min-h-[340px]">
              <img
                src="/campus_futuristic.jpg"
                alt="EEE Department Campus - GCE Erode"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/25 to-black/25"></div>

              {/* Top Campus Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold/40 shadow text-[10px] font-mono text-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold uppercase tracking-wider">EEE Department Campus</span>
                </div>
                <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono text-gray-300">
                  GCE Erode
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-1.5 text-gold text-[10px] font-mono uppercase tracking-widest mb-0.5">
                  <Sparkles size={12} />
                  <span>Host of ELIXIR'26 Symposium</span>
                </div>
                <h3 className="text-base sm:text-lg font-cinzel font-bold text-white mb-1">
                  The Innovation Ground for Next-Gen Engineers
                </h3>
                <p className="text-[11px] text-gray-300 leading-relaxed font-light line-clamp-2">
                  Equipped with premier computational suites, electric machinery stations, and embedded labs bridging foundational physics with future technologies.
                </p>
              </div>

              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-gold pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-gold pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-gold pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-gold pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Right: Interactive Lab & Facilities Explorer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-2.5 justify-center"
          >
            <div className="mb-1">
              <span className="text-[10px] font-mono text-gold uppercase tracking-widest">Department Highlights</span>
              <h4 className="text-base font-cinzel font-bold text-white">Specialized Research Laboratories</h4>
            </div>

            {labs.map((lab, idx) => {
              const isSelected = activeLab === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveLab(idx)}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md ${
                    isSelected
                      ? 'bg-gradient-to-r from-gold/15 via-[#181a24] to-[#12141c] border-gold shadow-[0_4px_20px_rgba(212,175,55,0.18)]'
                      : 'bg-[#12131a]/80 border-white/10 hover:border-gold/40 hover:bg-[#161822]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                      isSelected ? 'bg-gold text-black' : 'bg-gold/10 text-gold'
                    }`}>
                      {lab.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gold/80 block">
                        {lab.badge}
                      </span>
                      <h5 className="text-xs sm:text-sm font-cinzel font-bold text-white truncate">
                        {lab.title}
                      </h5>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                    {lab.desc}
                  </p>

                  {/* Highlights Tags */}
                  {isSelected && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/10">
                      {lab.highlights.map((h, i) => (
                        <span 
                          key={i} 
                          className="bg-black/60 text-gold text-[9px] font-mono px-2 py-0.5 rounded border border-gold/30"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* Department Metrics Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#101118]/90 border border-white/10 rounded-xl p-3.5 text-center shadow">
            <span className="text-xl sm:text-2xl font-mono font-bold text-gold">1984</span>
            <p className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest mt-0.5">Founding Legacy</p>
          </div>
          <div className="bg-[#101118]/90 border border-white/10 rounded-xl p-3.5 text-center shadow">
            <span className="text-xl sm:text-2xl font-mono font-bold text-gold">12</span>
            <p className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest mt-0.5">Symposium Events</p>
          </div>
          <div className="bg-[#101118]/90 border border-white/10 rounded-xl p-3.5 text-center shadow">
            <span className="text-xl sm:text-2xl font-mono font-bold text-gold">₹15K+</span>
            <p className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest mt-0.5">Cash Prize Pool</p>
          </div>
          <div className="bg-[#101118]/90 border border-white/10 rounded-xl p-3.5 text-center shadow">
            <span className="text-xl sm:text-2xl font-mono font-bold text-gold">100%</span>
            <p className="text-[10px] font-cinzel text-gray-400 uppercase tracking-widest mt-0.5">Certificates</p>
          </div>
        </div>

      </div>
    </section>
  );
};
