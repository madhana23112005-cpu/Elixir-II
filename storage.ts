import { Registration, RegistrationStatus, BlogPost } from './types';
import { 
  insertRegistrationToSupabase, 
  fetchSupabaseRegistrations, 
  updateSupabaseRegistrationStatus, 
  deleteSupabaseRegistration,
  subscribeToSupabaseRealtime,
  isSupabaseConfigured
} from './supabase';

const REGISTRATIONS_STORAGE_KEY = 'elixir_registrations';
const BLOGS_STORAGE_KEY = 'elixir_blogs';
const STORAGE_EVENT_NAME = 'elixir_data_updated';

// Legacy sample IDs to automatically purge
export const LEGACY_SAMPLE_IDS = ['ELX-8934', 'ELX-4721', 'ELX-3109'];

// Seed sample registrations: kept empty so only genuine registrations appear
const SEED_REGISTRATIONS: Registration[] = [];

// Seed sample blogs if none exist
const SEED_BLOGS: BlogPost[] = [
  {
    id: 'blog-transit-irt',
    title: 'GETTING TO IRT: Government Bus Services & Transit Guide to Campus',
    slug: 'getting-to-irt-bus-guide',
    category: 'Campus Transit',
    author: 'Barath kumar (Secretary) & Bala Muppidathy (Co-ordinator)',
    excerpt: 'Complete morning bus departure timings, routes from Erode Bus Stand & Chithode, and travel tips to reach Government College of Engineering, Erode (formerly IRTT).',
    content: `## GETTING TO IRT
### Government bus services to the college campus

Welcome delegates to ELIXIR'26! To help all participants, students, and guests reach the Government College of Engineering, Erode (formerly Institute of Road and Transport Technology — IRTT) conveniently on symposium days (**September 28 & 29, 2026**), our student coordination team has compiled the official morning bus schedules and transit guide.

---

### MORNING DEPARTURES

#### 🚏 FROM ERODE BUS STAND
- **Route Bus** — 8:00 AM
- **Town Govt Bus** — 8:00 AM
- **Town Govt Bus 5B** — 8:30 AM

#### 🚏 FROM CHITHODE
- **Route Bus** — 8:15 – 8:20 AM
- **Town Govt Bus** — 8:30 – 8:35 AM
- **Town Govt Bus 5B** — Around 8:50 AM

---

### ALSO GOOD TO KNOW

- ■ **Route buses** from Erode Bus Stand and Chithode reach the college by around **8:45 AM**, perfectly in time for morning registrations and inauguration.
- ■ **Town bus** from Lakshmi Nagar / Bhavani Bypass departs about **8:10 AM** and reaches the college by **8:30 AM**.
- ■ **Bus No. 3 and B12** run roughly every **5 minutes** from Lakshmi Nagar or Bhavani Bypass — get down at the Government College of Engineering stop, then a short 2-minute walk to the campus entrance.
- ■ **Bus No. 3** runs roughly every **10 minutes** from Erode Bus Stand — get down directly at the Government College of Engineering (IRTT) bus stop, then a short walk into the EEE Department block.

---

### OFFICIAL STUDENT COORDINATORS CONTACT

For any navigation assistance, route confirmation, or event queries, feel free to reach out directly to our student coordinators:

- **Barath kumar (Secretary)**: +91 63806 16416
- **Bala Muppidathy (Co-ordinator)**: +91 80151 72974
- **Official Email**: gceelixir26@gmail.com
- **Campus Address**: Department of EEE, Government College of Engineering, Chithode, Erode - 638316`,
    image_url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
    published_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'blog-1',
    title: "Welcome to ELIXIR'26: The Premier EEE Technical Symposium",
    slug: 'welcome-to-elixir-26',
    category: 'Announcement',
    author: 'ELIXIR Organizing Committee',
    excerpt: "Get ready for an electrifying showcase of engineering excellence, competitive technical events, and innovative paper presentations at GCE Erode.",
    content: `Welcome to ELIXIR'26, the national-level technical symposium proudly presented by the Department of Electrical and Electronics Engineering at Government College of Engineering, Erode.

ELIXIR'26 brings together the brightest minds across engineering colleges to compete, collaborate, and innovate. With curated challenges spanning embedded systems, circuit debugging, paper presentations, hardware projects, and exciting non-technical games, ELIXIR'26 provides an unparalleled stage to celebrate engineering craftsmanship.

### Highlights & Passes for ELIXIR'26
- **NOVA PASS (Day 1 • 28/09/2026):** Morning Solar 2.0 Workshop & Afternoon Project Display. ₹200/person for 1 event or ₹300/person for both events!
- **AURA PASS (Day 2 • 29/09/2026):** ₹300/person includes 1 Technical Event + 1 Non-Technical Event completely FREE!
- **ELITE PASS (Both Days • 28 & 29/09/2026):** ₹450/person overall conclave pass for Day 1 (Workshop & Project Display) + Day 2 (1 Tech & 1 Non-Tech). Accommodation not provided, food & refreshments included.

Join us on September 28 & 29, 2026, at GCE Erode. The stage is set!`,
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'blog-2',
    title: 'Mastering the Embedded Mind & Circuit Design Challenges',
    slug: 'mastering-embedded-mind-challenge',
    category: 'Technical',
    author: 'Barath Kumar M',
    excerpt: 'Key strategies and conceptual tips for conquering C programming logic, embedded behavior predictions, and analog fault hunting.',
    content: `Embedded Mind is crafted to test your core thinking and intuition as an embedded engineer rather than just typing boilerplate code.

### Preparation Checklist
1. **Pointers and Memory Layout:** Understand pointer arithmetic, bitwise operators (AND, OR, XOR, shifts), and register masking techniques.
2. **Interrupts & Timers:** Review how embedded controllers handle state transitions, volatile qualifiers, and timer delays.
3. **Output Prediction:** Practice mental tracing of C code snippets without relying on IDE debuggers.

Speed, accuracy, and strong fundamentals are what separate the winners in this fast-paced buzzer and simulation challenge!`,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'blog-3',
    title: 'Guidelines for PaperXpose and Hardware Project Display',
    slug: 'paperxpose-and-project-display-guide',
    category: 'Tutorial',
    author: 'Palani R & Akash S',
    excerpt: 'Everything you need to know about preparing your abstract, presentation deck, and working hardware prototypes for the jury.',
    content: `Both PaperXpose and Project Display provide an exceptional platform to present your research and engineering innovations to industry and academic judges.

### Key Evaluation Criteria
- **Originality & Innovation:** Novel approaches to solving real-world electrical, electronics, energy, or automation problems.
- **Methodology & Working Proof:** For Project Display, a functioning hardware prototype or working model is mandatory.
- **Clarity of Presentation:** Deliver your points concisely within the 5–7 minute presentation window.
- **Q&A Handling:** Be ready to answer questions regarding design trade-offs, scalability, and component choices.

Remember to submit your PaperXpose abstracts in advance to the official symposium email!`,
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    published_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

function notifyStorageChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME));
  }
}

// -------------------------------------------------------------
// REGISTRATIONS API
// -------------------------------------------------------------

export function getRegistrations(): Registration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: Registration[] = JSON.parse(raw);
    // Automatically purge legacy sample registrations
    const cleaned = parsed.filter(r => !LEGACY_SAMPLE_IDS.includes(r.id));
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Error reading registrations from localStorage:', err);
    return [];
  }
}

export function getRegistrationByEmail(email: string): Registration | null {
  const cleanEmail = email.trim().toLowerCase();
  const list = getRegistrations();
  return list.find(r => r.email.toLowerCase() === cleanEmail) || null;
}

export function getRegistrationsByEmail(email: string): Registration[] {
  const cleanEmail = email.trim().toLowerCase();
  const list = getRegistrations();
  return list.filter(r => r.email.toLowerCase() === cleanEmail);
}

export function getRegistrationById(id: string): Registration | null {
  const cleanId = id.trim().toUpperCase();
  const list = getRegistrations();
  return list.find(r => r.id.toUpperCase() === cleanId) || null;
}

export async function fetchRegistrationsFromCloud(): Promise<Registration[]> {
  if (!isSupabaseConfigured()) {
    return getRegistrations();
  }
  try {
    const { data, error } = await fetchSupabaseRegistrations();
    if (!error && data) {
      const cleaned = data.filter(r => !LEGACY_SAMPLE_IDS.includes(r.id));
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(cleaned));
      notifyStorageChanged();
      return cleaned;
    }
  } catch (err) {
    console.warn('Could not sync registrations from Supabase:', err);
  }
  return getRegistrations();
}

export async function addRegistration(reg: Registration): Promise<{ success: boolean; supabaseSaved: boolean; error?: string }> {
  const list = getRegistrations();
  // If exists with same ID, update, else prepend
  const index = list.findIndex(r => r.id === reg.id);
  if (index >= 0) {
    list[index] = reg;
  } else {
    list.unshift(reg);
  }
  localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
  notifyStorageChanged();

  if (!isSupabaseConfigured()) {
    return { success: true, supabaseSaved: false };
  }

  // Send to Supabase cloud database
  try {
    const cloudRes = await insertRegistrationToSupabase(reg);
    if (!cloudRes.success) {
      return { success: true, supabaseSaved: false, error: cloudRes.error };
    }
    return { success: true, supabaseSaved: true };
  } catch (err: any) {
    return { success: true, supabaseSaved: false, error: err?.message };
  }
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<void> {
  const list = getRegistrations();
  const updated = list.map(r => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(updated));
  notifyStorageChanged();

  if (!isSupabaseConfigured()) return;

  // Update on Supabase cloud database
  try {
    await updateSupabaseRegistrationStatus(id, status);
  } catch (err) {
    console.warn('Supabase status update failed:', err);
  }
}

export async function deleteRegistration(id: string): Promise<void> {
  const list = getRegistrations();
  const filtered = list.filter(r => r.id !== id);
  localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(filtered));
  notifyStorageChanged();

  if (!isSupabaseConfigured()) return;

  // Delete from Supabase cloud database
  try {
    await deleteSupabaseRegistration(id);
  } catch (err) {
    console.warn('Supabase delete failed:', err);
  }
}

/**
 * Removes legacy mock / sample registrations from local storage and Supabase
 */
export async function purgeLegacySampleRegistrations(): Promise<number> {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(REGISTRATIONS_STORAGE_KEY) : null;
  let count = 0;
  if (raw) {
    try {
      const parsed: Registration[] = JSON.parse(raw);
      const filtered = parsed.filter(r => !LEGACY_SAMPLE_IDS.includes(r.id));
      count = parsed.length - filtered.length;
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(filtered));
      notifyStorageChanged();
    } catch {
      // ignore
    }
  }
  for (const id of LEGACY_SAMPLE_IDS) {
    try {
      await deleteSupabaseRegistration(id);
    } catch {
      // ignore
    }
  }
  return count;
}

export function subscribeToRegistrations(callback: (registrations: Registration[]) => void): () => void {
  const handler = () => {
    callback(getRegistrations());
  };

  window.addEventListener(STORAGE_EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  // Subscribe to Supabase real-time changes
  const unsubscribeSupabase = subscribeToSupabaseRealtime(async () => {
    const cloudData = await fetchRegistrationsFromCloud();
    callback(cloudData);
  });

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
    unsubscribeSupabase();
  };
}

// -------------------------------------------------------------
// BLOGS API
// -------------------------------------------------------------

export function getBlogs(): BlogPost[] {
  if (typeof window === 'undefined') return SEED_BLOGS;
  try {
    const raw = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(SEED_BLOGS));
      return SEED_BLOGS;
    }
    const parsed: BlogPost[] = JSON.parse(raw);
    // Ensure the Getting to IRT transit blog is present
    const hasTransitBlog = parsed.some(b => b.id === 'blog-transit-irt' || b.slug === 'getting-to-irt-bus-guide');
    if (!hasTransitBlog) {
      const transitBlog = SEED_BLOGS.find(b => b.id === 'blog-transit-irt');
      if (transitBlog) {
        parsed.unshift(transitBlog);
        localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(parsed));
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error reading blogs from localStorage:', err);
    return SEED_BLOGS;
  }
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const list = getBlogs();
  return list.find(b => b.slug === slug) || null;
}

export async function saveBlog(blogData: Partial<BlogPost> & { title: string }): Promise<BlogPost> {
  const list = getBlogs();
  const slug = blogData.slug || blogData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const id = blogData.id || `blog-${Date.now()}`;
  const published_at = blogData.published_at || new Date().toISOString();

  const fullBlog: BlogPost = {
    id,
    title: blogData.title,
    slug,
    content: blogData.content || '',
    excerpt: blogData.excerpt || '',
    author: blogData.author || 'ELIXIR Team',
    category: blogData.category || 'Technical',
    image_url: blogData.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    published_at
  };

  const index = list.findIndex(b => b.id === id);
  if (index >= 0) {
    list[index] = fullBlog;
  } else {
    list.unshift(fullBlog);
  }

  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(list));
  notifyStorageChanged();
  return fullBlog;
}

export async function deleteBlog(id: string): Promise<void> {
  const list = getBlogs();
  const filtered = list.filter(b => b.id !== id);
  localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(filtered));
  notifyStorageChanged();
}

export function subscribeToBlogs(callback: (blogs: BlogPost[]) => void): () => void {
  const handler = () => {
    callback(getBlogs());
  };

  window.addEventListener(STORAGE_EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}

// -------------------------------------------------------------
// UTILITY: ADMIN LOGOUT
// -------------------------------------------------------------

export const logoutAdmin = () => {
  sessionStorage.removeItem('elixir_admin_auth');
  sessionStorage.clear();
  window.location.href = '#/login';
  window.location.reload();
};
