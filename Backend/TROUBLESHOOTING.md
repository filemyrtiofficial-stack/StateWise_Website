# Troubleshooting Guide

## Database Connection Issues

### Error: ECONNREFUSED

This error means the MySQL server is not accessible. Here are solutions:

#### For Local MySQL:

1. **Check if MySQL is running:**
   ```bash
   # Windows
   services.msc  # Look for MySQL service
   
   # Or check via command line
   net start MySQL
   ```

2. **Start MySQL service:**
   ```bash
   # Windows
   net start MySQL
   
   # Linux/Mac
   sudo service mysql start
   # or
   sudo systemctl start mysql
   ```

3. **Verify MySQL is listening on port 3306:**
   ```bash
   # Windows
   netstat -an | findstr 3306
   
   # Linux/Mac
   netstat -an | grep 3306
   ```

#### For Remote MySQL (like your u665497677_StatesubDomain):

1. **Check if the host is correct:**
   - Your credentials suggest a remote database
   - The host might not be `localhost`
   - Check your hosting provider's documentation for the correct host

2. **Common remote database hosts:**
   - `localhost` (if using SSH tunnel)
   - `your-domain.com`
   - `mysql.your-domain.com`
   - `IP address` (e.g., `185.xxx.xxx.xxx`)

3. **Check if you need a different port:**
   - Some hosting providers use non-standard ports
   - Common ports: 3306, 3307, 33060
   - Add `DB_PORT=3306` (or your port) to `.env`

4. **Check firewall/network:**
   - Remote databases might require whitelisting your IP
   - Check your hosting provider's firewall settings
   - Some providers only allow connections from specific IPs

5. **For cPanel/Shared Hosting:**
   - Host is usually `localhost` (even for remote)
   - Or use the provided MySQL hostname
   - Check cPanel → Databases → MySQL Databases

### Error: ER_ACCESS_DENIED_ERROR

**Solution:**
- Double-check username and password in `.env`
- Verify the user has proper permissions
- Try resetting the database password

### Error: ER_BAD_DB_ERROR

**Solution:**
- Database doesn't exist
- Create the database first
- Or check `DB_NAME` in `.env` matches the actual database name

### Error: ENOTFOUND

**Solution:**
- Check `DB_HOST` in `.env`
- Verify network connectivity
- For remote databases, ensure the hostname is correct

## Quick Fixes

### 1. Test Database Connection
```bash
npm run test-db
```

### 2. Verify .env File
Make sure your `.env` file exists and contains:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=u665497677_StatesubDomain
DB_PASSWORD=fileMyRTI@50cr
DB_NAME=u665497677_State
```

### 3. For Remote Databases (cPanel/Shared Hosting)

If you're using a shared hosting service (like the `u665497677_` prefix suggests), try:

**Option 1: Use localhost (most common)**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=u665497677_StatesubDomain
DB_PASSWORD=fileMyRTI@50cr
DB_NAME=u665497677_State
```

**Option 2: Use the provided MySQL hostname**
Check your hosting control panel for the MySQL hostname. It might be:
- `localhost`
- `mysql.your-domain.com`
- An IP address

**Option 3: Check cPanel MySQL Settings**
1. Log into cPanel
2. Go to "MySQL Databases"
3. Check the "Current Databases" section
4. Note the exact database name and username
5. Check "Remote MySQL" if you need to allow remote connections

### 4. Test Connection Manually

You can test the connection using MySQL command line:
```bash
mysql -h localhost -u u665497677_StatesubDomain -p u665497677_State
```

If this works, the credentials are correct and the issue is with the Node.js connection.

## Still Having Issues?

1. **Check server logs** for more detailed error messages
2. **Run the test script:** `npm run test-db`
3. **Verify all environment variables** are set correctly
4. **Check MySQL server status** and logs
5. **Contact your hosting provider** if using remote database

