import pool from './src/lib/db.js';
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'").then(r => console.log(r.rows)).catch(console.error).finally(()=>pool.end());
