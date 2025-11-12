-- Add payment columns to rti_applications table
-- Run this migration to support payment tracking

ALTER TABLE rti_applications
ADD COLUMN payment_id VARCHAR(255) NULL AFTER pincode,
ADD COLUMN order_id VARCHAR(255) NULL AFTER payment_id,
ADD INDEX idx_payment_id (payment_id),
ADD INDEX idx_order_id (order_id);

