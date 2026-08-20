# 🔌 Backend API Requirements for GuardPay

## 📋 TABLE OF CONTENTS
1. [Overview](#overview)
2. [Authentication Endpoints](#authentication)
3. [User Management](#user-management)
4. [Reports](#reports)
5. [Comments](#comments)
6. [Reactions](#reactions)
7. [Statistics](#statistics)
8. [Search](#search)
9. [Push Notifications](#push-notifications)
10. [Image Upload](#image-upload)
11. [Error Responses](#error-responses)
12. [Database Schema](#database-schema)

---

## 📊 OVERVIEW

### **Base URL:**
```
Development: http://localhost:3000/api
Production: https://api.guardpay.ke/api
```

### **Authentication:**
- Method: JWT (JSON Web Tokens)
- Header: `Authorization: Bearer <token>`
- Token expiry: 30 days
- Refresh token: 90 days

### **Response Format:**
All responses follow this structure:
```json
{
  "success": true | false,
  "data": { ... } | null,
  "error": "Error message" | null,
  "timestamp": "2025-01-XX 12:00:00 UTC"
}
```

### **Rate Limiting:**
- Anonymous: 10 requests/minute
- Authenticated: 100 requests/minute
- Report submission: 5 reports/hour per user

---

## 🔐 AUTHENTICATION

### **POST /auth/register**
Register a new user

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "email": "user@example.com", // Optional
  "name": "Anxious N.",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123abc",
      "phoneNumber": "+254712345678",
      "name": "Precious K.",
      "email": "user@example.com",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

---

### **POST /auth/login**
Login existing user

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123abc",
      "phoneNumber": "+254712345678",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

---

### **POST /auth/send-otp**
Send OTP for phone verification

**Request:**
```json
{
  "phoneNumber": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent to +254712345678",
    "expiresIn": 300
  }
}
```

---

### **POST /auth/verify-otp**
Verify OTP code

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### **POST /auth/refresh**
Refresh access token

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token_here",
    "refreshToken": "new_refresh_token_here"
  }
}
```

---

### **POST /auth/logout**
Logout user (invalidate tokens)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## 👤 USER MANAGEMENT

### **GET /users/me**
Get current user profile

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123abc",
    "phoneNumber": "+254712345678",
    "name": "John Doe",
    "email": "user@example.com",
    "verifiedPhone": true,
    "verifiedEmail": false,
    "reputationScore": 85,
    "reportCount": 5,
    "helpfulVotes": 23,
    "createdAt": "2025-01-10T10:00:00Z"
  }
}
```

---

### **PUT /users/me**
Update user profile

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "notificationsEnabled": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123abc",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "notificationsEnabled": true
  }
}
```

---

### **DELETE /users/me**
Delete user account

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

---

## 📝 REPORTS

### **GET /reports**
Get all fraud reports (paginated)

**Query Parameters:**
- `page` (int, default: 1)
- `limit` (int, default: 20, max: 100)
- `sortBy` (string: "recent" | "riskScore" | "reportCount")
- `fraudType` (string: optional filter)

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "phoneNumber": "+254712345678",
        "riskScore": 85,
        "reportCount": 3,
        "mostCommonFraudType": "whatsapp_takeover",
        "lastReportDate": "2025-01-15T08:00:00Z",
        "verified": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### **GET /reports/:phoneNumber**
Get all reports for a specific number

**Response:**
```json
{
  "success": true,
  "data": {
    "phoneNumber": "+254712345678",
    "reports": [
      {
        "id": "report_123",
        "fraudType": "whatsapp_takeover",
        "description": "Pretended to be my mother...",
        "amount": 20000,
        "hasEvidence": true,
        "evidenceUrls": [
          "https://storage.guardpay.ke/evidence/img1.jpg"
        ],
        "userName": "John M.",
        "userId": "user_123abc",
        "location": "Kenya",
        "verified": true,
        "reactions": {
          "helpful": 15,
          "confirmed": 10,
          "disputed": 1
        },
        "timestamp": "2025-01-10T10:00:00Z"
      }
    ],
    "stats": {
      "totalReports": 3,
      "verifiedReports": 2,
      "totalAmount": 65000,
      "riskScore": 85
    }
  }
}
```

---

### **POST /reports**
Create a new fraud report

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "fraudType": "whatsapp_takeover",
  "description": "Someone hacked my mother's WhatsApp...",
  "amount": 20000,
  "hasEvidence": true,
  "evidenceUrls": ["https://storage.../img1.jpg"],
  "location": "Nairobi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report_123",
      "phoneNumber": "+254712345678",
      "fraudType": "whatsapp_takeover",
      "description": "Someone hacked my mother's WhatsApp...",
      "amount": 20000,
      "hasEvidence": true,
      "userId": "user_123abc",
      "userName": "John M.",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  }
}
```

---

### **PUT /reports/:reportId/verify**
Mark report as verified (admin only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "verified": true,
  "verificationNote": "Evidence reviewed and confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "report_123",
    "verified": true,
    "verifiedBy": "admin_456",
    "verifiedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### **DELETE /reports/:reportId**
Delete a report (user owns it or admin)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Report deleted successfully"
  }
}
```

---

## 💬 COMMENTS

### **GET /comments/:phoneNumber**
Get all comments for a phone number

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_123",
        "phoneNumber": "+254712345678",
        "text": "This number tried the same scam on me!",
        "userName": "Alice M.",
        "userId": "user_456",
        "timestamp": "2025-01-12T14:30:00Z",
        "reactions": {
          "helpful": 8,
          "confirmed": 5,
          "disputed": 0
        }
      }
    ]
  }
}
```

---

### **POST /comments**
Add a comment to a phone number

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "text": "Be very careful with this number!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_456",
      "phoneNumber": "+254712345678",
      "text": "Be very careful with this number!",
      "userName": "John M.",
      "userId": "user_123abc",
      "timestamp": "2025-01-15T10:35:00Z"
    }
  }
}
```

---

### **DELETE /comments/:commentId**
Delete a comment (user owns it or admin)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

---

## 👍 REACTIONS

### **POST /reactions**
Add reaction to a report or comment

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "targetType": "report", // or "comment"
  "targetId": "report_123",
  "reactionType": "helpful" // "helpful", "confirmed", "disputed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reaction": {
      "id": "reaction_789",
      "targetType": "report",
      "targetId": "report_123",
      "reactionType": "helpful",
      "userId": "user_123abc",
      "timestamp": "2025-01-15T10:40:00Z"
    },
    "totals": {
      "helpful": 16,
      "confirmed": 10,
      "disputed": 1
    }
  }
}
```

---

### **DELETE /reactions/:reactionId**
Remove a reaction

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Reaction removed"
  }
}
```

---

## 📊 STATISTICS

### **GET /stats/number/:phoneNumber**
Get comprehensive stats for a phone number

**Response:**
```json
{
  "success": true,
  "data": {
    "phoneNumber": "+254712345678",
    "riskScore": 85,
    "reportCount": 3,
    "commentCount": 5,
    "verifiedReportCount": 2,
    "mostCommonFraudType": "whatsapp_takeover",
    "totalAmountLost": 65000,
    "firstReportDate": "2025-01-05T10:00:00Z",
    "lastReportDate": "2025-01-15T08:00:00Z",
    "fraudTypeCounts": {
      "whatsapp_takeover": 3,
      "fake_mpesa": 0
    },
    "trending": true,
    "recentActivityCount": 2
  }
}
```

---

### **GET /stats/global**
Get app-wide statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalReports": 1247,
    "totalVerifiedReports": 892,
    "totalUsers": 10342,
    "totalFlaggedNumbers": 537,
    "totalAmountSaved": 2400000,
    "scamsPrevented": 156,
    "topFraudTypes": [
      {
        "fraudType": "whatsapp_takeover",
        "count": 423
      },
      {
        "fraudType": "fake_mpesa",
        "count": 312
      }
    ],
    "trendingNumbers": [
      {
        "phoneNumber": "+254712345678",
        "reportCount": 3,
        "riskScore": 85
      }
    ]
  }
}
```

---

### **GET /stats/user/:userId**
Get statistics for a specific user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123abc",
    "reportsSubmitted": 5,
    "commentsPosted": 12,
    "helpfulVotes": 23,
    "reputationScore": 85,
    "verifiedReports": 3,
    "joinedDate": "2025-01-10T10:00:00Z",
    "lastActiveDate": "2025-01-15T10:00:00Z"
  }
}
```

---

## 🔍 SEARCH

### **GET /search**
Search across reports, numbers, and descriptions

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string: "all" | "numbers" | "descriptions")
- `page` (int, default: 1)
- `limit` (int, default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "number",
        "phoneNumber": "+254712345678",
        "riskScore": 85,
        "reportCount": 3,
        "matchReason": "exact_match"
      },
      {
        "type": "report",
        "reportId": "report_123",
        "phoneNumber": "+254712345678",
        "excerpt": "...hacked WhatsApp...",
        "matchReason": "description_match"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

## 🔔 PUSH NOTIFICATIONS

### **POST /notifications/register**
Register device for push notifications

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "deviceToken": "ExponentPushToken[xxxxx]",
  "platform": "ios" // or "android"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registered": true,
    "deviceId": "device_123"
  }
}
```

---

### **POST /notifications/send**
Send notification (admin/system only)

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "userIds": ["user_123", "user_456"],
  "title": "New Scam Alert",
  "body": "A new number has been flagged in your area",
  "data": {
    "phoneNumber": "+254712345678",
    "screen": "NumberDetail"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sent": 2,
    "failed": 0
  }
}
```

---

### **PUT /notifications/settings**
Update notification preferences

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "fraudAlerts": true,
  "weeklyDigest": true,
  "communityUpdates": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "fraudAlerts": true,
      "weeklyDigest": true,
      "communityUpdates": false
    }
  }
}
```

---

## 📸 IMAGE UPLOAD

### **POST /upload/evidence**
Upload evidence image

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request:**
```
FormData:
  - file: <image_file>
  - reportId: "report_123" (optional, if attaching to existing report)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.guardpay.ke/evidence/user_123/img_456.jpg",
    "thumbnail": "https://storage.guardpay.ke/evidence/user_123/thumb_456.jpg",
    "fileSize": 524288,
    "uploadedAt": "2025-01-15T10:45:00Z"
  }
}
```

---

### **DELETE /upload/evidence/:imageId**
Delete an evidence image

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully"
  }
}
```

---

## ❌ ERROR RESPONSES

### **Standard Error Format:**
```json
{
  "success": false,
  "error": "Error message here",
  "errorCode": "ERROR_CODE",
  "timestamp": "2025-01-15T10:50:00Z"
}
```

### **HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### **Error Codes:**
```javascript
// Authentication Errors
AUTH_INVALID_CREDENTIALS      // Wrong username/password
AUTH_TOKEN_EXPIRED            // Token expired
AUTH_INVALID_TOKEN            // Malformed token
AUTH_USER_NOT_FOUND           // User doesn't exist
AUTH_PHONE_NOT_VERIFIED       // Phone not verified
AUTH_OTP_INVALID              // Wrong OTP code
AUTH_OTP_EXPIRED              // OTP expired

// Validation Errors
VALIDATION_REQUIRED_FIELD     // Missing required field
VALIDATION_INVALID_PHONE      // Invalid phone format
VALIDATION_INVALID_EMAIL      // Invalid email format
VALIDATION_STRING_TOO_LONG    // Text exceeds max length

// Resource Errors
RESOURCE_NOT_FOUND            // Report/comment not found
RESOURCE_ALREADY_EXISTS       // Duplicate entry
RESOURCE_FORBIDDEN            // No permission to access

// Rate Limiting
RATE_LIMIT_EXCEEDED           // Too many requests

// System Errors
DATABASE_ERROR                // Database connection issue
STORAGE_ERROR                 // File upload failed
NETWORK_ERROR                 // External service unavailable
```

---

## 🗄️ DATABASE SCHEMA

### **Users Table:**
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  verified_phone BOOLEAN DEFAULT FALSE,
  verified_email BOOLEAN DEFAULT FALSE,
  reputation_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_active TIMESTAMP,
  INDEX idx_phone (phone_number),
  INDEX idx_email (email)
);
```

---

### **Reports Table:**
```sql
CREATE TABLE reports (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  fraud_type ENUM('whatsapp_takeover', 'fake_mpesa', 'sim_swap', 'impersonation', 'loan_scam', 'job_scam', 'other') NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2),
  has_evidence BOOLEAN DEFAULT FALSE,
  user_id VARCHAR(36) NOT NULL,
  location VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(36),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_phone_number (phone_number),
  INDEX idx_fraud_type (fraud_type),
  INDEX idx_created_at (created_at),
  INDEX idx_verified (verified)
);
```

---

### **Evidence Table:**
```sql
CREATE TABLE evidence (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  file_size INT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  INDEX idx_report (report_id)
);
```

---

### **Comments Table:**
```sql
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_phone_number (phone_number),
  INDEX idx_user (user_id),
  INDEX idx_created_at (created_at)
);
```

---

### **Reactions Table:**
```sql
CREATE TABLE reactions (
  id VARCHAR(36) PRIMARY KEY,
  target_type ENUM('report', 'comment') NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  reaction_type ENUM('helpful', 'confirmed', 'disputed') NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_reaction (target_type, target_id, user_id),
  INDEX idx_target (target_type, target_id),
  INDEX idx_user (user_id)
);
```

---

### **Notification Tokens Table:**
```sql
CREATE TABLE notification_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  device_token VARCHAR(500) NOT NULL,
  platform ENUM('ios', 'android', 'web') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_token (device_token),
  INDEX idx_user (user_id)
);
```

---

## 🔐 SECURITY REQUIREMENTS

### **Authentication:**
- Use bcrypt for password hashing (cost factor: 12)
- JWT tokens with HS256 algorithm
- Refresh tokens stored in httpOnly cookies
- OTP via SMS (Twilio/Africa's Talking)

### **Authorization:**
- Users can only edit/delete their own content
- Admins have full access
- Rate limiting per endpoint

### **Data Validation:**
- Sanitize all user inputs
- Validate phone number format (Kenyan: +254...)
- Max text length: 5000 characters
- Max file size: 10MB per image

### **HTTPS:**
- All endpoints must use HTTPS in production
- Redirect HTTP → HTTPS

---

## 📈 PERFORMANCE REQUIREMENTS

### **Response Times:**
- GET requests: <200ms
- POST requests: <500ms
- Image upload: <2s

### **Caching:**
- Cache frequently accessed data (reports list)
- Cache duration: 5 minutes
- Use Redis for caching

### **Database:**
- Index all foreign keys
- Index phone numbers for fast lookup
- Pagination for all list endpoints

---

## 🧪 TESTING REQUIREMENTS

### **Unit Tests:**
- Cover all business logic functions
- Mock external services (SMS, storage)

### **Integration Tests:**
- Test all API endpoints
- Test authentication flow
- Test database operations

### **Load Testing:**
- Support 1000 concurrent users
- Handle 10,000 requests/hour

---

## 📞 SUPPORT & DOCUMENTATION

### **API Documentation:**
- Provide Postman collection
- Provide Swagger/OpenAPI spec
- Include example requests/responses

### **Error Logging:**
- Log all 500 errors
- Use Sentry/LogRocket for monitoring
- Alert on critical errors

### **Deployment:**
- Use CI/CD pipeline
- Automated testing before deploy
- Blue-green deployment strategy

---

## ✅ CHECKLIST FOR BACKEND TEAM

### **Phase 1: Foundation (Week 1)**
- [ ] Set up database (PostgreSQL/MySQL)
- [ ] Implement user authentication
- [ ] Create user registration/login endpoints
- [ ] Set up JWT token system
- [ ] Deploy to development environment

### **Phase 2: Core Features (Week 2)**
- [ ] Implement reports endpoints (CRUD)
- [ ] Implement comments endpoints (CRUD)
- [ ] Implement reactions system
- [ ] Add search functionality
- [ ] Deploy to staging environment

### **Phase 3: Advanced Features (Week 3)**
- [ ] Implement push notifications
- [ ] Set up image upload/storage (S3/Firebase)
- [ ] Add statistics endpoints
- [ ] Implement rate limiting
- [ ] Set up caching layer

### **Phase 4: Production (Week 4)**
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation complete
- [ ] Deploy to production
- [ ] Monitor and fix bugs

---

## 🚀 READY TO INTEGRATE

**Frontend is ready and waiting!**

Once you provide:
1. ✅ Base API URL
2. ✅ Authentication endpoints
3. ✅ Core CRUD endpoints
4. ✅ Error response format

We can start integration immediately (estimate: 1-2 weeks)

---

**Questions? Contact frontend team:**
- Email: dev@guardpay.ke
- Slack: #guardpay-dev
- GitHub: [github.com/guardpay/frontend](https://github.com)

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Ready for implementation
