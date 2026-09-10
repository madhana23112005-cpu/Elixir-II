import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Send, 
  UserCheck, 
  Bus, 
  Clock, 
  Compass, 
  Info, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink,
  Navigation,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_COORDINATORS, TRANSIT_GUIDE } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-24 bg-gradient-to-b from-[#0a1128] via-[#0d1630] to-[#080d1f] min-h-screen text-slate-100 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-md">
            <Phone size={14} className="text-amber-400" />
            <span>Official Helpdesk & Campus Route</span>
          </div>
          <h2 className="text-amber-400 font-cinzel text-sm sm:text-base tracking-[0.3em] uppercase mb-2">Connect With ELIXIR'26</h2>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-black uppercase tracking-wider text-white">Contact Us</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4"></div>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            Have questions regarding event registrations, schedules, or need help reaching the campus? Reach out directly to our student coordinators or view the official transit guide.
          </p>
        </div>

        {/* ======================================================== */}
        {/* OFFICIAL COORDINATORS SECTION (PROMINENT CARDS) */}
        {/* ======================================================== */}
        <div className="mb-20">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={16} /> Official Student Representatives
              </span>
              <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white mt-1">Official Symposium Coordinators</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Department of EEE, GCE Erode</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {OFFICIAL_COORDINATORS.map((coord, idx) => (
              <div 
                key={coord.name}
                className="bg-slate-900/90 backdrop-blur-xl p-7 rounded-[2rem] border-2 border-amber-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden group hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Accent glow on card */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors pointer-events-none" />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                        {coord.role}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">ELIXIR'26 Core</span>
                    </div>

                    <h4 className="text-xl sm:text-2xl font-cinzel font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {coord.name}
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm mb-6">
                      Department of Electrical and Electronics Engineering, Government College of Engineering, Erode.
                    </p>

                    {coord.phone ? (
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-700 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                            <Phone size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</p>
                            <a 
                              href={`tel:${coord.phone}`} 
                              className="text-base font-mono font-black text-amber-300 hover:underline tracking-wider"
                            >
                              {coord.displayPhone}
                            </a>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-700 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Desk</p>
                            <a 
                              href="mailto:gceelixir26@gmail.com" 
                              className="text-xs font-mono font-bold text-amber-300 hover:underline tracking-wider"
                            >
                              gceelixir26@gmail.com
                            </a>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Active
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {coord.phone ? (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <a
                        href={`tel:${coord.phone}`}
                        className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 text-white py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <Phone size={14} className="text-amber-400" />
                        <span>Call</span>
                      </a>
                      <a
                        href={coord.waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600/90 hover:bg-emerald-500 text-white border-2 border-emerald-400/50 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      >
                        <MessageSquare size={14} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <a
                        href="mailto:gceelixir26@gmail.com"
                        className="w-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 hover:border-amber-400 text-white py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Mail size={14} className="text-amber-400" />
                        <span>Send Official Mail</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* GETTING TO IRT — CAMPUS TRANSIT & BUS GUIDE (BLOG SECTION) */}
        {/* ======================================================== */}
        <div className="mb-20" id="getting-to-irt">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] border-2 border-amber-400/50 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
            
            {/* Header of Transit Blog */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b-2 border-slate-700/80 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <Bus size={15} />
                  <span>Official Transit Blog & Guide</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-cinzel font-black text-white tracking-wide">
                  {TRANSIT_GUIDE.title}
                </h3>
                <p className="text-amber-300 font-medium text-base sm:text-lg mt-1">
                  {TRANSIT_GUIDE.subtitle}
                </p>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Government College of Engineering, Erode (formerly Institute of Road and Transport Technology — IRTT)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/blog/getting-to-irt-bus-guide"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Open Full Article</span>
                  <ExternalLink size={14} />
                </Link>
                <a
                  href="https://maps.google.com/?q=Government+College+of+Engineering+Erode+Chithode"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Navigation size={14} className="text-amber-400" />
                  <span>Google Maps GPS</span>
                </a>
              </div>
            </div>

            {/* Departures Grid */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="text-amber-400" size={20} />
                <h4 className="text-xl sm:text-2xl font-cinzel font-black text-white uppercase tracking-wider">
                  Morning Departures
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* FROM ERODE BUS STAND */}
                <div className="bg-slate-950/90 rounded-2xl border-2 border-slate-700 p-6 shadow-md hover:border-amber-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                        <Compass size={18} />
                      </div>
                      <h5 className="font-cinzel font-black text-amber-300 text-base uppercase tracking-wider">
                        FROM ERODE BUS STAND
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                      Direct Routes
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {TRANSIT_GUIDE.morningDepartures.fromErodeBusStand.map((dep, index) => (
                      <li key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <Bus size={16} className="text-amber-400" />
                          {dep.name}
                        </span>
                        <span className="text-sm font-mono font-black text-yellow-300 px-2.5 py-1 rounded bg-amber-500/20 border border-amber-400/40">
                          {dep.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FROM CHITHODE */}
                <div className="bg-slate-950/90 rounded-2xl border-2 border-slate-700 p-6 shadow-md hover:border-amber-400/50 transition-colors">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
                        <Compass size={18} />
                      </div>
                      <h5 className="font-cinzel font-black text-emerald-300 text-base uppercase tracking-wider">
                        FROM CHITHODE
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                      Nearby Junction
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {TRANSIT_GUIDE.morningDepartures.fromChithode.map((dep, index) => (
                      <li key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <Bus size={16} className="text-emerald-400" />
                          {dep.name}
                        </span>
                        <span className="text-sm font-mono font-black text-emerald-300 px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/40">
                          {dep.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ALSO GOOD TO KNOW */}
            <div className="bg-gradient-to-br from-slate-950 via-[#101b38] to-slate-950 rounded-2xl border-2 border-amber-400/40 p-6 sm:p-8 shadow-inner">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                  <Info size={20} />
                </div>
                <h4 className="text-lg sm:text-xl font-cinzel font-black text-yellow-300 uppercase tracking-widest">
                  ALSO GOOD TO KNOW
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRANSIT_GUIDE.goodToKnow.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                    <span className="text-amber-400 font-bold text-base mt-0.5 select-none">■</span>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE FORM & LOCATION DETAILS */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border-2 border-slate-700 shadow-2xl">
            <h4 className="text-2xl font-cinzel font-black text-white mb-2 uppercase tracking-wide">
              Send Us a Message
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Need clarification on registration payments or workshop prerequisites? Drop your details below.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border-2 border-emerald-400/50 rounded-2xl animate-in zoom-in duration-300">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
                <h5 className="text-xl font-cinzel font-black text-white mb-2">Message Sent!</h5>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Thank you for contacting ELIXIR'26. Our student coordinators (Barath kumar & Bala Muppidathy) have logged your query and will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl border border-slate-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all" 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all" 
                      placeholder="10-digit number" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all" 
                    placeholder="student@example.com" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Subject *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all" 
                    placeholder="e.g. Project Expo Team Query / Workshop Details" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Your Message *</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all resize-none" 
                    placeholder="Write your query in detail..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(251,191,36,0.5)] border-2 border-yellow-200 cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : 'Transmit Query'} <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Location & Contact Channels */}
          <div className="space-y-8">
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2.5rem] border-2 border-slate-700 shadow-xl">
              <h4 className="text-2xl font-cinzel font-black text-amber-300 mb-4 flex items-center gap-2">
                <MapPin className="text-amber-400" /> College Campus Location
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                <strong className="text-white">Department of Electrical and Electronics Engineering</strong><br />
                Government College of Engineering, Erode (formerly IRTT)<br />
                Suriyampalayam Post, Chithode, Erode, Tamil Nadu 638316
              </p>

              {/* Map embed */}
              <div className="h-64 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner">
                <iframe 
                  title="GCE Erode Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.665798485202!2d77.671343715335!3d11.431257491879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba915d3f3f5a6e1%3A0x6b803023e98c9195!2sGovernment%20College%20of%20Engineering%2C%20Erode!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-slate-700">
                <Mail className="text-amber-400 mb-2" size={22} />
                <p className="text-[10px] text-amber-200 uppercase font-black tracking-wider">Official Email</p>
                <a href="mailto:gceelixir26@gmail.com" className="text-white text-sm font-semibold hover:text-amber-300 transition-colors">
                  gceelixir26@gmail.com
                </a>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-slate-700">
                <Instagram className="text-amber-400 mb-2" size={22} />
                <p className="text-[10px] text-amber-200 uppercase font-black tracking-wider">Instagram Handle</p>
                <a href="https://instagram.com/gce_elixir" target="_blank" rel="noreferrer" className="text-white text-sm font-semibold hover:text-amber-300 transition-colors">
                  @gce_elixir
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
