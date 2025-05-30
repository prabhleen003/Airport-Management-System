const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Passenger dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const [upcomingFlights] = await db.query(`
            SELECT * FROM flights 
            WHERE departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        `);

        const [bookings] = await db.query(`
            SELECT b.*, f.flight_number, f.source, f.destination, 
                  f.departure_time, f.arrival_time,
                  s.seat_number
            FROM bookings b
            JOIN flights f ON b.flight_id = f.flight_id
            JOIN seats s ON b.seat_id = s.seat_id
            WHERE b.passenger_id = ? AND f.departure_time > NOW()
            ORDER BY f.departure_time
        `, [req.session.user.id]);

        const [ferryBookings] = await db.query(`
            SELECT fb.*, f.departure_time, f.route
            FROM ferry_bookings fb
            JOIN ferries f ON fb.ferry_id = f.ferry_id
            WHERE fb.passenger_id = ? AND f.departure_time > NOW()
            ORDER BY f.departure_time
        `, [req.session.user.id]);

        res.render('passenger/dashboard', {
            user: req.session.user,
            upcomingFlights,
            bookings,
            ferryBookings
        });
    } catch (error) {
        console.error('Passenger Dashboard Error:', error);
        res.status(500).send('Server error');
    }
});

// Book flight
router.get('/book-flight', async (req, res) => {
    try {
        const [sources] = await db.query('SELECT DISTINCT source FROM flights');
        const [destinations] = await db.query('SELECT DISTINCT destination FROM flights');

        res.render('passenger/book-flight', {
            user: req.session.user,
            sources,
            destinations
        });
    } catch (error) {
        console.error('Book Flight Error:', error);
        res.status(500).send('Server error');
    }
});

router.post('/search-flights', async (req, res) => {
    const { source, destination, date } = req.body;

    try {
        const [flights] = await db.query(`
            SELECT * FROM flights 
            WHERE source = ? AND destination = ? 
            AND DATE(departure_time) = ?
        `, [source, destination, date]);

        res.render('passenger/flight-results', {
            user: req.session.user,
            flights,
            search: { source, destination, date }
        });
    } catch (error) {
        console.error('Search Flights Error:', error);
        res.status(500).send('Server error');
    }
});

// Select seat
router.get('/select-seat/:flightId', async (req, res) => {
    const { flightId } = req.params;

    try {
        const [flights] = await db.query('SELECT * FROM flights WHERE flight_id = ?', [flightId]);
        const flight = flights[0];

        const [seats] = await db.query(`
            SELECT * FROM seats
            WHERE flight_id = ? AND seat_id NOT IN (
                SELECT seat_id FROM bookings WHERE flight_id = ?
            )
        `, [flightId, flightId]);

        res.render('passenger/select-seat', {
            user: req.session.user,
            flight,
            seats
        });
    } catch (error) {
        console.error('Select Seat Error:', error);
        res.status(500).send('Server error');
    }
});

router.post('/book-seat', async (req, res) => {
    const { flight_id, seat_id } = req.body;
    const passenger_id = req.session.user.id;

    try {
        await db.query(`
            INSERT INTO bookings (passenger_id, flight_id, seat_id, booking_date)
            VALUES (?, ?, ?, NOW())
        `, [passenger_id, flight_id, seat_id]);

        res.redirect('/passenger/dashboard');
    } catch (error) {
        console.error('Book Seat Error:', error);
        res.status(500).send('Server error');
    }
});

// Book ferry
router.get('/book-ferry', async (req, res) => {
    try {
        const [ferries] = await db.query(`
            SELECT * FROM ferries
            WHERE departure_time > NOW()
            ORDER BY departure_time
        `);

        res.render('passenger/book-ferry', {
            user: req.session.user,
            ferries
        });
    } catch (error) {
        console.error('Book Ferry Error:', error);
        res.status(500).send('Server error');
    }
});

router.post('/book-ferry', async (req, res) => {
    const { ferry_id } = req.body;
    const passenger_id = req.session.user.id;

    try {
        await db.query(`
            INSERT INTO ferry_bookings (passenger_id, ferry_id, booking_date)
            VALUES (?, ?, NOW())
        `, [passenger_id, ferry_id]);

        res.redirect('/passenger/dashboard');
    } catch (error) {
        console.error('Book Ferry Post Error:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
