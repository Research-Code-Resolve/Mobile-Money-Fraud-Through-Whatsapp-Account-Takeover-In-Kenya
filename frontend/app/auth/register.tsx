import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone) errs.phone = 'Phone number is required';
    if (!form.password || form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: wire to backend /auth/register endpoint
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoSmall}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.trustBlue} />
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join GuardPay and protect your mobile money</Text>
          </View>

          <View style={styles.form}>
            <Input label="Full name" placeholder="Jane Wanjiku" leftIcon="person-outline" value={form.name} onChangeText={update('name')} error={errors.name} />
            <Input label="Email address" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" leftIcon="mail-outline" value={form.email} onChangeText={update('email')} error={errors.email} />
            <Input label="Phone number" placeholder="+254 7XX XXX XXX" keyboardType="phone-pad" leftIcon="call-outline" value={form.phone} onChangeText={update('phone')} error={errors.phone} hint="Used to send emergency alerts" />
            <Input label="Password" placeholder="At least 6 characters" isPassword leftIcon="lock-closed-outline" value={form.password} onChangeText={update('password')} error={errors.password} />
            <Input label="Confirm password" placeholder="Repeat your password" isPassword leftIcon="lock-closed-outline" value={form.confirm} onChangeText={update('confirm')} error={errors.confirm} />

            <Button label="Create Account" onPress={handleRegister} loading={loading} size="lg" />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')} accessibilityLabel="Log in">
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing['2xl'] },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoSmall: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.trustBlueSurface, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center' },
  form: { gap: Spacing.xs },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  loginText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
});
