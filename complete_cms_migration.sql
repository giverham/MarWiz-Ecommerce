/*
  COMPLETE MIGRATION SCRIPT (CONSOLIDATED)
  Run this entire script in your Supabase SQL Editor to:
  1. Fix Categories (adds parent_id, creates product_categories, and seeds subcategories).
  2. Fix Collections (adds banner/sorting fields, creates product_collections).
  3. Create Homepage Showcase Sections & Junction Table.
  4. Seed Default Showcase Sections & Products Mapping.
  5. Refresh Schema Cache.
*/

-- =========================================================
-- 1. PARENT-CHILD CATEGORY SYSTEM
-- =========================================================
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE CASCADE;

-- Create category junction table
CREATE TABLE IF NOT EXISTS product_categories (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_product_categories" ON product_categories;
CREATE POLICY "anon_read_product_categories" ON product_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_product_categories" ON product_categories;
CREATE POLICY "auth_all_product_categories" ON product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- 2. DYNAMIC HOMEPAGE COLLECTIONS
-- =========================================================
ALTER TABLE collections ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS limit_products int DEFAULT 8;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS show_in_homepage boolean DEFAULT true;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS background_style text DEFAULT 'default';

-- Create collection junction table
CREATE TABLE IF NOT EXISTS product_collections (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_product_collections" ON product_collections;
CREATE POLICY "anon_read_product_collections" ON product_collections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_product_collections" ON product_collections;
CREATE POLICY "auth_all_product_collections" ON product_collections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- 3. HOMEPAGE SHOWCASE SECTIONS (NEW CMS FEATURE)
-- =========================================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_homepage_sections" ON homepage_sections;
CREATE POLICY "anon_read_homepage_sections" ON homepage_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_homepage_sections" ON homepage_sections;
CREATE POLICY "auth_all_homepage_sections" ON homepage_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create showcase junction table
CREATE TABLE IF NOT EXISTS product_homepage_sections (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  homepage_section_id uuid REFERENCES homepage_sections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, homepage_section_id)
);

ALTER TABLE product_homepage_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_read_product_homepage_sections" ON product_homepage_sections;
CREATE POLICY "anon_read_product_homepage_sections" ON product_homepage_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_all_product_homepage_sections" ON product_homepage_sections;
CREATE POLICY "auth_all_product_homepage_sections" ON product_homepage_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================
-- 4. MIGRATE DATA AND SEED DEFAULT ENTITIES
-- =========================================================

-- Migrate category mappings
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Migrate collection mappings
INSERT INTO product_collections (product_id, collection_id)
SELECT id, collection_id FROM products WHERE collection_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Seed collections
INSERT INTO collections (name, slug, subtitle, description, show_in_homepage, limit_products, sort_order, background_style, is_active)
VALUES
('Featured Products', 'featured-products', 'Editor''s Choice', 'A curated selection of our finest pieces.', true, 8, 1, 'default', true),
('New Arrivals', 'new-arrivals', 'Just Arrived', 'The latest additions to our collection.', true, 8, 2, 'default', true),
('Watch Collection', 'watch-collection', 'Timepieces', 'Discover watches that define moments.', true, 8, 3, 'default', true),
('Fashion Collection', 'fashion-collection', 'Essentials', 'Elevate your wardrobe with our latest fashion.', true, 8, 4, 'default', true),
('Handmade Collection', 'handmade-collection', 'Craftsmanship', 'Experience true artisan quality.', true, 8, 5, 'default', true),
('Signature Tailoring', 'signature-tailoring', 'Bespoke', 'Master craftsmanship for the modern gentleman.', true, 8, 6, 'default', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed default Homepage Showcase Sections
INSERT INTO homepage_sections (name, slug, is_active, sort_order)
VALUES
('Handmade', 'handmade', true, 1),
('Tailoring', 'tailoring', true, 2),
('Fashion', 'fashion', true, 3),
('Watches', 'watches', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Map existing products to seeded showcase sections as examples
-- Handmade Showcases (some watches and shirts)
INSERT INTO product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, hs.id FROM products p, homepage_sections hs
WHERE hs.slug = 'handmade' AND p.slug IN ('marwiz-chronograph-noir', 'marwiz-signature-slim')
ON CONFLICT DO NOTHING;

-- Tailoring Showcases
INSERT INTO product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, hs.id FROM products p, homepage_sections hs
WHERE hs.slug = 'tailoring' AND p.slug IN ('royal-navy-tuxedo', 'emperor-brocade-agbada')
ON CONFLICT DO NOTHING;

-- Fashion Showcases
INSERT INTO product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, hs.id FROM products p, homepage_sections hs
WHERE hs.slug = 'fashion' AND p.slug IN ('royal-navy-tuxedo', 'emperor-brocade-agbada', 'classic-silk-kaftan')
ON CONFLICT DO NOTHING;

-- Watches Showcases
INSERT INTO product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, hs.id FROM products p, homepage_sections hs
WHERE hs.slug = 'watches' AND p.slug IN ('marwiz-chronograph-noir', 'marwiz-heritage-gold', 'marwiz-signature-slim', 'marwiz-phantom-limited')
ON CONFLICT DO NOTHING;

-- Force Schema Cache Refresh
NOTIFY pgrst, 'reload schema';
