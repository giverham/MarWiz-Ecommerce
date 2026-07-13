-- Add product availability column
ALTER TABLE public.products ADD COLUMN availability text DEFAULT 'in_stock';
UPDATE public.products SET availability = 'in_stock';
