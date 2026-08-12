import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@guardpay_auth';
const USER_STORAGE_KEY = '@guardpay_user';
const REMEMBER_PHONE_KEY = '@guardpay_remember_phone';
const BIOMETRIC_AUTH_KEY = '@guardpay_biometric';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authToken = null;
  }

  /**
   * Login with phone number and password
   * @param {string} phoneNumber - Clean phone number (e.g., "254712345678")
   * @param {string} password - User password or PIN
   * @param {boolean} rememberMe - Whether to save phone number
   * @returns {Promise<{success: boolean, message?: string, user?: object}>}
   */
  async login(phoneNumber, password, rememberMe = false) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('YOUR_API_URL/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, password }),
      // });
      // const data = await response.json();

      // Temporary mock implementation for demo
      const mockUser = {
        id: '1',
        fullName: 'Demo User',
        phoneNumber: phoneNumber,
        email: 'demo@guardpay.com',
        createdAt: new Date().toISOString(),
      };

      const mockToken = `mock_token_${Date.now()}`;

      // Store auth data
      await this.setAuthData(mockToken, mockUser);

      // Save phone number if remember me is enabled
      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBER_PHONE_KEY, phoneNumber);
      } else {
        await AsyncStorage.removeItem(REMEMBER_PHONE_KEY);
      }

      this.currentUser = mockUser;
      this.authToken = mockToken;

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please check your credentials.',
      };
    }
  }

  /**
   * Sign up new user
   * @param {object} userData - User registration data
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async signUp(userData) {
    try {
      const { fullName, phoneNumber, email, password } = userData;

      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('YOUR_API_URL/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ fullName, phoneNumber, email, password }),
      // });
      // const data = await response.json();

      // Temporary mock implementation
      // In production, backend will handle user creation and return token
      console.log('Sign up data:', { fullName, phoneNumber, email });

      return {
        success: true,
        message: 'Account created successfully',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: 'Sign up failed. Please try again.',
      };
    }
  }

  /**
   * Request password reset OTP
   * @param {string} phoneNumber - User's phone number
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async requestPasswordReset(phoneNumber) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('YOUR_API_URL/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber }),
      // });
      // const data = await response.json();

      // Temporary mock implementation
      console.log('Password reset requested for:', phoneNumber);

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Could not send OTP. Please try again.',
      };
    }
  }

  /**
   * Verify OTP code
   * @param {string} phoneNumber - User's phone number
   * @param {string} otp - OTP code
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async verifyOTP(phoneNumber, otp) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('YOUR_API_URL/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });
      // const data = await response.json();

      // Temporary mock implementation - accept any 6-digit OTP
      if (otp.length === 6) {
        return {
          success: true,
          message: 'OTP verified',
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'OTP verification failed.',
      };
    }
  }

  /**
   * Reset password with OTP
   * @param {string} phoneNumber - User's phone number
   * @param {string} otp - Verified OTP code
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  async resetPassword(phoneNumber, otp, newPassword) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('YOUR_API_URL/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, otp, newPassword }),
      // });
      // const data = await response.json();

      // Temporary mock implementation
      console.log('Password reset for:', phoneNumber);

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Password reset failed.',
      };
    }
  }

  /**
   * Logout user
   * @returns {Promise<{success: boolean}>}
   */
  async logout() {
    try {
      // Clear all auth data except remembered phone
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        USER_STORAGE_KEY,
        BIOMETRIC_AUTH_KEY,
      ]);

      this.currentUser = null;
      this.authToken = null;

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  /**
   * Get current user data
   * @returns {Promise<object|null>}
   */
  async getCurrentUser() {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }

      const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userJson) {
        this.currentUser = JSON.parse(userJson);
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get auth token
   * @returns {Promise<string|null>}
   */
  async getAuthToken() {
    try {
      if (this.authToken) {
        return this.authToken;
      }

      const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (token) {
        this.authToken = token;
        return token;
      }

      return null;
    } catch (error) {
      console.error('Get auth token error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const token = await this.getAuthToken();
    return !!token;
  }

  /**
   * Get saved phone number (from remember me)
   * @returns {Promise<string|null>}
   */
  async getSavedPhoneNumber() {
    try {
      return await AsyncStorage.getItem(REMEMBER_PHONE_KEY);
    } catch (error) {
      console.error('Get saved phone error:', error);
      return null;
    }
  }

  /**
   * Store auth data
   * @param {string} token - Auth token
   * @param {object} user - User data
   */
  async setAuthData(token, user) {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, token);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Set auth data error:', error);
    }
  }

  /**
   * Save biometric auth credentials
   * @param {string} phoneNumber - User's phone number
   * @param {string} token - Auth token
   */
  async setBiometricAuth(phoneNumber, token) {
    try {
      const data = { phone: phoneNumber, token: token };
      await AsyncStorage.setItem(BIOMETRIC_AUTH_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Set biometric auth error:', error);
    }
  }

  /**
   * Get biometric auth credentials
   * @returns {Promise<object|null>}
   */
  async getBiometricAuth() {
    try {
      const dataJson = await AsyncStorage.getItem(BIOMETRIC_AUTH_KEY);
      return dataJson ? JSON.parse(dataJson) : null;
    } catch (error) {
      console.error('Get biometric auth error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * @param {object} updates - Profile updates
   * @returns {Promise<{success: boolean, user?: object}>}
   */
  async updateProfile(updates) {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const token = await this.getAuthToken();
      // const response = await fetch('YOUR_API_URL/auth/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(updates),
      // });
      // const data = await response.json();

      // Temporary mock implementation
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        this.currentUser = updatedUser;

        return {
          success: true,
          user: updatedUser,
        };
      }

      return {
        success: false,
        message: 'No user logged in',
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Profile update failed',
      };
    }
  }
}

// Export singleton instance
export default new AuthService();
