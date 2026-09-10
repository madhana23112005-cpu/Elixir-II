
export enum EventCategory {
  TECHNICAL = 'Technical',
  NON_TECHNICAL = 'Non-Technical'
}

export enum RegistrationStatus {
  PENDING = 'Payment Pending Verification',
  CONFIRMED = 'Confirmed',
  REJECTED = 'Rejected',
  PRESENT = 'Checked In'
}

export interface Coordinator {
  name: string;
  phone?: string;
}

export interface EventRound {
  name: string;
  details: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  slogan?: string;
  category: EventCategory;
  day?: 1 | 2;
  dayLabel?: string;
  rules: string[];
  rounds?: EventRound[];
  timing: string;
  prize: string;
  fee: number;
  feeDisplay?: string;
  feeNote?: string;
  whatsappUrl?: string;
  image: string;
  maxMembers: number;
  coordinators?: Coordinator[];
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  image_url: string;
  published_at: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  institution: string;
  image: string;
  time: string;
  topic: string;
}

export interface ScheduleItem {
  day?: 1 | 2;
  dayTitle?: string;
  time: string;
  activity: string;
  type: string;
  venue: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Title' | 'Gold' | 'Silver' | 'Bronze';
  logo: string;
}

export enum PassType {
  NOVA = 'NOVA PASS',
  AURA = 'AURA PASS',
  ELITE = 'ELITE PASS'
}

export interface Registration {
  id: string;
  name: string;
  college: string;
  department: string;
  email: string;
  phone: string;
  passType?: PassType | string;
  passKey?: string;
  daysAttended?: string;
  passDetails?: Record<string, any>;
  teamMembers: string[];
  events: string[];
  totalFee: number;
  transactionId?: string;
  status: RegistrationStatus;
  timestamp: string;
}
