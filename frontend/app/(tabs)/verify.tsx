import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const CHECKLIST = [
  { id: 'called', label: 'I have called the sender' },
  { id: 'number', label: 'I confirmed this is their real number' },
  { id: 'urgency', label: 'The request is not unusually urgent' },
  { id: 'reason', label: 'I know why they need the money' },
  { id: 'identity', label: 'I have verified their identity' },
];

type RiskLevel = 'high' | 'medium' | 'low' | null;

interface AnalysisResult {
  riskLevel: RiskLevel;
  flags: string[];
  recommendation: string;
}

export default function VerifyScreen() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'scanner'>('checklist');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allChecked = checked.size === CHECKLIST.length;
  const someUnchecked = checked.size > 0 && !allChecked;

  const analyzeMessage = async () => {
    if (!message.trim()) return;
    setAnalyzing(true);
    setResult(null);
    // TODO: wire to AI/ML backend endpoint POST /api/analyze-message
    setTimeout(() => {
      const lower = message.toLowerCase();
      const flags: string[] = [];
      if (/urgent|immediately|now|asap|hurry|quick/i.test(lower)) flags.push('Urgency language detected');
      if (/otp|code|pin|password/i.test(lower)) flags.push('OTP / PIN request detected');
      if (/send money|mpesa|transfer|lipa/i.test(lower)) flags.push('Money transfer request detected');
      if (/mama|dad|sick|hospital|accident|emergency/i.test(lower)) flags.push('Emotional manipulation detected');
      if (/unknown|new number|changed/i.test(lower)) flags.push('Unknown or changed number');

      const riskLevel: RiskLevel =
        flags.length >= 3 ? 'high' : flags.length >= 1 ? 'medium' : 'low';

      const recommendation =
        riskLevel === 'high'
          ? 'Do NOT send money or share any codes. Call the sender directly to verify.'
          : riskLevel === 'medium'
          ? 'Be cautious. Verify the sender\'s identity before taking any action.'
          : 'This message appears safe, but always verify before sending money.';

      setResult({ riskLevel, flags, recommendation });
      setAnalyzing(false);
    }, 1800);
  };

  const riskConfig = {
    high: { color: Colors.alertRed, bg: Colors.alertRedSurface, icon: 'close-circle' as const, label: 'HIGH RISK' },
    medium: { color: Colors.warningOrange, bg: Colors.warningOrangeSurface, icon: 'warning' as const, label: 'MEDIUM RISK' },
    low: { color: Colors.securityGreen, bg: Colors.securityGreenSurface, icon: 'checkmark-circle' as const, label: 'LOW RISK' },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verify &amp; Check</Text>
          <Text style={styles.subtitle}>Stay protected before you act</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['checklist', 'scanner'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              accessibilityLabel={tab === 'checklist' ? 'Verify before sending tab' : 'Scam message checker tab'}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'checklist' ? 'Verify Before Sending' : 'Scam Message Checker'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Checklist Tab */}
        {activeTab === 'checklist' && (
          <View>
            <Card style={styles.card} padding="lg">
              <View style={styles.cardHeader}>
                <Ionicons name="shield-checkmark-outline" size={28} color={Colors.trustBlue} />
                <Text style={styles.cardTitle}>Verify Before You Send Money</Text>
              </View>
              <Text style={styles.cardDesc}>
                Scammers rely on urgency and trust. Take 30 seconds to confirm before transferring any money — it could save you thousands.
              </Text>

              <View style={styles.checklist}>
                {CHECKLIST.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggle(item.id)}
                    style={styles.checkItem}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: checked.has(item.id) }}
                    accessibilityLabel={item.label}
                  >
                    <View style={[styles.checkbox, checked.has(item.id) && styles.checkboxChecked]}>
                      {checked.has(item.id) && (
                        <Ionicons name="checkmark" size={14} color={Colors.white} />
                      )}
                    </View>
                    <Text style={[styles.checkLabel, checked.has(item.id) && styles.checkLabelChecked]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {someUnchecked && (
                <View style={styles.warning}>
                  <Ionicons name="warning-outline" size={18} color={Colors.warningOrange} />
                  <Text style={styles.warningText}>We recommend verifying all items before sending money.</Text>
                </View>
              )}

              <Button
                label={allChecked ? 'Safe to Proceed ✓' : 'Continue'}
                onPress={() => {}}
                variant={allChecked ? 'secondary' : 'primary'}
                style={{ marginTop: Spacing.md }}
              />
            </Card>
          </View>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <View>
            <Card style={styles.card} padding="lg">
              <View style={styles.cardHeader}>
                <Ionicons name="chatbubble-outline" size={28} color={Colors.trustBlue} />
                <Text style={styles.cardTitle}>Scam Message Checker</Text>
              </View>
              <Text style={styles.cardDesc}>
                Paste any suspicious WhatsApp message below. Our AI will analyze it for scam patterns.
              </Text>

              <TextInput
                style={styles.messageInput}
                placeholder="Paste the suspicious message here..."
                placeholderTextColor={Colors.textDisabled}
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
                accessibilityLabel="Suspicious message input"
              />

              <Button
                label="Analyze Message"
                onPress={analyzeMessage}
                loading={analyzing}
                disabled={!message.trim()}
                leftIcon={<Ionicons name="scan-outline" size={18} color={Colors.white} />}
              />
            </Card>

            {/* Result Card */}
            {result && result.riskLevel && (
              <Card
                style={[styles.resultCard, { backgroundColor: riskConfig[result.riskLevel].bg }]}
                padding="lg"
              >
                <View style={styles.riskHeader}>
                  <Ionicons name={riskConfig[result.riskLevel].icon} size={32} color={riskConfig[result.riskLevel].color} />
                  <View style={styles.riskLabelBox}>
                    <Text style={[styles.riskLabel, { color: riskConfig[result.riskLevel].color }]}>
                      {riskConfig[result.riskLevel].label}
                    </Text>
                    <Text style={styles.riskSub}>Risk Assessment</Text>
                  </View>
                </View>

                {result.flags.length > 0 && (
                  <View style={styles.flags}>
                    <Text style={styles.flagsTitle}>Detected Patterns:</Text>
                    {result.flags.map((flag) => (
                      <View key={flag} style={styles.flagRow}>
                        <Ionicons name="alert-circle-outline" size={16} color={riskConfig[result.riskLevel!].color} />
                        <Text style={styles.flagText}>{flag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.recommendation}>
                  <Text style={styles.recTitle}>Recommended Action</Text>
                  <Text style={styles.recText}>{result.recommendation}</Text>
                </View>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  header: { marginBottom: Spacing.lg },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: Colors.grey100, borderRadius: BorderRadius.md, padding: 4, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, alignItems: 'center' },
  activeTab: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, color: Colors.textSecondary, textAlign: 'center' },
  activeTabText: { color: Colors.trustBlue, fontFamily: FontFamily.semiBold },
  card: { marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  cardTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, flex: 1 },
  cardDesc: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.lg },
  checklist: { gap: Spacing.md },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  checkboxChecked: { backgroundColor: Colors.trustBlue, borderColor: Colors.trustBlue },
  checkLabel: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary, flex: 1, lineHeight: 22 },
  checkLabelChecked: { color: Colors.textSecondary, textDecorationLine: 'line-through' },
  warning: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: Colors.warningOrangeSurface, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  warningText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.warningOrange, lineHeight: 20 },
  messageInput: { backgroundColor: Colors.grey50, borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary, minHeight: 140, marginBottom: Spacing.md },
  resultCard: { borderRadius: BorderRadius.lg, borderWidth: 1 },
  riskHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  riskLabelBox: {},
  riskLabel: { fontSize: FontSize.lg, fontFamily: FontFamily.bold },
  riskSub: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  flags: { marginBottom: Spacing.md },
  flagsTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  flagText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textPrimary, flex: 1 },
  recommendation: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md },
  recTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  recText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20 },
});
