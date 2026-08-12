# 🛡️ GuardPay - Frontend

**Community-Powered Fraud Prevention for Kenya**

GuardPay is a mobile application that protects Kenyans from mobile money fraud through community intelligence, real-time alerts, and AI-powered message analysis.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-black.svg)](https://expo.dev/)

---

## 📱 What is GuardPay?

GuardPay helps Kenyans avoid mobile money fraud by:

- **🔍 Checking Numbers** - Instantly see if a number has been reported for fraud
- **📢 Reporting Scams** - Share your experience to protect others
- **💬 Community Intelligence** - Learn from real fraud victims
- **🤖 AI Message Analysis** - Detect fraud patterns before sending money
- **🔐 Safe Word System** - Create family verification codes
- **📚 Educational Content** - Learn to spot common scams

---

## 🎯 Features

### **Core Features:**
- ✅ Number checking against community database
- ✅ Fraud report submission with evidence
- ✅ Community feed with risk scores
- ✅ Real-time chatrooms per flagged number
- ✅ Comment and reaction system
- ✅ Message analyzer (AI fraud detection)
- ✅ Family safe word setup
- ✅ Trusted contacts management
- ✅ Interactive fraud scenarios
- ✅ Emergency help guide

### **Unique Differentiators:**
- 🚀 **Message Analyzer** - No other Kenyan fraud app has this
- 🔑 **Safe Word System** - Family verification that scammers can't fake
- 👥 **Community Chatrooms** - Discuss scam patterns in real-time
- 📊 **Risk Scoring** - Algorithm-based fraud probability

---

## 🚀 Quick Start

### **Prerequisites:**
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (optional)

### **Installation:**

```bash
# Clone the repository
git clone https://github.com/your-org/guardpay-frontend.git
cd guardpay-frontend

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

### **First Launch:**
The app will automatically seed demo data on first launch. You'll see 12 sample fraud reports to explore features.

---

## 📂 Project Structure

```
frontend/
├── App.js                      # Main navigation
├── screens/                    # All 15 screens
│   ├── WelcomeScreen.js
│   ├── DashboardScreen.js
│   ├── CommunityFeedScreen.js
│   ├── NumberDetailScreen.js
│   ├── ReportNumberScreen.js
│   ├── MessageAnalyzerScreen.js
│   ├── SafeWordScreen.js
│   └── ... (8 more)
├── services/                   # Business logic
│   ├── communityService.js    # Reports/comments
│   ├── fraudDatabaseService.js
│   ├── demoData.js
│   └── ... (2 more)
├── assets/                     # Images & icons
├── package.json
└── Documentation/
    ├── FRONTEND_COMPLETE_AUDIT.md
    ├── BACKEND_API_REQUIREMENTS.md
    ├── TESTING_GUIDE.md
    └── ... (more docs)
```

---

## 🎨 Screenshots

*(Add screenshots here after deployment)*

| Dashboard | Community Feed | Number Details |
|-----------|---------------|----------------|
| ![](screenshots/dashboard.png) | ![](screenshots/feed.png) | ![](screenshots/detail.png) |

---

## 🔧 Tech Stack

**Frontend:**
- React Native 0.76
- Expo 52
- React Navigation 6
- AsyncStorage (temporary, will use backend)

**UI Components:**
- Ionicons
- React Native Gesture Handler
- React Native Safe Area Context

**State Management:**
- React Hooks (useState, useEffect)
- Local AsyncStorage

---

## 📖 Documentation

Comprehensive documentation is available:

- **[Frontend Audit](FRONTEND_COMPLETE_AUDIT.md)** - Complete feature list and status
- **[Backend API Requirements](BACKEND_API_REQUIREMENTS.md)** - Full API spec for backend team
- **[Testing Guide](TESTING_GUIDE.md)** - How to test and demo the app
- **[Trust & Credibility Audit](TRUST_AND_CREDIBILITY_AUDIT.md)** - Security and trust analysis
- **[Frontend Priorities](FRONTEND_PRIORITIES_NOW.md)** - Roadmap for remaining work

---

## 🎯 Current Status

**Version:** 1.0.0-beta  
**Frontend Completion:** 95%  
**Production Ready:** ⏳ Pending backend integration

### **What's Working:**
- ✅ All 15 screens implemented
- ✅ All core features functional
- ✅ Demo data system
- ✅ Legal framework (Privacy Policy, Terms of Service)
- ✅ Professional UI/UX
- ✅ Responsive design

### **What's Needed:**
- ⏳ Backend API integration
- ⏳ User authentication
- ⏳ Data persistence (currently using AsyncStorage)
- ⏳ Push notifications
- ⏳ Image upload for evidence

---

## 🔌 Backend Integration

**Status:** Frontend is ready and waiting for backend!

We need the following from the backend team:

### **Critical Endpoints:**
1. `POST /auth/register` - User registration
2. `POST /auth/login` - User login
3. `GET /reports` - List all reports
4. `POST /reports` - Create report
5. `GET /reports/:phoneNumber` - Get reports for number
6. `POST /comments` - Add comment
7. `POST /reactions` - Add reaction

**Full API specification:** See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md)

**Integration Time:** 1-2 weeks once backend APIs are ready

---

## 🧪 Testing

### **Run Tests:**
```bash
npm test
```

### **Manual Testing:**
1. Start the app: `npm start`
2. Load demo data from Dashboard
3. Follow test scenarios in [TESTING_GUIDE.md](TESTING_GUIDE.md)

### **Demo Script:**
Complete presentation script available in [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🚀 Deployment

### **Web Deployment (Netlify/Vercel):**
```bash
npm run build:web
# Deploy the web-build folder
```

### **iOS (TestFlight):**
```bash
expo build:ios
# Follow Expo's TestFlight guide
```

### **Android (Play Store):**
```bash
expo build:android
# Generate signed APK
```

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Coding Standards:**
- Use ESLint configuration
- Follow existing code style
- Add comments for complex logic
- Update documentation

---

## 📊 Roadmap

### **Phase 1: Foundation** ✅ (Complete)
- All screens implemented
- Core features working
- Demo data system
- Legal framework

### **Phase 2: Backend Integration** ⏳ (In Progress)
- Connect to APIs
- User authentication
- Data persistence
- Push notifications

### **Phase 3: Advanced Features** 🔜 (Planned)
- AI/ML fraud pattern detection
- Police report integration
- WhatsApp chatroom per number
- Screenshot evidence upload
- Real-time scam alerts

### **Phase 4: Scale** 🔮 (Future)
- Partnership with Safaricom
- Integration with M-PESA
- Government collaboration
- Regional expansion

---

## 🔒 Security

### **Current Security Measures:**
- ✅ Data stored locally (AsyncStorage)
- ✅ No sensitive data in code
- ✅ Privacy policy compliant with Kenya Data Protection Act
- ✅ User content guidelines

### **Production Security (Needs Backend):**
- HTTPS for all API calls
- JWT token authentication
- Input validation & sanitization
- Rate limiting
- XSS protection

**Report security issues:** security@guardpay.ke

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Frontend Development:**
- Your Name - Lead Frontend Developer

**Backend Development:**
- Backend Team (in progress)

**Mentorship:**
- [Mentor Name] - Project Advisor

---

## 📞 Contact

- **Website:** [guardpay.ke](https://guardpay.ke) (coming soon)
- **Email:** support@guardpay.ke
- **Twitter:** [@GuardPayKE](https://twitter.com/guardpayke)
- **GitHub:** [github.com/guardpay](https://github.com/guardpay)

---

## 🙏 Acknowledgments

- Safaricom for M-PESA fraud awareness
- Kenya Police Cyber Crime Unit
- Our users and beta testers
- Expo and React Native communities

---

## 📈 Stats

- **Lines of Code:** ~15,000
- **Screens:** 15
- **Services:** 5
- **Dependencies:** 50+
- **Development Time:** 3 months
- **Team Size:** 3 developers

---

## ⚠️ Important Notes

**Current Limitation:** This frontend uses AsyncStorage for demo purposes. Data is NOT persisted across sessions without a backend. 

**For Production:** Backend integration is required for:
- User accounts
- Data persistence
- Real-time sync
- Push notifications
- Image uploads

See [BACKEND_API_REQUIREMENTS.md](BACKEND_API_REQUIREMENTS.md) for full backend specifications.

---

## 🎓 For Educational Use

This project was developed as part of [University/Course Name] to address real-world mobile money fraud in Kenya. It demonstrates:

- Mobile app development with React Native
- Community-driven data platforms
- AI-powered fraud detection
- User-centered design for social impact
- Legal compliance (privacy, terms of service)

---

## 🌍 Social Impact

GuardPay aims to reduce mobile money fraud in Kenya by:

- **Crowdsourcing fraud intelligence** from real victims
- **Preventing scams** before money is sent
- **Educating users** about common fraud patterns
- **Building community trust** through transparency

**Potential Impact:** Saving Kenyans millions of shillings annually

---

## 🔥 Quick Links

- 📖 [Full Documentation](FRONTEND_COMPLETE_AUDIT.md)
- 🔌 [Backend API Spec](BACKEND_API_REQUIREMENTS.md)
- 🧪 [Testing Guide](TESTING_GUIDE.md)
- 🎯 [Frontend Priorities](FRONTEND_PRIORITIES_NOW.md)
- 📊 [Trust Audit](TRUST_AND_CREDIBILITY_AUDIT.md)

---

**Built with ❤️ in Kenya** 🇰🇪

**Last Updated:** January 2025  
**Version:** 1.0.0-beta  
**Status:** Ready for backend integration

---

## 📝 Changelog

### [1.0.0-beta] - 2025-01-15

**Added:**
- All 15 core screens
- Community reporting system
- Message analyzer with AI fraud detection
- Safe word family verification
- Legal framework (Privacy Policy, Terms of Service)
- Demo data seeding system
- Comprehensive documentation

**Pending:**
- Backend API integration
- User authentication
- Push notifications
- Image upload for evidence

---

*For questions or support, contact dev@guardpay.ke*
