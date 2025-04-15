const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Staff dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Get upcoming flights (next 30 minutes)
        const [upcomingFlights] = await db.query(`
            SELECT * FROM flights 
            WHERE departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        `);
        
        // Get assigned duties
        const [duties] = await db.query(`
            SELECT d.*, p.name as port_name 
            FROM duties d
            JOIN ports p ON d.port_id = p.id
            WHERE d.staff_id = ? AND d.end_time > NOW()
            ORDER BY d.start_time
        `, [req.session.user.id]);
        
        // Get all upcoming flights
        const [flights] = await db.query(`
            SELECT * FROM flights 
            WHERE departure_time > NOW()
            ORDER BY departure_time
            LIMIT 10
        `);
        
        // Get staff leave requests
        const [leaveRequests] = await db.query(`
            SELECT * FROM leave_requests
            WHERE user_id = ?
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
    const user_id = req.session.user.id;
    
    try {
        await db.query(`
            INSERT INTO leave_requests (user_id, start_date, end_date, reason, status)
            VALUES (?, ?, ?, ?, 'pending')
        `, [user_id, start_date, end_date, reason]);
        
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
            SELECT d.*, p.name as port_name 
            FROM duties d
            JOIN ports p ON d.port_id = p.id
            WHERE d.staff_id = ?
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