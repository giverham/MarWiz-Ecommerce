import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const collections = [
  { name: 'Featured Products', slug: 'featured-products', subtitle: 'Editor\'s Choice', description: 'A curated selection of our finest pieces.', show_in_homepage: true, limit_products: 8, sort_order: 1, background_style: 'default', is_active: true },
  { name: 'New Arrivals', slug: 'new-arrivals', subtitle: 'Just Arrived', description: 'The latest additions to our collection.', show_in_homepage: true, limit_products: 8, sort_order: 2, background_style: 'default', is_active: true },
  { name: 'Watch Collection', slug: 'watch-collection', subtitle: 'Timepieces', description: 'Discover watches that define moments.', show_in_homepage: true, limit_products: 8, sort_order: 3, background_style: 'default', is_active: true },
  { name: 'Fashion Collection', slug: 'fashion-collection', subtitle: 'Essentials', description: 'Elevate your wardrobe with our latest fashion.', show_in_homepage: true, limit_products: 8, sort_order: 4, background_style: 'default', is_active: true },
  { name: 'Handmade Collection', slug: 'handmade-collection', subtitle: 'Craftsmanship', description: 'Experience true artisan quality.', show_in_homepage: true, limit_products: 8, sort_order: 5, background_style: 'default', is_active: true },
  { name: 'Signature Tailoring', slug: 'signature-tailoring', subtitle: 'Bespoke', description: 'Master craftsmanship for the modern gentleman.', show_in_homepage: true, limit_products: 8, sort_order: 6, background_style: 'default', is_active: true }
];

async function seed() {
  console.log('Seeding default collections...');
  for (const col of collections) {
    const { data, error } = await supabase.from('collections').upsert(col, { onConflict: 'slug' });
    if (error) {
      console.error(`Error inserting ${col.name}:`, error.message);
    } else {
      console.log(`Inserted ${col.name}`);
    }
  }
  console.log('Done seeding collections.');
}

seed();
