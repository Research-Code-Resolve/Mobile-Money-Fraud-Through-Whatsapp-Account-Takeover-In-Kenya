import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addReport, FRAUD_TYPES } from '../services/communityService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_BREAKPOINT = 380;

export default function ReportNumberScreen({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState(route?.params?.phoneNumber || '');
  const [selectedFraudType, setSelectedFraudType] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [hasEvidence, setHasEvidence] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!phoneNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter the phone number');
      return;
    }

    if (!selectedFraudType) {
      Alert.alert('Missing Information', 'Please select the type of fraud');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please describe what happened');
      return;
    }

    setIsSubmitting(true);

    const reportData = {
      phoneNumber: phoneNumber.trim(),
      fraudType: selectedFraudType,
      description: description.trim(),
      amount: amount ? parseFloat(amount) : null,
      hasEvidence,
      userName: 'Anonymous', // Will be replaced with actual user name later
    };

    const result = await addReport(reportData);

    setIsSubmitting(false);

    if (result.success) {
      // Log for debugging
      console.log('Report submitted successfully:', result.report);
      
      Alert.alert(
        '✓ Report Submitted',
        `Thank you for helping protect the community. Your report has been recorded.\n\nReport ID: ${result.report.id}`,
        [
          {
            text: 'View Community Feed',
            onPress: () => {
              // Reset form first
              setPhoneNumber('');
              setSelectedFraudType(null);
              setDescription('');
              setAmount('');
              setHasEvidence(false);
              // Then navigate
              navigation.navigate('CommunityFeed');
            },
          },
          {
            text: 'Done',
            onPress: () => {
              // Reset form
              setPhoneNumber('');
              setSelectedFraudType(null);
              setDescription('');
              setAmount('');
              setHasEvidence(false);
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      console.error('Failed to submit report:', result.error);
      Alert.alert('Error', `Could not submit report: ${result.error || 'Unknown error'}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Report Fraud Number</Text>
            <Text style={styles.pageSubtitle}>Help protect the community</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconBox}>
            <Ionicons name="shield-checkmark" size={24} color="#1565C0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Community Protection</Text>
            <Text style={styles.infoText}>
              Your report helps others avoid falling victim to the same scammer. All reports are anonymous.
            </Text>
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="call" size={20} color="#1565C0" />
            <Text style={styles.cardTitle}>Suspicious Phone Number</Text>
          </View>

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 0712345678 or +254712345678"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputHint}>Enter the number that tried to scam you</Text>
        </View>

        {/* Fraud Type Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={20} color="#D32F2F" />
            <Text style={styles.cardTitle}>Type of Fraud *</Text>
          </View>

          <Text style={styles.sectionDesc}>Select the type of scam you encountered</Text>

          <View style={styles.fraudTypesGrid}>
            {FRAUD_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.fraudTypeCard,
                  selectedFraudType === type.id && styles.fraudTypeCardActive,
                ]}
                onPress={() => setSelectedFraudType(type.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.fraudTypeIcon,
                    { backgroundColor: type.color + '15' },
                    selectedFraudType === type.id && { backgroundColor: type.color },
                  ]}
                >
                  <Ionicons
                    name={type.icon}
                    size={24}
                    color={selectedFraudType === type.id ? '#fff' : type.color}
                  />
                </View>
                <Text
                  style={[
                    styles.fraudTypeLabel,
                    selectedFraudType === type.id && styles.fraudTypeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
                {selectedFraudType === type.id && (
                  <View style={styles.checkMark}>
                    <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color="#1565C0" />
            <Text style={styles.cardTitle}>What Happened? *</Text>
          </View>

          <Text style={styles.inputLabel}>Describe the incident</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. They pretended to be my sister and asked for emergency money. Said not to call because phone was broken."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputHint}>
            Include details like: What they said, how they contacted you, any red flags
          </Text>
        </View>

        {/* Amount Lost (Optional) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash" size={20} color="#EF6C00" />
            <Text style={styles.cardTitle}>Amount Lost (Optional)</Text>
          </View>

          <Text style={styles.inputLabel}>Amount in KES</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5000"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.inputHint}>
            Help others understand the scale. Leave blank if you didn't lose money.
          </Text>
        </View>

        {/* Evidence Toggle */}
        <TouchableOpacity
          style={styles.evidenceCard}
          onPress={() => setHasEvidence(!hasEvidence)}
          activeOpacity={0.7}
        >
          <View style={styles.evidenceLeft}>
            <View
              style={[
                styles.evidenceIconBox,
                hasEvidence && { backgroundColor: '#2E7D32' },
              ]}
            >
              <Ionicons
                name={hasEvidence ? 'checkmark-circle' : 'camera-outline'}
                size={24}
                color={hasEvidence ? '#fff' : '#6B7280'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.evidenceTitle}>I have screenshots or evidence</Text>
              <Text style={styles.evidenceDesc}>
                Evidence makes reports more credible
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.checkbox,
              hasEvidence && styles.checkboxChecked,
            ]}
          >
            {hasEvidence && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Ionicons name="shield-checkmark" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="lock-closed" size={16} color="#6B7280" />
          <Text style={styles.privacyText}>
            Your report is anonymous. We don't share personal information.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 20,
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  pageTitle: {
    fontSize: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 24 : 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  pageSubtitle: { fontSize: 13, color: '#6B7280' },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#374151', lineHeight: 19 },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  sectionDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12, lineHeight: 19 },

  // Form Elements
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 120, paddingTop: 14 },
  inputHint: { fontSize: 12, color: '#6B7280', marginTop: 8, lineHeight: 18 },

  // Fraud Types
  fraudTypesGrid: { gap: 12 },
  fraudTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  fraudTypeCardActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  fraudTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fraudTypeLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  fraudTypeLabelActive: { color: '#1F2937', fontWeight: '700' },
  checkMark: { marginLeft: 'auto' },

  // Evidence Card
  evidenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  evidenceLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  evidenceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  evidenceDesc: { fontSize: 12, color: '#6B7280' },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },

  // Submit Button
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  submitBtnDisabled: { backgroundColor: '#9CA3AF' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Privacy Notice
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  privacyText: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
});
