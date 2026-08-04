import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius, Shadow } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const MOCK_ALERTS = [
  { id: '1', title: 'New OTP Scam Circulating in Nairobi', source: 'DCI Cybercrime Unit', time: '2h ago', severity: 'danger' as const },
  { id: '2', title: 'Safaricom: Beware of fake customer care numbers', source: 'Safaricom', time: '5h ago', severity: 'warning' as const },
  { id: '3', title: 'SIM Swap fraud increase in Westlands', source: 'CBK', time: '1d ago', severity: 'warning' as const },
];

const QUICK_ACTIONS = [
  { icon: 'shield-checkmark-outline', label: 'Verify\nBefore Sending', route: '/verify', color: Colors.trustBlue, bg: Colors.trustBlueSurface },
  { icon: 'warning-outline', label: 'Emergency\nHelp', route: '/emergency', color: Colors.alertRed, bg: Colors.alertRedSurface },
  { icon: 'chatbubble-outline', label: 'Check\nMessage', route: '/verify', color: Colors.securityGreen, bg: Colors.securityGreenSurface },
  { icon: 'flag-outline', label: 'Report\nFraud', route: '/report/new', color: Colors.warningOrange, bg: Colors.warningOrangeSurface },
];

export default function HomeScreen() {
  const router = useRouter();
  const securityScore = 72;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient colors={[Colors.trustBlue, Colors.trustBlueDark]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.name}>Jane Wanjiku 👋</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/fraud-alerts')}
              style={styles.bellBtn}
              accessibilityLabel="Fraud alerts"
            >
              <Ionicons name="notifications-outline" size={24} color={Colors.white} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Security Score */}
          <Card style={styles.scoreCard} padding="md">
            <View style={styles.scoreRow}>
              <View style={styles.scoreLeft}>
                <Text style={styles.scoreLabel}>Security Score</Text>
                <Text style={styles.scoreValue}>{securityScore}/100</Text>
                <Text style={styles.scoreSubtext}>Good — keep improving</Text>
              </View>
              <View style={styles.scoreRight}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreCircleText}>{securityScore}</Text>
                </View>
              </View>
            </View>
            <ProgressBar
              progress={securityScore}
              color={securityScore >= 70 ? Colors.securityGreen : securityScore >= 40 ? Colors.warningOrange : Colors.alertRed}
              style={{ marginTop: Spacing.sm }}
            />
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.improveBtn}
              accessibilityLabel="Improve security score"
            >
              <Text style={styles.improveBtnText}>Improve Score →</Text>
            </TouchableOpacity>
          </Card>
        </LinearGradient>

        <View style={styles.body}>
          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => router.push(action.route as any)}
                style={[styles.actionBtn, { backgroundColor: action.bg }]}
                accessibilityLabel={action.label.replace('\n', ' ')}
              >
                <Ionicons name={action.icon as any} size={28} color={action.color} />
                <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fraud Alerts */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Fraud Alerts</Text>
            <TouchableOpacity onPress={() => router.push('/fraud-alerts')} accessibilityLabel="See all fraud alerts">
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {MOCK_ALERTS.map((alert) => (
            <Card key={alert.id} style={styles.alertCard} padding="md">
              <View style={styles.alertRow}>
                <View style={[styles.alertDot, { backgroundColor: alert.severity === 'danger' ? Colors.alertRed : Colors.warningOrange }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View style={styles.alertMeta}>
                    <Text style={styles.alertSource}>{alert.source}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                </View>
                <Badge label={alert.severity === 'danger' ? 'High' : 'Medium'} variant={alert.severity === 'danger' ? 'danger' : 'warning'} />
              </View>
            </Card>
          ))}

          {/* Fraud Stats */}
          <Card style={styles.statsCard} padding="md">
            <Text style={styles.sectionTitle}>Fraud in Kenya This Month</Text>
            <View style={styles.statsRow}>
              {[
                { label: 'Reports Filed', value: '1,247' },
                { label: 'Amount Lost', value: 'KSh 4.2M' },
                { label: 'Accounts Recovered', value: '389' },
              ].map((stat) => (
                <View key={stat.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Educational tip */}
          <Card variant="flat" style={styles.tipCard} padding="md">
            <View style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={24} color={Colors.warningOrange} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Safety Tip</Text>
                <Text style={styles.tipText}>Never share your M-PESA PIN or WhatsApp OTP with anyone — not even Safaricom agents.</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xl },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing['2xl'] },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: 'rgba(255,255,255,0.8)' },
  name: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.white },
  bellBtn: { position: 'relative', padding: Spacing.xs },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.alertRed },
  scoreCard: { marginTop: -Spacing.sm, ...Shadow.md },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  scoreLeft: { flex: 1 },
  scoreRight: {},
  scoreLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  scoreValue: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, marginTop: Spacing.xs },
  scoreSubtext: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.securityGreen, marginTop: 2 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.trustBlueSurface, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.trustBlue },
  scoreCircleText: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.trustBlue },
  improveBtn: { marginTop: Spacing.sm },
  improveBtnText: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
  body: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: { flex: 1, minWidth: '45%', borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', gap: Spacing.xs },
  actionLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, textAlign: 'center' },
  alertCard: { marginBottom: Spacing.sm },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginTop: 2, alignSelf: 'flex-start' },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  alertMeta: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  alertSource: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  alertTime: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textDisabled },
  statsCard: { marginTop: Spacing.md, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.trustBlue },
  statLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  tipCard: { marginBottom: Spacing.md },
  tipRow: { flexDirection: 'row', gap: Spacing.sm },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semiBold, color: Colors.warningOrange, marginBottom: 4 },
  tipText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20 },
});
