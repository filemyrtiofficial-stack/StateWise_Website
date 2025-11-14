# WhatsApp Notification System Setup Guide

## 📱 Overview

This is a **FREE** WhatsApp notification system using Puppeteer to automate WhatsApp Web. It sends notifications to a fixed phone number whenever forms are submitted.

**Features:**
- ✅ No paid APIs required
- ✅ No Meta Cloud API needed
- ✅ QR code displayed in terminal
- ✅ Session persistence (saves cookies to avoid re-scanning)
- ✅ Auto-restart on crashes
- ✅ Browser stays visible (headless: false)
- ✅ Integrated with all form submissions (RTI, Consultation, Callback)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

The required packages are already in `package.json`:
- `puppeteer` - Browser automation
- `qrcode-terminal` - QR code display in terminal

If not installed, run:
```bash
cd Backend
npm install
```

### Step 2: Configure WhatsApp Phone Number

Add to your `.env` file:
```env
WHATSAPP_NOTIFICATION_PHONE=+91XXXXXXXXXX
```

**Format:** Include country code with `+` prefix (e.g., `+919876543210` for India)

### Step 3: Start the Server

```bash
npm start
# or for development
npm run dev
```

### Step 4: Scan QR Code

When the server starts:
1. A browser window will open automatically
2. WhatsApp Web will load
3. **QR code will appear in the browser window**
4. Check your terminal for instructions
5. Scan the QR code with your WhatsApp mobile app:
   - Open WhatsApp on your phone
   - Go to **Settings > Linked Devices**
   - Tap **"Link a Device"**
   - Scan the QR code shown in the browser window

### Step 5: Verify Connection

After scanning:
- Terminal will show: `✅ WhatsApp is ready!`
- Browser window will show your WhatsApp chats
- Session is saved to `Backend/utils/whatsapp/session.json`

---

## 📁 File Structure

```
Backend/
├── utils/
│   └── whatsapp/
│       ├── whatsapp.js          # Main WhatsApp utility
│       ├── session.json          # Saved session cookies (auto-generated)
│       └── browser_data/         # Browser user data (auto-generated)
├── controllers/
│   ├── rtiApplicationController.js    # ✅ WhatsApp integrated
│   ├── callbackController.js          # ✅ WhatsApp integrated
│   └── consultationController.js      # ✅ WhatsApp integrated
├── config/
│   └── env.js                    # ✅ WhatsApp config added
└── server.js                     # ✅ WhatsApp initialization added
```

---

## 🔧 How It Works

### 1. Initialization (on server start)

```javascript
// server.js automatically initializes WhatsApp
if (config.WHATSAPP?.NOTIFICATION_PHONE) {
  initializeWhatsApp();
}
```

### 2. Form Submission Flow

When a form is submitted:
1. Form data is saved to database
2. Email notification is sent (existing functionality)
3. **WhatsApp notification is sent** (new functionality)

Example in `rtiApplicationController.js`:
```javascript
// Send WhatsApp notification (non-blocking)
sendFormSubmissionNotification('RTI Application', {
  'Application ID': applicationId,
  'Full Name': full_name,
  'Email': email,
  'Mobile': mobile,
  // ... other fields
}).catch(err => {
  logger.error('WhatsApp notification error (non-critical):', err.message);
});
```

### 3. Message Format

WhatsApp messages are formatted as:
```
📋 *New RTI Application Submission*

*Application ID:* 123
*Full Name:* John Doe
*Email:* john@example.com
*Mobile:* 9876543210
*Service:* RTI Filing
*State:* Maharashtra
...

⏰ 12/25/2024, 10:30:45 AM
```

---

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `WHATSAPP_NOTIFICATION_PHONE` | Phone number to receive notifications | `+919876543210` | Yes |

### Disable WhatsApp Notifications

To disable WhatsApp notifications:
1. Remove or comment out `WHATSAPP_NOTIFICATION_PHONE` in `.env`
2. Or set it to empty: `WHATSAPP_NOTIFICATION_PHONE=`

The server will log:
```
ℹ️  WhatsApp notifications disabled (WHATSAPP_NOTIFICATION_PHONE not set)
```

---

## 🔄 Session Management

### Automatic Session Saving

- Session cookies are saved to `Backend/utils/whatsapp/session.json`
- On next server start, cookies are restored automatically
- **No need to scan QR code again** (unless session expires)

### Manual Session Reset

If you need to reset the session:
```bash
# Delete session file
rm Backend/utils/whatsapp/session.json

# Restart server - will show QR code again
npm start
```

---

## 🐛 Troubleshooting

### Issue: QR Code Not Appearing

**Solution:**
1. Check if browser window opened
2. Wait a few seconds for WhatsApp Web to load
3. If still not showing, check browser console for errors
4. Try refreshing the page manually in the browser

### Issue: "WhatsApp not ready" Error

**Solution:**
1. Ensure QR code was scanned successfully
2. Check browser window - should show your chats
3. If not logged in, delete `session.json` and restart
4. Check terminal logs for specific error messages

### Issue: Messages Not Sending

**Solution:**
1. Verify WhatsApp is ready: Check terminal for `✅ WhatsApp ready`
2. Check phone number format: Must include country code (e.g., `+91...`)
3. Ensure the phone number exists in your WhatsApp contacts (or use direct link)
4. Check browser window - should be logged in and showing chats
5. Review terminal logs for error messages

### Issue: Browser Crashes

**Solution:**
- System auto-restarts on crashes (up to 5 attempts)
- If crashes persist:
  1. Close all browser instances manually
  2. Delete `browser_data` folder: `rm -rf Backend/utils/whatsapp/browser_data`
  3. Restart server

### Issue: "Invalid phone number" Error

**Solution:**
- Ensure phone number format: `+91XXXXXXXXXX` (with country code)
- Remove spaces and special characters
- Phone number must be valid WhatsApp number

---

## 📝 API Usage

### Send Custom WhatsApp Message

```javascript
const { sendWhatsAppMessage } = require('./utils/whatsapp/whatsapp');

// Send message to any phone number
await sendWhatsAppMessage('+919876543210', 'Hello from Node.js!');
```

### Send Form Notification

```javascript
const { sendFormSubmissionNotification } = require('./utils/whatsapp/whatsapp');

// Send formatted form notification
await sendFormSubmissionNotification('Consultation', {
  'Full Name': 'John Doe',
  'Email': 'john@example.com',
  'Mobile': '9876543210'
});
```

### Check WhatsApp Status

```javascript
const { isReady } = require('./utils/whatsapp/whatsapp');

if (isReady()) {
  console.log('WhatsApp is ready to send messages');
} else {
  console.log('WhatsApp is not ready yet');
}
```

---

## 🔒 Security Notes

1. **Session File:** `session.json` contains authentication cookies
   - Keep it secure and don't commit to git
   - Already in `.gitignore` by default

2. **Browser Data:** `browser_data/` contains browser cache
   - Can be large (100+ MB)
   - Safe to delete if needed (will recreate)

3. **Phone Number:** Store in `.env` file (not in code)
   - `.env` should be in `.gitignore`

---

## 🚨 Production Considerations

### Running on Server (Headless)

For production servers without display:
1. Install Xvfb (virtual display):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install xvfb
   
   # Start with virtual display
   xvfb-run -a npm start
   ```

2. Or use headless mode (modify `whatsapp.js`):
   ```javascript
   browser = await puppeteer.launch({
     headless: true, // Change to true
     // ... other options
   });
   ```
   **Note:** Headless mode may have limitations with WhatsApp Web

### Performance

- WhatsApp initialization takes ~10-30 seconds on first run
- Subsequent runs are faster (uses saved session)
- Message sending takes ~2-5 seconds per message
- Non-blocking: Form submissions don't wait for WhatsApp

### Monitoring

Check logs for:
- `✅ WhatsApp ready` - System ready
- `✅ WhatsApp message sent` - Message delivered
- `❌ Failed to send` - Error occurred
- `🔄 Reconnecting` - Auto-recovery in progress

---

## 📚 Additional Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [WhatsApp Web](https://web.whatsapp.com/)
- [QR Code Terminal](https://www.npmjs.com/package/qrcode-terminal)

---

## ✅ Integration Checklist

- [x] WhatsApp utility created (`utils/whatsapp/whatsapp.js`)
- [x] Environment configuration added (`config/env.js`)
- [x] RTI Application controller integrated
- [x] Callback Request controller integrated
- [x] Consultation controller integrated
- [x] Server initialization added (`server.js`)
- [x] Session persistence implemented
- [x] Auto-restart on crashes
- [x] QR code terminal display
- [x] Error handling and logging

---

## 🎉 You're All Set!

Your WhatsApp notification system is ready. Every form submission will now:
1. ✅ Send email notification (existing)
2. ✅ Send WhatsApp notification (new)

**Test it:**
1. Submit a form from your frontend
2. Check your WhatsApp for the notification
3. Check terminal logs for confirmation

---

**Need Help?** Check the troubleshooting section or review the terminal logs for detailed error messages.

