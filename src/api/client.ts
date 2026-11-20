import {
  PublicContentData,
  AdminUser,
  WebsiteSettings,
  PageSection,
  Service,
  ServicePricing,
  GalleryImage,
  GalleryCategory,
  Testimonial,
  FAQ,
  Enquiry,
} from '../types';

const API_BASE = '/api';

// Helper for authorized fetch
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('stroke_admin_token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type only if body is NOT FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred.';
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// Public API
export const publicApi = {
  getContent: () => apiFetch<PublicContentData>('/content'),
  submitEnquiry: (formData: FormData) =>
    apiFetch<{
      success: boolean;
      referenceNumber: string;
      enquiryId: number;
      estimatedPrice: number;
      message: string;
    }>('/enquiries', {
      method: 'POST',
      body: formData,
    }),
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiFetch<{ success: boolean; token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () =>
    apiFetch<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    }),
  getMe: () => apiFetch<{ user: AdminUser }>('/auth/me'),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ success: boolean; message: string }>('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Admin API
export const adminApi = {
  // Dashboard
  getDashboard: () =>
    apiFetch<{
      metrics: {
        totalEnquiries: number;
        newEnquiries: number;
        inProgressEnquiries: number;
        completedEnquiries: number;
        totalArtworks: number;
        totalReviews: number;
      };
      recentEnquiries: Enquiry[];
      latestArtworks: GalleryImage[];
      recentReviews: Testimonial[];
      monthlyStats: { month: string; enquiries: number }[];
      statusCounts: Record<string, number>;
    }>('/admin/dashboard'),

  // Website Settings
  getSettings: () => apiFetch<WebsiteSettings>('/admin/settings'),
  updateSettings: (settings: Partial<WebsiteSettings>) =>
    apiFetch<{ success: boolean; settings: WebsiteSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Sections
  getSections: () => apiFetch<PageSection[]>('/admin/sections'),
  updateSection: (id: number, data: Partial<PageSection>) =>
    apiFetch<{ success: boolean; section: PageSection }>(`/admin/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Gallery
  getGallery: () => apiFetch<GalleryImage[]>('/admin/gallery'),
  createArtwork: (formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; image: GalleryImage }>('/admin/gallery', {
      method: 'POST',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  updateArtwork: (id: number, formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; image: GalleryImage }>(`/admin/gallery/${id}`, {
      method: 'PUT',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  deleteArtwork: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/gallery/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () => apiFetch<GalleryCategory[]>('/admin/gallery/categories'),
  createCategory: (data: { name: string; slug?: string; displayOrder?: number }) =>
    apiFetch<{ success: boolean; category: GalleryCategory }>('/admin/gallery/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Services
  getServices: () => apiFetch<Service[]>('/admin/services'),
  createService: (formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; service: Service }>('/admin/services', {
      method: 'POST',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  updateService: (id: number, formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; service: Service }>(`/admin/services/${id}`, {
      method: 'PUT',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  deleteService: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/services/${id}`, {
      method: 'DELETE',
    }),

  // Pricing
  getPricing: () => apiFetch<ServicePricing[]>('/admin/pricing'),
  createPricing: (data: Partial<ServicePricing>) =>
    apiFetch<{ success: boolean; rule: ServicePricing }>('/admin/pricing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePricing: (id: number, data: Partial<ServicePricing>) =>
    apiFetch<{ success: boolean; rule: ServicePricing }>(`/admin/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePricing: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/pricing/${id}`, {
      method: 'DELETE',
    }),

  // Testimonials
  getTestimonials: () => apiFetch<Testimonial[]>('/admin/testimonials'),
  createTestimonial: (formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; review: Testimonial }>('/admin/testimonials', {
      method: 'POST',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  updateTestimonial: (id: number, formData: FormData | object) => {
    const isFormData = formData instanceof FormData;
    return apiFetch<{ success: boolean; review: Testimonial }>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: isFormData ? formData : JSON.stringify(formData),
    });
  },
  deleteTestimonial: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // FAQs
  getFaqs: () => apiFetch<FAQ[]>('/admin/faqs'),
  createFaq: (data: Partial<FAQ>) =>
    apiFetch<{ success: boolean; faq: FAQ }>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFaq: (id: number, data: Partial<FAQ>) =>
    apiFetch<{ success: boolean; faq: FAQ }>(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFaq: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/faqs/${id}`, {
      method: 'DELETE',
    }),

  // Enquiries
  getEnquiries: (params?: { search?: string; status?: string; dateFrom?: string; dateTo?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params?.dateTo) query.set('dateTo', params.dateTo);
    if (params?.page) query.set('page', String(params.page));
    return apiFetch<{
      enquiries: Enquiry[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/admin/enquiries?${query.toString()}`);
  },
  getEnquiryById: (id: number) => apiFetch<Enquiry>(`/admin/enquiries/${id}`),
  updateEnquiryStatus: (
    id: number,
    data: {
      newStatus: string;
      changeReason?: string;
      quotedPrice?: number;
      estimatedCompletionDate?: string;
      adminNotes?: string;
    }
  ) =>
    apiFetch<{ success: boolean; enquiry: Enquiry }>(`/admin/enquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  addEnquiryNote: (id: number, data: { noteText: string; isCustomerVisible?: boolean }) =>
    apiFetch<{ success: boolean; note: any }>(`/admin/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEnquiry: (id: number, data: Partial<Enquiry>) =>
    apiFetch<{ success: boolean; enquiry: Enquiry }>(`/admin/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Media Library
  getMedia: () =>
    apiFetch<
      {
        id: number;
        filename: string;
        originalName: string;
        mimeType: string;
        fileSize: number;
        fileUrl: string;
        altText?: string;
        folder: string;
        createdAt: string;
      }[]
    >('/admin/media'),
  uploadMedia: (formData: FormData) =>
    apiFetch<{ success: boolean; media: any[] }>('/admin/media/upload', {
      method: 'POST',
      body: formData,
    }),
  deleteMedia: (id: number) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/media/${id}`, {
      method: 'DELETE',
    }),
};
