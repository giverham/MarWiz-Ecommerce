export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  collection_id: string | null;
  images: string[];
  variants: { colors?: string[]; sizes?: string[] };
  specs: Record<string, string>;
  stock: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_limited_edition: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: { color?: string; size?: string };
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  state: string;
  city: string;
  notes: string | null;
  payment_method: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  is_active: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string | null;
  folder: string;
  type: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  announcement_text: string | null;
  announcement_active: boolean;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  hero_cta_text: string | null;
  hero_cta_link: string | null;
  brand_name: string | null;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  footer_about: string | null;
  footer_copyright: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  tiktok_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  google_analytics_id: string | null;
  google_search_console: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  maintenance_mode: boolean;
  homepage_sections: string[];
  instagram_handle: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant: { color?: string; size?: string };
}
