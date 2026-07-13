-- Insert initial Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES 
  (gen_random_uuid(), 'Watches', 'watches', 'Luxury and precision timepieces', 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg', 1, true),
  (gen_random_uuid(), 'Clothes', 'clothes', 'Handcrafted tailored clothing', 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg', 2, true),
  (gen_random_uuid(), 'Shoes', 'shoes', 'Premium handmade leather shoes', 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Map Watches to Watches Category
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'watches' 
  AND (p.name ILIKE '%Chronograph%' 
       OR p.name ILIKE '%Heritage%' 
       OR p.name ILIKE '%Signature Slim%' 
       OR p.name ILIKE '%Phantom%' 
       OR p.name ILIKE '%Aviator%' 
       OR p.name ILIKE '%Diamond Eclipse%');

-- Map Clothes to Clothes Category
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE c.slug = 'clothes' 
  AND p.category_id IS NULL;

-- Ensure foreign key from products.category_id to categories.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_category_id_fkey'
    ) THEN
        ALTER TABLE public.products
        ADD CONSTRAINT products_category_id_fkey
        FOREIGN KEY (category_id) REFERENCES public.categories(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Populate product_homepage_sections based on old flags/logic to keep the storefront working
INSERT INTO public.product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, h.id
FROM public.products p, public.homepage_sections h
WHERE h.name = 'Watches' AND p.category_id = (SELECT id FROM public.categories WHERE slug = 'watches')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, h.id
FROM public.products p, public.homepage_sections h
WHERE h.name = 'Fashion' AND p.category_id = (SELECT id FROM public.categories WHERE slug = 'clothes')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, h.id
FROM public.products p, public.homepage_sections h
WHERE h.name = 'Handmade' AND p.is_featured = true
ON CONFLICT DO NOTHING;

INSERT INTO public.product_homepage_sections (product_id, homepage_section_id)
SELECT p.id, h.id
FROM public.products p, public.homepage_sections h
WHERE h.name = 'Tailoring' AND p.is_best_seller = true AND p.category_id = (SELECT id FROM public.categories WHERE slug = 'clothes')
ON CONFLICT DO NOTHING;

-- Enforce constraints on product_homepage_sections
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_homepage_sections_product_id_fkey'
    ) THEN
        ALTER TABLE public.product_homepage_sections
        ADD CONSTRAINT product_homepage_sections_product_id_fkey
        FOREIGN KEY (product_id) REFERENCES public.products(id)
        ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'product_homepage_sections_section_id_fkey'
    ) THEN
        ALTER TABLE public.product_homepage_sections
        ADD CONSTRAINT product_homepage_sections_section_id_fkey
        FOREIGN KEY (homepage_section_id) REFERENCES public.homepage_sections(id)
        ON DELETE CASCADE;
    END IF;
END $$;
