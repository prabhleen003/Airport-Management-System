const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Admin Dashboard
router.get('/dashboard', (req, res) => {
    console.log('Admin dashboard access attempt:', req.session.user);
    if (!req.session.user || req.session.user.role !== 'admin') {
        console.log('Unauthorized access to admin dashboard');
        return res.redirect('/');
    }
    console.log('Rendering admin dashboard');
    res.render('admin/dashboard', { user: req.session.user });
});

// Staff Management Routes
router.get('/staff', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/staff', { user: req.session.user });
});

router.get('/staff/approve', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/staff-approve', { user: req.session.user });
});

// Flight Management Routes
router.get('/flights', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/flights', { user: req.session.user });
});

router.get('/flights/add', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/flight-add', { user: req.session.user });
});

// Passenger Management Routes
router.get('/passengers', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/passengers', { user: req.session.user });
});

// Reports Route
router.get('/reports', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    res.render('admin/reports', { user: req.session.user });
});

// Approve/reject staff
router.post('/staff/approve/:id', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    try {
        if (action === 'approve') {
            await db.query('UPDATE employees SET approved = 1 WHERE emp_id = ?', [id]);
        } else if (action === 'reject') {
            await db.query('DELETE FROM employees WHERE emp_id = ?', [id]);
        }

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Staff Approval Error:', error);
        res.status(500).send('Server error');
    }
});

// Assign duties to staff
router.get('/assign-duties', async (req, res) => {
    try {
        const [staff] = await db.query(`
            SELECT * FROM employees 
            WHERE role = 'staff' AND approved = 1
        `);

        const [ports] = await db.query('SELECT * FROM airport_services');

        res.render('admin/assign-duties', {
            user: req.session.user,
            staff,
            ports
        });
    } catch (error) {
        console.error('Assign Duties Error:', error);
        res.status(500).send('Server error');
    }
});

router.post('/assign-duties', async (req, res) => {
    const { staff_id, port_id, duty, start_time, end_time } = req.body;

    try {
        await db.query(`
            INSERT INTO duties (emp_id, airport_id, service_desc, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
        `, [staff_id, port_id, duty, start_time, end_time]);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Assign Duties Post Error:', error);
        res.status(500).send('Server error');
    }
});

// Manage leave requests
router.post('/leave-request/:id', async (req, res) => {
    const { id } = req.params;
    const { action, reassign_to } = req.body;

    try {
        if (action === 'approve') {
            await db.query('UPDATE leave_requests SET status = "approved" WHERE leave_id = ?', [id]);

            if (reassign_to) {
                const [leaveRequests] = await db.query('SELECT * FROM leave_requests WHERE leave_id = ?', [id]);
                const leaveRequest = leaveRequests[0];

                await db.query(`
                    UPDATE duties 
                    SET emp_id = ? 
                    WHERE emp_id = ? AND 
                    ((start_time BETWEEN ? AND ?) OR 
                    (end_time BETWEEN ? AND ?))
                `, [
                    reassign_to,
                    leaveRequest.emp_id,
                    leaveRequest.start_date,
                    leaveRequest.end_date,
                    leaveRequest.start_date,
                    leaveRequest.end_date
                ]);
            }
        } else if (action === 'reject') {
            await db.query('UPDATE leave_requests SET status = "rejected" WHERE leave_id = ?', [id]);
        }

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Leave Request Error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
