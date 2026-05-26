CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(20) DEFAULT 'driver',
    is_active BOOLEAN DEFAULT FALSE,
    is_employed BOOLEAN DEFAULT TRUE,
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

INSERT INTO users (login, first_name, last_name, email, password_hash, phone_number, role, is_active, is_employed) VALUES
('admin', 'Admin', 'User', 'isitestuser@proton.me', '$2b$10$cJ3cQlccPsFeeaD/G2IKx.3McGOVhn0FUk/k/rZ1XQ3bMsvH6HJI.', '123456789', 'manager', true, true),
('jkowalski', 'Jan', 'Kowalski', 'jkowalski@example.com', '$2b$10$cJ3cQlccPsFeeaD/G2IKx.3McGOVhn0FUk/k/rZ1XQ3bMsvH6HJI.', '500100200', 'driver', false, false),
('anowak', 'Anna', 'Nowak', 'anowak@example.com', '$2b$10$cJ3cQlccPsFeeaD/G2IKx.3McGOVhn0FUk/k/rZ1XQ3bMsvH6HJI.', '500100201', 'driver', false, true),
('pwisniew', 'Piotr', 'Wiśniewski', 'pwisniew@example.com', '$2b$10$cJ3cQlccPsFeeaD/G2IKx.3McGOVhn0FUk/k/rZ1XQ3bMsvH6HJI.', '500100202', 'driver', true, true),
('mzajac', 'Marek', 'Zając', 'mzajac@example.com', '$2b$10$cJ3cQlccPsFeeaD/G2IKx.3McGOVhn0FUk/k/rZ1XQ3bMsvH6HJI.', '500100203', 'driver', true, true);

INSERT INTO vehicles (license_plate, brand, model, year_of_manufacture, current_mileage, current_fuel_level, status) VALUES
('GD 12345', 'Volvo', 'FH16', 2020, 150000, 80, 'available'),
('GD 67890', 'Mercedes', 'Actros', 2019, 230000, 60, 'available'),
('GD 11111', 'Scania', 'R500', 2021, 90000, 100, 'available'),
('GD 22222', 'MAN', 'TGX', 2018, 310000, 45, 'in_service'),
('GD 33333', 'DAF', 'XF', 2022, 50000, 90, 'available');

INSERT INTO vehicle_assignments (vehicle_id, driver_id, start_time, end_time, start_mileage, end_mileage, start_fuel_level, end_fuel_level, status) VALUES
(1, 2, '2025-01-10 08:00:00', '2025-01-10 16:00:00', 149000, 150000, 90, 80, 'completed'),
(2, 3, '2025-02-15 07:00:00', '2025-02-15 15:00:00', 229000, 230000, 70, 60, 'completed'),
(3, 4, '2025-03-20 06:00:00', NULL, 89500, NULL, 100, NULL, 'active'),
(1, 5, '2025-04-01 09:00:00', '2025-04-01 17:00:00', 148000, 149000, 95, 90, 'completed');

INSERT INTO service_intervals (vehicle_id, element_name, interval_km, interval_months, last_service_mileage, last_service_date) VALUES
(1, 'Oil change', 15000, 12, 140000, '2024-06-01'),
(1, 'Brake inspection', 30000, 24, 120000, '2024-01-15'),
(2, 'Oil change', 15000, 12, 220000, '2024-08-10'),
(2, 'Tire rotation', 20000, NULL, 210000, '2024-05-20'),
(3, 'Oil change', 15000, 12, 80000, '2024-09-01'),
(4, 'Oil change', 15000, 12, 300000, '2024-03-10'),
(4, 'Brake inspection', 30000, 24, 280000, '2023-11-05'),
(5, 'Oil change', 15000, 12, 40000, '2024-11-15');

INSERT INTO service_logs (vehicle_id, element_name, service_date, service_mileage, description, cost) VALUES
(1, 'Oil change', '2024-06-01', 140000, 'Regular oil and filter change.', 350.00),
(1, 'Brake inspection', '2024-01-15', 120000, 'Front brake pads replaced.', 800.00),
(2, 'Oil change', '2024-08-10', 220000, 'Regular oil and filter change.', 350.00),
(2, 'Tire rotation', '2024-05-20', 210000, 'All tires rotated and balanced.', 200.00),
(3, 'Oil change', '2024-09-01', 80000, 'Regular oil and filter change.', 350.00),
(4, 'Oil change', '2024-03-10', 300000, 'Regular oil and filter change.', 350.00),
(4, 'Brake inspection', '2023-11-05', 280000, 'Rear brake pads replaced.', 750.00),
(5, 'Oil change', '2024-11-15', 40000, 'Regular oil and filter change.', 350.00);

INSERT INTO vehicle_status_images (vehicle_id, side, azure_blob_url, updated_at) VALUES
(1, 'front', 'https://example.blob.core.windows.net/vehicles/gd12345-front.jpg', '2025-01-10 16:00:00'),
(1, 'rear', 'https://example.blob.core.windows.net/vehicles/gd12345-rear.jpg', '2025-01-10 16:00:00'),
(1, 'left', 'https://example.blob.core.windows.net/vehicles/gd12345-left.jpg', '2025-01-10 16:00:00'),
(1, 'right', 'https://example.blob.core.windows.net/vehicles/gd12345-right.jpg', '2025-01-10 16:00:00'),
(2, 'front', 'https://example.blob.core.windows.net/vehicles/gd67890-front.jpg', '2025-02-15 15:00:00'),
(2, 'rear', 'https://example.blob.core.windows.net/vehicles/gd67890-rear.jpg', '2025-02-15 15:00:00');