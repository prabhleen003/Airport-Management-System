const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'Hello-WELLO',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
const passengerRoutes = require('./routes/passenger');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/');
};

const isStaff = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'staff') {
        return next();
    }
    res.redirect('/');
};

const isPassenger = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'passenger') {
        return next();
    }
    res.redirect('/');
};

// Use routes
app.use('/', authRoutes);
app.use('/admin', isAdmin, adminRoutes);
app.use('/staff', isStaff, staffRoutes);  
app.use('/passenger', isPassenger, passengerRoutes);

// Landing page route
app.get('/', (req, res) => {
    res.render('landing');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
