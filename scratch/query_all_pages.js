import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lyrkrecesniblsixmqhn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cmtyZWNlc25pYmxzaXhtcWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4Nzg0MTYsImV4cCI6MjA5OTQ1NDQxNn0.L-dZyaqEw-ZNEcMmmKRPTwT6Yqyq6cp9RwyQ6O3uOEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('pages')
    .select('*');

  if (error) {
    console.error('Error fetching pages:', error.message);
    return;
  }

  console.log('Pages list:', JSON.stringify(data, null, 2));
}

run();
