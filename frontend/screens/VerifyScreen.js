import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Real verification steps that actually protect users
const VERIFICATION_STEPS = [
  {
    id: 1,
    icon: 'call-outline',
    title: 'Call the saved number',
    description: 'Use the number YOU saved in your phone, NOT any number from the message',
    action: 'Called and verified',
    critical: true,
  },
  {
    id: 2,
    icon: 'shield-checkmark-outline',
    title: 'Check if request is normal',
    description: 'Does this person usually ask for money this way? Is the amount typical?',
    action: 'Request seems normal',
    critical: true,
  },
  {
    id: 3,
    icon: 'chatbubbles-outline',
    title: 'Check the writing style',
    description: 'Is the grammar, spelling, or tone different from how they usually text?',
    action: 'Writing style matches',
    critical: false,
  },
  {
    id: 4,
    icon: 'help-circle-outline',
    title: 'Ask a personal question',
    description: 'Ask something only the real person would know (family detail, recent event, shared memory)',
    action: 'Answered correctly',
    critical: true,
  },
  {
    id: 5,
    icon: 'key-outline',
    title: 'Check for safe word',
    description: 'If you have a family safe word, ask them to say it',
    action: 'Safe word confirmed',
    critical: false,
  },
];

// Red flags that indicate a scam
const RED_FLAGS = [
  { icon: 'time-outline', text: 'Urgent/emergency language', weight: 3 },
  { icon: 'close-circle-outline', text: 'Asking not to call', weight: 5 },
  { icon: 'phone-portrait-outline', text: 'New number mentioned', weight: 4 },
  { icon: 'alert-circle-outline', text: 'Threatening consequences', weight: 4 },
  { icon: 'cash-outline', text: 'Large amount of money', weight: 2 },
  { icon: 'lock-closed-outline', text: 'Asked not to tell others', weight: 4 },
];

export default function VerifyScreen({ navigation }) {
  const [sender, setSender] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [verifiedSteps, setVerifiedSteps] = useState([]);
  const [detectedFlags, setDetectedFlags] = useState([]);
  const [result, setResult] = useState(null);

  const toggleStep = (id) => {
    if (verifiedSteps.includes(id)) {
      setVerifiedSteps(verifiedSteps.filter(s => s !== id));
    } else {
      setVerifiedSteps([...verifiedSteps, id]);
    }
  };

  const toggleFlag = (text) => {
    if (detectedFlags.includes(text)) {
      setDetectedFlags(detectedFlags.filter(f => f !== text));
    } else {
      setDetectedFlags([...detectedFlags, text]);
    }
  };

  const calculateRisk = () => {
    const criticalSteps = VERIFICATION_STEPS.filter(s => s.critical);
    const criticalCompleted = criticalSteps.filter(s => verifiedSteps.includes(s.id)).length;
    const criticalTotal = criticalSteps.length;
    
    const flagWeight = detectedFlags.reduce((sum, flag) => {
      const foundFlag = RED_FLAGS.find(f => f.text === flag);
      return sum + (foundFlag ? foundFlag.weight : 0);
    }, 0);

    const maxFlagWeight = RED_FLAGS.reduce((sum, f) => sum + f.weight, 0);
    
    // Risk score: 0-100 (higher is more risky)
    const verificationScore = (criticalCompleted / criticalTotal) * 100;
    const flagScore = (flagWeight / maxFlagWeight) * 100;
    
    const riskScore = Math.round((100 - verificationScore) * 0.6 + flagScore * 0.4);
    
    let riskLevel = 'LOW';
    let riskColor = '#2E7D32';
    let riskBg = '#E8F5E9';
    let recommendation = 'PROCEED WITH CAUTION';
    
    if (riskScore >= 70) {
      riskLevel = 'VERY HIGH';
      riskColor = '#B71C1C';
      riskBg = '#FFEBEE';
      recommendation = 'DO NOT SEND MONEY';
    } else if (riskScore >= 50) {
      riskLevel = 'HIGH';
      riskColor = '#D32F2F';
      riskBg = '#FFEBEE';
      recommendation = 'LIKELY A SCAM';
    } else if (riskScore >= 30) {
      riskLevel = 'MEDIUM';
      riskColor = '#EF6C00';
      riskBg = '#FFF3E0';
      recommendation = 'VERIFY MORE';
    } else if (criticalCompleted === criticalTotal) {
      riskLevel = 'LOW';
      riskColor = '#2E7D32';
      riskBg = '#E8F5E9';
      recommendation = 'VERIFIED SAFE';
    }

    setResult({
      riskScore,
      riskLevel,
      riskColor,
      riskBg,
      recommendation,
      criticalCompleted,
      criticalTotal,
      flagsDetected: detectedFlags.length,
      sender,
      amount,
    });
  };

  const reset = () => {
    setSender('');
    setAmount('');
    setMessage('');
    setVerifiedSteps([]);
    setDetectedFlags([]);
    setResult(null);
  };

  if (result) {
    const isSafe = result.riskScore < 30 && result.criticalCompleted === result.criticalTotal;
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.container}>
          <Text style={styles.pageTitle}>Verification Result</Text>
          
          {/* Risk Score Card */}
          <View style={[styles.resultCard, { backgroundColor: result.riskBg, borderColor: result.riskColor }]}>
            <View style={styles.riskScoreCircle}>
              <Text style={[styles.riskScoreNumber, { color: result.riskColor }]}>{result.riskScore}</Text>
              <Text style={styles.riskScoreLabel}>Risk Score</Text>
            </View>
            
            <View style={[styles.riskLevelBadge, { backgroundColor: result.riskColor }]}>
              <Text style={styles.riskLevelText}>{result.riskLevel} RISK</Text>
            </View>
            
            <Text style={[styles.recommendationText, { color: result.riskColor }]}>
              {result.recommendation}
            </Text>
          </View>

          {/* Analysis Details */}
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Analysis Details</Text>
            
            <View style={styles.analysisRow}>
              <Ionicons name="checkmark-circle" size={20} color={result.criticalCompleted === result.criticalTotal ? '#2E7D32' : '#EF6C00'} />
              <Text style={styles.analysisText}>
                {result.criticalCompleted}/{result.criticalTotal} critical verification steps completed
              </Text>
            </View>
            
            <View style={styles.analysisRow}>
              <Ionicons name="warning" size={20} color={result.flagsDetected > 0 ? '#D32F2F' : '#9CA3AF'} />
              <Text style={styles.analysisText}>
                {result.flagsDetected} red flag{result.flagsDetected !== 1 ? 's' : ''} detected
              </Text>
            </View>

            {result.sender && (
              <View style={styles.analysisRow}>
                <Ionicons name="person" size={20} color="#6B7280" />
                <Text style={styles.analysisText}>Sender: {result.sender}</Text>
              </View>
            )}

            {result.amount && (
              <View style={styles.analysisRow}>
                <Ionicons name="cash" size={20} color="#6B7280" />
                <Text style={styles.analysisText}>Amount: KES {result.amount}</Text>
              </View>
            )}
          </View>

          {/* Action Recommendations */}
          <View style={styles.recommendationsCard}>
            <Text style={styles.recommendationsTitle}>
              {isSafe ? '✓ What to do next:' : '⚠️ What to do next:'}
            </Text>
            
            {isSafe ? (
              <>
                <Text style={styles.recommendationItem}>• You've verified this request thoroughly</Text>
                <Text style={styles.recommendationItem}>• Only send if you're 100% comfortable</Text>
                <Text style={styles.recommendationItem}>• Keep records of the transaction</Text>
                <Text style={styles.recommendationItem}>• Trust your instinct - if unsure, wait</Text>
              </>
            ) : (
              <>
                <Text style={[styles.recommendationItem, { color: '#D32F2F', fontWeight: '700' }]}>
                  • DO NOT send money yet
                </Text>
                <Text style={styles.recommendationItem}>• Complete all critical verification steps</Text>
                <Text style={styles.recommendationItem}>• Call the person on a saved number</Text>
                <Text style={styles.recommendationItem}>• If they can't verify, it's likely a scam</Text>
                <Text style={styles.recommendationItem}>• Report suspicious numbers</Text>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.btn} onPress={reset}>
            <Text style={styles.btnText}>Verify Another Request</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnSecondary, { marginBottom: 32 }]}
            onPress={() => navigation.navigate('NumberCheck')}
          >
            <Text style={styles.btnSecondaryText}>Report This Number</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View style={styles.modePill}>
            <Ionicons name="shield-checkmark" size={14} color="#1565C0" />
            <Text style={styles.modePillText}>SMART VERIFICATION</Text>
          </View>
        </View>
        
        <Text style={styles.pageTitle}>Pause & Verify</Text>
        <Text style={styles.pageSubtitle}>
          Complete the verification steps below to check if this money request is legitimate.
        </Text>

        {/* Quick Action Card */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => navigation.navigate('NumberCheck')}
          activeOpacity={0.8}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="search" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickActionTitle}>Check Number First</Text>
            <Text style={styles.quickActionSub}>See if this number was reported as a scam</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Request Details */}
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={20} color="#1565C0" />
          <Text style={styles.sectionTitle}>Request Details</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Who is asking for money?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Kevin, Mum, Sister" 
            value={sender} 
            onChangeText={setSender}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Amount requested (KES)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 5000" 
            keyboardType="numeric" 
            value={amount} 
            onChangeText={setAmount}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Copy the message they sent</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Paste or type the exact message..." 
            value={message} 
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Verification Steps */}
        <View style={styles.sectionHeader}>
          <Ionicons name="clipboard-outline" size={20} color="#1565C0" />
          <Text style={styles.sectionTitle}>Verification Checklist</Text>
        </View>
        <Text style={styles.sectionDesc}>Complete these steps before sending money</Text>

        {VERIFICATION_STEPS.map((step) => (
          <TouchableOpacity 
            key={step.id}
            style={styles.stepCard}
            onPress={() => toggleStep(step.id)}
            activeOpacity={0.7}
          >
            <View style={styles.stepLeft}>
              <View style={[styles.stepIconBox, verifiedSteps.includes(step.id) && styles.stepIconBoxDone]}>
                <Ionicons 
                  name={verifiedSteps.includes(step.id) ? 'checkmark' : step.icon} 
                  size={20} 
                  color={verifiedSteps.includes(step.id) ? '#fff' : '#1565C0'} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.stepTitle, verifiedSteps.includes(step.id) && styles.stepTitleDone]}>
                    {step.title}
                  </Text>
                  {step.critical && (
                    <View style={styles.criticalBadge}>
                      <Text style={styles.criticalText}>CRITICAL</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.stepDesc}>{step.description}</Text>
                {verifiedSteps.includes(step.id) && (
                  <Text style={styles.stepAction}>✓ {step.action}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Red Flags Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="warning" size={20} color="#D32F2F" />
          <Text style={styles.sectionTitle}>Red Flags Detected?</Text>
        </View>
        <Text style={styles.sectionDesc}>Select any warning signs you noticed</Text>

        <View style={styles.flagsGrid}>
          {RED_FLAGS.map((flag) => (
            <TouchableOpacity
              key={flag.text}
              style={[styles.flagChip, detectedFlags.includes(flag.text) && styles.flagChipActive]}
              onPress={() => toggleFlag(flag.text)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={flag.icon} 
                size={16} 
                color={detectedFlags.includes(flag.text) ? '#fff' : '#6B7280'} 
              />
              <Text style={[styles.flagChipText, detectedFlags.includes(flag.text) && styles.flagChipTextActive]}>
                {flag.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Warning if critical steps not done */}
        {verifiedSteps.length > 0 && !VERIFICATION_STEPS.filter(s => s.critical).every(s => verifiedSteps.includes(s.id)) && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle" size={20} color="#EF6C00" />
            <Text style={styles.warningText}>
              Complete all CRITICAL steps before analyzing
            </Text>
          </View>
        )}

        {/* Analyze Button */}
        <TouchableOpacity 
          style={[styles.analyzeBtn, verifiedSteps.length === 0 && styles.analyzeBtnDisabled]} 
          onPress={calculateRisk}
          disabled={verifiedSteps.length === 0}
          activeOpacity={0.85}
        >
          <Ionicons name="analytics" size={20} color="#fff" />
          <Text style={styles.analyzeBtnText}>Analyze Risk Level</Text>
        </TouchableOpacity>

        {verifiedSteps.length === 0 && (
          <Text style={styles.helperText}>Complete at least one verification step to analyze</Text>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { paddingTop: 20, marginBottom: 12 },
  modePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E3F2FD', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  modePillText: { fontSize: 11, fontWeight: '700', color: '#1565C0', letterSpacing: 0.8 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
  
  // Quick Action Card
  quickActionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#6D4C41', borderRadius: 16, padding: 16,
    marginBottom: 24, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3,
  },
  quickActionIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  quickActionSub: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  // Sections
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  sectionDesc: { fontSize: 13, color: '#6B7280', marginBottom: 12, marginTop: -6 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    padding: 14, fontSize: 15, color: '#1F2937', backgroundColor: '#F9FAFB',
  },
  textArea: { height: 100, paddingTop: 14 },

  // Verification Steps
  stepCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1.5, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  stepLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepIconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E3F2FD', alignItems: 'center', 
    justifyContent: 'center', flexShrink: 0,
  },
  stepIconBoxDone: { backgroundColor: '#1565C0' },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  stepTitleDone: { color: '#1565C0' },
  stepDesc: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 4 },
  stepAction: { fontSize: 12, color: '#2E7D32', fontWeight: '600', marginTop: 4 },
  criticalBadge: {
    backgroundColor: '#FFEBEE', paddingHorizontal: 6, 
    paddingVertical: 2, borderRadius: 6,
  },
  criticalText: { fontSize: 9, fontWeight: '700', color: '#D32F2F', letterSpacing: 0.5 },

  // Red Flags
  flagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  flagChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },
  flagChipActive: { backgroundColor: '#D32F2F', borderColor: '#D32F2F' },
  flagChipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  flagChipTextActive: { color: '#fff' },

  // Warning Banner
  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF3E0', borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#FFE0B2',
  },
  warningText: { flex: 1, fontSize: 13, color: '#EF6C00', fontWeight: '600', lineHeight: 18 },

  // Analyze Button
  analyzeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1565C0', borderRadius: 16,
    paddingVertical: 16, marginBottom: 8,
  },
  analyzeBtnDisabled: { backgroundColor: '#9CA3AF' },
  analyzeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  helperText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginBottom: 16 },

  // Result Screen
  resultCard: {
    borderRadius: 18, borderWidth: 2, padding: 24,
    alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  riskScoreCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff', alignItems: 'center', 
    justifyContent: 'center', marginBottom: 16,
    borderWidth: 3, borderColor: '#E5E7EB',
  },
  riskScoreNumber: { fontSize: 36, fontWeight: '700' },
  riskScoreLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  riskLevelBadge: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12,
  },
  riskLevelText: { fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  recommendationText: { fontSize: 20, fontWeight: '700', textAlign: 'center' },

  // Analysis Card
  analysisCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  analysisTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  analysisRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  analysisText: { flex: 1, fontSize: 14, color: '#374151' },

  // Recommendations Card
  recommendationsCard: {
    backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB',
  },
  recommendationsTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  recommendationItem: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 6 },

  // Buttons
  btn: {
    backgroundColor: '#1565C0', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnSecondary: {
    backgroundColor: '#fff', borderRadius: 16, borderWidth: 2,
    borderColor: '#1565C0', paddingVertical: 14, alignItems: 'center',
  },
  btnSecondaryText: { color: '#1565C0', fontWeight: '700', fontSize: 15 },
});
