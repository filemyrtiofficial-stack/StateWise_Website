# WhatsApp Notifications - Quick Reference

## 🚀 Setup (One-Time)

1. **Add to `.env`:**
   ```env
   WHATSAPP_NOTIFICATION_PHONE=+91XXXXXXXXXX
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Scan QR code** in the browser window that opens

4. **Done!** Session is saved automatically

---

## 📱 What Gets Notified?

All form submissions automatically send WhatsApp messages:
- ✅ RTI Applications
- ✅ Consultation Requests  
- ✅ Callback Requests

---

## 🔧 Common Commands

### Check if WhatsApp is ready
```bash
# Check terminal logs for:
✅ WhatsApp ready - Messages can now be sent
```

### Reset session (if QR code needed again)
```bash
rm Backend/utils/whatsapp/session.json
npm start
```

### Disable WhatsApp notifications
```bash
# Remove or comment out in .env:
# WHATSAPP_NOTIFICATION_PHONE=+91XXXXXXXXXX
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| QR code not showing | Check browser window opened |
| "WhatsApp not ready" | Delete `session.json` and restart |
| Messages not sending | Verify phone number format: `+91XXXXXXXXXX` |
| Browser crashes | Auto-restarts up to 5 times |

---

## 📝 Message Format

```
📋 *New [Form Type] Submission*

*Field Name:* Value
*Field Name:* Value
...

⏰ [Timestamp]
```

---

## 📚 Full Documentation

See `WHATSAPP_SETUP.md` for complete guide.

