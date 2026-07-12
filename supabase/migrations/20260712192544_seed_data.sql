/*
# MarWiz - Seed Data

Seeds the database with site settings, categories, collections, products, testimonials, pages, and nav items.
*/

-- ============ SITE SETTINGS ============
INSERT INTO site_settings (id, announcement_text, announcement_active,
  hero_title, hero_subtitle, hero_image_url, hero_cta_text, hero_cta_link,
  brand_name, tagline, footer_about, footer_copyright,
  bank_name, account_name, account_number,
  whatsapp_number, contact_email, contact_phone, contact_address,
  instagram_url, facebook_url, twitter_url, tiktok_url,
  meta_title, meta_description, meta_keywords,
  primary_color, secondary_color, accent_color,
  homepage_sections, instagram_handle
) VALUES (
  1,
  'Complimentary delivery on orders above ₦50,000 — Dare To Wear Different',
  true,
  'Dare To Wear Different',
  'Timeless luxury. Crafted for those who refuse the ordinary.',
  'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'Explore Collection',
  '/shop',
  'MarWiz Wears & Watches',
  'Dare To Wear Different',
  'MarWiz Wears & Watches is a Nigerian luxury fashion house crafting timeless timepieces and premium fashion for those who dare to stand apart. Every piece tells a story of elegance, precision, and bold individuality.',
  '© 2024 MarWiz Wears & Watches. All rights reserved.',
  'Guaranty Trust Bank (GTBank)',
  'MarWiz Wears & Watches',
  '0123456789',
  '2348012345678',
  'hello@marwiz.com',
  '+234 801 234 5678',
  '15 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
  'https://instagram.com/marwiz',
  'https://facebook.com/marwiz',
  'https://twitter.com/marwiz',
  'https://tiktok.com/@marwiz',
  'MarWiz Wears & Watches — Luxury Fashion & Premium Timepieces',
  'Discover MarWiz Wears & Watches, Nigeria''s premier luxury destination for premium watches and fashion. Dare To Wear Different.',
  'luxury watches, premium fashion, Nigerian luxury brand, designer watches, luxury clothing',
  '#0a0a0a',
  '#c9a96e',
  '#1a1a1a',
  '["announcement","hero","collections","featured-watches","featured-fashion","best-sellers","new-arrivals","limited-editions","brand-story","why-choose","editorial","testimonials","instagram","whatsapp-cta","newsletter"]'::jsonb,
  'marwiz'
) ON CONFLICT (id) DO NOTHING;

-- ============ CATEGORIES ============
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Luxury Watches', 'watches', 'Premium timepieces crafted for the bold.', 'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Luxury Fashion', 'fashion', 'Premium fashion for those who dare.', 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800', 2)
ON CONFLICT (slug) DO NOTHING;

-- ============ COLLECTIONS ============
INSERT INTO collections (name, slug, description, image_url, sort_order) VALUES
('Signature', 'signature', 'Our signature collection — defining pieces that embody the MarWiz ethos.', 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Heritage', 'heritage', 'Timeless designs rooted in craftsmanship and tradition.', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Noir', 'noir', 'Dark, bold, and unapologetically luxurious.', 'https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=800', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============ PRODUCTS ============
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, collection_id, images, variants, specs, stock, is_featured, is_best_seller, is_new_arrival, is_limited_edition, sort_order) VALUES
('MarWiz Chronograph Noir', 'chronograph-noir', 'A bold statement piece featuring a precision quartz movement, sapphire-coated glass, and a hand-finished stainless steel case. The Noir dial commands attention.', 185000, 220000,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'noir'),
  '["https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/9978724/pexels-photo-9978724.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/9978725/pexels-photo-9978725.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Black", "Silver"], "sizes": ["40mm", "42mm"]}'::jsonb,
  '{"Movement": "Quartz", "Case": "Stainless Steel 316L", "Glass": "Sapphire Coated", "Water Resistance": "50m", "Warranty": "2 Years"}'::jsonb,
  25, true, true, false, false, 1),
('MarWiz Heritage Gold', 'heritage-gold', 'An elegant timepiece with a gold-tone finish, automatic movement, and a leather strap handcrafted from Italian calfskin.', 320000, 380000,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'heritage'),
  '["https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/3782387/pexels-photo-3782387.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Gold", "Rose Gold"], "sizes": ["38mm", "40mm"]}'::jsonb,
  '{"Movement": "Automatic", "Case": "Gold-tone Steel", "Glass": "Sapphire Crystal", "Water Resistance": "30m", "Strap": "Italian Calfskin Leather", "Warranty": "3 Years"}'::jsonb,
  15, true, true, true, false, 2),
('MarWiz Signature Slim', 'signature-slim', 'A minimalist masterpiece. Ultra-thin profile, clean dial, and refined aesthetics for the modern gentleman.', 240000, null,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'signature'),
  '["https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/3782387/pexels-photo-3782387.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Silver", "Black"], "sizes": ["36mm", "40mm"]}'::jsonb,
  '{"Movement": "Quartz Slim", "Case": "Stainless Steel", "Glass": "Mineral Crystal", "Water Resistance": "30m", "Warranty": "2 Years"}'::jsonb,
  30, false, false, true, false, 3),
('MarWiz Phantom Limited', 'phantom-limited', 'Limited to 100 pieces worldwide. A stealth all-black design with a ceramic bezel and exhibition caseback.', 550000, 650000,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'noir'),
  '["https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/9978724/pexels-photo-9978724.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Black"], "sizes": ["42mm"]}'::jsonb,
  '{"Movement": "Automatic", "Case": "Black PVD Steel", "Bezel": "Ceramic", "Glass": "Sapphire Crystal", "Water Resistance": "100m", "Edition": "Limited 100pcs", "Warranty": "5 Years"}'::jsonb,
  8, true, false, false, true, 4),
('MarWiz Aviator Steel', 'aviator-steel', 'A robust pilot-style watch with a large readable dial, chronograph functions, and a steel bracelet.', 195000, null,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'signature'),
  '["https://images.pexels.com/photos/3782387/pexels-photo-3782387.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Silver", "Black"], "sizes": ["42mm", "44mm"]}'::jsonb,
  '{"Movement": "Quartz Chronograph", "Case": "Stainless Steel", "Glass": "Sapphire Coated", "Water Resistance": "50m", "Strap": "Steel Bracelet", "Warranty": "2 Years"}'::jsonb,
  20, false, true, false, false, 5),
('MarWiz Diamond Eclipse', 'diamond-eclipse', 'A luxurious ladies timepiece featuring a diamond-set bezel and mother-of-pearl dial.', 425000, 500000,
  (SELECT id FROM categories WHERE slug = 'watches'),
  (SELECT id FROM collections WHERE slug = 'heritage'),
  '["https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/3782387/pexels-photo-3782387.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Silver", "Rose Gold"], "sizes": ["34mm"]}'::jsonb,
  '{"Movement": "Quartz", "Case": "Stainless Steel", "Bezel": "Diamond Set", "Dial": "Mother of Pearl", "Glass": "Sapphire Crystal", "Water Resistance": "30m", "Warranty": "3 Years"}'::jsonb,
  12, true, false, true, false, 6),
('MarWiz Tailored Blazer', 'tailored-blazer', 'A sharply tailored blazer in premium wool blend. Structured shoulders, slim fit, and a timeless silhouette.', 145000, 175000,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'signature'),
  '["https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Black", "Navy", "Charcoal"], "sizes": ["S", "M", "L", "XL"]}'::jsonb,
  '{"Material": "Premium Wool Blend", "Fit": "Slim Tailored", "Lining": "Full Satin Lining", "Care": "Dry Clean Only"}'::jsonb,
  18, true, true, false, false, 1),
('MarWiz Silk Shirt', 'silk-shirt', 'A luxurious silk shirt with a subtle sheen, perfect for evening occasions. Tailored fit with mother-of-pearl buttons.', 85000, null,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'heritage'),
  '["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["White", "Black", "Champagne"], "sizes": ["S", "M", "L", "XL"]}'::jsonb,
  '{"Material": "100% Silk", "Fit": "Tailored", "Buttons": "Mother of Pearl", "Care": "Dry Clean Only"}'::jsonb,
  25, true, false, true, false, 2),
('MarWiz Leather Jacket', 'leather-jacket', 'A premium full-grain leather jacket with a modern silhouette. Hand-finished details and a quilted lining.', 210000, 250000,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'noir'),
  '["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Black", "Brown"], "sizes": ["S", "M", "L", "XL"]}'::jsonb,
  '{"Material": "Full-Grain Leather", "Lining": "Quilted Satin", "Hardware": "Antique Brass", "Care": "Professional Leather Care"}'::jsonb,
  10, false, true, false, false, 3),
('MarWiz Cashmere Coat', 'cashmere-coat', 'An overcoat crafted from a cashmere-wool blend. Elegant drape, timeless design, and supreme warmth.', 285000, 320000,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'heritage'),
  '["https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Camel", "Black", "Grey"], "sizes": ["M", "L", "XL"]}'::jsonb,
  '{"Material": "Cashmere Wool Blend", "Fit": "Regular", "Lining": "Full Cupro Lining", "Care": "Dry Clean Only"}'::jsonb,
  8, true, false, false, false, 4),
('MarWiz Limited Overcoat', 'limited-overcoat', 'A limited edition double-breasted overcoat in midnight black. Only 50 pieces crafted.', 395000, 450000,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'noir'),
  '["https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Midnight Black"], "sizes": ["M", "L", "XL"]}'::jsonb,
  '{"Material": "Italian Wool", "Fit": "Tailored", "Edition": "Limited 50pcs", "Care": "Dry Clean Only"}'::jsonb,
  5, false, false, false, true, 5),
('MarWiz Knit Sweater', 'knit-sweater', 'A fine merino wool knit sweater with a modern crew neck. Soft, warm, and effortlessly elegant.', 65000, null,
  (SELECT id FROM categories WHERE slug = 'fashion'),
  (SELECT id FROM collections WHERE slug = 'signature'),
  '["https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1200","https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb,
  '{"colors": ["Black", "Navy", "Cream", "Burgundy"], "sizes": ["S", "M", "L", "XL", "XXL"]}'::jsonb,
  '{"Material": "100% Merino Wool", "Fit": "Regular", "Care": "Hand Wash Cold"}'::jsonb,
  35, false, true, true, false, 6)
ON CONFLICT (slug) DO NOTHING;

-- ============ TESTIMONIALS ============
INSERT INTO testimonials (name, role, content, rating, image_url, sort_order) VALUES
('Adaeze Okonkwo', 'Fashion Editor, Vogue Nigeria', 'MarWiz has redefined what luxury means in Nigeria. The craftsmanship is world-class, and every piece feels like a statement of intent.', 5, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 1),
('Tunde Bakare', 'CEO, Horizon Capital', 'I have been collecting watches for fifteen years. The Phantom Limited is among the finest I have ever owned. Precision, beauty, and soul.', 5, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', 2),
('Zainab Ibrahim', 'Creative Director', 'The tailoring is impeccable. My MarWiz blazer fits like it was made for me alone. This is luxury that speaks quietly but confidently.', 5, 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', 3),
('Chidi Eze', 'Architect', 'From the packaging to the product, every detail is considered. MarWiz does not sell products — they deliver experiences.', 5, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 4)
ON CONFLICT DO NOTHING;

-- ============ PAGES ============
INSERT INTO pages (slug, title, content) VALUES
('about', 'About MarWiz', '{"heading": "The MarWiz Story", "body": "Founded in Lagos, Nigeria, MarWiz Wears & Watches was born from a singular vision: to create a luxury brand that celebrates African craftsmanship on the world stage. Every timepiece, every garment, is a testament to the belief that true luxury is not about fitting in — it is about standing apart. We source the finest materials, partner with master artisans, and obsess over every detail so that when you wear MarWiz, you feel the difference. Our philosophy is simple: Dare To Wear Different.", "image": "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"}'::jsonb),
('contact', 'Contact Us', '{"heading": "Get in Touch", "body": "We are here to help. Whether you have a question about a product, an order, or simply want to say hello, reach out to us.", "address": "15 Adeola Odeku Street, Victoria Island, Lagos, Nigeria", "email": "hello@marwiz.com", "phone": "+234 801 234 5678", "hours": "Monday - Saturday: 9am - 7pm WAT"}'::jsonb),
('faqs', 'Frequently Asked Questions', '{"heading": "Frequently Asked Questions", "items": [{"q": "How do I place an order?", "a": "Browse our collection, add items to your shopping bag, proceed to checkout, fill in your delivery details, and click Send Order to WhatsApp. Our team will confirm your order and payment details."}, {"q": "Do I need to create an account?", "a": "No. We believe in a seamless shopping experience. Simply browse, add to bag, and checkout — no account required."}, {"q": "How do I pay?", "a": "We accept bank transfers. After checkout, you will see our bank details. Make the transfer and send the confirmation via WhatsApp along with your order."}, {"q": "How long does delivery take?", "a": "Within Lagos: 1-2 business days. Outside Lagos: 3-5 business days. International delivery: 7-14 business days."}, {"q": "Can I return a product?", "a": "Yes. We offer a 7-day return policy on unworn items in their original packaging. See our Returns Policy page for details."}, {"q": "Are your products authentic?", "a": "Every MarWiz product is crafted by our master artisans and comes with a certificate of authenticity."}]}'::jsonb),
('privacy', 'Privacy Policy', '{"heading": "Privacy Policy", "body": "MarWiz Wears & Watches respects your privacy. This policy outlines how we collect, use, and protect your personal information. We collect information you provide during checkout (name, phone, email, address) solely for the purpose of fulfilling your order. We do not share your data with third parties except as required by law. You may request deletion of your data at any time by contacting us."}'::jsonb),
('terms', 'Terms & Conditions', '{"heading": "Terms & Conditions", "body": "By using this website and placing an order with MarWiz Wears & Watches, you agree to these terms. All orders are subject to availability. Prices are listed in Nigerian Naira and may change without notice. Payment must be made via bank transfer before orders are dispatched. We reserve the right to refuse or cancel any order. All content on this site is owned by MarWiz Wears & Watches."}'::jsonb),
('returns', 'Return Policy', '{"heading": "Return Policy", "body": "We offer a 7-day return policy from the date of delivery. Items must be unworn, in their original packaging, and accompanied by proof of purchase. To initiate a return, contact us via WhatsApp with your order number. Refunds are processed within 5 business days of receiving the returned item. Custom or limited edition items are non-returnable."}'::jsonb),
('shipping', 'Shipping Policy', '{"heading": "Shipping Policy", "body": "We deliver across Nigeria and internationally. Within Lagos: 1-2 business days. Outside Lagos: 3-5 business days. International: 7-14 business days. Shipping costs are calculated at checkout based on your location. Orders above ₦50,000 qualify for free delivery within Nigeria."}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ============ NAV ITEMS ============
INSERT INTO nav_items (label, href, sort_order) VALUES
('Home', '/', 1),
('Shop', '/shop', 2),
('Watches', '/category/watches', 3),
('Fashion', '/category/fashion', 4),
('Collections', '/collections', 5),
('About', '/page/about', 6),
('Contact', '/page/contact', 7)
ON CONFLICT DO NOTHING;
