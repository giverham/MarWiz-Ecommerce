import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://lyrkrecesniblsixmqhn.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5cmtyZWNlc25pYmxzaXhtcWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4Nzg0MTYsImV4cCI6MjA5OTQ1NDQxNn0.L-dZyaqEw-ZNEcMmmKRPTwT6Yqyq6cp9RwyQ6O3uOEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

if (typeof window !== "undefined") {
  (window as any).supabase = supabase;
}

