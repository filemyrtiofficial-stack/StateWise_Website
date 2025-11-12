-- Payment Recovery Table
-- Stores failed application submissions after successful payment
-- Allows admins to recover and process these applications

CREATE TABLE IF NOT EXISTS payment_recoveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  service_id INT NOT NULL,
  state_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  rti_query TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  error_message TEXT,
  request_body TEXT,
  status ENUM('pending', 'processed', 'failed') DEFAULT 'pending',
  application_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_id (payment_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

