const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Predefined admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: 'abc@admin',
    name: 'System Admin',
    role: 'admin'
};

// Login routes
router.get('/login/:role', (req, res) => {
    const { role } = req.params;
    if (!['admin', 'staff', 'passenger'].includes(role)) {
        return res.redirect('/');
    }
    res.render('auth/login', { role });
});

router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role });

    if (role === 'admin') {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            req.session.user = {
                id: 'admin',
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                role: ADMIN_CREDENTIALS.role
            };
            return res.redirect('/admin/dashboard');
        } else {
            return res.render('auth/login', {
                role,
                error: 'Invalid admin credentials'
            });
        }
    }

    try {
        if (role === 'staff') {
            const [results] = await db.query(
                'SELECT * FROM employees WHERE email = ? AND password = ? AND approved = 1',
                [email, password]
            );

            if (results.length > 0) {
                const staff = results[0];
                req.session.user = {
                    id: staff.emp_id,
                    name: staff.name,
                    email: staff.email,
                    role: 'staff'
                };
                return res.redirect('/staff/dashboard');
            } else {
                return res.render('auth/login', {
                    role,
                    error: 'Invalid credentials or not approved yet.'
                });
            }
        }

        if (role === 'passenger') {
            const [results] = await db.query(
                'SELECT * FROM passengers WHERE email = ? AND password = ?',
                [email, password]
            );

            if (results.length > 0) {
                const passenger = results[0];
                req.session.user = {
                    id: passenger.passenger_id,
                    name: passenger.name,
                    email: passenger.email,
                    role: 'passenger'
                };
                return res.redirect('/passenger/dashboard');
            } else {
                return res.render('auth/login', {
                    role,
                    error: 'Invalid credentials.'
                });
            }
        }
    } catch (err) {
        console.error('Login Error:', err);
        return res.render('auth/login', {
            role,
            error: 'Server error. Please try again later.'
        });
    }

    return res.redirect('/');
});

// Signup routes
router.get('/signup/:role', (req, res) => {
    const { role } = req.params;
    if (!['staff', 'passenger'].includes(role)) {
        return res.redirect('/');
    }
    res.render('auth/signup', { role });
});

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (role === 'staff') {
            await db.query(
                'INSERT INTO employees (name, email, password, role, approved) VALUES (?, ?, ?, "staff", 0)',
                [name, email, password]
            );
            return res.render('auth/login', {
                role,
                error: 'Signup successful. Please wait for admin approval.'
            });
        }

        if (role === 'passenger') {
            await db.query(
                'INSERT INTO passengers (name, email, password) VALUES (?, ?, ?)',
                [name, email, password]
            );
            return res.redirect('/login/passenger');
        }

        return res.redirect('/');
    } catch (err) {
        console.error('Signup Error:', err);
        return res.render('auth/signup', {
            role,
            error: 'Signup failed. Try again later or use a different email.'
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
