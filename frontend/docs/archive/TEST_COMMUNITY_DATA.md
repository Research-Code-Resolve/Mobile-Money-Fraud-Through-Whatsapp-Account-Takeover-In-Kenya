# Testing Community Features - Troubleshooting Guide

## ✅ How to Test if Data is Being Saved

### **Test 1: Submit a Report**
1. Go to Dashboard → Click "Report Number"
2. Fill in:
   - Phone: `0712345678`
   - Fraud Type: Select "WhatsApp Account Takeover"
   - Description: "Pretended to be my brother"
   - Amount: `5000`
   - Evidence: Toggle ON
3. Click "Submit Report"
4. You should see: "✓ Report Submitted" alert
5. Click "View Community Feed"

**Expected:** You should see the number `0712345678` in the list with risk score

---

### **Test 2: Verify Data Persistence**
1. After submitting a report, go to Community Feed
2. **If you see the report:** Data is saved! ✅
3. **If empty:** There's an issue with AsyncStorage

---

### **Test 3: Check Multiple Reports**
1. Submit 2-3 different reports with different numbers
2. Go to Community Feed
3. **Expected:** All numbers should appear in the list

---

## 🔍 Troubleshooting: "Empty History" Issue

### **Possible Causes:**

#### **1. Navigation Timing Issue** ✅ FIXED
**Problem:** Screen wasn't reloading when navigating back
**Solution:** Added `navigation.addListener('focus')` to reload data

#### **2. AsyncStorage Not Working**
**Check:** Add this debug code temporarily

Open `ReportNumberScreen.js` and after line where it says `const result = await addReport(reportData);`, add:

```javascript
// Debug: Check if data was saved
const allReports = await getAllReports();
console.log('Total reports after save:', allReports.length);
console.log('Latest report:', allReports[allReports.length - 1]);
```

Then check your console/terminal for these logs.

#### **3. Data Structure Mismatch**
**Check:** In Chrome DevTools (when running web version):
1. Open Console
2. Type: `localStorage`
3. Look for `@guardpay_reports`
4. You should see JSON data

---

## 🧪 Quick Test Script

Add this temporary test button to your Dashboard to verify data:

```javascript
// Add to DashboardScreen.js imports
import { getAllReports, clearAllCommunityData } from '../services/communityService';

// Add this function inside DashboardScreen component
const testCommunityData = async () => {
  const reports = await getAllReports();
  Alert.alert(
    'Community Data Test',
    `Total Reports: ${reports.length}\n\n` +
    (reports.length > 0 
      ? `Latest: ${reports[reports.length - 1].phoneNumber}`
      : 'No reports yet')
  );
};

// Add this button in your JSX (temporarily)
<TouchableOpacity 
  style={{ backgroundColor: 'purple', padding: 10, margin: 10 }}
  onPress={testCommunityData}
>
  <Text style={{ color: 'white' }}>TEST: Check Reports</Text>
</TouchableOpacity>
```

---

## 🔧 Reset Data (If Testing)

If you want to clear all test data and start fresh:

**Option 1: From Code**
Add this button temporarily:

```javascript
import { clearAllCommunityData } from '../services/communityService';

<TouchableOpacity 
  onPress={async () => {
    await clearAllCommunityData();
    Alert.alert('Success', 'All community data cleared');
  }}
>
  <Text>Clear All Data</Text>
</TouchableOpacity>
```

**Option 2: From DevTools (Web)**
```javascript
// In browser console
localStorage.clear();
```

**Option 3: Uninstall/Reinstall App (Mobile)**

---

## ✅ Expected Behavior After Fix

### **After Submitting Report:**
1. See success alert
2. Navigate to Community Feed
3. **Immediately see your report** in the list
4. Risk score should be calculated (probably 15-20 for first report)

### **After Adding Multiple Reports:**
1. All reports visible in Community Feed
2. Sorted by risk score (highest first)
3. Search works
4. Filters work
5. Tapping opens detail screen

### **In Detail Screen:**
1. Shows all reports for that number
2. Can add comments
3. Can react to reports
4. Comments appear immediately

---

## 📊 Sample Test Data

Use these to test:

**Report 1:**
- Number: `0712345678`
- Type: WhatsApp Takeover
- Description: "Pretended to be my sister asking for hospital money"
- Amount: 5000

**Report 2:**
- Number: `0722123456`
- Type: Fake M-PESA
- Description: "Sent fake M-PESA message showing payment received"
- Amount: 10000

**Report 3:**
- Number: `0712345678` (SAME as Report 1)
- Type: WhatsApp Takeover
- Description: "Same number tried to scam my friend yesterday"
- Amount: 3000

**Expected Result:**
- `0712345678` should show: 2 reports, higher risk score
- `0722123456` should show: 1 report, lower risk score

---

## 🐛 Still Having Issues?

### **Check 1: Console Errors**
Look for any red errors in:
- Metro Bundler terminal
- Browser DevTools Console
- React Native Debugger

### **Check 2: Import Statements**
Make sure all screens have correct imports:

```javascript
import { 
  getAllReports, 
  getReportsForNumber,
  getNumberStats,
  // ... other imports
} from '../services/communityService';
```

### **Check 3: AsyncStorage Permission**
On some devices, AsyncStorage might need permissions. Usually works by default, but check app permissions.

### **Check 4: File Path**
Make sure `communityService.js` is in the correct location:
```
frontend/
  services/
    communityService.js  ← Here
```

---

## 💡 Quick Verification

Run this in your browser console (web version):

```javascript
// Check if reports exist
JSON.parse(localStorage.getItem('@guardpay_reports') || '[]')
```

Should return an array. If empty `[]`, data isn't being saved. If has objects, data is saved!

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Submit report → See success message
- ✅ Navigate to Community Feed → See your report immediately
- ✅ Submit another report → See both reports
- ✅ Close app and reopen → Data still there
- ✅ Search works
- ✅ Risk scores calculate correctly
- ✅ Comments save and appear

---

## 🎉 Next Steps After Verification

Once you confirm data is saving and loading correctly:
1. Remove any test/debug buttons
2. Test full user flows
3. Submit multiple reports to see risk scoring
4. Test the discussion/comment system
5. Prepare demo with realistic test data

**The navigation fix should solve the "empty history" issue!** Try it now and let me know if you still see any problems.
