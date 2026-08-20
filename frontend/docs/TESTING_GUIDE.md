# GuardPay Testing Guide

## 🧪 How to Test Your App (Step-by-Step)

### Before Your Presentation:

1. **Start the app:**
   ```bash
   npm start -- --web
   ```

2. **Open in browser** (Chrome recommended)

3. **Demo data will auto-load** on first visit ✨

4. **Test this exact flow:**

---

## 📋 Complete Testing Checklist

### ✅ Test 1: Dashboard Load
- [ ] Open app
- [ ] Dashboard appears
- [ ] See "Community Protection" banner
- [ ] Shows report count (e.g., "12 fraud reports from the community")

### ✅ Test 2: Community Feed
- [ ] Tap "Community Feed" from Dashboard
- [ ] See list of flagged numbers
- [ ] Numbers have risk scores (red/orange badges)
- [ ] See fraud types (WhatsApp takeover, fake M-PESA, etc.)

### ✅ Test 3: Number Details
- [ ] Tap on **+254712345678** (most reported number)
- [ ] See risk score: HIGH (should be 70+)
- [ ] See 3 reports for this number
- [ ] See fraud type breakdown
- [ ] See community comments

### ✅ Test 4: Check a Number
- [ ] Go to "Check a Number" from Dashboard
- [ ] Enter: **+254712345678**
- [ ] Tap "Check Number"
- [ ] See "FLAGGED — Be cautious" message
- [ ] See report count and warnings

### ✅ Test 5: Report a Number
- [ ] Go to "Report Number" from Dashboard
- [ ] Enter phone number: **+254700000000**
- [ ] Select fraud type: **WhatsApp Account Takeover**
- [ ] Add description: "Pretended to be my friend and asked for money"
- [ ] Optional: Add amount lost
- [ ] Toggle "I have evidence"
- [ ] Tap "Submit Report"
- [ ] Should see success message
- [ ] Navigate to Community Feed
- [ ] **Your report should appear!** 🎉

### ✅ Test 6: Navigation Flow
- [ ] Dashboard → Community Feed → Back
- [ ] Dashboard → Check Number → Back
- [ ] Dashboard → Report Number → Submit → Community Feed
- [ ] **Data persists across navigation** ✓

---

## 🚨 Common Issues & Fixes

### Issue: "No Reports Yet" on Community Feed

**Fix 1:** Demo data didn't load
```
1. Go to Dashboard
2. Look for "Try Demo Data" button
3. Tap it to manually load demo reports
```

**Fix 2:** Page was refreshed
```
DON'T refresh the page during your demo!
If you already refreshed:
- Close browser
- Restart: npm start -- --web
- Demo data will auto-load again
```

**Fix 3:** Clear cache and reload
```
Browser console → Run:
await AsyncStorage.clear()
location.reload()
```

### Issue: Report Submitted but Not Showing

**Cause:** You refreshed the page after submitting

**Solution:**
```
1. Don't refresh during testing
2. Use navigation buttons only
3. Demo data persists in session only
```

### Issue: App is Slow

**Cause:** Metro bundler or network

**Solution:**
```bash
# Stop the server (Ctrl+C)
# Clear cache
npm start -- --web --clear

# Or restart computer if necessary
```

---

## 📱 Testing on Phone (Expo Go)

### Option 1: Scan QR Code
1. Install Expo Go app on phone
2. Run `npm start` on computer
3. Scan QR code with phone camera
4. App opens in Expo Go

### Option 2: Same Network
1. Make sure phone and computer are on same WiFi
2. Run `npm start`
3. Enter the URL in Expo Go

---

## 🎬 Demo Script for Presentation

**Use this exact script:**

---

### Introduction (30 seconds)
> "Hello, I'm presenting **GuardPay** - a mobile app that protects Kenyans from mobile money fraud through community intelligence."

### Problem Statement (30 seconds)
> "Mobile money fraud through WhatsApp account takeover is rampant in Kenya. Victims lose thousands of shillings when scammers impersonate their contacts. GuardPay solves this by crowdsourcing fraud intelligence."

### Live Demo (3 minutes)

#### 1. Show Dashboard (20 seconds)
> "This is the main dashboard. As you can see, our community has already flagged **12 suspicious numbers**."

*Tap Community Feed*

#### 2. Show Community Feed (30 seconds)
> "Here's our community feed showing flagged numbers. Each number has a **risk score** calculated from reports. Look at this one - **+254712345678** has a **HIGH RISK score of 85** with 3 confirmed reports."

*Tap the number*

#### 3. Show Number Details (40 seconds)
> "Here's the detail view. We can see:
> - **3 fraud reports** from different community members
> - Primary fraud type: **WhatsApp Account Takeover**
> - **Community comments** sharing their experiences
> - Total amount lost by victims
> 
> This information helps others recognize and avoid this scammer."

*Go back*

#### 4. Check a Number (30 seconds)
> "Let's say I received a suspicious message. I can check if the number is flagged."

*Navigate to Check Number*
*Enter +254712345678*
*Tap Check*

> "Instantly, the app tells me: **FLAGGED - Be cautious** with 3 reports. This warns me before I send any money."

#### 5. Report a Number (40 seconds)
> "Anyone can report a suspicious number. Let me show you how easy it is."

*Navigate to Report Number*
*Enter +254700000000*
*Select WhatsApp Takeover*
*Type: "Someone hacked my friend's WhatsApp and asked for money"*
*Enable "I have evidence"*
*Tap Submit*

> "And it's submitted! This report now appears in the community feed, protecting others from this scammer."

*Navigate to Community Feed and briefly show it appears*

### Unique Features (30 seconds)
> "What makes GuardPay different:
> 1. **Community-driven** - Real reports from real victims
> 2. **Risk scoring** - Automatic fraud risk calculation
> 3. **Real-time protection** - Check numbers before sending money
> 4. **Anonymous reporting** - Safe for users to report
> 5. **Educational content** - Helps users recognize scams"

### Future Plans (30 seconds)
> "Following our mentor's advice, we plan to add:
> - **Chatrooms** for flagged numbers where victims can discuss patterns
> - **AI/ML** to detect fraud patterns and predict new scams
> - **Backend database** with real-time sync across all users
> - **Integration with M-PESA** for instant transaction verification"

### Closing (20 seconds)
> "GuardPay transforms fraud prevention from individual vigilance to community protection. Together, we can make mobile money safer for all Kenyans. Thank you!"

---

## 💡 Pro Tips

### During Demo:

1. **Don't refresh the browser** - Data will be lost
2. **Navigate using buttons** - Not browser back button
3. **Pre-load demo data** before presenting
4. **Keep session open** - Have app ready before you start
5. **Test full flow** 30 minutes before presentation

### If Something Goes Wrong:

**Backup plan:**
1. Have screenshots ready
2. Show video recording of app working
3. Explain: "This is a prototype using local storage; production will use Firebase"

### Impressive Details to Mention:

- "We built this in React Native/Expo for cross-platform deployment"
- "The UI follows Material Design principles"
- "Community-driven database with XX fraud reports"
- "Risk algorithm weighs report count, verification, and recency"
- "Fully responsive design for all screen sizes"

---

## 🎯 Key Metrics to Highlight

From demo data:
- **12 fraud reports** submitted
- **7 unique flagged numbers**
- **3 active community discussions**
- **Risk scores**: 85% (High Risk) for repeat offenders
- **Fraud types**: 7 categories covered
- **Total money lost**: KES 106,500 (based on demo reports)

---

## 📊 Expected Results

After testing, you should see:

```
✓ Dashboard loads instantly
✓ Community Feed shows 12 reports
✓ 7 flagged numbers displayed
✓ Risk scores: 1 HIGH, 3 MEDIUM, 3 LOW
✓ Number detail view works
✓ Can check known flagged numbers
✓ Can submit new reports
✓ Reports appear immediately in feed
✓ Data persists during session
✓ Navigation smooth and fast
```

---

## 🔧 Troubleshooting Commands

### Check if demo data loaded:
Open browser console (F12), then:
```javascript
// Check AsyncStorage
AsyncStorage.getItem('@guardpay_reports').then(data => {
  const reports = JSON.parse(data) || [];
  console.log(`Reports in storage: ${reports.length}`);
  console.log('First report:', reports[0]);
});
```

### Force reload demo data:
```javascript
import { seedDemoData } from './services/demoData';
seedDemoData().then(result => console.log('Seeded:', result));
```

### Clear all data and start fresh:
```javascript
AsyncStorage.clear().then(() => {
  console.log('Storage cleared');
  location.reload();
});
```

---

## ✅ Pre-Presentation Checklist

**1 Hour Before:**
- [ ] Test internet connection
- [ ] Charge laptop fully
- [ ] Test app full flow
- [ ] Have backup screenshots
- [ ] Practice demo script

**30 Minutes Before:**
- [ ] Start the app
- [ ] Verify demo data loaded
- [ ] Test each screen once
- [ ] Keep app open (don't refresh!)

**Right Before:**
- [ ] Close unnecessary browser tabs
- [ ] Close other applications
- [ ] Zoom in for visibility
- [ ] Have confidence - your app works! 🚀

---

Good luck with your presentation! Your app is impressive and demonstrates real problem-solving for a critical issue in Kenya. 🇰🇪
