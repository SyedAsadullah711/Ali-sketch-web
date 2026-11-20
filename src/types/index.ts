export interface WebsiteSettings {
  id?: number;
  studioName: string;
  artistName: string;
  tagline: string;
  announcementText: string;
  announcementBg: string;
  announcementTextColor: string;
  announcementVisible: boolean;
  logoText: string;
  logoImageUrl: string;
  faviconUrl: string;
  heroHeading: string;
  heroSubheading: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImageUrl: string;
  aboutHeading: string;
  aboutSubheading: string;
  aboutStory: string;
  aboutExperience: string;
  aboutSpecialization: string;
  aboutPhilosophy: string;
  aboutYearsExperience: number;
  aboutPersonalMessage: string;
  aboutImageUrl: string;
  howItWorksHeading: string;
  howItWorksSubheading: string;
  pricingHeading: string;
  pricingSubheading: string;
  pricingNote: string;
  faqHeading: string;
  faqSubheading: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  businessAddress: string;
  instagramUrl: string;
  pinterestUrl: string;
  facebookUrl: string;
  currency: string;
  currencySymbol: string;
  defaultCountry: string;
  timezone: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  maintenanceMode: boolean;
  navItems: string;
  updatedAt?: string;
}

export interface PageSection {
  id: number;
  sectionKey: string;
  title: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  startingPrice: number;
  availableSizes: string; // JSON array of string
  estimatedTime: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ServicePricing {
  id: number;
  sketchType: string;
  paperSize: string;
  dimensions: string;
  basePrice: number;
  maxDefaultSubjects: number;
  extraSubjectPrice: number;
  framingPrice: number;
  giftPackagingPrice: number;
  estimatedDays: string;
  isActive: boolean;
  displayOrder: number;
}

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  _count?: {
    images: number;
  };
}

export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  category?: GalleryCategory;
  imageUrl: string;
  beforeImageUrl?: string;
  tags?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface Testimonial {
  id: number;
  customerName: string;
  location: string;
  reviewText: string;
  rating: number;
  customerImageUrl?: string;
  sketchType: string;
  dateString: string;
  isFeatured: boolean;
  isVisible: boolean;
  isDemo: boolean;
  displayOrder: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface PublicContentData {
  settings: WebsiteSettings;
  sections: PageSection[];
  services: Service[];
  pricing: ServicePricing[];
  galleryImages: GalleryImage[];
  categories: GalleryCategory[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  processSteps: ProcessStep[];
}

export interface EnquiryAttachment {
  id: number;
  enquiryId: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
}

export interface EnquiryNote {
  id: number;
  enquiryId: number;
  authorName: string;
  noteText: string;
  isCustomerVisible: boolean;
  createdAt: string;
}

export interface EnquiryStatusHistory {
  id: number;
  enquiryId: number;
  previousStatus: string;
  newStatus: string;
  changeReason?: string;
  updatedBy: string;
  createdAt: string;
}

export interface Enquiry {
  id: number;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  sketchType: string;
  sketchSize: string;
  subjectsCount: number;
  orientation: string;
  paperType: string;
  framing: string;
  specialInstructions?: string;
  preferredDeliveryDate?: string;
  giftPackaging: boolean;
  additionalRequests?: string;
  estimatedPrice: number;
  quotedPrice?: number;
  currency: string;
  status: string;
  adminNotes?: string;
  estimatedCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: EnquiryAttachment[];
  notes?: EnquiryNote[];
  statusHistory?: EnquiryStatusHistory[];
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
  createdAt?: string;
}
