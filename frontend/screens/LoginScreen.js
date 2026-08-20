import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import authService from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    checkSavedCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const checkSavedCredentials = async () => {
    const savedPhone = await authService.getSavedPhoneNumber();
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setRememberMe(true);
    }
  };

  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    let cleaned = text.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    // If doesn't start with 254, add it
    if (!cleaned.startsWith('254') && cleaned.length > 0) {
      cleaned = '254' + cleaned;
    }
    
    // Format as +254 XXX XXX XXX
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

  const validateInputs = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (!phoneNumber || cleanPhone.length < 12) {
      Alert.alert('Invalid Phone', 'Please enter a valid Kenyan phone number');
      return false;
    }

    if (!password || password.length < 4) {
      Alert.alert('Invalid Password', 'Please enter your password or PIN');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const result = await authService.login(cleanPhone, password, rememberMe);
      
      if (result.success) {
        Alert.alert('Welcome!', 'Login successful', [
          { text: 'OK', onPress: () => navigation.replace('Dashboard') }
        ]);
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to GuardPay',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        const savedAuth = await authService.getBiometricAuth();
        if (savedAuth) {
          await authService.login(savedAuth.phone, savedAuth.token, true);
          navigation.replace('Dashboard');
        } else {
          Alert.alert('Setup Required', 'Please login with password first to enable biometric login');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    }
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
            <View style={styles.logoContainer}>
              <Shield size={60} color="#2563eb" strokeWidth={2} />
            </View>
            <Text style={styles.title}>Welcome to GuardPay</Text>
            <Text style={styles.subtitle}>
              Protecting Kenyans from mobile money fraud
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* Phone Number Input */}
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
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password / PIN</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password or PIN"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  keyboardType={password.length <= 6 ? 'number-pad' : 'default'}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberMe}>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                  thumbColor={rememberMe ? '#2563eb' : '#f3f4f6'}
                />
                <Text style={styles.rememberMeText}>Remember me</Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Biometric Login */}
            {biometricAvailable && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
              >
                <Text style={styles.biometricButtonText}>
                  Use Fingerprint / Face ID
                </Text>
              </TouchableOpacity>
            )}

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <Shield size={16} color="#6b7280" />
            <Text style={styles.securityText}>
              Your data is encrypted and secure
            </Text>
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
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
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
    textAlign: 'center',
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
  eyeIcon: {
    padding: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  biometricButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signUpLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
});
