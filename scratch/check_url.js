async function run() {
  const url = 'https://lyrkrecesniblsixmqhn.supabase.co/storage/v1/object/public/pages/about-main.jpg';
  try {
    const res = await fetch(url);
    console.log('Status code:', res.status);
    console.log('Headers:');
    for (const [key, value] of res.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
run();
