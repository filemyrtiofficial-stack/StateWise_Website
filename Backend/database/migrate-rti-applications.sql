-- Migration script to update rti_applications table for public submissions
-- Run this if the table already exists

-- Check if table exists and update it
-- If table doesn't exist, run setup.sql instead

-- Allow user_id to be NULL for public submissions
ALTER TABLE rti_applications 
MODIFY COLUMN user_id INT NULL;

-- Update foreign key to allow NULL
ALTER TABLE rti_applications 
DROP FOREIGN KEY rti_applications_ibfk_1;

ALTER TABLE rti_applications 
ADD CONSTRAINT rti_applications_ibfk_1 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

