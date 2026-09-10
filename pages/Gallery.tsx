import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Maximize2, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Eye,
  Instagram
} from 'lucide-react';

interface GalleryItem {
  id: number;
  url: string;
  category: string;
  title: string;
  subtitle: string;
  featured?: boolean;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    url: 'https://drive.google.com/uc?export=view&id=1pTzLRF9VGa-gnrNbQRTBBb728PwBqYTL',
    category: 'Official Poster',
    title: "ELIXIR'26: Main Event at its Core",
    subtitle: 'The flagship visual heraldry of the National Symposium',
    featured: true
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    category: 'Highlights',
    title: 'Technical Presentations',
    subtitle: 'Scholarly papers presented by brightest engineering minds'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    category: 'Innovation',
    title: 'Project Exhibition',
    subtitle: 'Live hardware prototypes and automated IoT circuits'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    category: 'Hardware',
    title: 'Circuit Design & Debugging',
    subtitle: 'Real-time oscilloscope testing and breadboard troubleshooting'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=1200',
    category: 'Workshop',
    title: 'Collaborative Learning Hub',
    subtitle: 'Hands-on practical sessions guided by faculty experts'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    category: 'Competitions',
    title: 'Tech Spark Arena',
    subtitle: 'Thrilling pen-and-paper technical image and situational challenges'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
    category: 'Highlights',
    title: 'Grand Inauguration',
    subtitle: 'Ceremonial lamp lighting and keynote presidential addresses'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    category: 'Competitions',
    title: 'Trace & Find Challenge',
    subtitle: 'Circuit diagnostics, assertion reasoning, and fault isolation showdown'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200',
    category: 'Innovation',
    title: 'Renewable Power Showcase',
    subtitle: 'Innovative solar and microgrid efficiency demonstrations'
  }
];

const CATEGORIES = ['All', 'Official Poster', 'Highlights', 'Innovation', 'Hardware', 'Workshop', 'Competitions'];

// LazyImage Component with IntersectionObserver & Smooth Fade-in
const LazyImageCard: React.FC<{
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}> = ({ item, index, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Use IntersectionObserver to trigger loading when the element approaches the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '180px 0px', // Preload image slightly before it enters viewport
        threshold: 0.01
      }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      id={`gallery-card-${item.id}`}
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 3) * 0.1, 
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      onClick={() => onSelect(item)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border transition-all duration-500 bg-[#0d0e14] shadow-xl hover:shadow-[0_10px_35px_rgba(212,175,55,0.18)] ${
        item.featured 
          ? 'border-gold/50 md:col-span-2 shadow-[0_0_30px_rgba(212,175,55,0.12)]' 
          : 'border-white/10 hover:border-gold/40'
      }`}
    >
      {/* Featured Badge */}
      {item.featured && (
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 bg-gradient-to-r from-amber-400 via-gold to-amber-500 text-black text-[10px] sm:text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-[0_2px_15px_rgba(212,175,55,0.5)]">
          <Sparkles size={12} className="shrink-0" />
          <span>Featured Media</span>
        </div>
      )}

      {/* Shimmer Placeholder Skeleton */}
      <div 
        className={`absolute inset-0 z-0 bg-gradient-to-r from-[#12131a] via-[#1a1c26] to-[#12131a] bg-[length:200%_100%] transition-opacity duration-700 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-pulse'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center">
            <Camera size={20} className="text-gold/40 animate-spin" />
          </div>
        </div>
      </div>

      {/* Media Container */}
      <div className={`relative w-full overflow-hidden ${item.featured ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[4/3]'}`}>
        {isInView && (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200';
              setIsLoaded(true);
            }}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100 filter-none' : 'opacity-0 scale-95 blur-sm'
            }`}
          />
        )}

        {/* Ambient Darkened Gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

        {/* Floating Quick Action Button */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="p-2.5 rounded-full bg-black/60 border border-gold/40 text-gold backdrop-blur-md shadow-lg hover:bg-gold hover:text-black transition-colors">
            <Maximize2 size={16} />
          </div>
        </div>

        {/* Captions Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-7 flex flex-col justify-end">
          <div className="transform transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-gold/20 border border-gold/40 text-gold text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                {item.category}
              </span>
            </div>

            <h4 className="text-white font-cinzel font-bold text-lg sm:text-xl md:text-2xl leading-snug drop-shadow-md group-hover:text-amber-200 transition-colors">
              {item.title}
            </h4>

            <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mt-1 font-normal opacity-85 group-hover:opacity-100 transition-opacity">
              {item.subtitle}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-gold text-[11px] font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye size={13} />
              <span>Tap to View Full Screen</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const filteredImages = selectedCategory === 'All' 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter((img) => img.category === selectedCategory);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalItem) return;

      if (e.key === 'Escape') {
        setActiveModalItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = filteredImages.findIndex((item) => item.id === activeModalItem.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setActiveModalItem(filteredImages[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = filteredImages.findIndex((item) => item.id === activeModalItem.id);
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setActiveModalItem(filteredImages[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem, filteredImages]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModalItem) return;
    const currentIndex = filteredImages.findIndex((item) => item.id === activeModalItem.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setActiveModalItem(filteredImages[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeModalItem) return;
    const currentIndex = filteredImages.findIndex((item) => item.id === activeModalItem.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setActiveModalItem(filteredImages[prevIndex]);
  };

  return (
    <div className="py-20 sm:py-24 md:py-28 bg-[#070709] text-white min-h-screen relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-radial from-amber-500/10 via-transparent to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10 sm:mb-14 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-mono font-semibold uppercase tracking-widest mb-4">
            <Camera size={15} className="text-gold" />
            <span>Visual Chronicle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-black uppercase tracking-wider text-white mb-4 leading-tight">
            SYMPOSIUM GALLERY
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />

          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Relive memorable symposium highlights, innovative project showcases, and intense technical competition rounds at GCE Erode.
          </p>
        </motion.div>

        {/* Category Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-gold to-amber-500 text-black border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-[#12131b]/80 text-gray-300 border-white/10 hover:border-gold/40 hover:text-white backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Active Category Meta Counter */}
        <div className="flex items-center justify-between px-2 mb-6 text-xs sm:text-sm text-gray-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers size={14} className="text-gold" />
            Showing <strong className="text-gold">{filteredImages.length}</strong> photo{filteredImages.length === 1 ? '' : 's'}
          </span>
          <span className="text-gray-500">Scroll to explore</span>
        </div>

        {/* Responsive Grid with Scroll-Triggered Lazy Loading & Staggered Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 md:gap-8">
          {filteredImages.map((img, idx) => (
            <LazyImageCard 
              key={img.id} 
              item={img} 
              index={idx}
              onSelect={(selected) => setActiveModalItem(selected)}
            />
          ))}
        </div>

        {/* Bottom Social Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-24 text-center"
        >
          <div className="inline-block w-full max-w-2xl p-7 sm:p-10 bg-[#0e0f17]/85 border border-white/10 hover:border-gold/40 rounded-3xl relative overflow-hidden backdrop-blur-md shadow-2xl transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.08)_0%,transparent_75%)] pointer-events-none" />
            <p className="relative z-10 text-gray-300 text-sm sm:text-base leading-relaxed italic font-cinzel">
              "Reliving the technical grandeur of past symposiums. Every frame tells a story of an engineer finding their spark."
            </p>
            <div className="mt-6 relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              <div className="hidden sm:block h-px w-12 bg-gold/30" />
              <a 
                href="https://instagram.com/gce_elixir" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black font-cinzel font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              >
                <Instagram size={16} />
                <span>Follow @gce_elixir</span>
              </a>
              <div className="hidden sm:block h-px w-12 bg-gold/30" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              aria-label="Close Preview"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-black/60 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95"
            >
              <X size={22} />
            </button>

            {/* Left Nav Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Nav Button */}
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95"
            >
              <ChevronRight size={24} />
            </button>

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#0d0e15] border border-gold/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col"
            >
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[68vh]">
                <img
                  src={activeModalItem.url}
                  alt={activeModalItem.title}
                  className="w-full h-full object-contain max-h-[68vh] transition-all duration-300 select-none"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>

              {/* Modal Metadata Footer */}
              <div className="p-4 sm:p-6 bg-[#0e0f17] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-block bg-gold/20 border border-gold/40 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                      {activeModalItem.category}
                    </span>
                    {activeModalItem.featured && (
                      <span className="inline-flex items-center gap-1 bg-gold text-black text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                        <Sparkles size={11} /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-cinzel font-bold text-white leading-snug">
                    {activeModalItem.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mt-0.5 font-normal">
                    {activeModalItem.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-mono text-gray-400">
                    {filteredImages.findIndex(i => i.id === activeModalItem.id) + 1} of {filteredImages.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-gold"
                      aria-label="Previous"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-gold"
                      aria-label="Next"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
