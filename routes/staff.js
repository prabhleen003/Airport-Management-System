const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Staff dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const [upcomingFlights] = await db.query(`
            SELECT * FROM flights 
            WHERE departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        `);

        const [duties] = await db.query(`
            SELECT d.*, a.name AS port_name 
            FROM duties d
            JOIN airports a ON d.airport_id = a.airport_id
            WHERE d.emp_id = ? AND d.end_time > NOW()
            ORDER BY d.start_time
        `, [req.session.user.id]);

        const [flights] = await db.query(`
            SELECT * FROM flights 
            WHERE departure_time > NOW()
            ORDER BY departure_time
            LIMIT 10
        `);

        const [leaveRequests] = await db.query(`
            SELECT * FROM leave_requests
            WHERE emp_id = ?
            ORDER BY start_date
        `, [req.session.user.id]);

        res.render('staff/dashboard', {
            user: req.session.user,
            upcomingFlights,
            duties,
            flights,
            leaveRequests
        });
    } catch (error) {
        console.error('Staff Dashboard Error:', error);
        res.status(500).send('Server error');
    }
});

// Apply for leave
router.get('/leave-request', (req, res) => {
    res.render('staff/leave-request', {
        user: req.session.user
    });
});

router.post('/leave-request', async (req, res) => {
    const { start_date, end_date, reason } = req.body;
    const emp_id = req.session.user.id;

    try {
        await db.query(`
            INSERT INTO leave_requests (emp_id, start_date, end_date, reason, status)
            VALUES (?, ?, ?, ?, 'pending')
        `, [emp_id, start_date, end_date, reason]);

        res.redirect('/staff/dashboard');
    } catch (error) {
        console.error('Leave Request Error:', error);
        res.status(500).send('Server error');
    }
});

// View duty schedule
router.get('/duties', async (req, res) => {
    try {
        const [duties] = await db.query(`
            SELECT d.*, a.name AS port_name 
            FROM duties d
            JOIN airports a ON d.airport_id = a.airport_id
            WHERE d.emp_id = ?
            ORDER BY d.start_time
        `, [req.session.user.id]);

        res.render('staff/duties', {
            user: req.session.user,
            duties
        });
    } catch (error) {
        console.error('Duties Error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
