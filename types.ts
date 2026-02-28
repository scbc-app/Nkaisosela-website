
export interface SheetRow {
  id: string;
  [key: string]: any;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  category: string;
  imageUrl: string;
  iconType?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  desc: string;
}

export interface UserAccount {
  Email: string;
  Password: string;
  Role: string;
  Name: string;
  LastLogin?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface ClientPartner {
  id: string;
  clientName: string;
  logoUrl: string;
  industry: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  companyName: string;
  quote: string;
  rating: number;
}

export interface GalleryProject {
  id: string;
  projectName: string;
  location: string;
  imageUrl: string;
  description: string;
}

export interface DocumentRecord {
  id: string;
  docType: 'Invoice' | 'Quotation' | 'Receipt' | 'Proforma Invoice' | 'Delivery Note' | 'Credit Note' | 'Debit Note';
  docNumber: string;
  clientName: string;
  date: string;
  amount: string;
  status: string;
  description: string;
}

export interface AppContent {
  services: ServiceItem[];
  blogs: BlogPost[];
  careers: JobPosition[];
  products: SheetRow[];
  users: UserAccount[];
  team: TeamMember[];
  clients: ClientPartner[];
  faqs: FAQItem[];
  testimonials: Testimonial[];
  gallery: GalleryProject[];
  documents: DocumentRecord[];
  settings: Record<string, string>;
}

export interface SheetMetadata {
  name: string;
  lastUpdated: string;
  rowCount: number;
  columns?: string[];
}

export interface SpreadsheetUrls {
  scriptUrl: string;
}

export interface AppState {
  data: SheetRow[];
  content: AppContent;
  metadata: null | SheetMetadata;
  isLoading: boolean;
  error: string | null;
  spreadsheetUrls: SpreadsheetUrls;
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
