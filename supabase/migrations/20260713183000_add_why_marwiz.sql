-- Add why_marwiz JSONB column to site_settings to make the "Why Choose MarWiz" section editable

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS why_marwiz JSONB DEFAULT '[
  { "icon": "Award", "title": "Master Craftsmanship", "desc": "Every piece is crafted by master artisans with decades of experience." },
  { "icon": "Shield", "title": "Authenticity Guaranteed", "desc": "Each product comes with a certificate of authenticity." },
  { "icon": "Truck", "title": "Nationwide Delivery", "desc": "Complimentary delivery on orders above ₦50,000 across Nigeria." },
  { "icon": "Star", "title": "Premium Materials", "desc": "We source only the finest materials from trusted suppliers worldwide." }
]'::jsonb;
