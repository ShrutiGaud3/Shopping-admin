export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
  addresses?: {
    _id?: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }[];
}

export interface ProductSpecification {
  sleeveLength?: string;
  collar?: string;
  pattern?: string;
  fit?: string;
  pockets?: string;
  occasion?: string;
  fabric?: string;
  lining?: string;
  closure?: string;
  material?: string;
  dimensions?: string;
  care?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  gender: 'Women' | 'Men' | 'Kids' | 'Unisex';
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  stock: number;
  isTrending?: boolean;
  isDeal?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  specifications?: ProductSpecification;
  sku?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  image: string;
  itemCount: number;
  slug: string;
  parent?: string | { _id: string; name: string; slug: string } | null;
  order?: number;
  showInMenu?: boolean;
  type?: 'category' | 'occasion' | 'festival' | 'collection';
  featured?: boolean;
  gender?: string;
  description?: string;
  children?: Category[];
}

export interface OrderItem {
  product: {
    id: string;
    name: string;
    brand?: string;
    price: number;
    image: string;
  };
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  _id?: string;
  orderId?: string;
  date: string;
  createdAt?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Exchange Requested' | 'Exchange Approved' | 'Exchange Rejected';
  paymentMethod: 'COD' | 'UPI' | 'Card';
  shippingAddress: {
    fullName?: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
}

export interface Coupon {
  id: string;
  _id?: string;
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  usageCount?: number;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: 'unread' | 'read' | 'replied';
  createdAt?: string;
}

export interface Review {
  id: string;
  _id?: string;
  user?: string;
  userName: string;
  userAvatar?: string;
  product: string | { _id: string; name: string; image?: string };
  productName?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  createdAt?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export interface InventoryItem {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  sku?: string;
  rating?: number;
  image?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Phase 1 Types
export interface SettingAnnouncement {
  _id?: string;
  text: string;
  link: string;
  isActive: boolean;
}

export interface Setting {
  _id?: string;
  announcements: SettingAnnouncement[];
  whatsappNumber: string;
  whatsappPrefilledMessage: string;
  supportPhone: string;
  supportEmail: string;
  supportAddress: string;
  workingHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    pinterest: string;
    youtube: string;
  };
  codEnabled: boolean;
  codExtraCharge: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  footerAboutText: string;
  copyrightText: string;
  seoDefaults: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}

export interface MarqueeItem {
  _id?: string;
  id?: string;
  text: string;
  link: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface PageItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface FaqItem {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  category: 'General' | 'Shipping & Delivery' | 'Returns & Exchange' | 'Orders & Payment' | 'Sizing & Customization';
  order: number;
  isActive: boolean;
}

export interface BannerItem {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  desktopImage: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  textColor?: 'light' | 'dark';
  alignment?: 'left' | 'center' | 'right';
  createdAt?: string;
}

export interface TrustBadgeItem {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  icon: 'shield' | 'truck' | 'creditCard' | 'rotate' | 'sparkles' | 'check';
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface HomeSectionItem {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  type: 'story_circles' | 'product_grid' | 'banner_grid' | 'campaign_banner';
  order: number;
  isActive: boolean;
  config: {
    filterBy?: 'trending' | 'deal' | 'new' | 'category' | 'all';
    category?: string;
    limit?: number;
    banners?: {
      image: string;
      title: string;
      subtitle: string;
      link: string;
      badge: string;
    }[];
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
  };
  products?: any[];
  createdAt?: string;
}
