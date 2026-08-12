import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isNumberFlagged, getNumberRiskScore } from '../services/communityService';

export default function NumberCheckScreen({ navigation }) {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [reportNote, setReportNote] = useState('');
  const [reported, setReported] = useState(false);

  const handleCheck = async () => {
    if (!number.trim()) {
      Alert.alert('Missing number', 'Please enter the phone number to check.');
      return;
    }
    
    const isFlagged = await isNumberFlagged(number.trim());
    const riskScore = await getNumberRiskScore(number.trim());
    
    setResult({
      number: number.trim(),
      isFlagged,
      riskScore,
      status: riskScore >= 50 ? 'flagged' : 'clean',
    });
    setReported(false);
    setReportNote('');
  };

  const handleReport = () => {
    navigation.navigate('ReportNumber', { phoneNumber: number.trim() });
  };

  const reset = () => {
    setNumber('');
    setResult(null);
    setReported(false);
    setReportNote('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Check a Number</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#1565C0" />
          <Text style={styles.infoText}>
            Got a suspicious money request? Enter the sender's number to see if it's been reported by the community.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +254712345678"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />
          <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.checkBtnText}>Check Number</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View
            style={[
              styles.resultCard,
              {
                borderColor: result.status === 'clean' ? '#2E7D32' : '#D32F2F',
                backgroundColor: result.status === 'clean' ? '#E8F5E9' : '#FFEBEE',
              },
            ]}
          >
            <Ionicons
              name={result.status === 'clean' ? 'checkmark-circle' : 'warning'}
              size={44}
              color={result.status === 'clean' ? '#2E7D32' : '#D32F2F'}
            />
            <Text style={[styles.resultTitle, { color: result.status === 'clean' ? '#2E7D32' : '#D32F2F' }]}>
              {result.status === 'clean'
                ? 'No reports found'
                : result.status === 'high_risk'
                ? 'HIGH RISK — Do not send money'
                : 'Flagged — Be cautious'}
            </Text>
            <Text style={styles.resultSub}>{result.note}</Text>
            {result.status !== 'clean' && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{result.reports}</Text>
                  <Text style={styles.statLabel}>Reports</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{result.lastReported}</Text>
                  <Text style={styles.statLabel}>Last reported</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {result && result.status !== 'clean' && !reported && (
          <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>Was this number used to scam you?</Text>
            <TextInput
              style={styles.input}
              placeholder="Optional: describe what happened"
              value={reportNote}
              onChangeText={setReportNote}
              multiline
            />
            <TouchableOpacity style={styles.reportBtn} onPress={handleReport}>
              <Ionicons name="flag" size={18} color="#fff" />
              <Text style={styles.reportBtnText}>Report to Community</Text>
            </TouchableOpacity>
          </View>
        )}

        {reported && (
          <View style={styles.thanksCard}>
            <Ionicons name="heart" size={20} color="#2E7D32" />
            <Text style={styles.thanksText}>
              Thank you! Your report helps protect others. This number now has {result.reports} report(s).
            </Text>
          </View>
        )}

        {result && (
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>Check another number</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, marginBottom: 16 },
  backBtn: { padding: 4 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  infoCard: {
    flexDirection: 'row', gap: 10, backgroundColor: '#E3F2FD',
    borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#BBDEFB',
  },
  infoText: { flex: 1, fontSize: 13, color: '#1F2937', lineHeight: 19 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    padding: 12, fontSize: 15, color: '#1F2937', backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  checkBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1565C0', borderRadius: 12, paddingVertical: 14,
  },
  checkBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultCard: {
    borderRadius: 16, borderWidth: 2, padding: 20,
    alignItems: 'center', gap: 10, marginBottom: 16,
  },
  resultTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  resultSub: { fontSize: 14, color: '#374151', textAlign: 'center', lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  reportSection: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  reportTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#D32F2F', borderRadius: 12, paddingVertical: 14,
  },
  reportBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  thanksCard: {
    flexDirection: 'row', gap: 10, backgroundColor: '#E8F5E9',
    borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#A5D6A7',
  },
  thanksText: { flex: 1, fontSize: 13, color: '#2E7D32', lineHeight: 19 },
  resetBtn: {
    backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  resetBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },
});