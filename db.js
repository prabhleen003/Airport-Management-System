// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',         // or your DB server IP
  user: 'root',              // DB username
  password: '2381269',  // DB password
  database: 'airport_management_system'     // your actual DB name
});

connection.connect((err) => {
  if (err) {
    console.error('❌ DB Connection Failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL DB as ID', connection.threadId);
});

module.exports = connection;
