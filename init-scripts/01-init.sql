CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(20) DEFAULT 'driver',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(15) UNIQUE NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year_of_manufacture INT NOT NULL,
    current_mileage INT NOT NULL DEFAULT 0,
    current_fuel_level INT NOT NULL DEFAULT 100,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_assignments (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id INT REFERENCES users(id) ON DELETE RESTRICT,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    start_mileage INT NOT NULL,
    end_mileage INT,
    start_fuel_level INT NOT NULL,
    end_fuel_level INT,
    dashboard_image_url TEXT,
    status VARCHAR(25) DEFAULT 'active'
);

CREATE TABLE service_intervals (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    element_name VARCHAR(50) NOT NULL,
    interval_km INT,
    interval_months INT,
    last_service_mileage INT NOT NULL DEFAULT 0,
    last_service_date DATE NOT NULL,
    UNIQUE(vehicle_id, element_name)
);

CREATE TABLE vehicle_status_images (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    side VARCHAR(20) NOT NULL,
    azure_blob_url TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_id, side)
);

CREATE TABLE service_logs (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    element_name VARCHAR(50) NOT NULL,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    service_mileage INT NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2)
);