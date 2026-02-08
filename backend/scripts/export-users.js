const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./prisma/dev.db', { readonly: true });

console.log('🔍 Exporting users from local SQLite database...');

const users = db.prepare('SELECT * FROM users').all();

console.log(`✅ Found ${users.length} users`);

// Save to JSON file
fs.writeFileSync(
    'users_export.json',
    JSON.stringify(users, null, 2)
);

console.log('💾 Saved to users_export.json');

db.close();
