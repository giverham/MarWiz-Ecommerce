const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir).sort();

const payload = {};

files.forEach(file => {
  if (file.endsWith('.sql')) {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    payload[file] = content;
  }
});

fs.writeFileSync(path.join(__dirname, 'sql_payload.json'), JSON.stringify(payload, null, 2), 'utf8');
console.log('Successfully prepared SQL payload in scratch/sql_payload.json');
