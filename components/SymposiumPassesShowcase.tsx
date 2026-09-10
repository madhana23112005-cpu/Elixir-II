import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Check, ArrowRight, Clock, ShieldAlert, Tag, Zap, Gift, Award, Calendar } from 'lucide-react';
import { SYMPOSIUM_PASSES, SymposiumPass } from '../constants';

interface SymposiumPassesShowcaseProps {
  onSelectPass?: (passId: 'NOVA' | 'AURA' | 'ELITE') => void;
  title?: string;
  subtitle?: string;
  showRegisterLink?: boolean;
}

export const SymposiumPassesShowcase: React.FC<SymposiumPassesShowcaseProps> = ({
  onSelectPass,
  title = "SYMPOSIUM CONCLAVE PASSES & OFFERS",
  subtitle = "Choose your gateway to 2 days of state-level technical battles, live workshops, and hardware innovation arenas.",
  showRegisterLink = true
}) => {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Tag size={13} className="text-gold" />
            <span>Official Pass Tiers &amp; Combos</span>
          </div>
          {title && (
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-cinzel font-black text-white uppercase tracking-wider sm:tracking-widest leading-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-base md:text-lg text-gray-300 mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {SYMPOSIUM_PASSES.map((pass: SymposiumPass, idx: number) => {
          const isNova = pass.id === 'NOVA';
          const isAura = pass.id === 'AURA';
          const isElite = pass.id === 'ELITE';

          return (
            <motion.div
              key={pass.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: "easeOut" }}
              className={`relative rounded-[2.5rem] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl border-2 ${
                pass.popular
                  ? 'bg-gradient-to-b from-[#161a29]/95 via-[#0e111d]/95 to-[#080a12]/95 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                  : isElite
                  ? 'bg-gradient-to-b from-[#181024]/95 via-[#100b1a]/95 to-[#090610]/95 border-purple-400/60 shadow-[0_0_35px_rgba(168,85,247,0.25)]'
                  : 'bg-gradient-to-b from-[#0e172a]/95 via-[#09101f]/95 to-[#060a14]/95 border-blue-400/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
              }`}
            >
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isNova 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    : isAura
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                }`}>
                  {pass.badge}
                </span>

                {pass.popular && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] uppercase tracking-widest shadow-md">
                    POPULAR
                  </span>
                )}
                {isElite && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                    BEST VALUE
                  </span>
                )}
              </div>

              {/* Pass Title & Tagline */}
              <div>
                <h4 className="text-2xl sm:text-3xl font-cinzel font-black text-white tracking-widest mb-1 uppercase">
                  {pass.name}
                </h4>
                <p className="text-xs text-gray-300 font-medium mb-5">
                  {pass.tagline}
                </p>

                {/* Price Display */}
                {isNova ? (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-blue-400/40 mb-6">
                    <div className="grid grid-cols-2 gap-2 text-center divide-x divide-white/10">
                      <div className="pr-1.5 flex flex-col justify-between">
                        <div>
                          <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full mb-1 border border-blue-400/30">
                            Single Event
                          </span>
                          <div className="text-2xl sm:text-3xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.4)]">
                            ₹200
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">per person</span>
                        </div>
                        <span className="text-[9px] text-blue-200/80 font-medium mt-1">Workshop OR Expo</span>
                      </div>
                      <div className="pl-2 flex flex-col justify-between relative">
                        <div>
                          <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full mb-1 border border-emerald-400/30">
                            Both Events
                          </span>
                          <div className="text-2xl sm:text-3xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.4)]">
                            ₹300
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">per person</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold mt-1">Save ₹100 Combo</span>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/10 text-center">
                      <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-bold uppercase tracking-wider">
                        ₹200 for 1 Event • ₹300 for Both Events Combo
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.4)]">
                        {pass.priceDisplay}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-semibold">/ person</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 font-bold uppercase tracking-wider mt-1.5">
                      {pass.priceNote}
                    </p>
                  </div>
                )}

                {/* Offer Highlights Box */}
                <div className={`p-4 rounded-2xl mb-6 border ${
                  isNova
                    ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
                    : isAura
                    ? 'bg-amber-500/15 border-amber-400/40 text-amber-100'
                    : 'bg-purple-500/15 border-purple-400/40 text-purple-100'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <Gift size={16} className="shrink-0 mt-0.5 text-gold" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-0.5">Special Offer Details</p>
                      <p className="text-xs leading-relaxed font-medium text-white/90">
                        {pass.offerDetails}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accommodation Notice for Elite Pass */}
                {pass.accommodationNote && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 mb-6 flex items-start gap-2">
                    <ShieldAlert size={16} className="shrink-0 text-red-400 mt-0.5" />
                    <p className="text-[11px] leading-snug font-medium">
                      <span className="font-bold text-red-300">Notice: </span>
                      {pass.accommodationNote}
                    </p>
                  </div>
                )}

                {/* Features List */}
                <div className="space-y-2.5 mb-8">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Pass Inclusions
                  </p>
                  {pass.features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {onSelectPass ? (
                  <button
                    onClick={() => onSelectPass(pass.id)}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                      pass.popular
                        ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                        : isElite
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                        : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(59,130,246,0.4)]'
                    }`}
                  >
                    <span>Select {pass.name}</span>
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </button>
                ) : showRegisterLink ? (
                  <Link
                    to={`/register?pass=${pass.id}`}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02] ${
                      pass.popular
                        ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                        : isElite
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                        : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(59,130,246,0.4)]'
                    }`}
                  >
                    <span>Get {pass.name}</span>
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </Link>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
