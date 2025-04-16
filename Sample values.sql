USE airport_management_system;

-- Insert sample airports
INSERT INTO Airport (name, city, state, country) VALUES
('John F. Kennedy International Airport', 'New York', 'New York', 'USA'),
('Los Angeles International Airport', 'Los Angeles', 'California', 'USA'),
('O’Hare International Airport', 'Chicago', 'Illinois', 'USA');

-- Insert sample aircraft
INSERT INTO Aircraft (model, capacity, airline) VALUES
('Boeing 737', 180, 'American Airlines'),
('Airbus A320', 160, 'Delta Airlines');

-- Insert sample flights
INSERT INTO Flight (airline, departure_airport_id, arrival_airport_id, aircraft_id, departure_time, arrival_time, status) VALUES
('American Airlines', 1, 2, 1, '2025-04-15 08:00:00', '2025-04-15 11:00:00', 'scheduled'),
('Delta Airlines', 2, 3, 2, '2025-04-16 14:00:00', '2025-04-16 17:00:00', 'scheduled');

-- Insert sample passengers
INSERT INTO Passenger (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@example.com', '9876543210'),
('Emma', 'Smith', 'emma.smith@example.com', '9876543211'),
('Ayesha', 'Khan', 'ayesha.khan@example.com', '9876543212'),
('Liam', 'Martinez', 'liam.martinez@example.com', '9876543213'),
('Sophia', 'Chavez', 'sophia.chavez@example.com', '9876543214'),
('Ravi', 'Patel', 'ravi.patel@example.com', '9876543215'),
('Mia', 'Wilson', 'mia.wilson@example.com', '9876543216'),
('Mohammed', 'Ali', 'mohammed.ali@example.com', '9876543217'),
('Noah', 'Nguyen', 'noah.nguyen@example.com', '9876543218'),
('Isabella', 'Lee', 'isabella.lee@example.com', '9876543219');

-- Insert sample employees
INSERT INTO Employee (first_name, last_name, email, phone, job_title, hire_date, airport_id) VALUES
('David', 'Johnson', 'david.johnson@example.com', '9876543220', 'Pilot', '2022-01-15', 1),
('Olivia', 'Taylor', 'olivia.taylor@example.com', '9876543221', 'Ground Crew', '2021-05-10', 2),
('Carlos', 'Rodriguez', 'carlos.rodriguez@example.com', '9876543222', 'Flight Attendant', '2020-07-22', 3),
('Ananya', 'Sharma', 'ananya.sharma@example.com', '9876543223', 'Security Officer', '2021-09-15', 3),
('Mohammed', 'Khan', 'mohammed.khan@example.com', '9876543224', 'Airline Staff', '2023-01-20', 2),
('Siti', 'Zahra', 'siti.zahra@example.com', '9876543225', 'Ticket Agent', '2022-04-18', 1);

-- Insert sample bookings
INSERT INTO Booking (passenger_id, flight_id, seat_number, booking_date, status) VALUES
(1, 1, '1A', '2025-04-10', 'booked'),
(2, 1, '1B', '2025-04-11', 'booked'),
(3, 2, '2A', '2025-04-12', 'booked'),
(4, 1, '2B', '2025-04-13', 'booked'),
(5, 2, '3A', '2025-04-14', 'booked'),
(6, 1, '3B', '2025-04-10', 'booked'),
(7, 2, '4A', '2025-04-11', 'booked'),
(8, 1, '4B', '2025-04-12', 'booked'),
(9, 2, '5A', '2025-04-13', 'booked'),
(10, 1, '5B', '2025-04-14', 'booked');

-- Insert sample users (passengers and employees)
INSERT INTO Users (username, password, role, passenger_id, employee_id) VALUES
('john_doe', 'password123', 'passenger', 1, NULL),
('emma_smith', 'password123', 'passenger', 2, NULL),
('ayesha_khan', 'password123', 'passenger', 3, NULL),
('liam_martinez', 'password123', 'passenger', 4, NULL),
('sophia_chavez', 'password123', 'passenger', 5, NULL),
('ravi_patel', 'password123', 'passenger', 6, NULL),
('mia_wilson', 'password123', 'passenger', 7, NULL),
('mohammed_ali', 'password123', 'passenger', 8, NULL),
('noah_nguyen', 'password123', 'passenger', 9, NULL),
('isabella_lee', 'password123', 'passenger', 10, NULL),
('david_johnson', 'password123', 'staff', NULL, 1),
('olivia_taylor', 'password123', 'staff', NULL, 2),
('carlos_rodriguez', 'password123', 'staff', NULL, 3),
('ananya_sharma', 'password123', 'staff', NULL, 4),
('mohammed_khan', 'password123', 'staff', NULL, 5),
('siti_zahra', 'password123', 'staff', NULL, 6);
