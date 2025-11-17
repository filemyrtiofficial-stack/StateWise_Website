-- Update Service Prices
-- Run this script to update prices in the production database

-- Seamless Online Filing: 2999 -> 699
UPDATE services 
SET price = 699.00, updated_at = NOW() 
WHERE slug = 'seamless-online-filing';

-- 15-minute Consultation: 299 -> 199
UPDATE services 
SET price = 199.00, updated_at = NOW() 
WHERE slug = '15-minute-consultation';

-- Anonymous RTI: 3999 -> 699
UPDATE services 
SET price = 699.00, updated_at = NOW() 
WHERE slug = 'anonymous';

-- 1st Appeal: 2499 -> 699
UPDATE services 
SET price = 699.00, updated_at = NOW() 
WHERE slug = '1st-appeal';

-- Bulk RTI: 9999 -> 0 (free/lead only)
UPDATE services 
SET price = 0.00, updated_at = NOW() 
WHERE slug = 'bulk';

