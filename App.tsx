import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Trophy, 
  Calendar, 
  Users, 
  Briefcase, 
  Camera, 
  Heart, 
  CheckCircle, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  Search, 
  BookOpen, 
  Newspaper, 
  AlertCircle,
  Home as HomeIcon,
  Sparkles,
  ArrowRight,
  Zap,
  Bus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Registration, RegistrationStatus } from './types';
import { 
  getRegistrations, 
  addRegistration as storeAddRegistration, 
  updateRegistrationStatus as storeUpdateRegistrationStatus, 
  deleteRegistration as storeDeleteRegistration,
  subscribeToRegistrations,
  fetchRegistrationsFromCloud 
} from './storage';
import { CinematicIntro } from './components/CinematicIntro';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminBlog from './pages/AdminBlog';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Schedule from './pages/Schedule';
import Speakers from './pages/Speakers';
import Sponsors from './pages/Sponsors';

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }: { children?: React.ReactNode, isAuthenticated: boolean }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: BookOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Contact Us', path: '/contact', icon: Phone },
    { name: 'Check Status', path: '/verify', icon: CheckCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 hover:bg-black/30 backdrop-blur-xl border-b border-gold/20 shadow-[0_4px_30px_rgba(0,0,0,0.15)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with Animation and Radiant Gold Glow */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-300"
            >
              <div className="relative flex items-center justify-center">
                {/* Luminous Animated Aura */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold/40 via-amber-400/30 to-gold/40 rounded-xl blur-md opacity-75 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />
                
                {/* Text with Radiant Gold Sheen and High-End Typography */}
                <span className="relative font-cinzel text-2xl sm:text-[1.75rem] lg:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBEA] via-[#FFD700] to-[#E5A700] drop-shadow-[0_2px_14px_rgba(255,215,0,0.55)] select-none">
                  ELIXIR'26
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-3 xl:space-x-4">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm lg:text-base font-bold tracking-wide transition-all duration-300 ${
                      active 
                        ? 'text-gold bg-gold/15 border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]' 
                        : 'text-gray-200 hover:text-gold hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Register Button with Shimmer Sweep */}
              <Link
                to="/register"
                className="relative group overflow-hidden bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-sm lg:text-base tracking-wider uppercase transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.8)] border border-yellow-200 active:scale-95 ml-2"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="text-slate-950 fill-slate-950" />
                  <span className="font-black">Register</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button with Glowing Pill */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
              className="relative p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 active:scale-95"
            >
              {isOpen ? <X size={24} className="text-gold" /> : <Menu size={24} className="text-gold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Bar Slide with Rich Warm Glass Aesthetics & Smooth Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-[#121118]/90 backdrop-blur-2xl border-b border-gold/30 shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.15)]"
          >
            {/* Ambient decorative glowing light beam & gold gradient */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-52 h-20 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

            <div className="px-4 pt-4 pb-6 space-y-2 relative z-10">
              {/* Header indicator inside drawer */}
              <div className="flex items-center justify-between gap-2 px-2 py-1.5 mb-2 border-b border-white/10 text-[10px] sm:text-[11px] font-cinzel text-amber-200/80 tracking-wider sm:tracking-widest uppercase">
                <span className="truncate font-semibold">GCE Erode · Dept of EEE</span>
                <span className="flex items-center gap-1.5 text-gold font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  28/09 & 29/09/2026
                </span>
              </div>

              {/* Navigation Items with Animated Staggered Reveal */}
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.25 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-gold/25 via-amber-500/15 to-gold/5 text-gold border border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'text-gray-200 hover:text-gold hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-lg transition-colors ${
                          active ? 'bg-gold/20 text-gold' : 'bg-white/5 text-gray-400 group-hover:text-gold group-hover:bg-gold/10'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <span className="font-semibold tracking-wide">{item.name}</span>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`${active ? 'text-gold' : 'text-gray-500'} transition-transform group-hover:translate-x-1`} 
                      />
                    </Link>
                  </motion.div>
                );
              })}

              {/* Animated Register Button with Glow & Shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                className="pt-3"
              >
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="group relative flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 px-4 py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_4px_30px_rgba(251,191,36,0.6)] hover:shadow-[0_4px_40px_rgba(251,191,36,0.8)] border border-yellow-200 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden text-sm"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                  <Sparkles size={18} className="text-slate-950 fill-slate-950" />
                  <span className="font-black">Register Now</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                </Link>
              </motion.div>

              {/* Quick Contact & Social links at bottom of drawer */}
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 px-2">
                <span>Need Assistance?</span>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://instagram.com/gce_elixir" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold transition-colors"
                  >
                    <Instagram size={15} />
                  </a>
                  <a 
                    href="mailto:gceelixir26@gmail.com" 
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold transition-colors"
                  >
                    <Mail size={15} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer: React.FC<{ onReplayIntro?: () => void }> = ({ onReplayIntro }) => (
  <footer className="bg-transparent border-t border-gold/10 pt-16 pb-8 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <h2 className="font-cinzel text-3xl font-bold text-gold glow-text-gold tracking-widest">ELIXIR'26</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Organized by Department of EEE, Government College of Engineering, Erode. The premier technical symposium celebrating engineering excellence.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com/gce_elixir" target="_blank" className="p-2 bg-gray-900 rounded-full hover:bg-gold hover:text-black transition-colors">
              <Instagram size={20} />
            </a>
            <a href="mailto:gceelixir26@gmail.com" className="p-2 bg-gray-900 rounded-full hover:bg-gold hover:text-black transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-gold font-bold mb-6 flex items-center gap-2">
            <ChevronRight size={18} /> Quick Links
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/events" className="hover:text-gold transition-colors">Events</Link></li>
            <li><Link to="/contact" className="text-amber-300 font-semibold hover:text-gold transition-colors flex items-center gap-1.5"><Bus size={14} /> Contact Us & Bus Guide</Link></li>
            <li><Link to="/verify" className="hover:text-gold transition-colors">Check Status</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">Symposium Blog</Link></li>
            {onReplayIntro && (
              <li>
                <button 
                  onClick={onReplayIntro} 
                  className="hover:text-gold transition-colors text-left flex items-center gap-1.5 cursor-pointer text-amber-300/80 hover:text-amber-300"
                >
                  <Sparkles size={13} className="text-gold" />
                  <span>Watch Cinematic Intro</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-gold font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard size={18} /> Admin Panel
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link to="/admin" className="hover:text-gold transition-colors">Participants Manager</Link></li>
            <li><Link to="/login" className="hover:text-gold transition-colors">Admin Login</Link></li>
            <li><Link to="/admin/blog" className="hover:text-gold transition-colors">Manage Blog Posts</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-gold font-bold mb-6 flex items-center gap-2">
            <MapPin size={18} /> Reach Us
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Government College of Engineering, Erode<br />
            (Formerly IRTT) • Chithode - 638316<br />
          </p>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Secretary</span>
              <a href="tel:6380616416" className="flex items-center gap-1.5 text-sm text-gold font-mono font-bold hover:underline">
                <Phone size={13} /> Barath kumar: 6380616416
              </a>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Co-ordinator</span>
              <a href="tel:8015172974" className="flex items-center gap-1.5 text-sm text-gold font-mono font-bold hover:underline">
                <Phone size={13} /> Bala Muppidathy: 8015172974
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-gold pt-1">
              <Mail size={14} /> gceelixir26@gmail.com
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} ELIXIR'26 EEE - GCE Erode. All Rights Reserved.
      </div>
    </div>
  </footer>
);

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // If intro is active on initial load/mount, ensure router points directly to Home ('/')
  useEffect(() => {
    if (showIntro) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
      if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
        window.location.hash = '#/';
      }
    }
  }, [showIntro, location.pathname, navigate]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    // Explicitly transition cleanly to Home page ('/') and reset scroll & hash
    navigate('/', { replace: true });
    if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
      window.location.hash = '#/';
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [navigate]);

  const handleReplayIntro = useCallback(() => {
    setShowIntro(true);
    navigate('/', { replace: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [navigate]);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('elixir_admin_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('elixir_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('elixir_admin_auth');
  };

  const fetchRegistrations = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchRegistrationsFromCloud();
      setRegistrations(data);
    } catch (err: any) {
      console.error('Error fetching registrations:', err);
      setFetchError(err.message || "Failed to load registrations.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
      // Subscribe to reactive local storage updates
      const unsubscribe = subscribeToRegistrations((updatedList) => {
        setRegistrations(updatedList);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [fetchRegistrations, isAuthenticated]);

  const addRegistration = async (reg: Registration) => {
    await storeAddRegistration(reg);
    setRegistrations(getRegistrations());
  };

  const updateRegistrationStatus = async (id: string, status: RegistrationStatus) => {
    await storeUpdateRegistrationStatus(id, status);
    setRegistrations(getRegistrations());
  };

  const deleteRegistration = async (id: string) => {
    await storeDeleteRegistration(id);
    setRegistrations(getRegistrations());
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-14 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/register" element={<Register onSubmit={addRegistration} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/sponsors" element={<Sponsors />} />
            
            {/* Admin Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Admin 
                    registrations={registrations} 
                    onUpdateStatus={updateRegistrationStatus}
                    onDeleteRegistration={deleteRegistration}
                    onRefresh={fetchRegistrations}
                    fetchError={fetchError}
                    isLoading={isLoading}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminBlog />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer onReplayIntro={handleReplayIntro} />
        <Link to="/register" className="fixed bottom-6 right-6 z-40 bg-gold text-black p-4 rounded-full shadow-2xl glow-gold transform transition-transform hover:scale-110">
          <Users size={24} />
        </Link>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
