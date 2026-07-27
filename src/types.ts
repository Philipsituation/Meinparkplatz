export type ParkingType = 'garage' | 'tiefgarage' | 'stellplatz' | 'carport' | 'e_ladesaeule';

export type PriceType = 'hourly' | 'nightly' | 'daily' | 'weekly' | 'monthly';

export type VehicleType = 'pkw' | 'suv_transporter' | 'motorrad' | 'wohnmobil';

export type FeatureType = 
  | 'überdacht' 
  | 'videoüberwacht' 
  | 'e_ladesaeule' 
  | 'zugang_24_7' 
  | 'barrierefrei' 
  | 'umzaeunt' 
  | 'zentrumsnah' 
  | 'bahnhofsnah';

export type PaymentMethod = 'Bar' | 'PayPal';

export type SmileyRating = 'top' | 'zufrieden' | 'naja';

export interface Landlord {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  memberSince: string;
  smileyRating: SmileyRating;
  topCount: number;
  zufriedenCount: number;
  najaCount: number;
  responseRate: string;
  responseTime: string;
  avatarUrl?: string;
}

export interface ParkingListing {
  id: string;
  title: string;
  description: string;
  type: ParkingType;
  price: number;
  priceType: PriceType;
  city: string;
  zipCode: string;
  streetName?: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  availableTimesNote: string;
  suitableVehicles: VehicleType[];
  features: FeatureType[];
  paymentMethods: PaymentMethod[];
  images: string[];
  landlord: Landlord;
  createdAt: string;
  viewsCount: number;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  exactAddress?: string; // e.g. "Kaiserstraße 42, 60329 Frankfurt am Main"
  exactLocationReleased?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: string;
  landlordId: string;
  landlordName: string;
  renterId: string;
  renterName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  expiresAt: string; // 2-week auto delete date
  messages: ChatMessage[];
  canRate: boolean; // unlocked if chatted sufficiently
  exactLocationReleased?: boolean;
}

export interface RatingReview {
  id: string;
  landlordId: string;
  raterName: string;
  rating: SmileyRating;
  tags: string[];
  comment?: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  locationQuery: string;
  radiusKm: number;
  selectedType: string;
  selectedPriceType: string;
  maxPrice: number;
  paymentMethod: string;
  vehicleType: string;
  features: FeatureType[];
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'distance';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  zipCode: string;
  city: string;
  joinedDate: string;
  listingsCount: number;
  totalViews: number;
  totalInquiries: number;
  estimatedEarnings: number;
  ratingsReceived: RatingReview[];
}

export type LegalModalType = 
  | 'impressum' 
  | 'hilfe' 
  | 'sicherheit' 
  | 'sicherheitsluecken' 
  | 'widerruf' 
  | 'jugendschutz' 
  | 'barrierefreiheit' 
  | 'datenschutz' 
  | 'agb' 
  | null;
