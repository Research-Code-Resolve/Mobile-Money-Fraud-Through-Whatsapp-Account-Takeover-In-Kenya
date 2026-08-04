import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Linking, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const RECOVERY_STEPS = [
  {
    step: 1,
    title: 'Recover Your WhatsApp',
    desc: 'Re-install WhatsApp and verify your phone number with the OTP sent via SMS.',
    icon: 'logo-whatsapp',
    color: Colors.securityGreen,
  },
  {
    step: 2,
    title: 'Warn Your Contacts',
    desc: 'Alert your contacts immediately so no one sends money thinking it is you.',
    icon: 'people-outline',
    color: Colors.trustBlue,
  },
  {
    step: 3,
    title: 'Secure Your M-PESA',
    desc: 'Call Safaricom on *234# or 0722 000 100 to freeze your M-PESA and change your PIN.',
    icon: 'phone-portrait-outline',
    color: Colors.warningOrange,
  },
  {
    step: 4,
    title: 'Enable Two-Step Verification',
    desc: 'In WhatsApp, go to Settings → Account → Two-step verification and set a 6-digit PIN.',
    icon: 'lock-closed-outline',
    color: Colors.trustBlue,
  },
  {
    step: 5,
    title: 'Report the Incident',
    desc: 'File a report with DCI Cybercrime Unit and Safaricom for official investigation.',
    icon: 'flag-outline',
    color: Colors.alertRed,
  },
];

const HOTLINES = [
  { name: 'DCI Cybercrime Unit', number: '0800 722 203', icon: 'shield-outline', color: Colors.trustBlue },
  { name: 'Safaricom', number: '0722 000 100', icon: 'phone-portrait-outline', color: Colors.securityGreen },
  { name: 'Kenya Police', number: '999', icon: 'call-outline', color: Colors.alertRed },
  { name: 'CBK Fraud Line', number: '0711 037 000', icon: 'business-outline', color: Colors.warningOrange },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activated, setActivated] = useState(false);

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  };

  const callNumber = (number: string, name: string) => {
    Alert.alert(`Call ${name}`, `Do you want to call ${number}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Emergency Banner */}
        <View style={styles.banner}>
          <Ionicons name="warning" size={32} color={Colors.white} />
          <Text style={styles.bannerTitle}>Emergency Recovery</Text>
          <Text style={styles.bannerSub}>Stay calm. Follow these steps to recover your account.</Text>
        </View>

        {/* Activate Button */}
        {!activated ? (
          <Card variant="danger" style={styles.activateCard} padding="lg">
            <View style={styles.activateContent}>
              <Ionicons name="alert-circle" size={40} color={Colors.alertRed} />
              <Text style={styles.activateTitle}>My WhatsApp Has Been Compromised</Text>
              <Text style={styles.activateDesc}>
                Tap below to start the recovery process and get step-by-step guidance.
              </Text>
              <Button
                label="Start Recovery Now"
                onPress={() => setActivated(true)}
                variant="danger"
                size="lg"
                leftIcon={<Ionicons name="flash" size={18} color={Colors.white} />}
              />
            </View>
          </Card>
        ) : (
          <View>
            {/* Progress */}
            <Card style={styles.progressCard} padding="md">
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Recovery Progress</Text>
                <Text style={styles.progressCount}>{completedSteps.size}/{RECOVERY_STEPS.length} steps</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(completedSteps.size / RECOVERY_STEPS.length) * 100}%` }]} />
              </View>
            </Card>

            {/* Steps */}
            {RECOVERY_STEPS.map((item) => (
              <Card key={item.step} style={styles.stepCard} padding="md">
                <TouchableOpacity
                  onPress={() => toggleStep(item.step)}
                  style={styles.stepRow}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: completedSteps.has(item.step) }}
                  accessibilityLabel={item.title}
                >
                  <View style={[styles.stepNum, completedSteps.has(item.step) && styles.stepNumDone, { borderColor: item.color }]}>
                    {completedSteps.has(item.step)
                      ? <Ionicons name="checkmark" size={16} color={Colors.white} />
                      : <Text style={[styles.stepNumText, { color: item.color }]}>{item.step}</Text>
                    }
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, completedSteps.has(item.step) && styles.stepTitleDone]}>
                      {item.title}
                    </Text>
                    <Text style={styles.stepDesc}>{item.desc}</Text>
                  </View>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={completedSteps.has(item.step) ? Colors.grey300 : item.color}
                  />
                </TouchableOpacity>

                {/* Special action for step 2 */}
                {item.step === 2 && (
                  <Button
                    label="Generate Warning Message"
                    onPress={() => router.push('/emergency/notify-contacts')}
                    variant="outline"
                    size="sm"
                    style={{ marginTop: Spacing.sm }}
                  />
                )}
                {/* Special action for step 5 */}
                {item.step === 5 && (
                  <Button
                    label="File a Report"
                    onPress={() => router.push('/report/new')}
                    variant="outline"
                    size="sm"
                    style={{ marginTop: Spacing.sm }}
                  />
                )}
              </Card>
            ))}
          </View>
        )}

        {/* Hotlines */}
        <Text style={styles.hotlineTitle}>Emergency Hotlines</Text>
        <View style={styles.hotlines}>
          {HOTLINES.map((h) => (
            <TouchableOpacity
              key={h.name}
              onPress={() => callNumber(h.number, h.name)}
              style={[styles.hotlineCard, { borderColor: h.color }]}
              accessibilityLabel={`Call ${h.name} at ${h.number}`}
            >
              <View style={[styles.hotlineIcon, { backgroundColor: h.color + '20' }]}>
                <Ionicons name={h.icon as any} size={20} color={h.color} />
              </View>
              <View style={styles.hotlineInfo}>
                <Text style={styles.hotlineName}>{h.name}</Text>
                <Text style={[styles.hotlineNum, { color: h.color }]}>{h.number}</Text>
              </View>
              <Ionicons name="call" size={18} color={h.color} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xl },
  banner: { backgroundColor: Colors.alertRed, padding: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  bannerTitle: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.white, textAlign: 'center' },
  bannerSub: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  activateCard: { margin: Spacing.lg },
  activateContent: { alignItems: 'center', gap: Spacing.md },
  activateTitle: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.alertRed, textAlign: 'center' },
  activateDesc: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  progressCard: { marginHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  progressTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  progressCount: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.trustBlue },
  progressTrack: { height: 8, backgroundColor: Colors.grey200, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: Colors.securityGreen, borderRadius: 4 },
  stepCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  stepNum: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumDone: { backgroundColor: Colors.securityGreen, borderColor: Colors.securityGreen },
  stepNumText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: 4 },
  stepTitleDone: { textDecorationLine: 'line-through', color: Colors.textSecondary },
  stepDesc: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20 },
  hotlineTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginHorizontal: Spacing.lg, marginTop: Spacing.lg, marginBottom: Spacing.md },
  hotlines: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  hotlineCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1.5, padding: Spacing.md },
  hotlineIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  hotlineInfo: { flex: 1 },
  hotlineName: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  hotlineNum: { fontSize: FontSize.base, fontFamily: FontFamily.bold, marginTop: 2 },
});
