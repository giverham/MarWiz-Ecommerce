import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Read environment variables from .env
const envPath = "C:\\Users\\HP\\OneDrive\\Desktop\\MarWIZ E-Commerce\\MarWiz-Ecommerce\\.env";
if (!fs.existsSync(envPath)) {
  console.error("Missing .env file in project root.");
  process.exit(1);
}

const env = fs.readFileSync(envPath, "utf-8");
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env.");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to upload file to bucket if not already there
async function uploadLocalFile(localPath, bucket, targetName, mimeType) {
  try {
    if (!fs.existsSync(localPath)) {
      console.warn(`⚠️ Local file not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    
    // Check if file already exists in bucket
    const { data: list, error: listError } = await supabase.storage
      .from(bucket)
      .list("", { search: targetName });
      
    if (listError) {
      console.error(`Error checking bucket ${bucket}:`, listError.message);
    }

    const exists = list && list.some(f => f.name === targetName);
    let publicUrl = "";

    if (!exists) {
      console.log(`📤 Uploading ${localPath} to ${bucket}/${targetName}...`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(targetName, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Upload failed for ${targetName}:`, error.message);
        return null;
      }
    } else {
      console.log(`✨ File ${targetName} already exists in ${bucket}, skipping upload.`);
    }

    publicUrl = supabase.storage.from(bucket).getPublicUrl(targetName).data.publicUrl;
    console.log(`✅ Public URL for ${targetName}: ${publicUrl}`);

    // Register in media table if not exists
    const { data: mediaExists } = await supabase
      .from("media")
      .select("*")
      .eq("url", publicUrl)
      .maybeSingle();

    if (!mediaExists) {
      console.log(`📝 Registering ${targetName} in media database table...`);
      const fileType = mimeType.split("/")[0];
      await supabase.from("media").insert({
        url: publicUrl,
        name: targetName,
        folder: bucket,
        type: fileType
      });
    }

    return publicUrl;
  } catch (err) {
    console.error(`Error processing ${localPath}:`, err.message);
    return null;
  }
}

// Utility to download remote image and upload to Supabase Storage
async function migrateRemoteImage(remoteUrl, bucket, targetName, mimeType) {
  try {
    console.log(`🌐 Fetching remote image ${remoteUrl}...`);
    const response = await fetch(remoteUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if already in bucket
    const { data: list } = await supabase.storage
      .from(bucket)
      .list("", { search: targetName });

    const exists = list && list.some(f => f.name === targetName);
    let publicUrl = "";

    if (!exists) {
      console.log(`📤 Uploading remote asset to ${bucket}/${targetName}...`);
      const { error } = await supabase.storage
        .from(bucket)
        .upload(targetName, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (error) throw error;
    } else {
      console.log(`✨ Remote asset ${targetName} already exists in ${bucket}, skipping upload.`);
    }

    publicUrl = supabase.storage.from(bucket).getPublicUrl(targetName).data.publicUrl;
    console.log(`✅ Public URL for ${targetName}: ${publicUrl}`);

    // Register in media table
    const { data: mediaExists } = await supabase
      .from("media")
      .select("*")
      .eq("url", publicUrl)
      .maybeSingle();

    if (!mediaExists) {
      console.log(`📝 Registering ${targetName} in media database table...`);
      const fileType = mimeType.split("/")[0];
      await supabase.from("media").insert({
        url: publicUrl,
        name: targetName,
        folder: bucket,
        type: fileType
      });
    }

    return publicUrl;
  } catch (err) {
    console.error(`Error migrating remote image ${remoteUrl}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Asset Migration & CMS Sync...");

  // 1. Upload local videos and logos
  const heroBackgroundUrl = await uploadLocalFile(
    "C:\\Users\\HP\\OneDrive\\Desktop\\MarWIZ E-Commerce\\MarWiz-Ecommerce\\public\\assets\\videos\\hero-background.mp4",
    "banners",
    "hero-background.mp4",
    "video/mp4"
  );

  const heroVideoUrl = await uploadLocalFile(
    "C:\\Users\\HP\\OneDrive\\Desktop\\MarWIZ E-Commerce\\MarWiz-Ecommerce\\public\\hero-video.mp4",
    "banners",
    "hero-video.mp4",
    "video/mp4"
  );

  const faviconUrl = await uploadLocalFile(
    "C:\\Users\\HP\\OneDrive\\Desktop\\MarWIZ E-Commerce\\MarWiz-Ecommerce\\public\\favicon.svg",
    "logos",
    "favicon.svg",
    "image/svg+xml"
  );

  // 2. Migrate remote Pexels images used on site
  const brandStoryUrl = await migrateRemoteImage(
    "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "banners",
    "brand-story.jpg",
    "image/jpeg"
  );

  const whatsappCtaUrl = await migrateRemoteImage(
    "https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "banners",
    "whatsapp-cta.jpg",
    "image/jpeg"
  );

  const mainAboutUrl = await migrateRemoteImage(
    "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "pages",
    "about-main.jpg",
    "image/jpeg"
  );

  // 3. Update site_settings (row 1)
  console.log("📝 Updating site_settings row with migrated URLs...");
  const updatePayload = {
    updated_at: new Date().toISOString()
  };

  if (heroBackgroundUrl) updatePayload.hero_video_url = heroBackgroundUrl;
  if (brandStoryUrl) updatePayload.brand_story_image_url = brandStoryUrl;
  if (whatsappCtaUrl) updatePayload.whatsapp_cta_image_url = whatsappCtaUrl;
  if (faviconUrl) updatePayload.favicon_url = faviconUrl;

  const { error: settingsError } = await supabase
    .from("site_settings")
    .update(updatePayload)
    .eq("id", 1);

  if (settingsError) {
    console.error("❌ Failed to update site_settings:", settingsError.message);
  } else {
    console.log("✅ Successfully updated site_settings row 1 with CMS media URLs!");
  }

  // 4. Update and expand About Page in pages table with rich default content
  console.log("📝 Seeding About Page with comprehensive layout data...");
  
  const aboutPageContent = {
    heading: "The MarWiz Story",
    title: "About MarWiz",
    subtitle: "Nigerian Luxury Fashion House & Premium Watchmaker",
    description: "Founded in Lagos, Nigeria, MarWiz Wears & Watches was born from a singular vision: to create a luxury brand that celebrates African craftsmanship on the world stage. Every timepiece, every garment, is a testament to the belief that true luxury is not about fitting in — it is about standing apart.",
    company_story: "We source the finest materials, partner with master artisans, and obsess over every detail so that when you wear MarWiz, you feel the difference. Our philosophy is simple: Dare To Wear Different. Over the years, we have grown from a local boutique workshop into an internationally-recognized symbol of sophisticated excellence.",
    main_image: mainAboutUrl || "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
    brand_story_image: brandStoryUrl || "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery_images: [
      brandStoryUrl || "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1200",
      mainAboutUrl || "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    
    // Stats
    stat_years: "12+",
    stat_customers: "5,000+",
    stat_products: "150+",
    stat_orders: "10,000+",
    
    // Mission & Vision
    mission_title: "Our Mission",
    mission_desc: "To champion authentic craftsmanship and bold, tailored expression. We combine heritage luxury design with modern African artistry to deliver exceptional garments and watches that inspire confidence and elevate personal expression.",
    vision_title: "Our Vision",
    vision_desc: "To be the leading premium fashion and lifestyle brand across the continent, recognized worldwide for outstanding quality, daring innovation, and a refusal to settle for the ordinary.",
    
    // Core Values
    values: [
      { title: "Individuality", desc: "We celebrate who you are. We make statement pieces for those who dare to stand apart and express their true self." },
      { title: "Artisanal Integrity", desc: "Every seam, every leather strap, every bezel is meticulously crafted by hand with strict adherence to elite standards." },
      { title: "African Heritage", desc: "We infuse our rich cultural identity and premium local textiles with international haute couture standards." }
    ],
    
    // Team Section
    team: [
      { name: "Marcus Wiz", position: "Creative Director & Founder", photo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400", bio: "With over 15 years in luxury tailoring, Marcus founded MarWiz to merge exquisite European Horology with bold West African prints." },
      { name: "Alisha Bello", position: "Head of Horology", photo: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400", bio: "Alisha oversees our mechanical watch assembly line, guaranteeing every mechanical caliber beats with pristine chronometric precision." }
    ],
    
    // CTA Section
    cta_title: "Experience Dynamic Luxury Firsthand",
    cta_desc: "Discover why thousands of collectors and fashion icons choose to Dare To Wear Different.",
    cta_btn_text: "Shop the Store",
    cta_btn_link: "/shop",
    cta_bg_image: whatsappCtaUrl || "https://images.pexels.com/photos/9968322/pexels-photo-9968322.jpeg?auto=compress&cs=tinysrgb&w=1600"
  };

  const { error: aboutPageError } = await supabase
    .from("pages")
    .update({ content: aboutPageContent })
    .eq("slug", "about");

  if (aboutPageError) {
    console.error("❌ Failed to update About Page page record:", aboutPageError.message);
  } else {
    console.log("✅ Successfully updated the About Page in Supabase with advanced structured CMS sections!");
  }

  console.log("🎉 Asset migration and database update complete!");
}

run();
