/*
# MarWiz Wears & Watches - Core Database Schema

## Overview
Creates the complete database schema for a luxury e-commerce platform with admin-managed content.
Customers do NOT create accounts — they browse, add to bag, checkout, and send orders via WhatsApp.
Only admin authenticates (via Supabase Auth) to manage the store.

## New Tables
1. `categories` — Product categories (Watches, Fashion, etc.)
2. `collections` — Luxury collections for grouping products
3. `products` — Products with images, variants, specs, flags (featured, best seller, new arrival, limited edition)
4. `orders` — Customer orders with delivery info and line items stored as JSONB
5. `testimonials` — Customer testimonials with ratings
6. `pages` — Editable static pages (About, Contact, FAQs, Privacy, Terms, Returns, Shipping)
7. `site_settings` — Singleton row holding ALL configurable site content (announcement bar, hero, footer, bank details, WhatsApp number, social media, SEO, theme, etc.)
8. `media` — Media library for reusable images/videos

## Security
- Public (anon) can READ products, categories, collections, testimonials, pages, site_settings, media.
- Public (anon) can INSERT orders (customers placing orders without login).
- Public (anon) can UPDATE orders (status updates only via admin — but anon can't update, only authenticated).
- Authenticated (admin) has full CRUD on all tables.
- Orders can be read/updated only by authenticated users (admin).
*/

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============ COLLECTIONS ============
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_collections" ON collections;
CREATE POLICY "anon_read_collections" ON collections FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_collections" ON collections;
CREATE POLICY "auth_insert_collections" ON collections FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_collections" ON collections;
CREATE POLICY "auth_update_collections" ON collections FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_collections" ON collections;
CREATE POLICY "auth_delete_collections" ON collections FOR DELETE
  TO authenticated USING (true);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(12,2) NOT NULL,
  compare_at_price numeric(12,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  images jsonb DEFAULT '[]'::jsonb,
  variants jsonb DEFAULT '{}'::jsonb,
  specs jsonb DEFAULT '{}'::jsonb,
  stock int DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  is_limited_edition boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  notes text,
  payment_method text DEFAULT 'bank_transfer',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  content text NOT NULL,
  rating int DEFAULT 5,
  image_url text,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_testimonials" ON testimonials;
CREATE POLICY "anon_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============ PAGES ============
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_pages" ON pages;
CREATE POLICY "anon_read_pages" ON pages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_pages" ON pages;
CREATE POLICY "auth_insert_pages" ON pages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pages" ON pages;
CREATE POLICY "auth_update_pages" ON pages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pages" ON pages;
CREATE POLICY "auth_delete_pages" ON pages FOR DELETE
  TO authenticated USING (true);

-- ============ SITE_SETTINGS (singleton) ============
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  -- Announcement bar
  announcement_text text,
  announcement_active boolean DEFAULT true,
  -- Hero section
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  hero_video_url text,
  hero_cta_text text,
  hero_cta_link text,
  -- Brand
  brand_name text,
  tagline text,
  logo_url text,
  favicon_url text,
  -- Footer
  footer_about text,
  footer_copyright text,
  -- Bank details
  bank_name text,
  account_name text,
  account_number text,
  -- Contact
  whatsapp_number text,
  contact_email text,
  contact_phone text,
  contact_address text,
  -- Social media
  instagram_url text,
  facebook_url text,
  twitter_url text,
  tiktok_url text,
  -- SEO
  meta_title text,
  meta_description text,
  meta_keywords text,
  google_analytics_id text,
  google_search_console text,
  -- Theme
  primary_color text,
  secondary_color text,
  accent_color text,
  -- Misc
  maintenance_mode boolean DEFAULT false,
  -- Homepage section visibility
  homepage_sections jsonb DEFAULT '[]'::jsonb,
  -- Instagram
  instagram_handle text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_site_settings" ON site_settings;
CREATE POLICY "anon_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ MEDIA LIBRARY ============
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  name text,
  folder text DEFAULT 'products',
  type text DEFAULT 'image',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_media" ON media;
CREATE POLICY "anon_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_media" ON media;
CREATE POLICY "auth_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_media" ON media;
CREATE POLICY "auth_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_media" ON media;
CREATE POLICY "auth_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

-- ============ NAV ITEMS ============
CREATE TABLE IF NOT EXISTS nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_nav_items" ON nav_items;
CREATE POLICY "anon_read_nav_items" ON nav_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_nav_items" ON nav_items;
CREATE POLICY "auth_insert_nav_items" ON nav_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_nav_items" ON nav_items;
CREATE POLICY "auth_update_nav_items" ON nav_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_nav_items" ON nav_items;
CREATE POLICY "auth_delete_nav_items" ON nav_items FOR DELETE
  TO authenticated USING (true);
