import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, CheckCircle2, Info, Users, Loader2, User, X, Phone, ArrowRight, Calendar, Cpu, Layers } from 'lucide-react';
import { Event, EventCategory } from '../types';
import { EVENTS, SYMPOSIUM_DATES_DISPLAY } from '../constants';

const EventDetailModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isDay1 = event.day === 1;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="bg-gradient-to-b from-[#0A1628]/95 via-[#0D1F3C]/95 to-[#07101E]/95 w-full max-w-2xl rounded-[2.5rem] border border-gold/40 relative shadow-[0_25px_60px_-15px_rgba(10,25,50,0.8),0_0_30px_rgba(212,175,55,0.15)] backdrop-blur-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Prominent High-Visibility Close Button */}
        <button 
          onClick={onClose} 
          aria-label="Close instructions modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-[80] bg-blue-950/90 hover:bg-gold text-gold hover:text-black border border-gold/40 hover:border-gold p-2.5 rounded-full shadow-2xl transition-all duration-200 cursor-pointer flex items-center justify-center group"
        >
          <X size={20} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Modal Header/Image */}
        <div className="relative h-48 flex-shrink-0">
          <img src={event.image} alt="" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/80 to-transparent"></div>
          <div className="absolute bottom-6 left-8 right-16">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isDay1 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {event.dayLabel || (isDay1 ? 'Day 1 • 28/09/2026' : 'Day 2 • 29/09/2026')}
              </span>
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">{event.category}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white uppercase tracking-widest leading-tight">{event.title}</h3>
            {event.slogan && (
              <p className="text-gold/70 text-[10px] italic mt-1 font-medium tracking-widest line-clamp-2">"{event.slogan}"</p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-6 sm:px-8 py-6 custom-scrollbar space-y-6">
          {/* Action Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-950/50 backdrop-blur-md p-3.5 rounded-2xl border border-gold/20">
              <p className="text-[9px] text-blue-300/70 font-bold uppercase mb-1">Registration</p>
              <p className="text-gold font-bold text-xs">{event.feeDisplay || `₹${event.fee} / head`}</p>
            </div>
            <div className="bg-blue-950/50 backdrop-blur-md p-3.5 rounded-2xl border border-gold/20">
              <p className="text-[9px] text-blue-300/70 font-bold uppercase mb-1">Team Size</p>
              <p className="text-white font-bold text-xs flex items-center gap-1.5">
                <Users size={12} className="text-gold" /> 
                {event.maxMembers === 1 ? '1 Member (Solo)' : `Up to ${event.maxMembers} Members`}
              </p>
            </div>
            <div className="bg-blue-950/50 backdrop-blur-md p-3.5 rounded-2xl border border-gold/20">
              <p className="text-[9px] text-blue-300/70 font-bold uppercase mb-1">Date & Time</p>
              <p className="text-white font-bold text-[11px] flex items-center gap-1 truncate"><Clock size={12} className="text-gold" /> {event.timing}</p>
            </div>
            <div className="bg-blue-950/50 backdrop-blur-md p-3.5 rounded-2xl border border-gold/20">
              <p className="text-[9px] text-blue-300/70 font-bold uppercase mb-1">Rewards</p>
              <p className="text-white font-bold text-[11px] flex items-center gap-1 truncate"><Trophy size={12} className="text-gold" /> {event.prize}</p>
            </div>
          </div>

          {/* Official Pass & Amount Breakdown Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-gold/30 relative overflow-hidden shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <div>
                <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 inline-block mb-1">
                  Official Registration Pass Pricing
                </span>
                <h4 className="text-base sm:text-lg font-cinzel font-black text-white uppercase tracking-wider">
                  {isDay1 ? 'NOVA PASS (Day 1 Exclusive)' : 'AURA PASS (Day 2 Arena)'}
                </h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xl sm:text-2xl font-cinzel font-black text-yellow-300 block drop-shadow-[0_0_10px_rgba(253,224,71,0.4)]">
                  {isDay1 ? '₹200 • Combo ₹300' : '₹300'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">per person / delegate</span>
              </div>
            </div>

            <p className="text-xs text-amber-200/90 leading-relaxed font-medium mb-3">
              {event.feeNote || (isDay1 
                ? 'Register for 1 Event at ₹200/person OR participate in Both Events (Workshop + Project Display) for ₹300/person (Save ₹100 combo)!' 
                : '₹300/person includes 1 Technical Event + 1 Non-Technical Event completely FREE!')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2.5 border-t border-white/10 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Morning Refreshments & College Networking Lunch Included</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Official Government Verified Certifications</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                <span>Want full 2-day access? Choose <strong>ELITE PASS (₹450 / person)</strong> for all Day 1 + Day 2 events!</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <section>
            <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-gold pl-3">
               Event Overview
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed antialiased">{event.description}</p>
          </section>

          {/* Rounds Section */}
          {event.rounds && event.rounds.length > 0 && (
            <section>
              <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2 border-l-2 border-gold pl-3">
                 Rounds & Format
              </h4>
              <div className="space-y-4">
                {event.rounds.map((round, idx) => (
                  <div key={idx} className="bg-blue-950/40 border border-gold/15 p-4 rounded-2xl">
                    <h5 className="text-gold font-cinzel font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> {round.name}
                    </h5>
                    <p className="text-slate-300 text-xs leading-relaxed font-normal">{round.details}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rules Section */}
          {event.rules && event.rules.length > 0 && (
            <section>
              <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-gold pl-3">
                 Rules & Regulations
              </h4>
              <div className="bg-blue-950/40 border border-gold/15 p-5 rounded-2xl">
                <ul className="space-y-2.5">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Coordinators Section */}
          {event.coordinators && event.coordinators.length > 0 && (
            <section>
              <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-gold pl-3">
                 Event Coordinators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.coordinators.map((coord, idx) => (
                  <div key={idx} className="bg-blue-950/40 border border-gold/15 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{coord.name}</p>
                      {coord.phone && (
                        <a href={`tel:${coord.phone}`} className="text-[11px] text-gold/80 hover:text-gold font-mono mt-0.5 block">
                          {coord.phone}
                        </a>
                      )}
                    </div>
                    {coord.phone && (
                      <a href={`tel:${coord.phone}`} className="p-2 bg-gold/10 hover:bg-gold/20 text-gold rounded-xl border border-gold/20">
                        <Phone size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer / CTA */}
        <div className="p-6 sm:p-8 bg-[#07101E]/95 border-t border-gold/20 rounded-b-[2.5rem] flex items-center gap-3 sm:gap-4 flex-shrink-0 backdrop-blur-md">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-4 rounded-2xl border border-gold/30 text-gold/80 hover:text-gold hover:border-gold hover:bg-gold/10 transition-all font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            Close
          </button>
          <Link 
            to={`/register?eventId=${event.id}`} 
            className="flex-1 bg-gradient-to-r from-gold via-amber-400 to-gold text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:brightness-110 shadow-lg shadow-gold/20 transition-all glow-gold"
          >
            Register For {event.title} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [dayFilter, setDayFilter] = useState<'all' | 1 | 2>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const fallbackImage = 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=800';

  useEffect(() => {
    setEvents(EVENTS);
    setLoading(false);
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesDay = dayFilter === 'all' || e.day === dayFilter;
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesDay && matchesCategory;
  });

  const categories = ['All', ...Object.values(EventCategory)];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  return (
    <div className="py-24 bg-[#0A0A0A] min-h-screen">
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-4">
            <Calendar size={14} />
            <span>2-Day Event Schedule: 28/09/2026 & 29/09/2026</span>
          </div>
          <h2 className="text-gold font-cinzel text-sm tracking-[0.3em] uppercase mb-3">Choose Your Battlefield</h2>
          <h3 className="text-4xl sm:text-5xl font-cinzel font-bold mb-4 uppercase tracking-widest text-white">Symposium Events</h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
          
          {/* Day Selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-2xl mx-auto">
            <button
              onClick={() => setDayFilter('all')}
              className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                dayFilter === 'all'
                  ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-gold/40 hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setDayFilter(1)}
              className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${
                dayFilter === 1
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <Cpu size={14} />
              <span>Day 1 (28/09): Morning Workshop & Afternoon Project Display (2)</span>
            </button>
            <button
              onClick={() => setDayFilter(2)}
              className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-2 ${
                dayFilter === 2
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Layers size={14} />
              <span>Day 2 (29/09): 4 Tech & 4 Non-Tech Events (8)</span>
            </button>
          </div>

          {/* Pass Quick Selection Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto mb-8">
            <Link
              to="/register?pass=NOVA"
              className="p-3.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/40 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-300 block">Day 1 Pass</span>
                <span className="text-white font-cinzel font-black text-sm group-hover:text-blue-300 transition-colors">NOVA PASS (₹200 • Combo ₹300)</span>
                <span className="text-[10px] text-gray-400 block">Morning Workshop & Expo</span>
              </div>
              <ArrowRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              to="/register?pass=AURA"
              className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 text-left transition-all group flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">Day 2 Pass • Popular</span>
                <span className="text-white font-cinzel font-black text-sm group-hover:text-amber-300 transition-colors">AURA PASS (₹300)</span>
                <span className="text-[10px] text-gray-400 block">1 Tech + 1 Non-Tech FREE</span>
              </div>
              <ArrowRight size={14} className="text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              to="/register?pass=ELITE"
              className="p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/40 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 block">2-Day All Access</span>
                <span className="text-white font-cinzel font-black text-sm group-hover:text-purple-300 transition-colors">ELITE PASS (₹450)</span>
                <span className="text-[10px] text-gray-400 block">All 4 Events • Food Included</span>
              </div>
              <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  categoryFilter === cat 
                    ? 'bg-white text-black border-white shadow-md' 
                    : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Day Context Banner */}
        {dayFilter === 1 && (
          <div className="mb-8 p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-3xl flex items-center justify-between gap-4">
            <div>
              <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-cinzel">Day 1 Schedule • 28/09/2026</p>
              <p className="text-gray-300 text-xs mt-1">Dedicated solely to the Project Display demonstration and Solar 2.0 Technical Workshop.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold whitespace-nowrap">2 Exclusive Events</span>
          </div>
        )}

        {dayFilter === 2 && (
          <div className="mb-8 p-5 bg-amber-950/30 border border-amber-500/30 rounded-3xl flex items-center justify-between gap-4">
            <div>
              <p className="text-amber-400 font-bold text-xs uppercase tracking-wider font-cinzel">Day 2 Schedule • 29/09/2026</p>
              <p className="text-gray-300 text-xs mt-1">Featuring all 4 Technical Battles (PaperXpose, Tech Spark, QuizTech 360°, Trace & Find) and 4 Non-Technical Arenas (CineQuest, Guess My Act, IPL Auction, Card of Chaos).</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold whitespace-nowrap">8 Exciting Events</span>
          </div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-cinzel">No events match the selected filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => {
              const isDay1 = event.day === 1;

              return (
                <div key={event.id} className="group bg-[#111] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col hover:border-gold/50 transition-all duration-500 shadow-2xl relative">
                  
                  {/* Event Image Banner */}
                  <div className="relative h-56 overflow-hidden bg-black/40">
                    <img 
                      src={event.image || fallbackImage} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
                        isDay1 
                          ? 'bg-emerald-500 text-black font-black' 
                          : 'bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-400'
                      }`}>
                        {event.dayLabel || (isDay1 ? 'Day 1 • 28/09' : 'Day 2 • 29/09')}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-gold text-black px-3.5 py-1 text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest">
                      {event.feeDisplay || `₹${event.fee} / Head`}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-gray-300">
                      <span className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Clock size={11} className="text-gold" /> {event.timing}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] text-gold font-black uppercase tracking-[0.2em]">{event.category}</span>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Users size={12} />
                        <span className="text-[10px] font-bold uppercase">{event.maxMembers === 1 ? 'Solo' : `Max ${event.maxMembers}`}</span>
                      </div>
                    </div>

                    <h4 className="text-2xl font-cinzel font-black text-white mb-2 group-hover:text-gold transition-colors uppercase tracking-widest leading-tight">
                      {event.title}
                    </h4>

                    {event.slogan && (
                      <p className="text-[10px] text-gold/70 italic font-mono mb-3 truncate">
                        "{event.slogan}"
                      </p>
                    )}

                    <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="bg-blue-950/40 border border-blue-500/30 text-sky-300 hover:text-white hover:bg-blue-900/60 py-3.5 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Info size={13} className="text-sky-400" />
                        Details
                      </button>
                      <Link 
                        to={`/register?eventId=${event.id}`} 
                        className="bg-gold text-black py-3.5 rounded-xl font-black transition-all text-center text-[10px] uppercase tracking-widest hover:bg-amber-500 glow-gold"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
