import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Fraud detection patterns
const URGENCY_WORDS = ['urgent', 'emergency', 'hospital', 'accident', 'quickly', 'asap', 'immediately', 'hurry', 'rush', 'desperate'];
const BLOCKING_PHRASES = ["don't call", "phone broken", "phone lost", "phone stolen", "new number", "different number", "can't talk", "battery dead"];
const MONEY_PATTERNS = /(\d{1,3}(?:,\d{3})*|\d+)\s*(ksh|kes|shillings|bob)/gi;

export default function MessageAnalyzerScreen({ navigation }) {
  const [messageText, setMessageText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [result, setResult] = useState(null);

  // Reset state when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMessageText('');
      setSenderName('');
      setResult(null);
    });

    return unsubscribe;
  }, [navigation]);

  const analyzeMessage = () => {
    if (!messageText.trim()) {
      Alert.alert('Missing message', 'Please enter the message text to analyze.');
      return;
    }

    const text = messageText.toLowerCase();
    const flags = [];
    let riskScore = 0;

    // Check for urgency words
    const urgencyMatches = URGENCY_WORDS.filter(word => text.includes(word));
    if (urgencyMatches.length > 0) {
      flags.push({
        type: 'urgency',
        severity: 'high',
        title: 'Urgency Pressure Detected',
        description: `Contains urgency words: ${urgencyMatches.join(', ')}. Scammers use urgency to stop you from thinking clearly.`,
      });
      riskScore += urgencyMatches.length * 15;
    }

    // Check for blocking phrases
    const blockingMatches = BLOCKING_PHRASES.filter(phrase => text.includes(phrase));
    if (blockingMatches.length > 0) {
      flags.push({
        type: 'blocking',
        severity: 'high',
        title: 'Verification Blocking',
        description: `Prevents you from calling: "${blockingMatches[0]}". This is a classic scam tactic to avoid voice verification.`,
      });
      riskScore += 25;
    }

    // Check for money requests
    const moneyMatches = messageText.match(MONEY_PATTERNS);
    if (moneyMatches) {
      const amounts = moneyMatches.join(', ');
      flags.push({
        type: 'money',
        severity: 'medium',
        title: 'Money Request Detected',
        description: `Requesting: ${amounts}. Always verify money requests through a separate channel.`,
      });
      riskScore += 10;
    }

    // Check for poor grammar (simple check - multiple spaces, missing punctuation)
    const hasMultipleSpaces = /\s{2,}/.test(messageText);
    const hasPoorCapitalization = /[a-z]\.[A-Z]/.test(messageText) || /^[a-z]/.test(messageText.trim());
    if (hasMultipleSpaces || hasPoorCapitalization) {
      flags.push({
        type: 'grammar',
        severity: 'low',
        title: 'Unusual Writing Style',
        description: 'Grammar or formatting seems off. Does this match how they normally write?',
      });
      riskScore += 5;
    }

    // Check message length - too short for a genuine emergency
    if (text.includes('emergency') && messageText.length < 50) {
      flags.push({
        type: 'brevity',
        severity: 'medium',
        title: 'Suspiciously Brief',
        description: 'Real emergencies usually include more details. This message is very short.',
      });
      riskScore += 10;
    }

    // Check for lack of personal details
    const hasPersonalInfo = /\b(remember|yesterday|last|our|we|together)\b/i.test(messageText);
    if (moneyMatches && !hasPersonalInfo) {
      flags.push({
        type: 'impersonal',
        severity: 'medium',
        title: 'Lacks Personal Context',
        description: 'No personal references or shared memories. Real friends/family usually mention specific details.',
      });
      riskScore += 10;
    }

    // Calculate risk level
    let riskLevel = 'low';
    let riskColor = '#2E7D32';
    if (riskScore >= 40) {
      riskLevel = 'high';
      riskColor = '#D32F2F';
    } else if (riskScore >= 20) {
      riskLevel = 'medium';
      riskColor = '#EF6C00';
    }

    setResult({
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      riskColor,
      flags,
      messageText,
      senderName,
    });
  };

  const reset = () => {
    setMessageText('');
    setSenderName('');
    setResult(null);
  };

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Analysis Result</Text>
          </View>

          {/* Risk Score Card */}
          <View style={[styles.riskCard, { borderColor: result.riskColor, backgroundColor: result.riskColor + '15' }]}>
            <View style={styles.riskScoreCircle}>
              <Text style={[styles.riskScoreNum, { color: result.riskColor }]}>{result.riskScore}</Text>
              <Text style={[styles.riskScoreLabel, { color: result.riskColor }]}>Risk Score</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.riskTitle, { color: result.riskColor }]}>
                {result.riskLevel === 'high' ? '🚨 HIGH RISK' : result.riskLevel === 'medium' ? '⚠️ MEDIUM RISK' : '✅ LOW RISK'}
              </Text>
              <Text style={styles.riskDesc}>
                {result.riskLevel === 'high'
                  ? 'Strong fraud indicators detected. Do NOT send money without thorough verification.'
                  : result.riskLevel === 'medium'
                  ? 'Several warning signs present. Verify before taking action.'
                  : 'Few red flags detected, but always verify money requests independently.'}
              </Text>
            </View>
          </View>

          {/* Detected Flags */}
          {result.flags.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Detected Red Flags ({result.flags.length})</Text>
              {result.flags.map((flag, i) => (
                <View key={i} style={styles.flagCard}>
                  <Ionicons
                    name={flag.severity === 'high' ? 'warning' : flag.severity === 'medium' ? 'alert-circle' : 'information-circle'}
                    size={22}
                    color={flag.severity === 'high' ? '#D32F2F' : flag.severity === 'medium' ? '#EF6C00' : '#1565C0'}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.flagTitle}>{flag.title}</Text>
                    <Text style={styles.flagDesc}>{flag.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          <View style={styles.recommendCard}>
            <Text style={styles.recommendTitle}>✅ What To Do Next</Text>
            <Text style={styles.recommendItem}>1. Call {result.senderName || 'the sender'} on the number you have saved</Text>
            <Text style={styles.recommendItem}>2. Ask a personal question only they would know</Text>
            <Text style={styles.recommendItem}>3. Verify through a family member or mutual contact</Text>
            <Text style={styles.recommendItem}>4. Never share OTP codes or PINs</Text>
            <Text style={styles.recommendItem}>5. When in doubt, don't send money</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btn} onPress={reset}>
              <Text style={styles.btnText}>Analyze Another Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => navigation.navigate('Verify')}>
              <Text style={styles.btnOutlineText}>Go to Verify Tool</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Message Analyzer</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="scan" size={22} color="#1565C0" />
          <Text style={styles.infoText}>
            Got a suspicious WhatsApp message? Copy and paste it here. Our AI will detect common fraud patterns and urgency tactics.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Who sent this? (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. My brother Kevin"
            value={senderName}
            onChangeText={setSenderName}
          />

          <Text style={styles.label}>Message text to analyze</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder='e.g. "Hi, my phone broken. Send 5000 urgent hospital"'
            value={messageText}
            onChangeText={setMessageText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeMessage}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.analyzeBtnText}>Analyze Message</Text>
          </TouchableOpacity>
        </View>

        {/* Example Messages */}
        <Text style={styles.sectionTitle}>Quick Test Examples</Text>
        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => setMessageText('Hi, my phone stolen. Please send 8000 urgent hospital accident. Dont call this number battery dying.')}
        >
          <Text style={styles.exampleTitle}>High Risk Example</Text>
          <Text style={styles.exampleText} numberOfLines={2}>
            "Hi, my phone stolen. Please send 8000 urgent hospital accident..."
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => setMessageText('Hey! Remember that restaurant we went to last week? I need to borrow KES 3000 for rent. Can pay back on Friday when salary comes. Let me know!')}
        >
          <Text style={styles.exampleTitle}>Low Risk Example</Text>
          <Text style={styles.exampleText} numberOfLines={2}>
            "Hey! Remember that restaurant we went to last week? I need to borrow..."
          </Text>
        </TouchableOpacity>

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
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    padding: 12, fontSize: 15, color: '#1F2937', backgroundColor: '#F9FAFB',
  },
  textArea: { minHeight: 120 },
  analyzeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1565C0', borderRadius: 12, paddingVertical: 14, marginTop: 16,
  },
  analyzeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  exampleCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB',
  },
  exampleTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  exampleText: { fontSize: 13, color: '#6B7280', fontStyle: 'italic', lineHeight: 19 },
  riskCard: {
    flexDirection: 'row', gap: 16, borderRadius: 16,
    borderWidth: 2, padding: 18, marginBottom: 20,
  },
  riskScoreCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  riskScoreNum: { fontSize: 28, fontWeight: '700' },
  riskScoreLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  riskTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  riskDesc: { fontSize: 13, color: '#374151', lineHeight: 19 },
  flagCard: {
    flexDirection: 'row', gap: 12, backgroundColor: '#fff',
    borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  flagTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  flagDesc: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  recommendCard: {
    backgroundColor: '#E8F5E9', borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#A5D6A7',
  },
  recommendTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32', marginBottom: 12 },
  recommendItem: { fontSize: 13, color: '#1F2937', lineHeight: 22, marginBottom: 6 },
  btnRow: { gap: 10 },
  btn: {
    backgroundColor: '#1565C0', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnOutline: {
    backgroundColor: 'transparent', borderWidth: 2, borderColor: '#1565C0',
  },
  btnOutlineText: { color: '#1565C0', fontWeight: '700', fontSize: 15 },
});
