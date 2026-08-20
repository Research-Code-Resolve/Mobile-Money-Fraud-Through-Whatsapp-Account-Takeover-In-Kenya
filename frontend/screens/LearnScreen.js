import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Real prevention tips from Kenya
const PREVENTION_TIPS = [
  {
    id: 1,
    icon: 'call',
    title: 'Always Call to Verify',
    tip: 'If someone asks for money via WhatsApp, CALL them on the number you already have saved. Don\'t use the number in the message.',
    color: '#1565C0',
  },
  {
    id: 2,
    icon: 'time',
    title: 'Urgency is a Red Flag',
    tip: 'Scammers create panic: "Emergency!", "Hospital!", "Urgent!". Real emergencies can wait 5 minutes for you to verify.',
    color: '#EF6C00',
  },
  {
    id: 3,
    icon: 'key',
    title: 'Never Share OTP Codes',
    tip: 'No company (Safaricom, banks, apps) will EVER ask for your OTP code. That code is your account key.',
    color: '#D32F2F',
  },
  {
    id: 4,
    icon: 'people',
    title: 'Ask Personal Questions',
    tip: 'Ask something only the real person would know: "What did we eat last Sunday?" Scammers can\'t answer.',
    color: '#2E7D32',
  },
  {
    id: 5,
    icon: 'chatbubbles',
    title: 'Check Writing Style',
    tip: 'Does the message sound like them? Poor grammar from an educated friend is suspicious.',
    color: '#6D4C41',
  },
  {
    id: 6,
    icon: 'shield',
    title: 'Enable 2-Step Verification',
    tip: 'WhatsApp Settings → Account → Two-step verification. Create a PIN only you know.',
    color: '#1565C0',
  },
];

const SCENARIOS = [
  {
    id: 1,
    title: 'The Urgent Request',
    category: 'WhatsApp Takeover',
    message: '"Hi, I\'m using my sister\'s phone. My phone got stolen. Please send me KES 5,000 urgently — I\'ll pay you back tonight."',
    sender: 'Kevin (saved contact)',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Send the money — Kevin always pays back.' },
      { id: 'B', text: 'Call Kevin on the number you already have saved.' },
      { id: 'C', text: 'Ask for their M-PESA number to verify.' },
    ],
    correct: 'B',
    explanation: 'Always call the person directly on a number you already know. Fraudsters count on urgency to stop you from verifying.',
  },
  {
    id: 2,
    title: 'The OTP Request',
    category: 'OTP Scam',
    message: '"Safaricom here. We\'re updating your account. Please share the 6-digit code we just sent you."',
    sender: 'Unknown number',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Share the code — it says it\'s Safaricom.' },
      { id: 'B', text: 'Hang up and call Safaricom on 100.' },
      { id: 'C', text: 'Ask for their employee ID.' },
    ],
    correct: 'B',
    explanation: 'Safaricom will never ask you to share an OTP. That code is your account key — sharing it hands over your account.',
  },
  {
    id: 3,
    title: 'The New Number',
    category: 'Impersonation',
    message: '"Mum, I got a new number. Please save it. I also need KES 8,000 for hospital. Don\'t call the old number, it\'s off."',
    sender: 'Unknown number',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Send the money — it sounds like an emergency.' },
      { id: 'B', text: 'Call a family member who would know the situation.' },
      { id: 'C', text: 'Reply asking for more details.' },
    ],
    correct: 'B',
    explanation: 'The script cuts off every verification route. Always verify through a separate trusted channel — call another family member.',
  },
  {
    id: 4,
    title: 'The Job Opportunity',
    category: 'Advance Fee Scam',
    message: '"Congratulations! You\'ve been selected for a job at a top hotel. Pay KES 3,500 registration fee to this M-PESA: 0712345678."',
    sender: 'Unknown number',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Pay the fee — it\'s a small amount for a good job.' },
      { id: 'B', text: 'Ignore it — legitimate employers never ask for payment.' },
      { id: 'C', text: 'Visit the hotel to confirm first.' },
    ],
    correct: 'B',
    explanation: 'Legitimate employers in Kenya never charge registration fees. This is a common advance fee scam targeting job seekers.',
  },
  {
    id: 5,
    title: 'The SIM Swap Alert',
    category: 'SIM Swap Fraud',
    message: 'SMS from "Safaricom": "Your SIM swap request has been approved. If you did not request this, call 0722000100 immediately."',
    sender: 'Safaricom Alert',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Call the number in the message.' },
      { id: 'B', text: 'Call Safaricom on 100 or visit a shop immediately.' },
      { id: 'C', text: 'Reply STOP to cancel the swap.' },
    ],
    correct: 'B',
    explanation: 'SIM swap fraud locks you out of your M-PESA. Act immediately by calling 100 (official number) or visiting a Safaricom shop. The number in the message may be fake.',
  },
  {
    id: 6,
    title: 'The M-PESA Reversal',
    category: 'Reversal Scam',
    message: '"I sent you KES 50,000 by mistake. Please reverse it or I\'ll lose my job. I\'m crying, please help urgently!"',
    sender: 'Unknown number',
    question: 'What should you do?',
    options: [
      { id: 'A', text: 'Send back the money immediately — they sound desperate.' },
      { id: 'B', text: 'Check your M-PESA statement first, then call Safaricom.' },
      { id: 'C', text: 'Send half now, half after confirming.' },
    ],
    correct: 'B',
    explanation: 'Scammers send fake "sent" messages or use stolen money. Check your actual M-PESA balance first. If you did receive money, call Safaricom 100 for official reversal process.',
  },
];

export default function LearnScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  const scenario = SCENARIOS[current];

  const select = (id) => {
    if (showResult) return;
    setSelected(id);
    setShowResult(true);
  };

  const next = () => {
    if (selected === scenario.correct && !completedScenarios.includes(scenario.id)) {
      setCompletedScenarios([...completedScenarios, scenario.id]);
    }
    const nextIndex = (current + 1) % SCENARIOS.length;
    setCurrent(nextIndex);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Learn & Stay Safe</Text>
        <Text style={styles.pageSubtitle}>Master fraud detection in minutes</Text>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressSub}>{completedScenarios.length}/{SCENARIOS.length} scenarios mastered</Text>
            </View>
            <View style={styles.trophyBadge}>
              <Ionicons name="trophy" size={20} color="#EF6C00" />
              <Text style={styles.trophyText}>{completedScenarios.length}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedScenarios.length / SCENARIOS.length) * 100}%` }]} />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
            <Text style={styles.statNumber}>KES 1.2B</Text>
            <Text style={styles.statLabel}>Lost annually in Kenya</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statNumber}>67%</Text>
            <Text style={styles.statLabel}>WhatsApp takeover</Text>
          </View>
        </View>

        {/* Prevention Tips */}
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark" size={22} color="#1565C0" />
          <Text style={styles.sectionTitle}>6 Rules to Never Get Scammed</Text>
        </View>

        {PREVENTION_TIPS.map((tip, index) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={[styles.tipIconBox, { backgroundColor: tip.color + '15' }]}>
              <Ionicons name={tip.icon} size={24} color={tip.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>
                {index + 1}. {tip.title}
              </Text>
              <Text style={styles.tipText}>{tip.tip}</Text>
            </View>
          </View>
        ))}

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('SafeWord')}
        >
          <Ionicons name="key" size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Create Your Family Safe Word</Text>
            <Text style={styles.actionDesc}>Extra layer of protection</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Real Stories */}
        <View style={styles.sectionHeader}>
          <Ionicons name="book" size={22} color="#6D4C41" />
          <Text style={styles.sectionTitle}>Real Stories from Nairobi</Text>
        </View>

        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Ionicons name="warning" size={18} color="#D32F2F" />
            <Text style={styles.storyLabel}>REAL CASE</Text>
          </View>
          <Text style={styles.storyTitle}>"They Took KES 45,000 From My Mother"</Text>
          <Text style={styles.storyText}>
            "Scammers hacked my WhatsApp and messaged my mum saying I needed hospital money urgently. 
            She sent KES 45,000 before I even knew. Now I have 2-step verification and a family safe word."
          </Text>
          <Text style={styles.storyAuthor}>- Sarah M., Westlands</Text>
        </View>

        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
            <Text style={[styles.storyLabel, { color: '#2E7D32' }]}>PREVENTED</Text>
          </View>
          <Text style={styles.storyTitle}>"I Almost Sent KES 20,000"</Text>
          <Text style={styles.storyText}>
            "Got a message from 'my brother' asking for money. Something felt off - the grammar was wrong. 
            I called him first. His account was hacked. Saved KES 20,000 by just making a phone call."
          </Text>
          <Text style={styles.storyAuthor}>- David K., Kasarani</Text>
        </View>

        {/* Practice Scenarios */}
        <View style={styles.sectionHeader}>
          <Ionicons name="game-controller" size={22} color="#EF6C00" />
          <Text style={styles.sectionTitle}>Practice Scenarios</Text>
        </View>
        <Text style={styles.sectionDesc}>Test your fraud detection skills with real examples</Text>

        {/* Progress dots */}
        <View style={styles.dots}>
          {SCENARIOS.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive, completedScenarios.includes(SCENARIOS[i].id) && styles.dotCompleted]} />
          ))}
        </View>

        {/* Scenario card */}
        <View style={styles.card}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{scenario.category}</Text>
          </View>
          <Text style={styles.scenarioTitle}>{scenario.title}</Text>
          <Text style={styles.fromLabel}>From: {scenario.sender}</Text>
          <View style={styles.messageBox}>
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" style={{ marginTop: 2 }} />
            <Text style={styles.messageText}>{scenario.message}</Text>
          </View>
          <Text style={styles.question}>{scenario.question}</Text>
        </View>

        {/* Options */}
        {scenario.options.map((opt) => {
          let optStyle = styles.option;
          let textStyle = styles.optionText;
          if (showResult) {
            if (opt.id === scenario.correct) {
              optStyle = { ...styles.option, ...styles.optionCorrect };
              textStyle = { ...styles.optionText, color: '#2E7D32', fontWeight: '700' };
            } else if (opt.id === selected) {
              optStyle = { ...styles.option, ...styles.optionWrong };
              textStyle = { ...styles.optionText, color: '#D32F2F' };
            }
          } else if (opt.id === selected) {
            optStyle = { ...styles.option, ...styles.optionSelected };
          }

          return (
            <TouchableOpacity key={opt.id} style={optStyle} onPress={() => select(opt.id)} activeOpacity={0.8}>
              <View style={styles.optionBadge}><Text style={styles.optionBadgeText}>{opt.id}</Text></View>
              <Text style={textStyle}>{opt.text}</Text>
              {showResult && opt.id === scenario.correct && (
                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              )}
              {showResult && opt.id === selected && opt.id !== scenario.correct && (
                <Ionicons name="close-circle" size={20} color="#D32F2F" />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {showResult && (
          <View style={[styles.explanationBox, { backgroundColor: selected === scenario.correct ? '#E8F5E9' : '#FFEBEE' }]}>
            <Ionicons
              name={selected === scenario.correct ? 'checkmark-circle' : 'information-circle'}
              size={20}
              color={selected === scenario.correct ? '#2E7D32' : '#D32F2F'}
            />
            <Text style={styles.explanationText}>{scenario.explanation}</Text>
          </View>
        )}

        {showResult && (
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>Next Scenario →</Text>
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
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginTop: 24, marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: '#6B7280', marginBottom: 20 },
  progressCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
    borderRadius: 16, padding: 18, marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#fff' },
  progressSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  trophyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  trophyText: { fontSize: 16, fontWeight: '700', color: '#EF6C00' },
  progressBar: {
    height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: '#fff', borderRadius: 4 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, borderRadius: 14, padding: 16, alignItems: 'center',
  },
  statNumber: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', textAlign: 'center', lineHeight: 16 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  sectionDesc: { fontSize: 14, color: '#6B7280', marginBottom: 12, marginTop: -8 },
  tipCard: {
    flexDirection: 'row', gap: 14, backgroundColor: '#fff',
    borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  tipIconBox: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  tipText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1565C0', borderRadius: 16, padding: 18,
    marginTop: 8, marginBottom: 24,
  },
  actionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 2 },
  actionDesc: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  storyCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#EF6C00',
  },
  storyHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10,
  },
  storyLabel: { fontSize: 11, fontWeight: '700', color: '#D32F2F', letterSpacing: 1 },
  storyTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  storyText: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 10 },
  storyAuthor: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 16, justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: '#1565C0', width: 28 },
  dotCompleted: { backgroundColor: '#2E7D32' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB',
  },
  categoryPill: {
    backgroundColor: '#E3F2FD', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 8,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#1565C0' },
  scenarioTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  fromLabel: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  messageBox: {
    flexDirection: 'row', gap: 8, backgroundColor: '#F3F4F6',
    borderRadius: 10, padding: 12, marginBottom: 14,
  },
  messageText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 20, fontStyle: 'italic' },
  question: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  optionSelected: { borderColor: '#1565C0', backgroundColor: '#E3F2FD' },
  optionCorrect: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  optionWrong: { borderColor: '#D32F2F', backgroundColor: '#FFEBEE' },
  optionBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  optionBadgeText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  optionText: { flex: 1, fontSize: 14, color: '#1F2937', lineHeight: 20 },
  explanationBox: {
    flexDirection: 'row', gap: 10, borderRadius: 12,
    padding: 14, marginTop: 4, marginBottom: 16,
  },
  explanationText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 20 },
  nextBtn: {
    backgroundColor: '#1565C0', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
