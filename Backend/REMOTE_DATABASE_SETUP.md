# Remote Database Setup Guide

## Your Database Credentials Analysis

Based on your credentials:
- **Username**: `u665497677_StatesubDomain`
- **Database**: `u665497677_State`

The `u665497677_` prefix indicates this is a **shared hosting/remote database** (likely cPanel, Plesk, or similar).

## Common Solutions

### Option 1: Use "localhost" (Most Common for Shared Hosting)

Even though it's a remote database, many shared hosting providers use `localhost` as the MySQL host:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=u665497677_StatesubDomain
DB_PASSWORD=fileMyRTI@50cr
DB_NAME=u665497677_State
```

### Option 2: Find the Correct MySQL Hostname

1. **Log into your hosting control panel** (cPanel, Plesk, etc.)
2. **Navigate to MySQL Databases** section
3. **Look for "MySQL Hostname"** or "Database Host"
4. Common values:
   - `localhost`
   - `mysql.yourdomain.com`
   - `yourdomain.com`
   - An IP address like `185.xxx.xxx.xxx`

### Option 3: Check Your Hosting Provider's Documentation

Different providers use different hosts:
- **cPanel**: Usually `localhost`
- **Plesk**: Usually `localhost` or `127.0.0.1`
- **Cloud hosting**: May use a specific domain or IP
- **Managed databases**: Use the provided connection string

## Step-by-Step: Finding Your MySQL Host

### For cPanel:

1. Log into cPanel
2. Go to **"MySQL Databases"** (under Databases section)
3. Look for **"Current Databases"** or **"MySQL Hostname"**
4. The hostname is usually displayed near the top
5. Common values: `localhost`, `mysql.yourdomain.com`

### For Plesk:

1. Log into Plesk
2. Go to **"Databases"** → **"MySQL"**
3. Check the connection details
4. Host is usually `localhost` or shown in connection info

### For Other Providers:

Check your hosting provider's documentation or support for:
- MySQL connection details
- Database hostname
- Remote MySQL access settings

## Testing Different Hosts

Try these common hosts one by one in your `.env` file:

```env
# Try 1: localhost (most common)
DB_HOST=localhost

# Try 2: 127.0.0.1 (same as localhost)
DB_HOST=127.0.0.1

# Try 3: Your domain
DB_HOST=mysql.yourdomain.com

# Try 4: Your main domain
DB_HOST=yourdomain.com
```

After each change, test with:
```bash
npm run test-db
```

## Remote MySQL Access

If you need to connect from outside the server:

1. **Enable Remote MySQL** in your control panel
2. **Whitelist your IP address**
3. **Use the provided remote hostname** (not localhost)

⚠️ **Security Note**: Only enable remote access if necessary. For applications on the same server, use `localhost`.

## Quick Checklist

- [ ] Checked hosting control panel for MySQL hostname
- [ ] Tried `localhost` as DB_HOST
- [ ] Verified database name matches exactly
- [ ] Verified username matches exactly
- [ ] Checked password is correct (no extra spaces)
- [ ] Tested connection with `npm run test-db`
- [ ] Checked if IP whitelisting is required

## Still Can't Connect?

1. **Contact your hosting provider** - They can provide the exact MySQL hostname
2. **Check hosting documentation** - Look for "MySQL connection" or "database connection"
3. **Try phpMyAdmin** - If you can access phpMyAdmin, the connection details are shown there
4. **Check server logs** - Your hosting provider may have error logs

## Example .env for Remote Database

```env
PORT=5000
NODE_ENV=development

# For shared hosting (cPanel) - usually localhost works
DB_HOST=localhost
DB_PORT=3306
DB_USER=u665497677_StatesubDomain
DB_PASSWORD=fileMyRTI@50cr
DB_NAME=u665497677_State

# For remote access (if enabled)
# DB_HOST=mysql.yourdomain.com
# DB_PORT=3306

JWT_SECRET=yourSecretKeyChangeThisInProduction
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

