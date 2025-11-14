-- Make address and pincode optional in consultations table
-- This allows appointment forms to submit without these fields

ALTER TABLE consultations 
MODIFY COLUMN address TEXT NULL,
MODIFY COLUMN pincode VARCHAR(10) NULL;
