import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Lock, ArrowLeft, KeyRound } from 'lucide-react-native';
import authService from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: New Password
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const formatPhoneNumber = (text) => {
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('254') && cleaned.length > 0) {
      cleaned = '254' + cleaned;
    }
    
    if (cleaned.length > 3) {
      let formatted = '+' + cleaned.substring(0, 3);
      if (cleaned.length > 3) formatted += ' ' + cleaned.substring(3, 6);
      if (cleaned.length > 6) formatted += ' ' + cleaned.substring(6, 9);
      if (cleaned.length > 9) formatted += ' ' + cleaned.substring(9, 12);
      return formatted;
    }
    
    return cleaned ? '+' + cleaned : '';
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleSendOTP = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (!phoneNumber || cleanPhone.length !== 12) {
      Alert.alert('Invalid Phone', 'Please enter a valid Kenyan phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.requestPasswordReset(cleanPhone);
      
      if (result.success) {
        setOtpSent(true);
        setStep(2);
        Alert.alert(
          'OTP Sent',
          `A verification code has been sent to ${phoneNumber}`
        );
      } else {
        Alert.alert('Error', result.message || 'Could not send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const result = await authService.verifyOTP(cleanPhone, otp);
      
      if (result.success) {
        setStep(3);
        Alert.alert('Verified', 'Please enter your new password');
      } else {
        Alert.alert('Invalid Code', result.message || 'The code you entered is incorrect');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const result = await authService.resetPassword(cleanPhone, otp, newPassword);
      
      if (result.success) {
        Alert.alert(
          'Password Reset',
          'Your password has been reset successfully',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
      } else {
        Alert.alert('Error', result.message || 'Could not reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {step === 1 && "Enter your phone number to receive a verification code"}
              {step === 2 && "Enter the 6-digit code sent to your phone"}
              {step === 3 && "Create a new password for your account"}
            </Text>
          </View>

          {/* Step Indicators */}
          <View style={styles.stepIndicators}>
            <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
            <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
            <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
            <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
          </View>

          {/* Form Content */}
          <View style={styles.form}>
            {/* Step 1: Phone Number */}
            {step === 1 && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Phone size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="+254 712 345 678"
                      placeholderTextColor="#9ca3af"
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      keyboardType="phone-pad"
                      maxLength={16}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Verification Code</Text>
                  <View style={styles.inputWrapper}>
                    <KeyRound size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="000000"
                      placeholderTextColor="#9ca3af"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                  <Text style={styles.hint}>
                    Code sent to {phoneNumber}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOTP}
                  disabled={loading}
                >
                  <Text style={styles.resendButtonText}>
                    Didn't receive code? Resend
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#9ca3af"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#9ca3af"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Back to Login */}
          <View style={styles.backToLoginContainer}>
            <Text style={styles.backToLoginText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLoginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  stepIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
  },
  stepDotActive: {
    backgroundColor: '#2563eb',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#2563eb',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginLeft: 4,
  },
  actionButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  actionButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    padding: 12,
  },
  resendButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  backToLoginLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
