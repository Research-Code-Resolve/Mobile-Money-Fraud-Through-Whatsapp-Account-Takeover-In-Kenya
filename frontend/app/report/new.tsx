import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const FRAUD_TYPES = [
  'WhatsApp Account Takeover',
  'OTP Theft',
  'SIM Swap',
  'Impersonation',
  'M-PESA Reversal Scam',
  'Fake Customer Care',
  'Other',
];

const STEPS = ['Fraud Type', 'Details', 'Submit'];

export default function ReportFraudScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fraudType: '',
    date: '',
    amountLost: '',
    description: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    setLoading(true);
    // TODO: wire to backend POST /api/reports
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.securityGreen} />
          </View>
          <Text style={styles.successTitle}>Report Submitted!</Text>
          <Text style={styles.successText}>
            Your fraud report has been received. The DCI Cybercrime Unit and Safaricom will review it.
          </Text>
          <Text style={styles.successRef}>Reference: GP-{Date.now().toString().slice(-6)}</Text>
          <Button label="Back to Home" onPress={() => router.replace('/(tabs)')} variant="primary" size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.title}>Report Fraud</Text>

          {/* Progress Steps */}
          <View style={styles.stepsRow}>
            {STEPS.map((s, i) => (
              <View key={s} style={styles.stepItem}>
                <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                  {i < step
                    ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                    : <Text style={[styles.stepDotText, i === step && { color: Colors.white }]}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
              </View>
            ))}
          </View>

          {/* Step 0 — Fraud Type */}
          {step === 0 && (
            <View>
              <Text style={styles.stepTitle}>What type of fraud occurred?</Text>
              <View style={styles.fraudTypes}>
                {FRAUD_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setForm((f) => ({ ...f, fraudType: type }))}
                    style={[styles.fraudType, form.fraudType === type && styles.fraudTypeSelected]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: form.fraudType === type }}
                    accessibilityLabel={type}
                  >
                    <Text style={[styles.fraudTypeText, form.fraudType === type && styles.fraudTypeTextSelected]}>
                      {type}
                    </Text>
                    {form.fraudType === type && (
                      <Ionicons name="checkmark-circle" size={18} color={Colors.trustBlue} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              <Button
                label="Next"
                onPress={() => setStep(1)}
                disabled={!form.fraudType}
                size="lg"
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          )}

          {/* Step 1 — Details */}
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>Tell us what happened</Text>
              <Input label="Date of incident" placeholder="e.g. 04 Aug 2026" leftIcon="calendar-outline" value={form.date} onChangeText={update('date')} />
              <Input label="Amount lost (KSh)" placeholder="e.g. 5000" keyboardType="numeric" leftIcon="cash-outline" value={form.amountLost} onChangeText={update('amountLost')} hint="Leave blank if no money was lost" />
              <Input label="Your phone number" placeholder="+254 7XX XXX XXX" keyboardType="phone-pad" leftIcon="call-outline" value={form.phone} onChangeText={update('phone')} />
              <Input label="Description" placeholder="Describe what happened in detail..." multiline value={form.description} onChangeText={update('description')} containerStyle={{ minHeight: 120 }} />
              <Button label="Review &amp; Submit" onPress={() => setStep(2)} size="lg" />
            </View>
          )}

          {/* Step 2 — Review */}
          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>Review your report</Text>
              <Card padding="md" style={styles.reviewCard}>
                {[
                  { label: 'Fraud Type', value: form.fraudType },
                  { label: 'Date', value: form.date || 'Not specified' },
                  { label: 'Amount Lost', value: form.amountLost ? `KSh ${form.amountLost}` : 'Not specified' },
                  { label: 'Phone', value: form.phone || 'Not specified' },
                  { label: 'Description', value: form.description || 'Not specified' },
                ].map(({ label, value }) => (
                  <View key={label} style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>{label}</Text>
                    <Text style={styles.reviewValue}>{value}</Text>
                  </View>
                ))}
              </Card>
              <Button label="Submit Report" onPress={handleSubmit} loading={loading} variant="secondary" size="lg" />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, marginBottom: Spacing.lg },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.grey200, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  stepDotActive: { backgroundColor: Colors.trustBlue },
  stepDotText: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.textSecondary },
  stepLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center' },
  stepLabelActive: { fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
  stepTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  fraudTypes: { gap: Spacing.sm },
  fraudType: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  fraudTypeSelected: { borderColor: Colors.trustBlue, backgroundColor: Colors.trustBlueSurface },
  fraudTypeText: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary },
  fraudTypeTextSelected: { fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
  reviewCard: { marginBottom: Spacing.lg },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  reviewLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary, flex: 1 },
  reviewValue: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textPrimary, flex: 2, textAlign: 'right' },
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  successIcon: { marginBottom: Spacing.md },
  successTitle: { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  successText: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  successRef: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.trustBlue, backgroundColor: Colors.trustBlueSurface, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md },
});
