// ═══════════════════════════════════════
// Application Type Definitions
// ═══════════════════════════════════════

export interface Service {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  duration: number; // minutes
  priceVND: number;
  priceUSD: number;
  image: string;
  color: string;
  note?: string;
  isActive: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  googleMaps: string;
  hours: string;
  phone: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  branchId: string;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  totalAmount: number;
  bookingCode: string;
  createdAt: string;
}

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discountPercent?: number;
  validUntil: string;
  isActive: boolean;
}

export type Locale = 'vi' | 'en' | 'cn' | 'jp' | 'kr';

export interface Dictionary {
  [key: string]: string | Dictionary;
}
