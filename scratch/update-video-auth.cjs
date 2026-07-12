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
  console.log('Signing in as admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@marwiz.com',
    password: 'MarWizAdmin2026!'
  });

  if (authError) {
    console.error('Sign-in failed:', authError.message);
    process.exit(1);
  }

  console.log('Sign-in successful. Updating site settings...');
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      hero_title: 'Dare To Wear Different',
      hero_subtitle: 'Timeless luxury. Crafted for those who refuse the ordinary.',
      hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40156-large.mp4',
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (error) {
    console.error('Error updating site settings:', error);
  } else {
    console.log('✓ Site settings updated successfully with admin authentication!');
  }
}

run();
