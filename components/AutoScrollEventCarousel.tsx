import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Sparkles, Zap, X } from 'lucide-react';
import { Event, EventCategory } from '../types';

interface AutoScrollEventCarouselProps {
  events: Event[];
  onClose?: () => void;
}

export const AutoScrollEventCarousel: React.FC<AutoScrollEventCarouselProps> = ({ events, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollSpeed] = useState(1); // pixels per frame
  const animIdRef = useRef<number | null>(null);

  // Duplicate events array to create seamless infinite wrap
  const displayEvents = [...events, ...events, ...events];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let pos = container.scrollLeft;

    const step = () => {
      if (!isPaused && container) {
        pos += scrollSpeed;
        
        // Single set width calculation: when it exceeds 1/3 of total scroll, wrap back to 0
        const oneThirdWidth = container.scrollWidth / 3;
        if (pos >= oneThirdWidth) {
          pos -= oneThirdWidth;
        }

        container.scrollLeft = pos;
      } else if (container) {
        pos = container.scrollLeft;
      }

      animIdRef.current = requestAnimationFrame(step);
    };

    animIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, [isPaused, scrollSpeed, events.length]);

  const scrollManual = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = 320;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="w-full py-8 sm:py-10 relative overflow-hidden select-none">
      {/* Header with Auto-scroll indicators & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-mono uppercase tracking-widest mb-1.5">
            <Zap size={13} className="text-gold animate-bounce" />
            <span>Active Showcase • 12 Events</span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-cinzel font-bold text-white tracking-wider uppercase">
            SYMPOSIUM <span className="text-gold glow-text-gold">EVENTS</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Hover over any event card to pause auto-scroll • Click to view specific event guidelines
          </p>
        </div>

        {/* Carousel Control Bar */}
        <div className="flex items-center flex-wrap gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-[#121318] border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume Auto Scroll" : "Pause Auto Scroll"}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 hover:bg-gold hover:text-black transition-colors text-gray-300"
            >
              {isPaused ? (
                <>
                  <Play size={11} className="fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause size={11} className="fill-current" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <div className="h-3.5 w-px bg-white/15"></div>

            <button
              onClick={() => scrollManual('left')}
              className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-gold transition-colors"
              title="Scroll Left"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              onClick={() => scrollManual('right')}
              className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-gold transition-colors"
              title="Scroll Right"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <Link
            to="/events"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel font-bold bg-gold/15 hover:bg-gold hover:text-black text-gold border border-gold/40 transition-colors shadow-sm"
          >
            <span>All Events Grid</span>
            <ArrowRight size={13} />
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-mono bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-300 border border-white/20 hover:border-red-500/40 transition-colors cursor-pointer"
              title="Hide Events Showcase"
            >
              <X size={13} />
              <span>Hide</span>
            </button>
          )}
        </div>
      </div>

      {/* Infinite Horizontal Track */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-4 sm:px-6 cursor-grab active:cursor-grabbing scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayEvents.map((ev, index) => (
          <div
            key={`${ev.id}-${index}`}
            className="flex-shrink-0 w-[270px] sm:w-[300px] md:w-[320px] group"
          >
            <div className="h-full bg-gradient-to-b from-[#16171e] via-[#111218] to-[#0c0d12] rounded-2xl border border-white/10 group-hover:border-gold/50 shadow-lg group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden transform group-hover:-translate-y-1.5">
              
              {/* Event Image Banner */}
              <div className="relative h-36 sm:h-40 overflow-hidden bg-black">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-black/60"></div>

                {/* Badges on Image */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shadow-sm ${
                    ev.day === 1 
                      ? 'bg-emerald-500 text-black font-black' 
                      : 'bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-300'
                  }`}>
                    {ev.day === 1 ? 'Day 1 • 28/09' : 'Day 2 • 29/09'}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md border border-gold/40 text-gold text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    {ev.category}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-gold/90 text-black text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Trophy size={10} /> {ev.prize}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-gray-300">
                  <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Clock size={11} className="text-gold" /> {ev.timing}
                  </span>
                  <span className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Users size={11} className="text-gold" /> Max {ev.maxMembers}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-cinzel font-bold text-white group-hover:text-gold transition-colors tracking-wide mb-0.5">
                    {ev.title}
                  </h4>
                  {ev.slogan && (
                    <p className="text-[10px] font-mono text-gold/70 italic mb-1.5 truncate">
                      "{ev.slogan}"
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gold font-semibold">
                    {ev.day === 1 
                      ? 'Fee: ₹200 • Combo ₹300' 
                      : (ev.category === EventCategory.NON_TECHNICAL 
                          ? 'Fee: FREE with Tech • ₹300' 
                          : 'Fee: ₹300 (1 Tech + 1 Free)')}
                  </span>
                  <Link
                    to={`/events`}
                    className="inline-flex items-center gap-1 text-[11px] font-cinzel font-bold text-white group-hover:text-gold hover:underline underline-offset-4"
                  >
                    <span>Details & Rules</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
