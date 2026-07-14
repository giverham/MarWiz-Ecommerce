const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}\\s*=\\s*["']?([^"\\n\\r']+)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Updating site_settings hero_cta_link to /collections...');
  const { data, error } = await supabase
    .from('site_settings')
    .update({ hero_cta_link: '/collections' })
    .eq('id', 1)
    .select();

  if (error) {
    console.error('Error updating site_settings:', error.message);
  } else {
    console.log('Successfully updated site_settings:', JSON.stringify(data, null, 2));
  }
}

run();
