/**
 * Security Helper Functions
 * 
 * Contains input validation, sanitization, and security utilities
 * to protect against XSS, injection, and other attacks.
 */

// ============================================
// INPUT SANITIZATION (XSS Protection)
// ============================================

/**
 * Sanitize user input to prevent XSS attacks
 * Removes/escapes HTML tags and dangerous characters
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 10000); // Max 10k characters
};

/**
 * Sanitize text for display (decode HTML entities for viewing)
 */
export const sanitizeForDisplay = (input) => {
  if (!input) return '';
  
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
};

// ============================================
// PHONE NUMBER VALIDATION
// ============================================

/**
 * Validate Kenyan phone number
 * Returns { valid: boolean, cleaned: string, error: string }
 */
export const validateKenyanPhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required', cleaned: '' };
  }
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Must be exactly 12 digits
  if (cleaned.length !== 12) {
    return { 
      valid: false, 
      error: `Phone number must be 12 digits (got ${cleaned.length})`,
      cleaned: '' 
    };
  }
  
  // Must start with 254 (Kenya country code)
  if (!cleaned.startsWith('254')) {
    return { 
      valid: false, 
      error: 'Phone number must start with 254 (Kenya code)',
      cleaned: '' 
    };
  }
  
  // Valid Kenyan mobile prefixes
  // Safaricom: 2547XX, Airtel: 25410X/25411X, Telkom: 25477X
  const validPrefixes = [
    '25470', '25471', '25472', '25473', '25474', '25479', // Safaricom
    '25410', '25411',  // Airtel
    '25477',           // Telkom
  ];
  
  const hasValidPrefix = validPrefixes.some(prefix => cleaned.startsWith(prefix));
  
  if (!hasValidPrefix) {
    return { 
      valid: false, 
      error: 'Invalid Kenyan mobile number prefix',
      cleaned: '' 
    };
  }
  
  // Check for obviously fake numbers (all same digit)
  const allSameDigit = /^(\d)\1+$/.test(cleaned);
  if (allSameDigit) {
    return { 
      valid: false, 
      error: 'Phone number appears to be invalid',
      cleaned: '' 
    };
  }
  
  return { valid: true, cleaned, error: '' };
};

/**
 * Format phone number for display
 * 254712345678 → +254 712 345 678
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 12) return phone;
  
  return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
};

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Validate email address (RFC-compliant)
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  
  // Trim and convert to lowercase
  const trimmed = email.trim().toLowerCase();
  
  // RFC 5322 compliant regex (simplified but robust)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Split into local and domain parts
  const [local, domain] = trimmed.split('@');
  
  // Check length limits (RFC 5321)
  if (local.length > 64) {
    return { valid: false, error: 'Email local part too long (max 64 characters)' };
  }
  
  if (domain.length > 255) {
    return { valid: false, error: 'Email domain too long (max 255 characters)' };
  }
  
  // Reject obvious disposable/temporary email domains
  const disposableDomains = [
    'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
  ];
  
  if (disposableDomains.some(d => domain.includes(d))) {
    return { valid: false, error: 'Temporary email addresses are not allowed' };
  }
  
  return { valid: true, email: trimmed, error: '' };
};

// ============================================
// AMOUNT VALIDATION
// ============================================

/**
 * Validate monetary amount in KES
 */
export const validateAmount = (value) => {
  if (!value || value === '') {
    return { valid: false, error: 'Amount is required', amount: 0 };
  }
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid number', amount: 0 };
  }
  
  if (num < 0) {
    return { valid: false, error: 'Amount cannot be negative', amount: 0 };
  }
  
  if (num === 0) {
    return { valid: false, error: 'Amount must be greater than 0', amount: 0 };
  }
  
  if (num > 10000000) {
    return { valid: false, error: 'Amount exceeds maximum (10,000,000 KES)', amount: 0 };
  }
  
  if (num < 1) {
    return { valid: false, error: 'Minimum amount is 1 KES', amount: 0 };
  }
  
  // Round to 2 decimal places (cents)
  const rounded = Math.round(num * 100) / 100;
  
  return { valid: true, amount: rounded, error: '' };
};

/**
 * Format amount for display
 * 5000 → 5,000 KES
 */
export const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ============================================
// TEXT LENGTH VALIDATION
// ============================================

/**
 * Validate text length with limits
 */
export const validateTextLength = (text, minLength = 0, maxLength = 1000, fieldName = 'Field') => {
  if (!text || text.trim() === '') {
    if (minLength > 0) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true, text: '', error: '' };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least ${minLength} characters`,
      text: trimmed 
    };
  }
  
  if (trimmed.length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} must not exceed ${maxLength} characters`,
      text: trimmed 
    };
  }
  
  return { valid: true, text: trimmed, error: '' };
};

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required', strength: 'none' };
  }
  
  if (password.length < 6) {
    return { 
      valid: false, 
      error: 'Password must be at least 6 characters',
      strength: 'weak' 
    };
  }
  
  // Calculate strength
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthLabel = strengthLabels[strength];
  
  return { 
    valid: true, 
    strength: strengthLabel,
    score: strength,
    error: '' 
  };
};

// ============================================
// CONTENT FILTERING
// ============================================

/**
 * Check for profanity/inappropriate content
 */
export const containsProfanity = (text) => {
  if (!text) return false;
  
  // Basic profanity list (expand as needed)
  const profanityList = [
    'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass',
    // Add more as needed
  ];
  
  const lowerText = text.toLowerCase();
  
  return profanityList.some(word => lowerText.includes(word));
};

/**
 * Filter profanity from text
 */
export const filterProfanity = (text) => {
  if (!text) return '';
  
  const profanityList = [
    'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass',
  ];
  
  let filtered = text;
  
  profanityList.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  
  return filtered;
};

/**
 * Detect spam patterns
 */
export const isSpam = (text) => {
  if (!text) return false;
  
  const spamPatterns = [
    /click here/gi,
    /buy now/gi,
    /limited time/gi,
    /act fast/gi,
    /(https?:\/\/[^\s]+){3,}/gi, // Multiple URLs
    /(.)\1{15,}/gi, // Repeated character 15+ times
    /[A-Z]{20,}/g, // ALL CAPS 20+ characters
  ];
  
  return spamPatterns.some(pattern => pattern.test(text));
};

// ============================================
// RATE LIMITING (Client-side)
// ============================================

const rateLimits = {};

/**
 * Check if action is rate-limited
 * @param {string} action - Action name (e.g., 'submit_report')
 * @param {string} userId - User identifier
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export const checkRateLimit = (action, userId = 'anonymous', maxAttempts = 5, windowMs = 60000) => {
  const now = Date.now();
  const key = `${action}_${userId}`;
  
  if (!rateLimits[key]) {
    rateLimits[key] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Reset if window expired
  if (now > rateLimits[key].resetTime) {
    rateLimits[key] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // Increment count
  rateLimits[key].count++;
  
  if (rateLimits[key].count > maxAttempts) {
    const retryAfter = Math.ceil((rateLimits[key].resetTime - now) / 1000);
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter,
      error: `Too many attempts. Please wait ${retryAfter} seconds.`
    };
  }
  
  return { 
    allowed: true, 
    remaining: maxAttempts - rateLimits[key].count 
  };
};

// ============================================
// SECURE LOGGING
// ============================================

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Secure logging that masks sensitive data
 */
export const secureLog = (message, data = {}) => {
  if (IS_PRODUCTION) {
    // In production, only log errors
    return;
  }
  
  // Mask sensitive fields
  const sensitiveFields = ['password', 'pin', 'token', 'secret', 'key', 'auth'];
  const masked = { ...data };
  
  Object.keys(masked).forEach(key => {
    if (sensitiveFields.some(s => key.toLowerCase().includes(s))) {
      masked[key] = '***MASKED***';
    }
  });
  
  console.log(`[GuardPay] ${message}`, masked);
};

// ============================================
// EXPORTS
// ============================================

export default {
  sanitizeInput,
  sanitizeForDisplay,
  validateKenyanPhone,
  formatPhoneNumber,
  validateEmail,
  validateAmount,
  formatAmount,
  validateTextLength,
  validatePassword,
  containsProfanity,
  filterProfanity,
  isSpam,
  checkRateLimit,
  secureLog,
};
