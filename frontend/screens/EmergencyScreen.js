import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Linking, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getContacts } from '../services/contactsService';
import { sendEmergencyAlert } from '../services/alertService';

const RECOVERY_STEPS = [
  { 
    id: 1, 
    title: 'Log out scammer from WhatsApp', 
    desc: 'Open WhatsApp → Settings → Linked Devices → Log out all other devices immediately. If you can\'t access WhatsApp, proceed to step 2.' 
  },
  { 
    id: 2, 
    title: 'Re-verify your phone number', 
    desc: 'Uninstall and reinstall WhatsApp. Verify using your phone number with the OTP code sent by WhatsApp. This kicks out the scammer.' 
  },
  { 
    id: 3, 
    title: 'Enable WhatsApp 2-Step Verification', 
    desc: 'WhatsApp → Settings → Account → Two-step verification → Enable. Create a 6-digit PIN. This prevents future takeovers.' 
  },
  { 
    id: 4, 
    title: 'Secure your M-PESA account', 
    desc: 'Call Safaricom 100 or 0722 000 100. Report the incident and request to change your M-PESA PIN immediately.' 
  },
  { 
    id: 5, 
    title: 'Check SIM card status', 
    desc: 'Confirm no unauthorized SIM swap happened. If your number isn\'t working, visit Safaricom shop immediately with ID.' 
  },
  { 
    id: 6, 
    title: 'Review account activity', 
    desc: 'Check M-PESA statement for unauthorized transactions. Check WhatsApp chat history for messages sent by scammer.' 
  },
  { 
    id: 7, 
    title: 'Report to authorities', 
    desc: 'File report with DCI Cybercrime (0800 722 203) or nearest police station. Keep reference number for follow-up.' 
  },
  { 
    id: 8, 
    title: 'Secure your email & social media', 
    desc: 'Change passwords for Gmail, Facebook, Instagram. Enable 2FA everywhere. Scammer may have accessed other accounts.' 
  },
];

const HOTLINES = [
  { name: 'Safaricom', number: '0722000100', color: '#2E7D32' },
  { name: 'DCI Cybercrime', number: '0800722203', color: '#1565C0' },
  { name: 'Kenya Police', number: '999', color: '#D32F2F' },
];

export default function EmergencyScreen({ navigation }) {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState([]);
  const [alertSent, setAlertSent] = useState(false);

  // Reset state when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setStarted(false);
      setDone([]);
      setAlertSent(false);
    });

    return unsubscribe;
  }, [navigation]);

  const toggleStep = (id) => setDone(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const callNumber = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const sendAlertToContacts = async () => {
    const contacts = getContacts();
    
    if (contacts.length === 0) {
      Alert.alert(
        'No Trusted Contacts',
        'You need to add trusted contacts first. Would you like to add them now?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Add Contacts', onPress: () => navigation.navigate('TrustedContacts') },
        ]
      );
      return;
    }

    Alert.alert(
      'Send Emergency Alert?',
      `This will send SMS alerts to ${contacts.length} trusted contact(s) warning them NOT to send you money.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alerts',
          style: 'destructive',
          onPress: async () => {
            const result = await sendEmergencyAlert(contacts);
            if (result.success) {
              setAlertSent(true);
              Alert.alert(
                'Alerts Sent!',
                `Successfully alerted ${result.sent} contact(s). They've been warned not to send you money.`
              );
            } else {
              Alert.alert('Error', 'Could not send alerts. Try calling contacts manually.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="warning" size={32} color="#fff" />
          <Text style={styles.emergencyTitle}>Emergency Centre</Text>
          <Text style={styles.emergencySubtitle}>Don't panic. We'll guide you through the next steps.</Text>
        </View>

        {!started ? (
          <View style={styles.card}>
            <View style={styles.redPill}>
              <Text style={styles.redPillText}>ACCOUNT COMPROMISED</Text>
            </View>
            <Text style={styles.cardTitle}>My WhatsApp account has been hacked</Text>
            <Text style={styles.cardDesc}>Someone may have taken over your account and is messaging your contacts to ask for money. Act immediately to protect your family and friends.</Text>
            
            {/* Alert Button */}
            <TouchableOpacity 
              style={styles.alertBtn} 
              onPress={sendAlertToContacts}
            >
              <Ionicons name="megaphone" size={18} color="#fff" />
              <Text style={styles.alertBtnText}>🚨 Alert All Trusted Contacts</Text>
            </TouchableOpacity>
            {alertSent && (
              <View style={styles.sentBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.sentText}>Alerts sent to your contacts</Text>
              </View>
            )}

            <TouchableOpacity style={styles.emergencyBtn} onPress={() => setStarted(true)}>
              <Ionicons name="flash" size={18} color="#fff" />
              <Text style={styles.emergencyBtnText}>Start Account Recovery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>Recovery progress</Text>
              <Text style={styles.progressCount}>{done.length}/{RECOVERY_STEPS.length} steps</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(done.length / RECOVERY_STEPS.length) * 100}%` }]} />
              </View>
            </View>

            {RECOVERY_STEPS.map((step) => {
              const isDone = done.includes(step.id);
              return (
                <TouchableOpacity
                  key={step.id}
                  style={[styles.stepCard, isDone && styles.stepCardDone]}
                  onPress={() => toggleStep(step.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.stepDot, isDone && styles.stepDotDone]}>
                    {isDone
                      ? <Ionicons name="checkmark" size={16} color="#fff" />
                      : <Text style={styles.stepNum}>{step.id}</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stepTitle, isDone && styles.stepTitleDone]}>
                      Step {step.id}: {step.title}
                    </Text>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Hotlines */}
        <Text style={styles.sectionTitle}>Emergency hotlines</Text>
        {HOTLINES.map((h) => (
          <TouchableOpacity key={h.name} style={styles.hotlineCard} onPress={() => callNumber(h.number)}>
            <View style={[styles.hotlineIcon, { backgroundColor: h.color + '20' }]}>
              <Ionicons name="call" size={20} color={h.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hotlineName}>{h.name}</Text>
              <Text style={[styles.hotlineNum, { color: h.color }]}>{h.number}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  emergencyHeader: {
    backgroundColor: '#D32F2F', padding: 24,
    alignItems: 'center', gap: 8,
  },
  emergencyTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  emergencySubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  card: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  redPill: {
    backgroundColor: '#FFEBEE', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, marginBottom: 10,
  },
  redPillText: { fontSize: 11, fontWeight: '700', color: '#D32F2F' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  alertBtn: {
    backgroundColor: '#EF6C00', borderRadius: 14,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12,
  },
  alertBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sentBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E8F5E9', borderRadius: 8, padding: 10, marginBottom: 12,
  },
  sentText: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  emergencyBtn: {
    backgroundColor: '#D32F2F', borderRadius: 14,
    paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  emergencyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  progressCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  progressLabel: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  progressCount: { fontSize: 13, color: '#1565C0', fontWeight: '700', marginBottom: 10 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#2E7D32', borderRadius: 4 },
  stepCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  stepCardDone: { opacity: 0.6, borderColor: '#2E7D32' },
  stepDot: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepDotDone: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  stepNum: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  stepTitleDone: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  stepDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginHorizontal: 16, marginTop: 8, marginBottom: 10 },
  hotlineCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E5E7EB',
  },
  hotlineIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  hotlineName: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  hotlineNum: { fontSize: 15, fontWeight: '700', marginTop: 1 },
});
