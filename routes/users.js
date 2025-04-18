// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('DB Query Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

module.exports = router;
