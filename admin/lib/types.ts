export type ItemCategory = 'Suits' | 'Bridal gowns' | 'Accessories' | 'Tuxedo' | 'Suit';

export type InventorySimpleStatus = 'Available' | 'Rented' | 'Dry cleaning';

export type TurnaroundStatus = 'Available' | 'Reserved' | 'Out on Rental' | 'In Cleaning/Maintenance' | 'Ready' | 'Due today';

export type BookingStatus =
  | 'Confirmed'
  | 'Ready'
  | 'Request'
  | 'Pending'
  | 'Delivered'
  | 'Completed'
  | 'Out on rent'
  | 'Due today'
  | 'Returned';

export type BookingType = 'Online' | 'Walk-in';

export interface SizeStock {
  size: string;
  total: number;
  rented: number;
  care: number;
  ready: number;
  reserved: number;
}

export interface RentalItem {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: ItemCategory;
  categorySlug: 'suits' | 'gowns' | 'accessories' | 'veils';
  color: string;
  fabric: string;
  fit: string;
  description: string;
  rentalPrice: number; // in Frw
  refundableDeposit: number; // in Frw
  rentalPeriodDays: number;
  images: string[];
  sizes: string[];
  sizeRange?: string; // e.g. "36–44" or "44–52"
  simpleStatus?: InventorySimpleStatus;
  condition?: string;
  stockBySize: SizeStock[];
  totalStock: number;
  readyStock: number;
  rentedStock: number;
  inCareStock: number;
  status: 'Published' | 'Draft' | 'Archived';
  allowOnlineBooking: boolean;
  cleaningTurnaroundDays: number;
  badge?: 'Bestseller' | 'Atelier favourite' | 'New arrival' | 'Popular' | 'Trending' | 'Rental' | string;
  isArchived?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. #UF-1048
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  type: BookingType;
  itemId: string;
  itemName: string;
  itemSku: string;
  itemImage?: string;
  size: string;
  pickupDate: string; // YYYY-MM-DD or display format
  returnDate: string; // YYYY-MM-DD
  rentalFee: number;
  depositFee: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  status: BookingStatus;
  fittingDate?: string;
  fittingTime?: string;
  occasion?: string;
  notes?: string;
  createdAt: string;
  createdTime?: string;
}

export type ClientBookStatus = 'OUT' | 'RETURNED' | 'FITTING';

export interface ClientBookEntry {
  id: string;
  dateLogged: string;
  timeLogged: string;
  clientName: string;
  telephone: string;
  nationalId: string;
  outfitTaken: string;
  returnDue: string;
  status: ClientBookStatus;
  notes?: string;
}

export interface AccoladeItem {
  id: string;
  title: string;
  category: 'Celebrity' | 'Certification' | 'Award' | 'Press';
  year: string;
  image: string;
  featuredPerson?: string;
  badge?: string;
}

export interface AtelierMetrics {
  monthlyRevenue: number;
  monthlyBookings: number;
  onlineBookingsCount: number;
  walkInBookingsCount: number;
  currentlyRentedCount: number;
  dueTodayCount: number;
  overdueCount: number;
  refundableDepositsHeld: number;
}
