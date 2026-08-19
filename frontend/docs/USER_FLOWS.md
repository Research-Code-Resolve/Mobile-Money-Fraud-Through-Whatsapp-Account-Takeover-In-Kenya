# GuardPay - User Flow Guide

## 🎯 Two Main User Scenarios

### Scenario 1: "I'VE BEEN HACKED!" 🚨
**User Journey:**
```
Dashboard
  ↓
[I've Been Hacked!] button (Red card)
  ↓
Emergency Screen
  ↓
[Alert All Trusted Contacts] button
  ↓
✅ Automatic SMS sent to all contacts:
   "⚠️ Jane's WhatsApp may be HACKED.
    DO NOT send money if they ask.
    Call them first to verify."
  ↓
[Start Account Recovery] button
  ↓
5-Step Recovery Process:
  1. Secure/recover WhatsApp
  2. Secure M-PESA (call Safaricom)
  3. Warn your contacts
  4. Report incident
  5. Enable 2FA
```

**What Happens:**
- User taps red "I've Been Hacked" card
- Goes to Emergency Screen
- Taps "Alert All Trusted Contacts"
- **Automatic alert sent to ALL contacts** (no manual sending needed)
- Contacts receive SMS warning NOT to send money
- User follows recovery steps

---

### Scenario 2: "I RECEIVED A SUSPICIOUS MESSAGE" 🛡️
**User Journey:**
```
Dashboard
  ↓
[Suspicious Message] button (Blue card)
  ↓
Message Analyzer Screen
  ↓
User pastes message text
  ↓
[Analyze Message] button
  ↓
Risk Score Result:
  • HIGH RISK (70+): Red warning - Do NOT send!
  • MEDIUM RISK (20-69): Orange caution - Verify first
  • LOW RISK (0-19): Green - Still verify
  ↓
Shows specific red flags:
  • Urgency words detected
  • Verification blocking
  • Poor grammar
  • Money request
  ↓
Recommendations:
  1. Call sender on known number
  2. Ask personal question
  3. Verify through family member
  4. When in doubt, don't send
```

**What Happens:**
- User receives suspicious WhatsApp message asking for money
- Taps blue "Suspicious Message" card
- Copies message text and pastes in analyzer
- Gets instant fraud risk assessment
- Sees specific warning flags
- Gets clear action steps

---

## 📱 Dashboard Layout (Clear Entry Points)

```
┌─────────────────────────────────────┐
│  Good morning 👋                    │
│  Jane Wanjiku                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ℹ️ Been hacked? Tap Emergency.      │
│    Got suspicious message?          │
│    Tap Analyze.                     │
└─────────────────────────────────────┘

┌──────────────────┬──────────────────┐
│   🚨 WARNING     │  🛡️ SHIELD       │
│                  │                  │
│  I've Been       │  Suspicious      │
│  Hacked!         │  Message         │
│                  │                  │
│  My account was  │  Someone asked   │
│  compromised     │  for money       │
└──────────────────┴──────────────────┘

Quick Actions:
┌─────┬─────┬─────┬─────┐
│Verify│Analyze│Emergency│Safe│
│Before│Message│  Help  │Word│
└─────┴─────┴─────┴─────┘
```

---

## 🔔 Automatic Alert System

### How It Works:

1. **Setup (One Time):**
   ```
   Profile → Trusted Contacts
   Add family/friends who might send you money
   ```

2. **When Hacked:**
   ```
   Emergency Screen → Alert All Trusted Contacts
   
   System sends SMS to ALL contacts automatically:
   - No manual copying needed
   - No individual sending
   - Instant broadcast to everyone
   ```

3. **What Contacts Receive:**
   ```
   ⚠️ FRAUD ALERT from GuardPay:
   
   Jane Wanjiku's WhatsApp may be HACKED.
   
   ❌ DO NOT send money if they ask
   ❌ Even if it seems urgent
   ✅ Call them on their known number first
   
   This is an automated security alert.
   ```

### Technical Implementation:

**Current (Demo Mode):**
- Simulates SMS sending with 300ms delay
- Shows success confirmation
- Tracks sent count

**Production (Backend Required):**
```javascript
POST /api/emergency/send-alerts
Body: {
  userId: "user123",
  userName: "Jane Wanjiku",
  contactIds: ["contact1", "contact2", ...]
}

Backend integrates with:
- Africa's Talking SMS API
- OR Twilio SMS API
- Sends actual SMS to all contacts
```

---

## 🎓 User Education Flow

### First Time Setup:
```
Welcome Screen
  ↓
Get Started
  ↓
Dashboard (First Visit)
  ↓
Prompt: "Add Trusted Contacts"
  ↓
Add 2-3 contacts
  ↓
Prompt: "Create Family Safe Word"
  ↓
Set safe word
  ↓
Prompt: "Try Practice Scenario"
  ↓
Complete 1 scenario
  ↓
✅ Setup Complete!
```

---

## 📊 User Flow Metrics to Track

### Scenario 1 (Been Hacked):
- Emergency screen visits
- Alert button taps
- Alerts sent successfully
- Contacts notified per incident
- Recovery steps completed

### Scenario 2 (Suspicious Message):
- Message analyzer uses
- High-risk messages detected
- Medium-risk messages detected
- Low-risk messages detected
- Money potentially saved

---

## 🔄 Alternative Paths

### Path A: Direct to Verify Tool
```
Dashboard → Verify Before Sending
User enters:
  - Who sent request
  - Amount
  - Reason given
Complete verification checklist
Get risk assessment
```

### Path B: Check Phone Number
```
Dashboard → Quick Actions → Check a Number
Enter phone number
See community reports
Report if fraudulent
```

### Path C: Learn First
```
Bottom Nav → Learn Tab
Read statistics
Review red flags guide
Practice scenarios
Build fraud awareness
```

---

## 💡 Key Design Decisions

### 1. **Visual Clarity**
- Red = Emergency (been hacked)
- Blue = Verification (suspicious message)
- Clear, large tap targets
- Icons + text for recognition

### 2. **Minimize Friction**
- One tap to emergency
- One tap to analyze
- Automatic alert broadcast
- No complex forms

### 3. **Progressive Disclosure**
- Show most urgent actions first
- Hide recovery steps until needed
- Collapsible information cards
- Step-by-step guidance

### 4. **Safety First**
- Emergency always visible
- Alert sends to ALL contacts (no selection needed)
- Clear warnings on high-risk messages
- Hotlines readily accessible

---

## 🚀 Future Enhancements

### Phase 2:
- [ ] Push notifications to contacts (no SMS needed)
- [ ] In-app chat with contacts
- [ ] Voice call verification button
- [ ] Screenshot upload for message analyzer

### Phase 3:
- [ ] Automatic alert when suspicious activity detected
- [ ] Location sharing during emergency
- [ ] Video verification calls
- [ ] Integration with bank apps

---

## 📱 Testing Checklist

### Scenario 1 Testing:
- [ ] "I've Been Hacked" button visible
- [ ] Emergency screen loads
- [ ] Alert button works
- [ ] Shows contact count
- [ ] Confirms alerts sent
- [ ] Recovery steps trackable

### Scenario 2 Testing:
- [ ] "Suspicious Message" button visible
- [ ] Message analyzer loads
- [ ] Can paste text
- [ ] Risk score calculates
- [ ] Flags display correctly
- [ ] Recommendations show

### Alert System Testing:
- [ ] Sends to all contacts
- [ ] Shows success message
- [ ] Tracks sent count
- [ ] Handles no contacts gracefully
- [ ] Error handling works

---

## 🎯 Success Criteria

**User understands within 5 seconds:**
- ✅ Where to go if hacked
- ✅ Where to go if suspicious message
- ✅ How to alert contacts
- ✅ How to verify before sending

**Friction points eliminated:**
- ✅ No manual SMS composition
- ✅ No contact selection
- ✅ No complex forms
- ✅ One-tap emergency

**Safety maximized:**
- ✅ All contacts alerted instantly
- ✅ Clear risk warnings
- ✅ Step-by-step recovery
- ✅ Hotlines accessible

---

Built to save families from fraud, one alert at a time. 🛡️
