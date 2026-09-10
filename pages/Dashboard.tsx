
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle, Clock, XCircle, Calendar, RefreshCw, Loader2, Trophy, Share2, QrCode, X, Star, Download, MapPin, Users, BookOpen, Zap, User, MessageCircle, ExternalLink } from 'lucide-react';
import { Registration, RegistrationStatus } from '../types';
import { getRegistrationsByEmail, subscribeToRegistrations } from '../storage';
import { getEventWhatsAppData } from '../constants';
import html2canvas from 'html2canvas';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
  </svg>
);

const PassModal: React.FC<{ registration: Registration; onClose: () => void }> = ({ registration, onClose }) => {
  const passRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrAsBlob = async () => {
      try {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&bgcolor=000&color=FFD700&data=${encodeURIComponent(JSON.stringify({ id: registration.id, type: 'ELIXIR_ENTRY' }))}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setQrBlobUrl(blobUrl);
      } catch (err) {
        console.error("QR Blob fetch failed", err);
      }
    };
    fetchQrAsBlob();
    return () => {
      if (qrBlobUrl) URL.revokeObjectURL(qrBlobUrl);
    };
  }, [registration.id]);

  const handleDownload = async () => {
    if (!passRef.current || !qrBlobUrl) return;
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(passRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `ELIXIR_PASS_${registration.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert("Capture failed. Please take a screenshot.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative max-w-sm w-full animate-in zoom-in-95 duration-500">
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>
        
        <div ref={passRef} className="relative bg-black border-2 border-gold/40 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(255,215,0,0.3)] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-full flex justify-between items-start mb-10">
               <div className="text-left">
                  <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em] mb-1">Entry Pass</p>
                  <h4 className="text-2xl font-cinzel font-black text-white glow-text-gold tracking-widest">ELIXIR'26</h4>
                  {registration.passType && (
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40">
                      {registration.passType}
                    </span>
                  )}
               </div>
               <Star className="text-gold" fill="currentColor" size={28} />
            </div>
            
            <div className="bg-white p-5 rounded-[2.5rem] mb-10 border-4 border-gold/30 shadow-2xl min-h-[200px] flex items-center justify-center w-full max-w-[240px]">
               {qrBlobUrl ? (
                 <img src={qrBlobUrl} alt="Pass QR" className="w-full h-auto" />
               ) : (
                 <Loader2 className="animate-spin text-gold" size={32} />
               )}
            </div>
            
            <div className="w-full text-left space-y-6 mb-8">
               <div>
                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">Participant Leader</p>
                 <p className="text-xl font-cinzel font-bold text-white tracking-wide uppercase">{registration.name}</p>
               </div>
               
               {registration.teamMembers.length > 0 && (
                 <div>
                   <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-2">Team Members</p>
                   <div className="flex flex-wrap gap-2">
                     {registration.teamMembers.map((m, i) => (
                       <span key={i} className="text-[10px] text-white font-bold border border-white/10 px-2 py-0.5 rounded uppercase">{m}</span>
                     ))}
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                 <div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">Entry ID</p>
                    <p className="text-gold font-mono font-bold uppercase">{registration.id}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">Venue</p>
                    <p className="text-white font-bold text-[10px] uppercase">GCE Erode</p>
                 </div>
               </div>
            </div>

            <button 
              onClick={handleDownload} 
              disabled={downloading || !qrBlobUrl}
              className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all glow-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20}/>}
              {downloading ? 'Processing...' : 'Download Pass'}
            </button>
          </div>
        </div>

        {/* Event WhatsApp Group Quick Access */}
        {registration.events && registration.events.length > 0 && (
          <div className="mt-4 bg-slate-950/90 border border-emerald-500/40 rounded-3xl p-4 shadow-xl text-left">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-white">Event WhatsApp Groups</p>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {registration.events.map((ev, idx) => {
                const wa = getEventWhatsAppData(ev);
                if (!wa) return null;
                return (
                  <a
                    key={idx}
                    href={wa.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/20 text-xs text-slate-200 hover:text-emerald-300 transition-colors"
                  >
                    <span className="truncate font-semibold text-[11px]">{wa.shortName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0 ml-2">
                      Join <ExternalLink size={10} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<Registration | null>(null);
  const [isLive, setIsLive] = useState(true);
  const userEmail = localStorage.getItem('elixir_user_email');

  const fetchUserRegistrations = () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    try {
      const data = getRegistrationsByEmail(userEmail);
      setUserRegistrations(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRegistrations();
    if (userEmail) {
      const emailFilter = userEmail.toLowerCase();
      const unsubscribe = subscribeToRegistrations((all) => {
        const userList = all.filter(r => r.email.toLowerCase() === emailFilter);
        setUserRegistrations(userList);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [userEmail]);

  const getStatusStyle = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.PRESENT:
        return { 
          icon: <Zap className="text-blue-400" size={24} />, 
          text: 'text-blue-400', 
          displayText: 'VERIFIED AT VENUE',
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20' 
        };
      case RegistrationStatus.CONFIRMED:
        return { 
          icon: <CheckCircle className="text-green-500" size={24} />, 
          text: 'text-green-500', 
          displayText: 'REGISTRATION ACTIVE',
          bg: 'bg-green-500/10', 
          border: 'border-green-500/20' 
        };
      case RegistrationStatus.PENDING:
        return { 
          icon: <Clock className="text-gold" size={24} />, 
          text: 'text-gold', 
          displayText: 'AWAITING VERIFICATION',
          bg: 'bg-gold/10', 
          border: 'border-gold/20' 
        };
      case RegistrationStatus.REJECTED:
        return { 
          icon: <XCircle className="text-red-500" size={24} />, 
          text: 'text-red-500', 
          displayText: 'PAYMENT DECLINED',
          bg: 'bg-red-500/10', 
          border: 'border-red-500/20' 
        };
      default:
        return { icon: <Clock />, text: 'text-gray-400', displayText: 'UNKNOWN', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 className="animate-spin text-gold" size={48} />
    </div>
  );

  if (!userEmail || userRegistrations.length === 0) {
    return (
      <div className="py-32 bg-[#0A0A0A] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <LayoutDashboard size={64} className="text-white/10 mx-auto mb-8" />
          <h2 className="text-4xl font-cinzel font-bold text-white mb-4">No Records Found</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">Verify your email address or register for an event first.</p>
          <Link to="/register" className="bg-gold text-black px-10 py-4 rounded-xl font-bold hover:bg-amber-500 transition-all">Register Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-[#0A0A0A] min-h-screen">
      {selectedPass && <PassModal registration={selectedPass} onClose={() => setSelectedPass(null)} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold/10 rounded-xl text-gold">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-cinzel font-bold tracking-widest uppercase">My Dashboard</h2>
                {isLive && (
                  <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live Sync</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500">Managing access for: <span className="text-white font-bold">{userEmail}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userRegistrations.map(reg => {
            const styles = getStatusStyle(reg.status);
            const isConfirmed = reg.status === RegistrationStatus.CONFIRMED || reg.status === RegistrationStatus.PRESENT;

            return (
              <div key={reg.id} className={`bg-[#111] rounded-[2.5rem] border ${isConfirmed ? 'border-gold/30 shadow-[0_0_40px_rgba(255,215,0,0.05)]' : 'border-white/10'} overflow-hidden shadow-2xl transition-all duration-700 animate-in fade-in zoom-in-95`}>
                <div className={`px-8 py-5 flex items-center justify-between border-b ${styles.border} ${styles.bg}`}>
                  <div className="flex items-center gap-3">
                    {styles.icon}
                    <span className={`font-black uppercase text-[10px] tracking-[0.2em] ${styles.text}`}>
                      {styles.displayText}
                    </span>
                  </div>
                  {reg.status === RegistrationStatus.PRESENT && (
                    <div className="bg-blue-400 text-black text-[9px] font-black px-3 py-0.5 rounded-full animate-pulse">VENUE ACCESS ACTIVE</div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-2xl font-cinzel font-bold text-white mb-2 uppercase tracking-wide">{reg.name}</h4>
                      {reg.passType && (
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 shrink-0">
                          {reg.passType}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">{reg.college}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">{reg.department}</p>
                        {reg.daysAttended && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-gray-400 text-[10px] font-mono">{reg.daysAttended}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {reg.teamMembers.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={12}/> Team Members</p>
                      <div className="flex flex-wrap gap-2">
                        {reg.teamMembers.map((m, i) => (
                          <span key={i} className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase px-3 py-1 border border-white/5 rounded-lg">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={12}/> Event Roster &amp; WhatsApp</p>
                    <div className="flex flex-wrap gap-2">
                      {reg.events.map((ev, i) => {
                        const wa = getEventWhatsAppData(ev);
                        return (
                          <div key={i} className="bg-gold/5 border border-gold/20 rounded-xl p-2 flex items-center gap-2">
                            <span className="text-gold text-[10px] font-bold uppercase">
                              {ev}
                            </span>
                            {wa && (
                              <a
                                href={wa.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1 transition-colors"
                                title={`Join ${wa.shortName} WhatsApp Group`}
                              >
                                <WhatsAppIcon className="w-3 h-3 text-emerald-400" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="w-full">
                    <button 
                      onClick={() => isConfirmed && setSelectedPass(reg)}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all text-sm font-bold uppercase tracking-widest ${
                        isConfirmed 
                          ? 'bg-gold text-black hover:bg-amber-500 glow-gold shadow-lg' 
                          : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed opacity-50'
                      }`}
                      disabled={!isConfirmed}
                    >
                      <QrCode size={18} /> {isConfirmed ? 'View Entry Pass' : 'Verification Required'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
