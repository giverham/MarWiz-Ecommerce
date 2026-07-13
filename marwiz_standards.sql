CREATE TABLE IF NOT EXISTS marwiz_standards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE marwiz_standards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to marwiz_standards" ON marwiz_standards;
CREATE POLICY "Allow public read access to marwiz_standards"
  ON marwiz_standards
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert marwiz_standards" ON marwiz_standards;
CREATE POLICY "Allow authenticated users to insert marwiz_standards"
  ON marwiz_standards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update marwiz_standards" ON marwiz_standards;
CREATE POLICY "Allow authenticated users to update marwiz_standards"
  ON marwiz_standards
  FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete marwiz_standards" ON marwiz_standards;
CREATE POLICY "Allow authenticated users to delete marwiz_standards"
  ON marwiz_standards
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert defaults if table is empty
INSERT INTO marwiz_standards (title, description, icon_name, display_order)
SELECT 'Master Craftsmanship', 'Every piece is crafted by master artisans with decades of experience.', 'Award', 1
WHERE NOT EXISTS (SELECT 1 FROM marwiz_standards);

INSERT INTO marwiz_standards (title, description, icon_name, display_order)
SELECT 'Authenticity Guaranteed', 'Each product comes with a certificate of authenticity.', 'Shield', 2
WHERE NOT EXISTS (SELECT 1 FROM marwiz_standards);

INSERT INTO marwiz_standards (title, description, icon_name, display_order)
SELECT 'Nationwide Delivery', 'Complimentary delivery on orders above ₦50,000 across Nigeria.', 'Truck', 3
WHERE NOT EXISTS (SELECT 1 FROM marwiz_standards);

INSERT INTO marwiz_standards (title, description, icon_name, display_order)
SELECT 'Premium Materials', 'We source only the finest materials from trusted suppliers worldwide.', 'Star', 4
WHERE NOT EXISTS (SELECT 1 FROM marwiz_standards);
