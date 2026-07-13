const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lyrkrecesniblsixmqhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cmtyZWNlc25pYmxzaXhtcWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4Nzg0MTYsImV4cCI6MjA5OTQ1NDQxNn0.L-dZyaqEw-ZNEcMmmKRPTwT6Yqyq6cp9RwyQ6O3uOEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: navItems } = await supabase.from('nav_items').select('*').order('sort_order');
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
  
  console.log('--- NAV ITEMS ---');
  console.log(JSON.stringify(navItems, null, 2));
  
  console.log('--- CATEGORIES ---');
  console.log(JSON.stringify(categories, null, 2));
}

check();
