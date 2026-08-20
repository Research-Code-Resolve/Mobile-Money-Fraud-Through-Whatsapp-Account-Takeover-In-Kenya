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
import { User, Phone, Mail, Lock, Eye, EyeOff, CheckSquare, Square, ArrowLeft } from 'lucide-react-native';
import authService from '../services/authService';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = () => {
    console.log('=== VALIDATION START ===');
    console.log('Full Name:', fullName, 'Length:', fullName.trim().length);
    console.log('Phone Number:', phoneNumber);
    console.log('Email:', email);
    console.log('Password Length:', password.length);
    console.log('Confirm Password Length:', confirmPassword.length);
    console.log('Agree Terms:', agreeTerms);
    
    if (!fullName.trim() || fullName.trim().length < 3) {
      console.log('FAILED: Name validation');
      Alert.alert('Invalid Name', 'Please enter your full name (at least 3 characters)');
      return false;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    console.log('Clean Phone:', cleanPhone, 'Length:', cleanPhone.length);
    
    if (!phoneNumber || cleanPhone.length !== 12) {
      console.log('FAILED: Phone validation');
      Alert.alert('Invalid Phone', `Please enter a valid Kenyan phone number.\n\nYou entered: ${cleanPhone}\nLength: ${cleanPhone.length} (need 12)`);
      return false;
    }

    // Only validate email if it's not empty
    if (email && email.trim() && !validateEmail(email)) {
      console.log('FAILED: Email validation');
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (!password || password.length < 6) {
      console.log('FAILED: Password validation');
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      console.log('FAILED: Password match validation');
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      console.log('FAILED: Terms validation');
      Alert.alert('Terms Required', 'Please agree to Terms of Service and Privacy Policy');
      return false;
    }

    console.log('=== VALIDATION PASSED ===');
    return true;
  };

  const handleSignUp = async () => {
    console.log('Sign up button pressed');
    console.log('Validating inputs...');
    
    if (!validateInputs()) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed, starting signup...');
    setLoading(true);
    
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      console.log('Signup data:', {
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        email: email.trim() || null,
        hasPassword: !!password
      });
      
      const result = await authService.signUp({
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
        email: email.trim() || null,
        password,
      });

      console.log('Signup result:', result);

      if (result.success) {
        Alert.alert(
          'Account Created!',
          'Your account has been created successfully. Please login to continue.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Sign Up Failed', result.message || 'Could not create account');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join the fight against mobile money fraud
            </Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
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
              <Text style={styles.hint}>
                This will be your username and used for M-Pesa verification
              </Text>
            </View>

            {/* Email (Optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.hint}>
                For account recovery and important notifications
              </Text>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              {agreeTerms ? (
                <CheckSquare size={24} color="#2563eb" />
              ) : (
                <Square size={24} color="#6b7280" />
              )}
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('TermsOfService')}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
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
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    lineHeight: 20,
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
});
