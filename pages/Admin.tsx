
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Settings, CheckCircle, Search, Users, User, Shield, AlertCircle, LayoutDashboard, Eye, Loader2, X, Download, Cloud, MapPin, TrendingUp, Camera, RefreshCw, Scan, LogOut, Database, Zap, UserCheck, Clock, History, ChevronRight, GraduationCap, Plus, UserPlus, FileSpreadsheet, Trash2, Mail, Phone, Calendar, Copy, Check
} from 'lucide-react';
import { Registration, RegistrationStatus } from '../types';
import { addRegistration, deleteRegistration, purgeLegacySampleRegistrations } from '../storage';
import { Html5Qrcode } from 'html5-qrcode';
import { EVENTS } from '../constants';
import { 
  checkSupabaseConnection, 
  SUPABASE_SETUP_SQL, 
  SUPABASE_PROJECT_ID, 
  SUPABASE_TABLE_NAME, 
  insertRegistrationToSupabase,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseCredentials,
  clearSupabaseCredentials
} from '../supabase';

interface AdminProps {
  registrations: Registration[];
  onUpdateStatus: (id: string, status: RegistrationStatus) => Promise<void>;
  onDeleteRegistration?: (id: string) => Promise<void>;
  onRefresh?: () => void;
  fetchError?: string | null;
  isLoading?: boolean;
  onLogout: () => void;
}

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio feedback failed");
  }
};

const LiveScanner: React.FC<{ 
  onScan: (id: string) => void; 
  onError: (err: string) => void;
  onClose: () => void;
  lastScannedParticipant: Registration | null;
}> = ({ onScan, onError, onClose, lastScannedParticipant }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isSuccessfullyScanned, setIsSuccessfullyScanned] = useState(false);
  const isLockedRef = useRef(false);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onScanRef.current = onScan;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let isCancelled = false;
    let localScanner: Html5Qrcode | null = null;

    const safeStopScanner = async (scanner: Html5Qrcode | null) => {
      if (!scanner) return;
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch (err) {
        // Suppress any "Cannot stop, scanner is not running or paused." edge cases
        console.debug("Scanner stop handled safely:", err);
      } finally {
        try {
          scanner.clear();
        } catch {
          // Ignore
        }
        const container = document.getElementById("reader");
        if (container) container.innerHTML = "";
      }
    };

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("reader", { verbose: false });
        localScanner = scanner;
        scannerRef.current = scanner;
        const config = { fps: 30, qrbox: { width: 280, height: 280 }, aspectRatio: 1.0, disableFlip: false };
        
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            if (isCancelled || isLockedRef.current) return;
            try {
              const payload = JSON.parse(decodedText);
              if (payload.type === 'ELIXIR_ENTRY' && payload.id) {
                isLockedRef.current = true;
                onScanRef.current(payload.id);
                setIsSuccessfullyScanned(true);
                playSuccessSound();
                if (navigator.vibrate) navigator.vibrate(100);
                setTimeout(() => {
                  isLockedRef.current = false;
                  setIsSuccessfullyScanned(false);
                }, 3000);
              }
            } catch (e) {
              console.warn("Invalid QR Format");
            }
          },
          () => {} 
        );

        if (isCancelled) {
          safeStopScanner(scanner);
        }
      } catch (err: any) {
        if (!isCancelled) {
          onErrorRef.current(err?.message || "Camera access failed. Please check permissions.");
        }
      }
    };

    startScanner();

    return () => {
      isCancelled = true;
      safeStopScanner(localScanner || scannerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-4 transition-colors duration-300 border-white/10">
      <div id="reader" className="w-full h-full object-cover"></div>
      {!isSuccessfullyScanned && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-64 h-64 border-2 border-white/10 rounded-[2rem]">
             <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-gold rounded-tl-2xl"></div>
             <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-gold rounded-tr-2xl"></div>
             <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-gold rounded-bl-2xl"></div>
             <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-gold rounded-br-2xl"></div>
             <div className="absolute top-0 left-0 w-full h-1 bg-gold/30 animate-pulse"></div>
          </div>
        </div>
      )}
      {isSuccessfullyScanned && (
        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="bg-green-500 text-white p-4 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.5)] mb-6 animate-bounce">
            <CheckCircle size={48} strokeWidth={4} />
          </div>
          <div className="text-center space-y-3 bg-black/80 p-8 rounded-[2rem] border-2 border-gold/30 shadow-2xl max-w-xs w-full">
            <h4 className="text-white text-3xl font-cinzel font-black uppercase tracking-wider line-clamp-2">
              {lastScannedParticipant?.name || 'VERIFIED'}
            </h4>
          </div>
        </div>
      )}
      <button onClick={onClose} className="absolute top-6 right-6 z-40 bg-black/50 hover:bg-red-500 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10"><X size={20} /></button>
    </div>
  );
};

const ManualEntryModal: React.FC<{ onClose: () => void; onSave: (reg: Registration) => Promise<void> }> = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    email: '',
    phone: '',
    selectedEvents: [] as string[]
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const regId = `MAN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const newReg: Registration = {
        id: regId,
        name: formData.name,
        college: formData.college,
        department: formData.department,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        teamMembers: [],
        events: formData.selectedEvents,
        totalFee: 0,
        transactionId: 'ON-SPOT',
        status: RegistrationStatus.CONFIRMED,
        timestamp: new Date().toISOString()
      };
      await onSave(newReg);
      onClose();
    } catch (err) {
      alert("Error adding participant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#111] w-full max-w-xl rounded-[3rem] border border-gold/20 p-10 relative overflow-hidden shadow-2xl">
         <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={24} /></button>
         <h3 className="text-2xl font-cinzel font-black uppercase tracking-widest text-gold mb-8">Manual Entry</h3>
         <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm" />
              <input type="text" placeholder="College" required value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm" />
              <input type="text" placeholder="Dept" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm" />
              <input type="tel" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm" />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 text-sm" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Select Events</p>
              <div className="flex flex-wrap gap-2">
                {EVENTS.map(ev => (
                  <button 
                    key={ev.id}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      selectedEvents: prev.selectedEvents.includes(ev.title) ? prev.selectedEvents.filter(t => t !== ev.title) : [...prev.selectedEvents, ev.title]
                    }))}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.selectedEvents.includes(ev.title) ? 'bg-gold border-gold text-black' : 'border-white/10 text-gray-500'}`}
                  >
                    {ev.title}
                  </button>
                ))}
              </div>
            </div>
            <button disabled={loading} className="w-full bg-gold text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-500 glow-gold flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />} Register Participant
            </button>
         </form>
      </div>
    </div>
  );
};

type AdminTab = 'registrations' | 'scanner' | 'settings';

const Admin: React.FC<AdminProps> = ({ registrations, onUpdateStatus, onDeleteRegistration, onRefresh, fetchError, isLoading, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('registrations');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<RegistrationStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedId, setLastScannedId] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<Registration[]>([]);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Deletion State
  const [regToDelete, setRegToDelete] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Supabase Integration State
  const [supabaseStatus, setSupabaseStatus] = useState<{ checked: boolean; connected: boolean; tableExists: boolean; isConfigured?: boolean; error?: string }>({
    checked: false,
    connected: false,
    tableExists: false,
    isConfigured: isSupabaseConfigured()
  });
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [inputProjectId, setInputProjectId] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);

  const checkSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setSupabaseStatus({ checked: true, connected: false, tableExists: false, isConfigured: false });
      return;
    }
    setIsCheckingSupabase(true);
    try {
      const res = await checkSupabaseConnection();
      setSupabaseStatus({ checked: true, ...res });
    } catch (err: any) {
      setSupabaseStatus({ checked: true, connected: false, tableExists: false, isConfigured: true, error: err?.message });
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  useEffect(() => {
    checkSupabase();
    // Automatically purge legacy demo sample registrations (ELX-8934, ELX-4721, ELX-3109)
    purgeLegacySampleRegistrations().then(purgedCount => {
      if (purgedCount > 0 && onRefresh) {
        onRefresh();
      }
    });
  }, []);

  const handleConfirmDelete = async () => {
    if (!regToDelete) return;
    setIsDeleting(true);
    try {
      if (onDeleteRegistration) {
        await onDeleteRegistration(regToDelete.id);
      } else {
        await deleteRegistration(regToDelete.id);
      }
      setDeleteNotice(`Registration for ${regToDelete.name} (${regToDelete.id}) was permanently removed.`);
      if (selectedId === regToDelete.id) {
        setSelectedId(null);
      }
      setRegToDelete(null);
      if (onRefresh) onRefresh();
      setTimeout(() => setDeleteNotice(null), 5000);
    } catch (err: any) {
      console.error('Error deleting registration:', err);
      setDeleteNotice(`Failed to delete: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleConnectNewSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) {
      setConnectError('Both Supabase Project URL and Anon API Key are required.');
      return;
    }
    setConnectError(null);
    saveSupabaseCredentials(inputUrl.trim(), inputKey.trim(), inputProjectId.trim());
    setIsCheckingSupabase(true);
    try {
      const res = await checkSupabaseConnection();
      setSupabaseStatus({ checked: true, ...res });
      if (res.connected) {
        setShowConnectForm(false);
        setInputUrl('');
        setInputKey('');
        setInputProjectId('');
        setSyncMessage('Successfully connected to new Supabase project!');
      } else {
        setConnectError(res.error || 'Connection failed. Please verify the URL and API key.');
      }
    } catch (err: any) {
      setConnectError(err?.message || 'Connection failed.');
    } finally {
      setIsCheckingSupabase(false);
    }
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setSupabaseStatus({ checked: true, connected: false, tableExists: false, isConfigured: false });
    setSyncMessage('Supabase database disconnected. App is running on local storage.');
  };

  const handleSyncToSupabase = async () => {
    if (!isSupabaseConfigured()) {
      setSyncMessage('Supabase is disconnected. Connect your new Supabase database first.');
      return;
    }
    setIsSyncingSupabase(true);
    setSyncMessage(null);
    let successCount = 0;
    let failCount = 0;
    for (const reg of registrations) {
      const res = await insertRegistrationToSupabase(reg);
      if (res.success) successCount++;
      else failCount++;
    }
    setSyncMessage(`Synced ${successCount} record(s) to Supabase.${failCount > 0 ? ` (${failCount} errors - ensure registrations table exists)` : ''}`);
    setIsSyncingSupabase(false);
  };

  const selectedReg = useMemo(() => registrations.find(r => r.id === selectedId) || null, [selectedId, registrations]);
  const lastScannedParticipant = useMemo(() => {
    if (!lastScannedId) return null;
    return registrations.find(r => r.id.toUpperCase() === lastScannedId.toUpperCase()) || null;
  }, [lastScannedId, registrations]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter(r => r.status === RegistrationStatus.CONFIRMED || r.status === RegistrationStatus.PRESENT).length;
    const pending = registrations.filter(r => r.status === RegistrationStatus.PENDING).length;
    const present = registrations.filter(r => r.status === RegistrationStatus.PRESENT).length;
    return { total, confirmed, pending, present };
  }, [registrations]);

  const handleScan = async (id: string) => {
    const participant = registrations.find(r => r.id.toUpperCase() === id.trim().toUpperCase());
    if (participant) {
      setLastScannedId(participant.id);
      if (participant.status !== RegistrationStatus.PRESENT) {
        await onUpdateStatus(participant.id, RegistrationStatus.PRESENT);
      }
      setRecentScans(prev => {
        const filtered = prev.filter(p => p.id !== participant.id);
        return [participant, ...filtered].slice(0, 5);
      });
      // Automatically open the full profile
      setSelectedId(participant.id);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = reg.name.toLowerCase().includes(s) || reg.id.toLowerCase().includes(s);
    const matchesFilter = (filter === 'ALL' || reg.status === filter);
    return matchesSearch && matchesFilter;
  });

  const handleManualSave = async (reg: Registration) => {
    await addRegistration(reg);
    if (onRefresh) onRefresh();
  };

  const handleExportData = () => {
    setIsExporting(true);
    try {
      const headers = ['ID', 'Name', 'College', 'Department', 'Email', 'Phone', 'Events', 'Total Fee', 'Transaction ID', 'Status', 'Timestamp'];
      const csvContent = [
        headers.join(','),
        ...registrations.map(r => [
          r.id,
          `"${r.name}"`,
          `"${r.college}"`,
          `"${r.department}"`,
          r.email,
          r.phone,
          `"${r.events.join(', ')}"`,
          r.totalFee,
          r.transactionId || 'N/A',
          r.status,
          r.timestamp
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `elixir_registrations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="py-24 bg-[#0A0A0A] min-h-screen text-white font-inter">
      {isManualEntryOpen && <ManualEntryModal onClose={() => setIsManualEntryOpen(false)} onSave={handleManualSave} />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-in fade-in slide-in-from-top-4">
           {[
             { label: 'Registrations', val: stats.total, icon: <Users size={20} />, color: 'text-white' },
             { label: 'Confirmed', val: stats.confirmed, icon: <CheckCircle size={20} />, color: 'text-green-500' },
             { label: 'Pending', val: stats.pending, icon: <Clock size={20} />, color: 'text-gold' },
             { label: 'Checked In', val: stats.present, icon: <Zap size={20} />, color: 'text-blue-400' }
           ].map((s, i) => (
             <div key={i} className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center shadow-lg">
                <div className={`${s.color} bg-white/5 p-3 rounded-2xl mb-3`}>{s.icon}</div>
                <p className="text-3xl font-cinzel font-black tracking-widest">{s.val}</p>
                <p className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em] mt-1">{s.label}</p>
             </div>
           ))}
        </div>

        {/* Header and Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gold/10 rounded-2xl text-gold border border-gold/20 shadow-lg"><LayoutDashboard size={32} /></div>
            <div>
              <h2 className="text-4xl font-cinzel font-black tracking-widest uppercase">Admin Hub</h2>
              <div className="flex items-center gap-3 mt-1">
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest font-mono">Status: {isLoading ? 'Syncing...' : 'Live Connected'}</p>
                 <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <button onClick={() => setIsManualEntryOpen(true)} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/10 text-gold hover:bg-gold hover:text-black transition-all flex items-center gap-2">
              <UserPlus size={16} /> New Entry
            </button>
            <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
            {['registrations', 'scanner', 'settings'].map((tab) => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab as AdminTab); setIsCameraActive(false); }}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {tab === 'registrations' ? <Database size={16} /> : tab === 'scanner' ? <Scan size={16} /> : <Settings size={16} />}
                <span className="ml-2 hidden sm:inline">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display */}
        <div className="bg-[#111] rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden min-h-[600px]">
          {activeTab === 'registrations' && (
            <div className="p-8 md:p-12 animate-in fade-in duration-500">
               {deleteNotice && (
                 <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
                   <div className="flex items-center gap-2">
                     <CheckCircle size={16} />
                     <span>{deleteNotice}</span>
                   </div>
                   <button onClick={() => setDeleteNotice(null)} className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1">Dismiss</button>
                 </div>
               )}
               <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or ID..." className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm focus:border-gold/50 text-white" />
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {['ALL', RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED, RegistrationStatus.PRESENT].map(f => (
                      <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-gold/20 border-gold text-gold' : 'border-white/5 text-gray-500 hover:text-white'}`}>{f.replace('Payment Pending Verification', 'PENDING')}</button>
                    ))}
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase text-gray-500 font-black tracking-widest">
                           <th className="px-10 py-8">Participant Info</th>
                           <th className="px-10 py-8">Status</th>
                           <th className="px-10 py-8 text-right">Quick Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredRegistrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-white/5 transition-all group">
                             <td className="px-10 py-8">
                                <p className="text-xl font-cinzel font-bold text-white group-hover:text-gold transition-colors">{reg.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{reg.id}</p>
                                  {reg.passType && (
                                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                                      {reg.passType}
                                    </span>
                                  )}
                                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                  <p className="text-[9px] text-gray-600 font-bold uppercase truncate max-w-[150px]">{reg.college}</p>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase border transition-all flex items-center gap-2 w-fit ${
                                  reg.status === RegistrationStatus.PRESENT ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 
                                  reg.status === RegistrationStatus.CONFIRMED ? 'text-green-500 border-green-500/30 bg-green-500/5' : 
                                  'text-gold border-gold/30 bg-gold/5 animate-pulse'
                                }`}>
                                   {reg.status === RegistrationStatus.PRESENT && <Zap size={10} />}
                                   {reg.status === RegistrationStatus.CONFIRMED && <CheckCircle size={10} />}
                                   {reg.status === RegistrationStatus.PENDING && <Clock size={10} />}
                                   {reg.status.replace('Payment Pending Verification', 'PENDING')}
                                </span>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  {reg.status === RegistrationStatus.PENDING && (
                                    <button onClick={() => onUpdateStatus(reg.id, RegistrationStatus.CONFIRMED)} className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">Confirm Payment</button>
                                  )}
                                  {reg.status === RegistrationStatus.CONFIRMED && (
                                    <button onClick={() => onUpdateStatus(reg.id, RegistrationStatus.PRESENT)} className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[9px] font-black uppercase hover:bg-blue-500 hover:text-white transition-all">Check-In</button>
                                  )}
                                  <button onClick={() => setSelectedId(reg.id)} title="View Participant Details" className="p-2 bg-white/5 text-gray-400 hover:text-gold rounded-xl transition-all border border-white/10"><Eye size={18}/></button>
                                  <button 
                                    onClick={() => setRegToDelete(reg)} 
                                    title="Delete Registration" 
                                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                                  >
                                    <Trash2 size={18}/>
                                  </button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               {filteredRegistrations.length === 0 && (
                 <div className="text-center py-20">
                    <Database className="text-white/5 mx-auto mb-4" size={64} />
                    <p className="text-gray-500 uppercase font-black text-xs tracking-widest">No matching records found.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'scanner' && (
            <div className="p-8 md:p-16 flex flex-col items-center animate-in slide-in-from-bottom-10 h-full">
               <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-3 space-y-8">
                     {cameraError && (
                       <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                         <span>{cameraError}</span>
                         <button onClick={() => setCameraError(null)} className="text-white hover:text-red-200 ml-3 text-[11px] uppercase font-bold tracking-wider">Dismiss</button>
                       </div>
                     )}
                     {!isCameraActive ? (
                       <div className="aspect-square bg-black/40 border border-white/5 p-16 rounded-[4rem] flex flex-col items-center justify-center space-y-12">
                          <Scan size={64} className="text-gold" />
                          <button 
                            onClick={() => {
                              setCameraError(null);
                              setIsCameraActive(true);
                            }} 
                            className="w-full bg-gold text-black py-7 rounded-[2.5rem] font-cinzel text-3xl font-black uppercase tracking-widest hover:bg-amber-500 glow-gold"
                          >
                            Start Scanner
                          </button>
                       </div>
                     ) : (
                       <LiveScanner onScan={handleScan} onError={setCameraError} onClose={() => setIsCameraActive(false)} lastScannedParticipant={lastScannedParticipant} />
                     )}
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                     <div className="bg-black/20 rounded-[3rem] border border-white/5 p-10 h-full">
                        <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Real-time Check-ins</h4>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {recentScans.map((scan, i) => (
                             <div key={i} className="flex items-center gap-4 p-5 bg-green-500/5 rounded-3xl border border-green-500/10 animate-in slide-in-from-right-4 cursor-pointer" onClick={() => setSelectedId(scan.id)}>
                                <UserCheck size={20} className="text-green-500" />
                                <div className="min-w-0">
                                   <h5 className="text-xs font-black text-white truncate">{scan.name}</h5>
                                   <p className="text-[9px] text-gray-500 font-mono">{scan.id}</p>
                                </div>
                             </div>
                           ))}
                           {recentScans.length === 0 && <p className="text-center text-gray-600 text-[10px] py-10">Scan a QR code to begin attendance check-in.</p>}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-12 md:p-20 space-y-12 animate-in fade-in duration-500">
               <div>
                  <h3 className="text-4xl font-cinzel font-black tracking-widest uppercase mb-4 text-gold">Administrative Options</h3>
                  <p className="text-gray-500 max-w-xl">Configure system behavior, monitor cloud database connectivity, and export symposium data.</p>
               </div>

               {/* Supabase Cloud Connection Card */}
               <div className={`bg-black/60 p-8 md:p-10 rounded-[2.5rem] border shadow-2xl relative overflow-hidden transition-all ${
                  isSupabaseConfigured() && supabaseStatus.connected ? 'border-emerald-500/30' : 'border-white/10'
               }`}>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
                     <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl border ${
                           isSupabaseConfigured() && supabaseStatus.connected 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-white/5 text-gray-400 border-white/10'
                        }`}>
                           <Database size={28} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <h4 className="text-2xl font-cinzel font-bold text-white">Supabase Cloud Database</h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                 isSupabaseConfigured() && supabaseStatus.connected 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                    : 'bg-white/10 text-gray-400 border border-white/20'
                              }`}>
                                 <span className={`w-1.5 h-1.5 rounded-full ${
                                    isSupabaseConfigured() && supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                                 }`}></span>
                                 {isSupabaseConfigured() ? (supabaseStatus.connected ? 'Connected' : 'Connecting...') : 'Disconnected'}
                              </span>
                           </div>
                           <p className="text-gray-400 text-xs mt-1">
                              {isSupabaseConfigured() ? (
                                 <>Project: <span className="text-emerald-400 font-mono font-bold">{getSupabaseConfig().projectName}</span> • Table: <span className="text-gold font-mono">{SUPABASE_TABLE_NAME}</span></>
                              ) : (
                                 <span>Previous project removed • Running in local storage mode</span>
                              )}
                           </p>
                        </div>
                     </div>
                     <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {!isSupabaseConfigured() ? (
                           <button 
                              onClick={() => setShowConnectForm(!showConnectForm)}
                              className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-gold hover:bg-amber-500 text-black transition-all flex items-center gap-2"
                           >
                              <Plus size={14} />
                              {showConnectForm ? 'Cancel' : 'Connect New Database'}
                           </button>
                        ) : (
                           <>
                              <button 
                                 onClick={checkSupabase}
                                 disabled={isCheckingSupabase}
                                 className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                              >
                                 {isCheckingSupabase ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                 Test Connection
                              </button>
                              <button 
                                 onClick={handleDisconnect}
                                 className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                              >
                                 <Trash2 size={14} />
                                 Disconnect
                              </button>
                           </>
                        )}
                        <button 
                           onClick={() => setShowSqlModal(true)}
                           className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                           <Database size={14} className="text-amber-400" />
                           View Table SQL
                        </button>
                        <button 
                           onClick={handleCopySql}
                           className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                              copiedSql ? 'bg-emerald-500 text-black font-bold' : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30'
                           }`}
                        >
                           {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                           {copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}
                        </button>
                     </div>
                  </div>

                  {/* Connect New Supabase Form */}
                  {showConnectForm && !isSupabaseConfigured() && (
                     <form onSubmit={handleConnectNewSupabase} className="my-6 p-6 bg-white/5 rounded-2xl border border-gold/30 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center gap-2 text-gold font-bold text-sm">
                           <Database size={16} />
                           <span>Connect New Supabase Database</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                           Enter the credentials for your new Supabase project. You can find these in your Supabase dashboard under <strong>Project Settings → API</strong>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Project URL</label>
                              <input 
                                 type="url" 
                                 placeholder="https://your-project.supabase.co" 
                                 value={inputUrl}
                                 onChange={(e) => setInputUrl(e.target.value)}
                                 required
                                 className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:border-gold outline-none"
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Anon / Publishable API Key</label>
                              <input 
                                 type="text" 
                                 placeholder="sb_publishable_... or eyJ..." 
                                 value={inputKey}
                                 onChange={(e) => setInputKey(e.target.value)}
                                 required
                                 className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:border-gold outline-none"
                              />
                           </div>
                        </div>
                        {connectError && (
                           <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                              {connectError}
                           </div>
                        )}
                        <div className="flex justify-end gap-3 pt-2">
                           <button 
                              type="button" 
                              onClick={() => setShowConnectForm(false)}
                              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                           >
                              Cancel
                           </button>
                           <button 
                              type="submit" 
                              disabled={isCheckingSupabase}
                              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gold hover:bg-amber-500 text-black flex items-center gap-2"
                           >
                              {isCheckingSupabase ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                              Save & Connect Database
                           </button>
                        </div>
                     </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                     <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Database Mode</p>
                        <p className="text-white text-sm font-bold">
                           {isSupabaseConfigured() ? 'Cloud Database Active' : 'Local Storage Mode'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                           {isSupabaseConfigured() ? 'Real-time REST & WebSocket sync' : 'High-speed local storage buffer'}
                        </p>
                     </div>
                     <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Registrations in Memory</p>
                        <p className="text-gold text-sm font-bold font-mono">{registrations.length} Records</p>
                        <p className="text-gray-500 text-xs mt-1">Safely preserved and available</p>
                     </div>
                     <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Cloud Migration</p>
                           <p className="text-gray-400 text-xs">Push all entries to new Supabase</p>
                        </div>
                        <button 
                           onClick={handleSyncToSupabase}
                           disabled={!isSupabaseConfigured() || isSyncingSupabase || registrations.length === 0}
                           className="mt-3 w-full bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                        >
                           {isSyncingSupabase ? <Loader2 className="animate-spin" size={14} /> : <Cloud size={14} />}
                           Sync All to Supabase
                        </button>
                     </div>
                  </div>

                  {syncMessage && (
                     <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-emerald-400">
                        {syncMessage}
                     </div>
                  )}

                  {isSupabaseConfigured() && supabaseStatus.checked && !supabaseStatus.tableExists && (
                     <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs leading-relaxed flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                           <span className="font-bold block mb-1">Notice for Supabase Table Setup:</span>
                           The <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">registrations</code> table needs to be created in your Supabase SQL Editor. Click <strong>"Copy SQL Schema"</strong> above, then paste and run it in your new Supabase project SQL Editor.
                        </div>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-gold/20 transition-all flex flex-col justify-between">
                     <div>
                        <FileSpreadsheet className="text-gold mb-6" size={40} />
                        <h4 className="text-2xl font-cinzel font-bold text-white mb-2">Export Registrations</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">Download all participant records in CSV format for institutional documentation and team allocation.</p>
                     </div>
                     <button 
                        onClick={handleExportData} 
                        disabled={isExporting || registrations.length === 0}
                        className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-amber-500 transition-all shadow-lg glow-gold disabled:opacity-30"
                     >
                        {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        {isExporting ? 'Exporting...' : 'Download Full Dataset (CSV)'}
                     </button>
                  </div>

                  <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-red-500/20 transition-all flex flex-col justify-between">
                     <div>
                        <LogOut className="text-red-500 mb-6" size={40} />
                        <h4 className="text-2xl font-cinzel font-bold text-white mb-2">Security Logout</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">Terminate the current administrative session. You will need the access key to log back into the hub.</p>
                     </div>
                     <button 
                        onClick={onLogout}
                        className="w-full border border-red-500/20 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                     >
                        <Shield size={18} /> Terminate Admin Session
                     </button>
                  </div>
               </div>

               <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                     <GraduationCap className="text-gold/40" size={24} />
                     <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">System Engine</p>
                        <p className="text-white font-bold text-xs">ELIXIR-Cloud v2.0</p>
                     </div>
                  </div>
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Department of EEE • GCE Erode</p>
               </div>
            </div>
          )}
        </div>

        {/* Global Inspector Modal */}
        {selectedReg && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-200">
            <div className="bg-[#0A0A0A] w-full max-w-2xl rounded-[4rem] border border-gold/30 p-12 md:p-16 relative overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
               <button onClick={() => setSelectedId(null)} className="absolute top-10 right-10 text-gray-600 hover:text-white p-2 z-20"><X size={32}/></button>
               
               <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-8">
                    <div className="p-6 bg-gold/10 text-gold rounded-3xl border border-gold/10"><User size={48} /></div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-cinzel font-black uppercase tracking-widest leading-tight">{selectedReg.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-gold text-sm font-mono tracking-widest">{selectedReg.id}</p>
                        {selectedReg.passType && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40">
                            {selectedReg.passType}
                          </span>
                        )}
                        {selectedReg.daysAttended && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-amber-200/90 bg-white/5 border border-white/10">
                            {selectedReg.daysAttended}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                     <div className="space-y-8">
                        <div>
                           <label className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] block mb-3">Academic Identity</label>
                           <div className="space-y-1">
                              <p className="text-white font-bold text-lg leading-tight">{selectedReg.college}</p>
                              <p className="text-gold font-black uppercase text-[10px] tracking-widest">{selectedReg.department}</p>
                           </div>
                        </div>
                        
                        <div>
                           <label className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] block mb-3">Secure Communication</label>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-white/80 text-sm">
                                 <Mail size={14} className="text-gold/50" />
                                 <span className="font-medium">{selectedReg.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-white/80 text-sm">
                                 <Phone size={14} className="text-gold/50" />
                                 <span className="font-medium">{selectedReg.phone}</span>
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] block mb-3">Pass & Digital Fingerprint</label>
                           <div className="space-y-2">
                              {selectedReg.daysAttended && (
                                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                                    <span>Pass Validity</span>
                                    <span className="text-yellow-300 font-mono font-medium">{selectedReg.daysAttended}</span>
                                 </div>
                              )}
                              {selectedReg.passDetails?.priceDisplay && (
                                 <div className="flex justify-between items-center text-[10px] text-gray-400">
                                    <span>Pass Plan</span>
                                    <span className="text-white font-mono">{selectedReg.passDetails.priceDisplay}</span>
                                 </div>
                              )}
                              <div className="flex justify-between items-center text-[10px] text-gray-500">
                                 <span>Transaction</span>
                                 <span className="text-gold font-mono tracking-widest">{selectedReg.transactionId}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-500">
                                 <span>Registered</span>
                                 <div className="flex items-center gap-2">
                                    <Calendar size={10} />
                                    <span>{new Date(selectedReg.timestamp).toLocaleString()}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-center text-center shadow-inner ${
                           selectedReg.status === RegistrationStatus.PRESENT ? 'bg-blue-500/10 border-blue-500/40' : 'bg-green-500/10 border-green-500/40'
                        }`}>
                           <label className="text-[9px] font-black uppercase tracking-widest block mb-4 text-gray-400">Venue Status</label>
                           <p className={`text-2xl md:text-3xl font-cinzel font-bold uppercase tracking-widest ${selectedReg.status === RegistrationStatus.PRESENT ? 'text-blue-400' : 'text-green-500'}`}>
                             {selectedReg.status.replace('Payment Pending Verification', 'PENDING')}
                           </p>
                        </div>

                        {selectedReg.teamMembers.length > 0 && (
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                             <label className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] block mb-4">Confirmed Team</label>
                             <div className="flex flex-col gap-3">
                                {selectedReg.teamMembers.map((member, i) => (
                                   <div key={i} className="flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
                                      <span className="text-xs text-white/90 font-bold uppercase tracking-wide">{member}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                        )}

                        <div>
                           <label className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] block mb-3">Event Selection</label>
                           <div className="flex flex-wrap gap-2">
                             {selectedReg.events.map((e,i) => (
                                <span key={i} className="text-[9px] font-black text-gold border border-gold/20 px-3 py-1.5 rounded-lg bg-gold/5 uppercase tracking-widest">
                                   {e}
                                </span>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                    {selectedReg.status !== RegistrationStatus.CONFIRMED && (
                      <button onClick={() => onUpdateStatus(selectedReg.id, RegistrationStatus.CONFIRMED)} className="flex-1 bg-white/5 border border-white/10 text-green-500 py-4 sm:py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-black transition-all">Confirm Payment</button>
                    )}
                    {selectedReg.status !== RegistrationStatus.PRESENT && (
                      <button onClick={() => onUpdateStatus(selectedReg.id, RegistrationStatus.PRESENT)} className="flex-1 bg-white/5 border border-white/10 text-blue-400 py-4 sm:py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 hover:text-black transition-all">Mark Present</button>
                    )}
                    <button 
                      onClick={() => setRegToDelete(selectedReg)}
                      className="px-6 py-4 sm:py-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                    <button onClick={() => setSelectedId(null)} className="flex-[2] bg-gold text-black py-4 sm:py-6 rounded-3xl font-cinzel text-xl sm:text-2xl font-black uppercase hover:bg-amber-500 glow-gold transition-all">Close Dossier</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {regToDelete && (
          <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0f111a] w-full max-w-md rounded-[2.5rem] border border-red-500/30 p-6 sm:p-8 relative shadow-2xl space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
                <Trash2 size={26} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-cinzel font-black text-white uppercase tracking-wider">Remove Registration?</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Are you sure you want to remove the registration for <strong className="text-white">{regToDelete.name}</strong> (<span className="text-gold font-mono">{regToDelete.id}</span>)?
                </p>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-gray-500">
                  This will remove the record from both the local database and the Supabase cloud table.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setRegToDelete(null)}
                  className="flex-1 py-3.5 px-4 rounded-xl text-xs font-bold bg-white/5 text-gray-300 hover:bg-white/10 transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  {isDeleting ? 'Removing...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SQL Schema Preview Modal */}
        {showSqlModal && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
            <div className="bg-[#0f111a] w-full max-w-3xl rounded-[2.5rem] border border-gold/40 p-6 sm:p-8 relative max-h-[90vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-cinzel font-black uppercase text-white tracking-wider">Supabase Table Schema</h3>
                    <p className="text-xs text-gray-400">Stores user details, pass tiers, event rosters, and payment status</p>
                  </div>
                </div>
                <button onClick={() => setShowSqlModal(false)} className="text-gray-400 hover:text-white p-2">
                  <X size={22} />
                </button>
              </div>

              <div className="my-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed shrink-0">
                <strong>⚡ Includes Pass Details:</strong> <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">pass_type</code>, <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">pass_key</code>, <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">days_attended</code>, and <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">pass_details (JSONB)</code>. Paste this into your Supabase SQL Editor and click <strong>Run</strong>.
              </div>

              <div className="flex-1 overflow-y-auto rounded-xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-emerald-400 selection:bg-gold selection:text-black">
                <pre className="whitespace-pre-wrap">{SUPABASE_SETUP_SQL}</pre>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0 mt-4">
                <p className="text-[11px] font-mono text-gray-500">Supabase SQL Editor → New Query → Run</p>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowSqlModal(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCopySql}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                      copiedSql ? 'bg-emerald-500 text-black font-bold' : 'bg-gold hover:bg-amber-500 text-black'
                    }`}
                  >
                    {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                    {copiedSql ? 'SQL Copied!' : 'Copy SQL'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
