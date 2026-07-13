/*
  Migration: Dynamic Categories & Collections CMS Overhaul
  - Modifies categories to support parent-child relationships.
  - Modifies collections to support homepage rendering.
  - Creates many-to-many junction tables product_categories and product_collections.
  - Migrates existing data from legacy columns in products to junction tables.
  - Drops legacy category_id and collection_id columns from products.
  - Seeds the requested default Fashion and Watches hierarchies.
*/

-- 1. Update Categories for Parent-Child Hierarchy
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE CASCADE;

-- 2. Update Collections for Homepage Rendering
ALTER TABLE collections ADD COLUMN IF NOT EXISTS subtitle text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS limit_products int DEFAULT 8;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS show_in_homepage boolean DEFAULT true;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS background_style text DEFAULT 'default';

-- 3. Create Junction Tables
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

-- 4. Migrate Existing Data
-- Move legacy category_id
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Move legacy collection_id
INSERT INTO product_collections (product_id, collection_id)
SELECT id, collection_id FROM products WHERE collection_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 5. Drop Legacy Columns
ALTER TABLE products DROP COLUMN IF EXISTS category_id;
ALTER TABLE products DROP COLUMN IF EXISTS collection_id;

-- 6. Seed Default Dynamic Categories
DO $$
DECLARE
  fashion_id uuid;
  watches_id uuid;
BEGIN
  -- Insert Parent: Fashion
  INSERT INTO categories (name, slug, description, sort_order)
  VALUES ('Fashion', 'fashion', 'Premium luxury fashion and apparel', 10)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO fashion_id;

  -- Insert Parent: Watches
  INSERT INTO categories (name, slug, description, sort_order)
  VALUES ('Watches', 'watches', 'Exquisite luxury timepieces', 20)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO watches_id;

  -- Insert Fashion Subcategories
  INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
    ('Men''s Wear', 'mens-wear', fashion_id, 10),
    ('Women''s Wear', 'womens-wear', fashion_id, 20),
    ('Native Wear', 'native-wear', fashion_id, 30),
    ('Corporate Wear', 'corporate-wear', fashion_id, 40),
    ('Casual Wear', 'casual-wear', fashion_id, 50),
    ('Luxury Wear', 'luxury-wear', fashion_id, 60),
    ('Shoes', 'shoes', fashion_id, 70),
    ('Bags', 'bags', fashion_id, 80),
    ('Accessories', 'accessories', fashion_id, 90)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;

  -- Insert Watches Subcategories
  INSERT INTO categories (name, slug, parent_id, sort_order) VALUES
    ('Luxury Watches', 'luxury-watches', watches_id, 10),
    ('Smart Watches', 'smart-watches', watches_id, 20),
    ('Classic Watches', 'classic-watches', watches_id, 30),
    ('Sports Watches', 'sports-watches', watches_id, 40),
    ('Couple Watches', 'couple-watches', watches_id, 50),
    ('Men''s Watches', 'mens-watches', watches_id, 60),
    ('Women''s Watches', 'womens-watches', watches_id, 70)
  ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id;
END $$;






