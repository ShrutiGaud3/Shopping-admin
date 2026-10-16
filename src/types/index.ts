export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'manager' | 'admin' | 'superadmin';
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

export interface StitchOption {
  _id?: string;
  type: string;
  price: number;
  description?: string;
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

  // Surat Ethnic Wear Fields
  fabric?: string;
  work?: string;
  occasion?: string;
  washCare?: string;
  setContents?: string;
  sareeLength?: string;
  lehengaFlare?: string;
  dispatchTime?: string;
  videoUrl?: string;
  stitchOptions?: StitchOption[];
  deliveryInfo?: {
    estimatedDays?: number;
    isCodAvailable?: boolean;
    freeShipping?: boolean;
  };
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
  discountAmount?: number;
  discount?: number;
  subtotal?: number;
  shippingFee?: number;
  shippingCharge?: number;
  codCharge?: number;
  couponCode?: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | string;
  orderStatus?: string;
  paymentMethod: 'COD' | 'UPI' | 'Card' | 'Online' | string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | string;
  paymentId?: string;
  shippingAddress: {
    fullName?: string;
    street: string;
    address?: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
    country?: string;
  };
  trackingNumber?: string;
  carrierName?: string;
  trackingUrl?: string;
  deliveredAt?: string;
  exchangeStatus?: 'none' | 'requested' | 'approved' | 'rejected';
  exchangeReason?: string;
  exchangeNotes?: string;
  exchangeRequestedAt?: string;
  exchangeResolvedAt?: string;
  exchangeAdminNotes?: string;
}

export interface Coupon {
  id: string;
  _id?: string;
  code: string;
  type?: 'percent' | 'flat';
  discountType?: 'percentage' | 'fixed' | 'percent' | 'flat';
  value?: number;
  discountValue?: number;
  discountPercentage?: number;
  maxDiscount?: number;
  maxDiscountAmount?: number;
  maximumDiscount?: number;
  minOrder?: number;
  minOrderAmount?: number;
  minimumOrderValue?: number;
  expiry?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  usageCount?: number;
  paymentMethod?: 'any' | 'prepaid' | 'cod';
  isActive: boolean;
  createdAt?: string;
}

export interface ShippingZone {
  _id?: string;
  id?: string;
  country: string;
  countryCode?: string;
  charge: number;
  freeAbove: number;
  estimatedDays?: string;
  isActive?: boolean;
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
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  exchangeRequests: number;
  pendingReviews: number;
  totalUsers: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: {
    _id: string;
    name: string;
    brand?: string;
    category: string;
    price: number;
    stock: number;
    sku?: string;
    images?: string[];
  }[];
  totalSubscribers: number;
  todaySubscribers: number;
  recentOrders: Order[];
}

export interface SubscriberItem {
  _id?: string;
  id?: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source?: string;
  subscribedAt?: string;
  createdAt?: string;
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
  type: 'story_circles' | 'product_grid' | 'banner_grid' | 'campaign_banner' | 'bestselling_categories';
  order: number;
  isActive: boolean;
  config: {
    filterBy?: 'trending' | 'deal' | 'new' | 'category' | 'all';
    category?: string;
    limit?: number;
    description?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    banners?: {
      image: string;
      title: string;
      subtitle?: string;
      link: string;
      badge?: string;
      tag?: string;
      description?: string;
    }[];
    ctaText?: string;
    ctaLink?: string;
    bgColor?: string;
  };
  products?: any[];
  createdAt?: string;
}

export interface ReviewItem {
  _id?: string;
  id?: string;
  user?: {
    _id?: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  product?: {
    _id?: string;
    name: string;
    images?: string[];
    price?: number;
    category?: string;
    slug?: string;
  };
  productName: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedBuyer: boolean;
  isVerifiedPurchase?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  helpfulVotes?: number;
  createdAt: string;
}

export interface BlogPostItem {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  readTime: string;
  views?: number;
  isPublished: boolean;
  publishedAt?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}
