export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  subcategories?: Category[];
}


export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  banner_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  button_text: string | null;
  button_link: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  show_in_homepage: boolean;
  limit_products: number | null;
  background_style: string | null;
  subtitle: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id?: string | null;
  images: string[];
  variants: { colors?: string[]; sizes?: string[] };
  specs: Record<string, string>;
  stock: number;
  availability: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  category?: Category;
  collections?: Collection[];
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
  hero_background_media: string | null;
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
  contact_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  tiktok_url: string | null;
  why_marwiz?: any[];
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
  brand_story_image_url: string | null;
  whatsapp_cta_image_url: string | null;
  default_placeholder_url: string | null;
  default_product_url: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant: { color?: string; size?: string };
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}
