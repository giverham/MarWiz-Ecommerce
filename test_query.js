import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log("Fetching products with joins...");
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories!products_category_id_fkey(*), product_homepage_sections(homepage_sections(*)), product_collections(collections(*))")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("QUERY ERROR:");
    console.error(error);
  } else {
    console.log(`Successfully fetched ${data?.length || 0} products.`);
    if (data?.length > 0) {
      console.log("Sample:", data[0].name);
    }
  }
}

checkProducts();
