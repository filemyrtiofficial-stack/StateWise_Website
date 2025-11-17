# Update Service Prices

This guide explains how to update service prices in the production database.

## Problem

The frontend fetches prices from the backend database, not from static files. Even if you update the frontend code, the production database still has the old prices.

## Solution

You have two options to update prices:

### Option 1: Run the Node.js Script (Recommended)

```bash
cd Backend
npm run update-prices
```

This script will:
- Update all service prices in the database
- Show verification of updated prices
- Handle errors gracefully

### Option 2: Run SQL Script Directly

If you have direct database access, you can run the SQL file:

```bash
mysql -u your_username -p your_database < Backend/database/update-service-prices.sql
```

Or execute the SQL commands in your database management tool (phpMyAdmin, MySQL Workbench, etc.)

## Current Price Updates

The following prices will be updated:

- **Seamless Online Filing**: ₹2,999 → ₹699
- **15-minute Consultation**: ₹299 → ₹199
- **Anonymous RTI**: ₹3,999 → ₹699
- **1st Appeal**: ₹2,499 → ₹699
- **Bulk RTI**: ₹9,999 → ₹0 (free/lead only)

## After Running the Script

1. The prices will be updated in the database
2. The frontend will automatically fetch the new prices from the API
3. No frontend rebuild is needed (prices come from backend)
4. Clear browser cache if prices don't update immediately

## Troubleshooting

If prices don't update:
1. Check database connection in `.env` file
2. Verify the service slugs match exactly
3. Check if the update script ran successfully
4. Clear browser cache and hard refresh (Ctrl+Shift+R)
5. Check browser console for API errors

