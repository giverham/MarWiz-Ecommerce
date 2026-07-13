-- Phase 2 Final Cleanup (Drop Legacy Schema)
-- WARNING: ONLY RUN THIS AFTER VERIFYING ALL STOREFRONT & ADMIN FUNCTIONALITY

-- 1. Drop Legacy Columns from Products
ALTER TABLE products 
  DROP COLUMN IF EXISTS is_featured,
  DROP COLUMN IF EXISTS is_best_seller,
  DROP COLUMN IF EXISTS is_new_arrival,
  DROP COLUMN IF EXISTS is_limited_edition;

-- 2. Drop the Legacy Collections Tables
DROP TABLE IF EXISTS product_collections CASCADE;
DROP TABLE IF EXISTS collections CASCADE;

-- 3. (Optional) If product_categories was replaced by product.category_id
-- We have fully transitioned to products.category_id
DROP TABLE IF EXISTS product_categories CASCADE;

-- Cleanup completed successfully.
