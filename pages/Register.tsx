import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Users, CheckCircle, ArrowRight, ArrowLeft, Download, 
  Info, Loader2, Star, User, UserPlus, WifiOff, AlertCircle, 
  Sparkles, Tag, Gift, ShieldAlert, Calendar, Clock, Trophy, Layers, Check,
  ExternalLink, Copy, Share2, MessageCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { EventCategory, Registration, RegistrationStatus, PassType, Event } from '../types';
import { EVENTS, SYMPOSIUM_PASSES, SymposiumPass, getEventWhatsAppData, EVENT_WHATSAPP_LINKS, EventWhatsAppInfo } from '../constants';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
  </svg>
);

interface RegisterProps {
  onSubmit: (registration: Registration) => Promise<void>;
}

type PassKey = 'NOVA' | 'AURA' | 'ELITE';

const Register: React.FC<RegisterProps> = ({ onSubmit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const passRef = useRef<HTMLDivElement>(null);

  // Steps: 1: Pass Selection, 2: Event Selection, 3: Participant Profiles, 4: Payment, 5: Ticket
  const [step, setStep] = useState(1);
  const [selectedPass, setSelectedPass] = useState<PassKey | null>(null);
  const [preselectedEvent, setPreselectedEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    email: '',
    phone: '',
    selectedEvents: [] as string[],
    teamMembers: [] as string[],
    transactionId: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    transactionId: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredData, setRegisteredData] = useState<Registration | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedWaId, setCopiedWaId] = useState<string | null>(null);

  const registeredWhatsAppGroups = useMemo(() => {
    if (!registeredData) return [];
    const list: EventWhatsAppInfo[] = [];
    const seen = new Set<string>();

    // 1. Check formData.selectedEvents IDs
    if (formData.selectedEvents && formData.selectedEvents.length > 0) {
      formData.selectedEvents.forEach(id => {
        const data = getEventWhatsAppData(id);
        if (data && !seen.has(data.id)) {
          seen.add(data.id);
          list.push(data);
        }
      });
    }

    // 2. Check registeredData.events titles
    if (registeredData.events && registeredData.events.length > 0) {
      registeredData.events.forEach(evName => {
        const data = getEventWhatsAppData(evName);
        if (data && !seen.has(data.id)) {
          seen.add(data.id);
          list.push(data);
        }
      });
    }

    return list;
  }, [registeredData, formData.selectedEvents]);

  const upiId = "midhun73272@oksbi";

  // Selected events data
  const selectedEventsData = useMemo(() => 
    EVENTS.filter(e => formData.selectedEvents.includes(e.id)), 
  [formData.selectedEvents]);

  // Derived counts for pass offers
  const day1SelectedCount = useMemo(() => 
    selectedEventsData.filter(e => e.day === 1).length,
  [selectedEventsData]);

  const techSelectedCount = useMemo(() => 
    selectedEventsData.filter(e => e.category === EventCategory.TECHNICAL && e.day === 2).length,
  [selectedEventsData]);

  const nonTechSelectedCount = useMemo(() => 
    selectedEventsData.filter(e => e.category === EventCategory.NON_TECHNICAL && e.day === 2).length,
  [selectedEventsData]);

  // Base price per person based on Pass Type and Offer Logic
  // NOVA: 1 event = ₹200, 2 events = ₹300
  // AURA: ₹300 (1 tech + 1 non-tech free)
  // ELITE: ₹450 (Day 1 Workshop & Project + Day 2 1 tech & 1 non-tech)
  const basePricePerHead = useMemo(() => {
    if (!selectedPass) return 0;

    if (selectedPass === 'NOVA') {
      if (day1SelectedCount >= 2) return 300;
      if (day1SelectedCount === 1) return 200;
      return 0;
    }

    if (selectedPass === 'AURA') {
      if (formData.selectedEvents.length > 0) return 300;
      return 300;
    }

    if (selectedPass === 'ELITE') {
      return 450;
    }

    return 0;
  }, [selectedPass, day1SelectedCount, formData.selectedEvents.length]);

  const activeMembersCount = useMemo(() => 
    formData.teamMembers.filter(m => m && m.trim() !== '').length,
  [formData.teamMembers]);

  const totalFee = useMemo(() => 
    (1 + activeMembersCount) * basePricePerHead,
  [activeMembersCount, basePricePerHead]);

  const maxTeamSize = useMemo(() => {
    if (selectedEventsData.length === 0) return 1;
    return Math.max(1, ...selectedEventsData.map(e => e.maxMembers || 1));
  }, [selectedEventsData]);

  // Initialize from query params (?pass=NOVA or ?eventId=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const passParam = params.get('pass')?.toUpperCase() as PassKey;
    const eventIdParam = params.get('eventId');

    if (eventIdParam) {
      const targetEvent = EVENTS.find(e => e.id === eventIdParam);
      if (targetEvent) {
        setPreselectedEvent(targetEvent);
        if (targetEvent.day === 1) {
          setSelectedPass('NOVA');
          setFormData(prev => ({
            ...prev,
            selectedEvents: [eventIdParam]
          }));
        } else {
          setSelectedPass('AURA');
          setFormData(prev => ({
            ...prev,
            selectedEvents: [eventIdParam]
          }));
        }
      }
      setStep(1);
    } else if (passParam && ['NOVA', 'AURA', 'ELITE'].includes(passParam)) {
      handleSelectPass(passParam, false);
      setPreselectedEvent(null);
      setStep(1);
    } else {
      setPreselectedEvent(null);
      setStep(1);
    }
  }, [location.search]);

  // Pass Selection Handler: automatically applies offers & routes to event selection
  const handleSelectPass = (passKey: PassKey, advanceToStep2: boolean = true) => {
    setSelectedPass(passKey);

    if (passKey === 'NOVA') {
      // Default to Workshop or first event if none selected
      setFormData(prev => {
        const filtered = prev.selectedEvents.filter(id => {
          const ev = EVENTS.find(e => e.id === id);
          return ev && ev.day === 1;
        });
        const initial = filtered.length > 0 ? filtered : ['workshop'];
        return { ...prev, selectedEvents: initial };
      });
    } else if (passKey === 'AURA') {
      // Day 2 pass: filter out Day 1 events
      setFormData(prev => {
        const filtered = prev.selectedEvents.filter(id => {
          const ev = EVENTS.find(e => e.id === id);
          return ev && ev.day === 2;
        });
        return { ...prev, selectedEvents: filtered };
      });
    } else if (passKey === 'ELITE') {
      // Overall pass: Allow user to manually select Day 1 (1 event or both) and Day 2 events
      // Retain existing selections without forcing any events
      setFormData(prev => ({
        ...prev
      }));
    }

    if (advanceToStep2) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone.replace(/\s/g, ''));

  useEffect(() => {
    let emailErr = '';
    let phoneErr = '';
    let transErr = '';
    
    if (formData.email && !validateEmail(formData.email)) emailErr = 'Invalid email address format';
    if (formData.phone && !validatePhone(formData.phone)) phoneErr = 'Phone number must be 10 digits';
    
    if (formData.transactionId && formData.transactionId.length > 0 && formData.transactionId.length < 12) {
      transErr = 'Transaction ID must be 12 digits';
    }

    setErrors({ email: emailErr, phone: phoneErr, transactionId: transErr });
  }, [formData.email, formData.phone, formData.transactionId]);

  // Event toggle handler respecting pass rules
  const toggleEvent = (id: string) => {
    const targetEvent = EVENTS.find(e => e.id === id);
    if (!targetEvent) return;

    setFormData(prev => {
      const isAlreadySelected = prev.selectedEvents.includes(id);
      let newSelected: string[] = [];

      if (selectedPass === 'NOVA') {
        // Can toggle Day 1 events
        if (targetEvent.day !== 1) return prev;
        newSelected = isAlreadySelected 
          ? prev.selectedEvents.filter(eid => eid !== id)
          : [...prev.selectedEvents, id];
      } else if (selectedPass === 'AURA') {
        // Day 2 pass: 1 Tech + 1 Non-Tech
        if (targetEvent.day !== 2) return prev;

        if (isAlreadySelected) {
          newSelected = prev.selectedEvents.filter(eid => eid !== id);
        } else {
          // If selecting technical, replace any existing technical event
          if (targetEvent.category === EventCategory.TECHNICAL) {
            const nonTechs = prev.selectedEvents.filter(eid => {
              const ev = EVENTS.find(e => e.id === eid);
              return ev && ev.category === EventCategory.NON_TECHNICAL;
            });
            newSelected = [...nonTechs, id];
          } else {
            // If selecting non-technical, replace any existing non-technical event
            const techs = prev.selectedEvents.filter(eid => {
              const ev = EVENTS.find(e => e.id === eid);
              return ev && ev.category === EventCategory.TECHNICAL;
            });
            newSelected = [...techs, id];
          }
        }
      } else if (selectedPass === 'ELITE') {
        // Elite pass: user manually selects Day 1 (1 event or both) + Day 2 (1 Tech & 1 Non-Tech)
        if (targetEvent.day === 1) {
          // Freely toggle Day 1 event (user can pick 1 or both)
          newSelected = isAlreadySelected 
            ? prev.selectedEvents.filter(eid => eid !== id)
            : [...prev.selectedEvents, id];
        } else if (targetEvent.day === 2) {
          if (isAlreadySelected) {
            newSelected = prev.selectedEvents.filter(eid => eid !== id);
          } else {
            if (targetEvent.category === EventCategory.TECHNICAL) {
              // Replace any existing Day 2 technical event
              const withoutDay2Tech = prev.selectedEvents.filter(eid => {
                const ev = EVENTS.find(e => e.id === eid);
                return !(ev && ev.day === 2 && ev.category === EventCategory.TECHNICAL);
              });
              newSelected = [...withoutDay2Tech, id];
            } else {
              // Replace any existing Day 2 non-technical event
              const withoutDay2NonTech = prev.selectedEvents.filter(eid => {
                const ev = EVENTS.find(e => e.id === eid);
                return !(ev && ev.day === 2 && ev.category === EventCategory.NON_TECHNICAL);
              });
              newSelected = [...withoutDay2NonTech, id];
            }
          }
        }
      } else {
        newSelected = isAlreadySelected 
          ? prev.selectedEvents.filter(eid => eid !== id)
          : [...prev.selectedEvents, id];
      }

      const newSelectedEvents = EVENTS.filter(e => newSelected.includes(e.id));
      const newMax = newSelected.length > 0 
        ? Math.max(1, ...newSelectedEvents.map(e => e.maxMembers || 1)) 
        : 1;

      const adjustedMembers = prev.teamMembers.slice(0, Math.max(0, newMax - 1));
      while(adjustedMembers.length < Math.max(0, newMax - 1)) adjustedMembers.push('');

      return {
        ...prev,
        selectedEvents: newSelected,
        teamMembers: adjustedMembers
      };
    });
  };

  const handleNext = () => {
    setSubmitError(null);
    if (step === 1 && !selectedPass) return;
    if (step === 2 && formData.selectedEvents.length === 0) return;
    if (step === 3) {
      if (!formData.name || !formData.college || !formData.department || !formData.email || !formData.phone || errors.email || errors.phone) return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSubmitError(null);
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transactionId || formData.transactionId.length !== 12) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const regId = `ELX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const activePassInfo = selectedPass ? SYMPOSIUM_PASSES.find(p => p.id === selectedPass) : null;
      
      const newReg: Registration = {
        id: regId,
        name: formData.name.trim(),
        college: formData.college.trim(),
        department: formData.department.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        passType: selectedPass ? `${selectedPass} PASS` : 'CONCLAVE PASS',
        passKey: selectedPass || undefined,
        daysAttended: activePassInfo ? activePassInfo.daysLabel : (selectedPass === 'ELITE' ? 'Day 1 & Day 2 • 28 & 29/09/2026' : selectedPass === 'NOVA' ? 'Day 1 Only • 28/09/2026' : 'Day 2 Only • 29/09/2026'),
        passDetails: activePassInfo ? {
          passId: activePassInfo.id,
          passName: activePassInfo.name,
          badge: activePassInfo.badge,
          tagline: activePassInfo.tagline,
          daysLabel: activePassInfo.daysLabel,
          agenda: activePassInfo.agenda,
          priceDisplay: activePassInfo.priceDisplay,
          priceNote: activePassInfo.priceNote,
          offerDetails: activePassInfo.offerDetails,
          selectedEventsCount: formData.selectedEvents.length
        } : undefined,
        teamMembers: formData.teamMembers.filter(m => m && m.trim() !== ''),
        events: formData.selectedEvents.map(id => EVENTS.find(ev => ev.id === id)?.title || id),
        totalFee,
        transactionId: formData.transactionId.trim(),
        status: RegistrationStatus.PENDING,
        timestamp: new Date().toISOString()
      };
      
      await onSubmit(newReg);
      setRegisteredData(newReg);
      localStorage.setItem('elixir_user_email', newReg.email);
      setStep(5);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setSubmitError(err.message || "Network Error: Could not connect to the database. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!passRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(passRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `ELIXIR_${registeredData?.passType?.replace(/\s+/g, '_') || 'PASS'}_${registeredData?.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert("Capture failed. Please take a screenshot.");
    } finally {
      setDownloading(false);
    }
  };

  const upiUri = `upi://pay?pa=${upiId}&pn=ELIXIR%20Symposium&am=${totalFee}&cu=INR&tn=ELIXIR%20${selectedPass || 'Pass'}%20Reg`;
  const paymentQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
  const passQrUrl = registeredData ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=000&color=FFD700&data=${encodeURIComponent(JSON.stringify({ id: registeredData.id, pass: registeredData.passType, name: registeredData.name, fee: registeredData.totalFee }))}` : '';

  const isTransactionValid = formData.transactionId.length === 12;

  // Selected pass object from constants
  const activePassObj = SYMPOSIUM_PASSES.find(p => p.id === selectedPass);

  // Events filtered for active pass in step 2
  const availableEventsForPass = useMemo(() => {
    if (selectedPass === 'NOVA') {
      return EVENTS.filter(e => e.day === 1);
    }
    if (selectedPass === 'AURA') {
      return EVENTS.filter(e => e.day === 2);
    }
    if (selectedPass === 'ELITE') {
      return EVENTS;
    }
    return EVENTS;
  }, [selectedPass]);

  return (
    <div className="py-24 bg-gradient-to-b from-[#0a1128] via-[#0d1630] to-[#080d1f] min-h-screen text-slate-100 relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-amber-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Progress Stepper (Steps 1 to 4) */}
        {step < 5 && (
          <div className="mb-10 flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: "Pass" },
              { num: 2, label: "Events" },
              { num: 3, label: "Delegates" },
              { num: 4, label: "Payment" }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 font-black text-xs ${
                    step >= s.num 
                      ? 'border-yellow-200 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.6)]' 
                      : 'border-slate-700 bg-slate-800/90 text-slate-400'
                  }`}>
                    {step > s.num ? <CheckCircle size={18} strokeWidth={3} /> : s.num}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider mt-1.5 ${step >= s.num ? 'text-amber-300' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-grow h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 -mt-4 ${
                    step > s.num ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]' : 'bg-slate-700/60'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] border-2 border-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden">
          
          {/* ==================================================== */}
          {/* STEP 1: PASS SELECTION (DISPLAY 3 PASSES WITH OFFERS) */}
          {/* ==================================================== */}
          {step === 1 && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-widest mb-3">
                  <Tag size={13} className="text-gold" />
                  <span>Step 1: Choose Your Conclave Pass</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-cinzel font-black text-white mb-2 uppercase tracking-wider sm:tracking-widest">
                  SELECT YOUR PASS
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                  Two days of cutting-edge engineering at GCE Erode. Select a pass below to unlock and automatically apply the special offers during event selection.
                </p>
              </div>

              {/* Event Pre-selection Notice if user came from Events Page */}
              {preselectedEvent && (
                <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border-2 border-amber-400/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black shrink-0 shadow-inner">
                      <Sparkles size={20} className="text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          Selected Event
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">
                          {preselectedEvent.day === 1 ? 'Day 1 • 28/09/2026' : 'Day 2 • 29/09/2026'}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-cinzel font-black text-white uppercase tracking-wider">
                        {preselectedEvent.title}
                      </h4>
                      <p className="text-xs text-amber-200/90 font-medium">
                        Recommended Pass: <strong className="text-yellow-300 font-bold">{preselectedEvent.day === 1 ? 'NOVA PASS' : 'AURA PASS'}</strong> (or <strong className="text-purple-300 font-bold">ELITE PASS</strong> for both days). Select your pass to continue:
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 self-end sm:self-center">
                    <span className="text-[11px] font-mono font-bold text-yellow-300 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-400/40 inline-block shadow-md">
                      {preselectedEvent.day === 1 
                        ? '₹200 (1 Event) • ₹300 (Both)' 
                        : (preselectedEvent.category === EventCategory.NON_TECHNICAL 
                            ? 'FREE with Tech / ₹300' 
                            : '₹300 (1 Tech + 1 Free)')}
                    </span>
                  </div>
                </div>
              )}

              {/* 3 Pass Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {SYMPOSIUM_PASSES.map((pass: SymposiumPass) => {
                  const isNova = pass.id === 'NOVA';
                  const isAura = pass.id === 'AURA';
                  const isElite = pass.id === 'ELITE';
                  const isSelected = selectedPass === pass.id;

                  return (
                    <div
                      key={pass.id}
                      onClick={() => handleSelectPass(pass.id)}
                      className={`relative rounded-[2.5rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl border-2 cursor-pointer group hover:scale-[1.02] ${
                        isSelected
                          ? 'ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-950 border-amber-300 bg-gradient-to-b from-slate-800 via-[#1b2542] to-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.4)]'
                          : pass.popular
                          ? 'bg-gradient-to-b from-[#161a29]/95 via-[#0e111d]/95 to-[#080a12]/95 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                          : isElite
                          ? 'bg-gradient-to-b from-[#181024]/95 via-[#100b1a]/95 to-[#090610]/95 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                          : 'bg-gradient-to-b from-[#0e172a]/95 via-[#09101f]/95 to-[#060a14]/95 border-blue-400/50 shadow-[0_0_25px_rgba(59,130,246,0.15)]'
                      }`}
                    >
                      {/* Top Badges */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isNova 
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                              : isAura
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                              : 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                          }`}>
                            {pass.badge}
                          </span>

                          {pass.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] uppercase tracking-widest shadow-md">
                              POPULAR
                            </span>
                          )}
                          {isElite && (
                            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-black text-[9px] uppercase tracking-widest shadow-md">
                              BEST VALUE
                            </span>
                          )}
                        </div>

                        {/* Title & Tagline */}
                        <h4 className="text-2xl font-cinzel font-black text-white tracking-widest uppercase mb-1">
                          {pass.name}
                        </h4>
                        <p className="text-xs text-gray-300 font-medium mb-4">
                          {pass.tagline}
                        </p>

                        {/* Price Display */}
                        {isNova ? (
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-blue-400/40 mb-4">
                            <div className="grid grid-cols-2 gap-2 text-center divide-x divide-white/10">
                              <div className="pr-1.5 flex flex-col justify-between">
                                <div>
                                  <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full mb-1 border border-blue-400/30">
                                    Single Event
                                  </span>
                                  <div className="text-2xl sm:text-3xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.4)]">
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
                                  <div className="text-2xl sm:text-3xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.4)]">
                                    ₹300
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono block">per person</span>
                                </div>
                                <span className="text-[9px] text-emerald-400 font-bold mt-1">Save ₹100 Combo</span>
                              </div>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-white/10 text-center">
                              <p className="text-[10px] text-amber-200/90 font-bold uppercase tracking-wider">
                                ₹200 for 1 Event • ₹300 for Both Events Combo
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.4)]">
                                {pass.priceDisplay}
                              </span>
                              <span className="text-xs text-gray-400 font-mono">/ person</span>
                            </div>
                            <p className="text-[10px] text-amber-200/90 font-bold uppercase tracking-wider mt-1">
                              {pass.priceNote}
                            </p>
                          </div>
                        )}

                        {/* Offer Details Box */}
                        <div className={`p-3.5 rounded-xl mb-4 border ${
                          isNova
                            ? 'bg-blue-500/10 border-blue-400/30 text-blue-200'
                            : isAura
                            ? 'bg-amber-500/15 border-amber-400/40 text-amber-100'
                            : 'bg-purple-500/15 border-purple-400/40 text-purple-100'
                        }`}>
                          <div className="flex items-start gap-2">
                            <Gift size={15} className="shrink-0 mt-0.5 text-gold" />
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-gold mb-0.5">Offer Details</p>
                              <p className="text-[11px] leading-relaxed font-medium text-white/90">
                                {pass.offerDetails}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Accommodation Notice for Elite */}
                        {pass.accommodationNote && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 mb-4 flex items-start gap-2">
                            <ShieldAlert size={15} className="shrink-0 text-red-400 mt-0.5" />
                            <p className="text-[10px] leading-snug font-medium">
                              <span className="font-bold text-red-300">Notice: </span>
                              {pass.accommodationNote}
                            </p>
                          </div>
                        )}

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {pass.features.slice(0, 4).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-300">
                              <div className="w-3.5 h-3.5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={10} strokeWidth={3} />
                              </div>
                              <span className="leading-tight text-[11px]">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Select Pass CTA Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPass(pass.id);
                        }}
                        className={`w-full py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                          pass.popular
                            ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                            : isElite
                            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                            : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                        }`}
                      >
                        <span>Select {pass.name}</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: EVENT SELECTION (AUTOMATICALLY APPLIED OFFERS) */}
          {/* ==================================================== */}
          {step === 2 && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              
              {/* Active Pass Banner with Change Option */}
              {activePassObj && (
                <div className={`rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xl ${
                  selectedPass === 'NOVA'
                    ? 'bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-blue-950/80 border-blue-400/60'
                    : selectedPass === 'AURA'
                    ? 'bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 border-amber-400/60'
                    : 'bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-purple-950/80 border-purple-400/60'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40">
                          Active Pass
                        </span>
                        <span className="text-white text-xs font-mono font-bold text-gray-300">
                          {activePassObj.daysLabel}
                        </span>
                      </div>
                      <h4 className="text-2xl font-cinzel font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span>{activePassObj.name}</span>
                        <span className="text-sm font-mono font-bold text-yellow-300">
                          {activePassObj.id === 'NOVA' ? '(₹200 for 1 Event • ₹300 for Both)' : `(${activePassObj.priceDisplay} / person)`}
                        </span>
                      </h4>
                      <p className="text-xs text-amber-200/90 font-medium">
                        ✨ {activePassObj.offerDetails}
                      </p>
                      {activePassObj.accommodationNote && (
                        <p className="text-[11px] text-red-300 font-medium mt-1">
                          ⚠️ {activePassObj.accommodationNote}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl border border-white/20 hover:border-gold text-white hover:text-gold text-xs font-black uppercase tracking-wider bg-black/40 hover:bg-black/60 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <ArrowLeft size={13} />
                      <span>Change Pass</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Offer-Specific Status Nudge */}
              {selectedPass === 'NOVA' && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-200 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-blue-400 shrink-0" size={16} />
                    <span>
                      {day1SelectedCount === 1 ? (
                        <>Selected <strong>1 Day 1 Event (₹200/person)</strong>. Tip: Add the second event for just <strong>₹100 more</strong> (₹300 combo)!</>
                      ) : day1SelectedCount >= 2 ? (
                        <strong className="text-amber-300">🎉 Both Day 1 Events Selected! Combo Offer Applied: ₹300/person (Saved ₹100)!</strong>
                      ) : (
                        <>Select 1 event for <strong>₹200</strong> or both events for <strong>₹300</strong>.</>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {selectedPass === 'AURA' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-400 shrink-0" size={16} />
                    <span>
                      <strong>AURA Pass Special Offer:</strong> ₹300/person includes <strong>1 Technical Event</strong> + <strong>1 Non-Technical Event completely FREE!</strong>
                    </span>
                  </div>
                </div>
              )}

              {selectedPass === 'ELITE' && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-400/30 text-purple-200 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-purple-400 shrink-0" size={16} />
                    <span>
                      <strong>ELITE Conclave Pass:</strong> Full 2-day access for <strong>₹450/person</strong>. Day 1: Manually select Workshop, Project Display, or both. Day 2: Choose 1 Tech and 1 Non-Tech event!
                    </span>
                  </div>
                </div>
              )}

              {/* Event Cards Grid */}
              <div className="space-y-6">
                
                {/* For NOVA PASS: Show Day 1 events */}
                {selectedPass === 'NOVA' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                        <Calendar size={15} className="text-blue-400" />
                        <span>Day 1 Events (28/09/2026)</span>
                      </h4>
                      <span className="text-xs text-blue-300 font-mono font-bold">Morning Workshop &amp; Afternoon Project Display</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {EVENTS.filter(e => e.day === 1).map(event => {
                        const isSelected = formData.selectedEvents.includes(event.id);
                        return (
                          <div 
                            key={event.id}
                            onClick={() => toggleEvent(event.id)}
                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                              isSelected
                                ? 'bg-gradient-to-br from-slate-800 via-[#1e2e54] to-slate-800 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-800/80 border-slate-700 hover:border-blue-400/60 hover:bg-slate-800 shadow-md'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-col">
                                <h4 className="font-black text-white uppercase tracking-wider text-sm group-hover:text-blue-300 transition-colors">{event.title}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-400/20 text-blue-300 border border-blue-400/40">
                                    {event.dayLabel || 'Day 1'}
                                  </span>
                                  <span className="text-[9px] font-mono text-gray-300">
                                    {event.timing}
                                  </span>
                                </div>
                              </div>
                              {isSelected ? (
                                <div className="w-7 h-7 rounded-full bg-blue-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                                  <CheckCircle size={16} strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full border-2 border-slate-500 bg-slate-900/60 group-hover:border-blue-400 transition-colors"></div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-300 line-clamp-2 mb-4 leading-relaxed font-medium">
                              {event.description}
                            </p>

                            <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-700/60">
                              <span className="text-slate-400 flex items-center gap-1">
                                <Users size={12} className="text-blue-400" />
                                {event.maxMembers === 1 ? 'Solo' : `Up to ${event.maxMembers} Members`}
                              </span>
                              <span className="text-blue-300 font-mono font-black">
                                {isSelected ? (day1SelectedCount >= 2 ? 'Combo Offer: ₹300 total' : 'Selected (₹200)') : 'Click to Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* For AURA PASS: Show Day 2 Technical & Non-Technical with Free tag */}
                {selectedPass === 'AURA' && (
                  <div className="space-y-6">
                    {/* Day 2 Technical Events */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                          <Trophy size={15} className="text-amber-400" />
                          <span>1. Select Technical Event (Included in Pass)</span>
                        </h4>
                        <span className="text-xs text-amber-300 font-mono font-bold">
                          {techSelectedCount > 0 ? '1 Selected' : 'Choose 1'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EVENTS.filter(e => e.day === 2 && e.category === EventCategory.TECHNICAL).map(event => {
                          const isSelected = formData.selectedEvents.includes(event.id);
                          return (
                            <div 
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group ${
                                isSelected
                                  ? 'bg-gradient-to-br from-slate-800 via-[#2e2617] to-slate-800 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                                  : 'bg-slate-800/80 border-slate-700 hover:border-amber-400/60 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-black text-white uppercase text-sm group-hover:text-amber-300 transition-colors">{event.title}</h5>
                                  <span className="text-[9px] font-mono text-amber-400 font-bold">Technical Battle • {event.timing}</span>
                                </div>
                                {isSelected ? (
                                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                                    <CheckCircle size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-500"></div>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">
                                {event.description}
                              </p>
                              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-700/60">
                                <span>Max {event.maxMembers} Members</span>
                                <span className="text-amber-300 font-mono">{isSelected ? 'Included in Pass' : 'Select'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Day 2 Non-Technical Events (FREE) */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                          <Gift size={15} className="text-emerald-400" />
                          <span>2. Select Non-Technical Event (100% FREE with AURA Pass!)</span>
                        </h4>
                        <span className="text-xs text-emerald-300 font-mono font-bold">
                          {nonTechSelectedCount > 0 ? 'FREE Selected' : 'Choose 1 FREE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EVENTS.filter(e => e.day === 2 && e.category === EventCategory.NON_TECHNICAL).map(event => {
                          const isSelected = formData.selectedEvents.includes(event.id);
                          return (
                            <div 
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group ${
                                isSelected
                                  ? 'bg-gradient-to-br from-slate-800 via-[#172e22] to-slate-800 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                  : 'bg-slate-800/80 border-slate-700 hover:border-emerald-400/60 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-black text-white uppercase text-sm group-hover:text-emerald-300 transition-colors">{event.title}</h5>
                                  <span className="text-[9px] font-mono text-purple-300 font-bold">Non-Technical Arena</span>
                                </div>
                                {isSelected ? (
                                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                                    <CheckCircle size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-500"></div>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">
                                {event.description}
                              </p>
                              <div className="flex justify-between items-center text-[11px] font-bold pt-2 border-t border-slate-700/60">
                                <span className="text-slate-400">Max {event.maxMembers} Members</span>
                                <span className="text-emerald-300 font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40">
                                  {isSelected ? 'FREE APPLIED' : 'FREE WITH PASS'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* For ELITE PASS: User manually selects Day 1 (Workshop, Project Expo, or both) + Day 2 (1 Tech & 1 Non-Tech) */}
                {selectedPass === 'ELITE' && (
                  <div className="space-y-6">
                    {/* Day 1 Selection */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                        <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                          <Calendar size={15} className="text-purple-400" />
                          <span>1. Day 1: Select Event(s) (Workshop &/or Project Display)</span>
                        </h4>
                        <span className="text-xs font-mono font-bold text-purple-300">
                          {day1SelectedCount === 0 
                            ? 'Choose 1 or both events' 
                            : day1SelectedCount === 1 
                            ? '1 Day 1 Event Selected' 
                            : '🎉 Both Day 1 Events Selected'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">
                        You can participate in 1 event or both events on Day 1 based on your interest. Click any card to select or deselect.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EVENTS.filter(e => e.day === 1).map(event => {
                          const isSelected = formData.selectedEvents.includes(event.id);
                          return (
                            <div 
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                                isSelected
                                  ? 'bg-gradient-to-br from-slate-800 via-[#261936] to-slate-800 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                                  : 'bg-slate-800/80 border-slate-700 hover:border-purple-400/60 hover:bg-slate-800 shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-black text-white uppercase text-sm group-hover:text-purple-300 transition-colors">{event.title}</h5>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 border border-purple-400/40">
                                      {event.dayLabel || 'Day 1'}
                                    </span>
                                    <span className="text-[9px] font-mono text-gray-300">{event.timing}</span>
                                  </div>
                                </div>
                                {isSelected ? (
                                  <div className="w-6 h-6 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                                    <CheckCircle size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-slate-500 bg-slate-900/60 group-hover:border-purple-400 transition-colors"></div>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3 font-medium">
                                {event.description}
                              </p>
                              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-700/60">
                                <span className="flex items-center gap-1">
                                  <Users size={12} className="text-purple-400" />
                                  {event.maxMembers === 1 ? 'Solo Participation' : `Up to ${event.maxMembers} Members`}
                                </span>
                                <span className="text-purple-300 font-mono font-bold">
                                  {isSelected ? '✓ Selected' : 'Click to Select'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Day 2 Technical Event */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                          <Trophy size={15} className="text-amber-400" />
                          <span>2. Day 2: Select 1 Technical Event</span>
                        </h4>
                        <span className="text-xs text-amber-300 font-mono font-bold">
                          {techSelectedCount > 0 ? '1 Selected' : 'Choose 1'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EVENTS.filter(e => e.day === 2 && e.category === EventCategory.TECHNICAL).map(event => {
                          const isSelected = formData.selectedEvents.includes(event.id);
                          return (
                            <div 
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group ${
                                isSelected
                                  ? 'bg-gradient-to-br from-slate-800 via-[#2e2617] to-slate-800 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                                  : 'bg-slate-800/80 border-slate-700 hover:border-amber-400/60 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-black text-white uppercase text-sm group-hover:text-amber-300 transition-colors">{event.title}</h5>
                                  <span className="text-[9px] font-mono text-amber-400 font-bold">{event.timing}</span>
                                </div>
                                {isSelected ? (
                                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                                    <CheckCircle size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-500"></div>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">
                                {event.description}
                              </p>
                              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-700/60">
                                <span>Max {event.maxMembers} Members</span>
                                <span className="text-amber-300 font-mono font-bold">{isSelected ? '✓ Selected' : 'Click to Select'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Day 2 Non-Technical Event */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-cinzel font-black uppercase tracking-wider text-sm flex items-center gap-2">
                          <Gift size={15} className="text-emerald-400" />
                          <span>3. Day 2: Select 1 Non-Technical Event</span>
                        </h4>
                        <span className="text-xs text-emerald-300 font-mono font-bold">
                          {nonTechSelectedCount > 0 ? '1 Selected' : 'Choose 1'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EVENTS.filter(e => e.day === 2 && e.category === EventCategory.NON_TECHNICAL).map(event => {
                          const isSelected = formData.selectedEvents.includes(event.id);
                          return (
                            <div 
                              key={event.id}
                              onClick={() => toggleEvent(event.id)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group ${
                                isSelected
                                  ? 'bg-gradient-to-br from-slate-800 via-[#172e22] to-slate-800 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                                  : 'bg-slate-800/80 border-slate-700 hover:border-emerald-400/60 hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="font-black text-white uppercase text-sm group-hover:text-emerald-300 transition-colors">{event.title}</h5>
                                  <span className="text-[9px] font-mono text-purple-300 font-bold">Non-Technical Arena</span>
                                </div>
                                {isSelected ? (
                                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                                    <CheckCircle size={14} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-500"></div>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">
                                {event.description}
                              </p>
                              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-700/60">
                                <span>Max {event.maxMembers} Members</span>
                                <span className="text-emerald-300 font-mono font-bold">{isSelected ? '✓ Selected' : 'Click to Select'}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fee Calculation Summary & Next Button */}
              <div className="pt-4">
                <div className="mb-6 p-6 sm:p-8 bg-slate-950/90 rounded-[2rem] border-2 border-amber-400/40 shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-xs text-amber-200 font-black uppercase tracking-[0.2em]">
                        {selectedPass ? `${selectedPass} PASS RATE` : 'CONCLAVE PASS'}
                      </p>
                      <h5 className="text-white text-base font-bold mt-1">
                        {1 + activeMembersCount} Participant{activeMembersCount > 0 ? 's' : ''} • ₹{basePricePerHead} / head
                      </h5>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formData.selectedEvents.length} total event{formData.selectedEvents.length > 1 ? 's' : ''} chosen under this pass
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-4xl sm:text-5xl font-cinzel font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]">
                        ₹{totalFee}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Total Fee with Applied Pass Offers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white px-6 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs cursor-pointer shadow-md"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button 
                    onClick={handleNext} 
                    disabled={formData.selectedEvents.length === 0} 
                    className="flex-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-30 shadow-[0_0_30px_rgba(251,191,36,0.6)] border-2 border-yellow-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Continue to Participant Profiles</span>
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: PARTICIPANT PROFILES */}
          {/* ==================================================== */}
          {step === 3 && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-cinzel font-black text-white mb-2 uppercase tracking-widest">
                  Participant Profiles
                </h3>
                <div className="flex items-center justify-center gap-3 bg-amber-500/20 border-2 border-amber-400/50 py-2 px-5 rounded-full max-w-fit mx-auto shadow-md">
                   <Users className="text-amber-300" size={18} />
                   <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
                     Registering {1 + activeMembersCount} Participant(s) • Total: ₹{totalFee}
                   </span>
                </div>
              </div>
              
              <div className="bg-slate-800/90 p-6 sm:p-8 rounded-3xl border-2 border-slate-700 shadow-lg mb-6">
                <h4 className="text-amber-300 text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md"><User size={18} /></div>
                  Leader Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Full Name *</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="As per College ID" 
                      className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Institution *</label>
                    <input 
                      type="text" 
                      value={formData.college} 
                      onChange={e => setFormData({...formData, college: e.target.value})} 
                      placeholder="College Name" 
                      className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Department *</label>
                    <input 
                      type="text" 
                      value={formData.department} 
                      onChange={e => setFormData({...formData, department: e.target.value})} 
                      placeholder="e.g. EEE, ECE, CSE" 
                      className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      maxLength={10} 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                      placeholder="10-digit mobile number" 
                      className={`w-full bg-slate-950 border-2 ${errors.phone ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40'} rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner`} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Email Address *</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      placeholder="leader@example.com" 
                      className={`w-full bg-slate-950 border-2 ${errors.email ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40'} rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner`} 
                    />
                  </div>
                </div>
              </div>

              {maxTeamSize > 1 && (
                <div className="bg-slate-800/90 p-6 sm:p-8 rounded-3xl border-2 border-slate-700 shadow-lg">
                  <h4 className="text-amber-300 text-xs font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md"><UserPlus size={18} /></div>
                    Team Members (Optional for events supporting teams)
                  </h4>
                  <p className="text-xs text-gray-400 mb-6">
                    Each member added increases the pass fee by ₹{basePricePerHead} and receives full credentials, kits, certificates, and refreshments.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-xs font-bold text-amber-200 uppercase tracking-wider block">Member {index + 2} Name</label>
                        <input 
                          type="text" 
                          value={member || ''} 
                          onChange={e => {
                            const newMembers = [...formData.teamMembers];
                            newMembers[index] = e.target.value;
                            setFormData({...formData, teamMembers: newMembers});
                          }} 
                          placeholder="Member Full Name" 
                          className="w-full bg-slate-950 border-2 border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all text-sm font-medium shadow-inner" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleBack} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs shadow-md cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!formData.name || !formData.college || !formData.department || !formData.email || !formData.phone || !!errors.email || !!errors.phone} 
                  className="flex-[2] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-30 shadow-[0_0_25px_rgba(251,191,36,0.6)] border-2 border-yellow-200 cursor-pointer disabled:cursor-not-allowed"
                >
                  Payment Verification <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: PAYMENT VERIFICATION */}
          {/* ==================================================== */}
          {step === 4 && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8 animate-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <div className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  {selectedPass} PASS
                </div>
                <h3 className="text-3xl font-cinzel font-black text-white mb-2 uppercase tracking-widest">
                  Final Step: Payment
                </h3>
                <p className="text-slate-200 text-base">
                  Total Payable: <span className="text-yellow-300 font-black text-2xl font-mono ml-1">₹{totalFee}</span>
                  <span className="text-xs text-gray-400 block mt-1">({1 + activeMembersCount} participant{activeMembersCount > 0 ? 's' : ''} × ₹{basePricePerHead})</span>
                </p>
              </div>
              
              <div className="flex flex-col items-center max-w-md mx-auto">
                {/* Important Note */}
                <div className="bg-amber-500/15 border-2 border-amber-400/60 p-5 rounded-2xl mb-8 w-full flex items-start gap-4 text-amber-100 shadow-md">
                  <Info size={24} className="text-amber-300 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-xs leading-relaxed font-medium">
                    <span className="text-amber-300 font-bold uppercase block mb-1">Payment Instructions:</span>
                    Scan the QR code below using any UPI app (GPay, PhonePe, Paytm). After completing payment, enter your 12-digit transaction ID and click Register to download your entry pass.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-[3rem] border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-8">
                  <img src={paymentQrUrl} alt="Payment QR Code" className="w-64 h-64 object-contain" />
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 flex flex-col items-center">
                    <p className="text-slate-950 font-black text-xl tracking-widest">{upiId}</p>
                    <p className="text-slate-600 text-[11px] uppercase font-black mt-1 text-center">Department of EEE - ELIXIR'26</p>
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <label className="text-xs font-black text-amber-200 uppercase tracking-widest block text-center">Enter 12-Digit Reference Transaction ID *</label>
                  <input 
                    type="text" 
                    required
                    maxLength={12}
                    value={formData.transactionId}
                    onChange={e => setFormData({...formData, transactionId: e.target.value.replace(/\D/g, '')})}
                    placeholder="e.g. 425182910283" 
                    className={`w-full bg-slate-950 border-2 ${errors.transactionId ? 'border-red-500 ring-2 ring-red-500/30' : 'border-amber-400 focus:border-amber-300 focus:ring-4 focus:ring-amber-400/30'} rounded-2xl px-6 py-5 text-amber-300 placeholder-slate-500 focus:outline-none transition-all text-center font-mono font-black tracking-[0.3em] text-xl shadow-inner`} 
                  />
                  <p className="text-center text-[11px] text-slate-400">
                    {formData.transactionId.length}/12 digits entered
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200 animate-in shake duration-300">
                   <WifiOff size={24} className="flex-shrink-0 text-red-400" />
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-red-300">Submission Failed</p>
                     <p className="text-xs leading-relaxed">{submitError}</p>
                   </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleBack} 
                  disabled={isSubmitting} 
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs shadow-md cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !isTransactionValid} 
                  className={`flex-[2] py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all shadow-lg border-2 ${
                    isTransactionValid 
                      ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 border-yellow-200 shadow-[0_0_25px_rgba(251,191,36,0.6)] cursor-pointer' 
                      : 'bg-slate-800/80 text-slate-500 border-slate-700 cursor-not-allowed opacity-40'
                  }`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  {isSubmitting ? 'Submitting...' : 'Register & Get Pass'}
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 5: REGISTRATION LOGGED / PASS TICKET */}
          {/* ==================================================== */}
          {step === 5 && registeredData && (
            <div className="p-8 sm:p-12 md:p-16 text-center animate-in zoom-in duration-700 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle size={40} strokeWidth={3} />
              </div>
              <h3 className="text-3xl md:text-5xl font-cinzel font-black text-white mb-2 tracking-widest uppercase">
                REGISTRATION LOGGED
              </h3>
              <p className="text-sm text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                Your entry pass has been generated. Total fee of <span className="text-yellow-300 font-bold font-mono">₹{registeredData.totalFee}</span> has been recorded.
              </p>
              
              <div className="relative max-w-md mx-auto group mb-10">
                 <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full opacity-50"></div>
                 <div ref={passRef} className="relative bg-slate-950 border-2 border-amber-400/60 rounded-[3.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden text-left">
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-6">
                         <div>
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 inline-block mb-1.5">
                              {registeredData.passType || 'CONCLAVE PASS'}
                            </span>
                            <h4 className="text-xl font-cinzel font-black text-white glow-text-gold tracking-widest uppercase">ELIXIR'26</h4>
                            <p className="text-[10px] text-gray-400 font-medium">GCE Erode • 28 &amp; 29 Sept 2026</p>
                         </div>
                         <Star className="text-amber-400 fill-amber-400" size={24} />
                       </div>
                       
                       <div className="bg-white p-5 rounded-[2.5rem] mb-6 border-4 border-amber-400/40 shadow-xl">
                          <img src={passQrUrl} alt="Pass QR" className="w-48 h-48 mx-auto" crossOrigin="anonymous" />
                       </div>
                       
                       <div className="space-y-3 text-xs">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Delegate Leader</p>
                            <p className="text-white font-bold uppercase text-sm">{registeredData.name}</p>
                            <p className="text-[11px] text-gray-400">{registeredData.college} ({registeredData.department})</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pass ID</p>
                              <p className="text-amber-300 font-mono font-bold text-xs">{registeredData.id}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fee Paid</p>
                              <p className="text-yellow-300 font-mono font-bold text-xs">₹{registeredData.totalFee}</p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Registered Events</p>
                            <div className="flex flex-wrap gap-1.5">
                              {registeredData.events.map((evName, idx) => {
                                const wa = getEventWhatsAppData(evName);
                                return (
                                  <span key={idx} className="text-[10px] bg-slate-800 text-amber-200 px-2 py-0.5 rounded border border-slate-700 font-semibold inline-flex items-center gap-1">
                                    <span>{evName}</span>
                                    {wa && (
                                      <a
                                        href={wa.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-400 hover:text-emerald-300 ml-1 inline-flex items-center gap-0.5 underline decoration-emerald-500/50"
                                        title={`Join ${wa.shortName} WhatsApp Group`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <WhatsAppIcon className="w-3 h-3 inline text-emerald-400" />
                                        <span>Join WA</span>
                                      </a>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {registeredData.passType?.includes('ELITE') && (
                            <div className="pt-2 border-t border-slate-800 text-[10px] text-gray-400">
                              <span className="text-amber-300 font-bold">Inclusions: </span>
                              Food &amp; Refreshments provided. Accommodation is not provided.
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              {/* ==================================================== */}
              {/* OFFICIAL WHATSAPP GROUP LINKS FOR REGISTERED EVENTS */}
              {/* ==================================================== */}
              {registeredWhatsAppGroups.length > 0 ? (
                <div className="max-w-xl mx-auto mb-10 text-left bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-emerald-500/20">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <WhatsAppIcon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          Mandatory Step
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {registeredWhatsAppGroups.length} {registeredWhatsAppGroups.length === 1 ? 'Group' : 'Groups'} to Join
                        </span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-cinzel font-black text-white">
                        Join Event WhatsApp Group{registeredWhatsAppGroups.length > 1 ? 's' : ''}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Join the official WhatsApp group for your registered event{registeredWhatsAppGroups.length > 1 ? 's' : ''} to receive problem statements, slot schedules, venue updates, and live announcements from student coordinators.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {registeredWhatsAppGroups.map((group) => {
                      const isCopied = copiedWaId === group.id;
                      return (
                        <div 
                          key={group.id}
                          className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-md group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                              <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono uppercase font-bold text-emerald-400 tracking-wider block truncate">
                                {group.category}
                              </span>
                              <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                {group.shortName || group.title}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(group.link);
                                setCopiedWaId(group.id);
                                setTimeout(() => setCopiedWaId(null), 2500);
                              }}
                              title="Copy invite link to share with teammates"
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                            >
                              {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              <span className="text-[11px]">{isCopied ? 'Copied!' : 'Copy'}</span>
                            </button>

                            <a
                              href={group.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:shadow-[0_0_20px_rgba(16,185,129,0.55)] transition-all cursor-pointer"
                            >
                              <span>Join Group</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-emerald-300/80 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-400 shrink-0" />
                      Share the link with your team members so all members can stay connected.
                    </span>
                  </div>
                </div>
              ) : (
                /* Fallback in case events array is empty or unmatched */
                <div className="max-w-xl mx-auto mb-10 text-left bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                  <div className="flex items-center gap-3 mb-4">
                    <WhatsAppIcon className="w-8 h-8 text-emerald-400" />
                    <div>
                      <h4 className="text-base font-cinzel font-bold text-white">Join Event WhatsApp Groups</h4>
                      <p className="text-xs text-slate-300">Connect with event coordinators and participants:</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.values(EVENT_WHATSAPP_LINKS).slice(0, 6).map(g => (
                      <a
                        key={g.id}
                        href={g.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs text-white hover:text-emerald-300 flex items-center justify-between"
                      >
                        <span className="truncate">{g.shortName}</span>
                        <ExternalLink size={12} className="shrink-0 text-emerald-400 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_25px_rgba(251,191,36,0.6)] border-2 border-yellow-200 flex items-center justify-center gap-3 cursor-pointer">
                  Open Dashboard <ArrowRight size={18}/>
                </button>
                <button 
                  onClick={handleDownload} 
                  disabled={downloading}
                  className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-md cursor-pointer"
                >
                  {downloading ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
                  {downloading ? 'Capturing...' : 'Save Draft Pass'}
                </button>
              </div>
            </div>
          )}
          
          {step > 5 || (step === 5 && !registeredData) ? (
            <div className="p-20 text-center">
               <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
               <p className="text-white font-cinzel font-bold">Session State Error</p>
               <button onClick={() => setStep(1)} className="mt-4 text-gold underline font-bold uppercase tracking-widest text-xs">Restart Registration</button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Register;
