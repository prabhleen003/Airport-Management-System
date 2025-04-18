const express = require('express');
const router = express.Router();

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

router.post('/login', (req, res) => {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role }); // Debug log
    
    // Special handling for admin login
    if (role === 'admin') {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            console.log('Admin login successful'); // Debug log
            // Set admin session
            req.session.user = {
                id: 'admin',
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                role: ADMIN_CREDENTIALS.role
            };
            return res.redirect('/admin/dashboard');
        } else {
            console.log('Invalid admin credentials'); // Debug log
            return res.render('auth/login', { 
                role, 
                error: 'Invalid admin credentials' 
            });
        }
    }

    // For other roles (staff and passenger), show database not available message
    if (role === 'staff' || role === 'passenger') {
        return res.render('auth/login', { 
            role, 
            error: 'Database connection is not available. Please try again later.' 
        });
    }

    // If role is not recognized
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

router.post('/signup', (req, res) => {
    const { role } = req.body;
    return res.render('auth/signup', { 
        role, 
        error: 'Database connection is not available. Please try again later.' 
    });
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;