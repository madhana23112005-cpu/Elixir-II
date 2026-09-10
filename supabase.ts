import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Registration, RegistrationStatus } from './types';

// Read from environment or local storage (cleared by default since previous project was blocked)
function getEnvOrStorage(envKey: string, storageKey: string): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey);
    if (stored && stored.trim()) return stored.trim();
  }
  const envVal = ((import.meta as any).env as Record<string, string | undefined>)?.[envKey];
  return (envVal || '').trim();
}

export const SUPABASE_TABLE_NAME = 'registrations';

export function getSupabaseConfig() {
  const rawUrl = (getEnvOrStorage('VITE_SUPABASE_URL', 'elixir_supabase_url') || 'https://kohpzwmolsuxwhqyigat.supabase.co').trim();
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const key = (getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'elixir_supabase_key') || 'sb_publishable_WAbdH3CcAXSG7hg1PUC4lg_iidc_jgU').trim();
  const projectId = (getEnvOrStorage('VITE_SUPABASE_PROJECT_ID', 'elixir_supabase_project_id') || 'kohpzwmolsuxwhqyigat').trim();
  const projectName = (getEnvOrStorage('VITE_SUPABASE_PROJECT_NAME', 'elixir_supabase_project_name') || 'Elixir-II').trim();

  return {
    url: cleanUrl,
    key,
    projectId,
    projectName,
    isConfigured: Boolean(cleanUrl && key && cleanUrl.startsWith('http'))
  };
}

export const SUPABASE_PROJECT_NAME = getSupabaseConfig().projectName;
export const SUPABASE_PROJECT_ID = getSupabaseConfig().projectId;
export const SUPABASE_URL = getSupabaseConfig().url;
export const SUPABASE_ANON_KEY = getSupabaseConfig().key;

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    cachedClient = null;
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(config.url, config.key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedClient;
}

// Fallback export for backward compatibility
export const supabase = {
  from: (tableName: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      } as any;
    }
    return client.from(tableName);
  },
  channel: (name: string) => {
    const client = getSupabaseClient();
    if (!client) {
      return {
        on: () => ({ subscribe: () => {} }),
      } as any;
    }
    return client.channel(name);
  },
  removeChannel: (channel: any) => {
    const client = getSupabaseClient();
    if (client && channel) {
      client.removeChannel(channel);
    }
  }
} as unknown as SupabaseClient;

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

export function saveSupabaseCredentials(url: string, anonKey: string, projectId: string = '', projectName: string = ''): void {
  if (typeof window === 'undefined') return;
  const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  localStorage.setItem('elixir_supabase_url', cleanUrl);
  localStorage.setItem('elixir_supabase_key', anonKey.trim());
  if (projectId) localStorage.setItem('elixir_supabase_project_id', projectId.trim());
  if (projectName) localStorage.setItem('elixir_supabase_project_name', projectName.trim());
  cachedClient = null;
}

export function clearSupabaseCredentials(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('elixir_supabase_url');
  localStorage.removeItem('elixir_supabase_key');
  localStorage.removeItem('elixir_supabase_project_id');
  localStorage.removeItem('elixir_supabase_project_name');
  cachedClient = null;
}

// Full SQL query for user's convenience in Supabase SQL Editor for the new database
export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  pass_type TEXT,
  pass_key TEXT,
  days_attended TEXT,
  pass_details JSONB DEFAULT '{}'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  events JSONB DEFAULT '[]'::jsonb,
  total_fee NUMERIC DEFAULT 0,
  transaction_id TEXT,
  status TEXT DEFAULT 'Payment Pending Verification',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add pass columns if the table was previously created without them
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS pass_type TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS pass_key TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS days_attended TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS pass_details JSONB DEFAULT '{}'::jsonb;

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert for symposium registration
CREATE POLICY "Allow public insert"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public read for verify & admin
CREATE POLICY "Allow public select"
  ON public.registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public update for check-ins & approvals
CREATE POLICY "Allow public update"
  ON public.registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Allow public delete for admin actions
CREATE POLICY "Allow public delete"
  ON public.registrations
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Helpful indexes for instant search & lookup
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_transaction_id ON public.registrations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_registrations_pass_key ON public.registrations(pass_key);
CREATE INDEX IF NOT EXISTS idx_registrations_pass_type ON public.registrations(pass_type);

-- Enable real-time updates for live admin dashboard & check-ins
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
`;

/**
 * Normalizes rows from Supabase into the application's Registration model,
 * supporting both snake_case and camelCase database columns seamlessly.
 */
export function normalizeSupabaseRow(row: any): Registration {
  let parsedTeamMembers: string[] = [];
  if (Array.isArray(row.team_members)) {
    parsedTeamMembers = row.team_members;
  } else if (Array.isArray(row.teamMembers)) {
    parsedTeamMembers = row.teamMembers;
  } else if (typeof row.team_members === 'string') {
    try {
      parsedTeamMembers = JSON.parse(row.team_members);
    } catch {
      parsedTeamMembers = [];
    }
  }

  let parsedEvents: string[] = [];
  if (Array.isArray(row.events)) {
    parsedEvents = row.events;
  } else if (Array.isArray(row.events)) {
    parsedEvents = row.events;
  } else if (typeof row.events === 'string') {
    try {
      parsedEvents = JSON.parse(row.events);
    } catch {
      parsedEvents = [];
    }
  }

  let parsedPassDetails: Record<string, any> | undefined = undefined;
  if (row.pass_details && typeof row.pass_details === 'object') {
    parsedPassDetails = row.pass_details;
  } else if (row.passDetails && typeof row.passDetails === 'object') {
    parsedPassDetails = row.passDetails;
  } else if (typeof row.pass_details === 'string') {
    try {
      parsedPassDetails = JSON.parse(row.pass_details);
    } catch {
      parsedPassDetails = undefined;
    }
  }

  return {
    id: row.id || '',
    name: row.name || '',
    college: row.college || '',
    department: row.department || '',
    email: row.email || '',
    phone: row.phone || '',
    passType: row.pass_type || row.passType || (row.pass_key ? `${row.pass_key} PASS` : undefined),
    passKey: row.pass_key || row.passKey || undefined,
    daysAttended: row.days_attended || row.daysAttended || undefined,
    passDetails: parsedPassDetails,
    teamMembers: parsedTeamMembers,
    events: parsedEvents,
    totalFee: Number(row.total_fee ?? row.totalFee ?? 0),
    transactionId: row.transaction_id || row.transactionId || '',
    status: (row.status as RegistrationStatus) || RegistrationStatus.PENDING,
    timestamp: row.timestamp || row.created_at || new Date().toISOString(),
  };
}

/**
 * Checks connection and table presence in Supabase
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  isConfigured: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { connected: false, tableExists: false, isConfigured: false, error: 'No database credentials configured.' };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { connected: false, tableExists: false, isConfigured: false, error: 'Supabase client could not be initialized.' };
  }

  try {
    const { data, error } = await client
      .from(SUPABASE_TABLE_NAME)
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
        return { connected: true, tableExists: false, isConfigured: true, error: error.message };
      }
      return { connected: false, tableExists: false, isConfigured: true, error: error.message };
    }

    return { connected: true, tableExists: true, isConfigured: true };
  } catch (err: any) {
    return { connected: false, tableExists: false, isConfigured: true, error: err?.message || 'Unknown network error' };
  }
}

/**
 * Sends a registration to Supabase with snake_case and camelCase compatibility.
 */
export async function insertRegistrationToSupabase(reg: Registration): Promise<{ success: boolean; isConfigured?: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, isConfigured: false };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { success: true, isConfigured: false };
  }

  // Standard Postgres / Supabase schema payload
  const passTypeVal = reg.passType || (reg.passKey ? `${reg.passKey} PASS` : 'CONCLAVE PASS');
  const passKeyVal = reg.passKey || (reg.passType ? reg.passType.replace(' PASS', '') : '');
  const daysAttendedVal = reg.daysAttended || (passKeyVal === 'ELITE' ? 'Day 1 & Day 2 (Both Days)' : passKeyVal === 'NOVA' ? 'Day 1 Only' : passKeyVal === 'AURA' ? 'Day 2 Only' : '');
  const passDetailsVal = reg.passDetails || {};

  const payloadSnake = {
    id: reg.id,
    name: reg.name,
    college: reg.college,
    department: reg.department,
    email: reg.email,
    phone: reg.phone,
    pass_type: passTypeVal,
    pass_key: passKeyVal,
    days_attended: daysAttendedVal,
    pass_details: passDetailsVal,
    team_members: reg.teamMembers,
    events: reg.events,
    total_fee: reg.totalFee,
    transaction_id: reg.transactionId || '',
    status: reg.status,
    timestamp: reg.timestamp,
    created_at: reg.timestamp,
  };

  try {
    const { error: insertErr } = await client
      .from(SUPABASE_TABLE_NAME)
      .upsert(payloadSnake, { onConflict: 'id' });

    if (!insertErr) {
      return { success: true, isConfigured: true };
    }

    // Fallback if camelCase
    const payloadCamel = {
      id: reg.id,
      name: reg.name,
      college: reg.college,
      department: reg.department,
      email: reg.email,
      phone: reg.phone,
      passType: passTypeVal,
      passKey: passKeyVal,
      daysAttended: daysAttendedVal,
      passDetails: passDetailsVal,
      teamMembers: reg.teamMembers,
      events: reg.events,
      totalFee: reg.totalFee,
      transactionId: reg.transactionId || '',
      status: reg.status,
      timestamp: reg.timestamp,
    };

    const { error: camelErr } = await client
      .from(SUPABASE_TABLE_NAME)
      .upsert(payloadCamel, { onConflict: 'id' });

    if (!camelErr) {
      return { success: true, isConfigured: true };
    }

    return { success: false, isConfigured: true, error: insertErr.message || camelErr.message };
  } catch (err: any) {
    return { success: false, isConfigured: true, error: err?.message || 'Network error connecting to Supabase' };
  }
}

/**
 * Fetches all registrations from Supabase
 */
export async function fetchSupabaseRegistrations(): Promise<{
  data: Registration[];
  isConfigured?: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], isConfigured: false };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { data: [], isConfigured: false };
  }

  try {
    const { data, error } = await client
      .from(SUPABASE_TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }

    const normalized = (data || []).map(normalizeSupabaseRow);
    return { data: normalized, isConfigured: true };
  } catch (err: any) {
    return { data: [], isConfigured: true, error: err?.message || 'Failed to fetch registrations from Supabase' };
  }
}

/**
 * Updates status in Supabase
 */
export async function updateSupabaseRegistrationStatus(id: string, status: RegistrationStatus): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { success: true };
  }

  try {
    const { error } = await client
      .from(SUPABASE_TABLE_NAME)
      .update({ status })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Deletes a registration in Supabase
 */
export async function deleteSupabaseRegistration(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { success: true };
  }

  try {
    const { error } = await client
      .from(SUPABASE_TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Subscribes to real-time changes on the Supabase registrations table
 */
export function subscribeToSupabaseRealtime(onUpdate: () => void): () => void {
  if (!isSupabaseConfigured()) {
    return () => {};
  }
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('registrations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SUPABASE_TABLE_NAME },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    return () => {};
  }
}

