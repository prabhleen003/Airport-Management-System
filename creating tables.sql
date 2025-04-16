-- Drop and Create the Database
DROP DATABASE IF EXISTS airport_management_system;
CREATE DATABASE airport_management_system;
USE airport_management_system;

-- Table: Airport
CREATE TABLE Airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50)
);

-- Table: Passenger
CREATE TABLE Passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(15)
);

-- Table: Employee
CREATE TABLE Employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(15),
    job_title VARCHAR(50),
    hire_date DATE,
    airport_id INT,
    FOREIGN KEY (airport_id) REFERENCES Airport(airport_id)
);

-- Table: Aircraft
CREATE TABLE Aircraft (
    aircraft_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    capacity INT,
    airline VARCHAR(50)
);

-- Table: Flight
CREATE TABLE Flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(50),
    departure_airport_id INT,
    arrival_airport_id INT,
    aircraft_id INT,
    departure_time DATETIME,
    arrival_time DATETIME,
    status ENUM('scheduled', 'cancelled', 'delayed', 'departed', 'arrived') NOT NULL,
    FOREIGN KEY (departure_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (arrival_airport_id) REFERENCES Airport(airport_id),
    FOREIGN KEY (aircraft_id) REFERENCES Aircraft(aircraft_id)
);

-- Table: Booking (NO unique constraint on seat; status-based booking control)
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT,
    flight_id INT,
    seat_number VARCHAR(5),
    booking_date DATE,
    status ENUM('booked', 'cancelled') DEFAULT 'booked',
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

-- Table: Users (linked to either Passenger or Employee)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff', 'passenger') NOT NULL,
    passenger_id INT DEFAULT NULL,
    employee_id INT DEFAULT NULL,
    FOREIGN KEY (passenger_id) REFERENCES Passenger(passenger_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);
