import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log("Starting additive migration for collections...");

  const queries = [
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS seo_title TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS seo_description TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image_url TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS button_text TEXT;`,
    `ALTER TABLE collections ADD COLUMN IF NOT EXISTS button_link TEXT;`
  ];

  for (const q of queries) {
    const { error } = await supabase.rpc('execute_sql', { query: q });
    if (error) {
      console.error("Migration Error:", error.message, q);
    } else {
      console.log("Executed successfully:", q);
    }
  }
  console.log("Migration complete.");
}

runMigration();
