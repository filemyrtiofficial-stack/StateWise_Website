# Email Notification Setup

This document explains how to configure email notifications for form submissions.

## Overview

The backend now sends email notifications to `admin@filemyrti.com` whenever any form is submitted:
- Consultation Form (Appointment Form)
- Callback Request Form
- RTI Application Form (both public and authenticated)

## Configuration

### Environment Variables

The system supports both naming conventions. You can use either:

**Option 1: MAIL_* (existing format)**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME="admin@filemyrti.com"
MAIL_PASSWORD="your-password"
```

**Option 2: SMTP_* (alternative format)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@filemyrti.com
```

**Note**: 
- Port 465 automatically uses SSL (secure: true)
- Port 587 uses TLS (secure: false)
- Quotes around values in .env are automatically removed
- If `ADMIN_EMAIL` is not set, it defaults to `MAIL_USERNAME` or `admin@filemyrti.com`

### Gmail Setup Example

If using Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password (not your regular password) as `SMTP_PASSWORD`

3. **Configure `.env`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ADMIN_EMAIL=admin@filemyrti.com
   ```

### Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Custom SMTP
Use your provider's SMTP settings. Common ports:
- **587** - TLS (recommended)
- **465** - SSL
- **25** - Unencrypted (not recommended)

## How It Works

1. **Non-Blocking**: Email sending is asynchronous and does not block form submissions. If email fails, the form submission still succeeds.

2. **Error Handling**: Email errors are logged but do not affect the user experience. Form submissions always complete successfully.

3. **Email Format**: Emails include:
   - Form type (Consultation, Callback Request, RTI Application)
   - All submitted fields in a clean table format
   - Submission timestamp
   - Submission ID

## Testing

### Test Email Configuration

You can test the email configuration by submitting any form:
1. Submit a consultation form
2. Submit a callback request
3. Submit an RTI application

Check the server logs for email sending status:
- ✅ `Email notification sent for [Form Type] submission` - Success
- ❌ `Failed to send email notification` - Error (check SMTP credentials)

### Verify Email Delivery

Check the `admin@filemyrti.com` inbox for:
- Subject: `New Form Submission - [Form Type]`
- HTML formatted email with all form fields

## Troubleshooting

### Email Not Sending

1. **Check Environment Variables**:
   - Ensure all SMTP variables are set in `.env`
   - Restart the server after changing `.env`

2. **Check SMTP Credentials**:
   - Verify username and password are correct
   - For Gmail, use App Password (not regular password)
   - Ensure 2FA is enabled if using Gmail

3. **Check Server Logs**:
   - Look for email-related error messages
   - Check for connection timeouts or authentication errors

4. **Test SMTP Connection**:
   - Try connecting with a mail client using the same credentials
   - Verify firewall/network allows SMTP connections

### Common Errors

- **"Invalid login"**: Wrong username/password
- **"Connection timeout"**: Firewall blocking SMTP port
- **"Authentication failed"**: For Gmail, ensure using App Password
- **"Email service not configured"**: Missing SMTP environment variables

## Security Notes

- Never commit `.env` file to version control
- Use App Passwords for Gmail (not your main password)
- Keep SMTP credentials secure
- Consider using environment-specific email addresses for testing

## Disabling Email Notifications

To disable email notifications temporarily:
1. Remove or comment out SMTP environment variables
2. The system will log a warning but continue working
3. Form submissions will still succeed

