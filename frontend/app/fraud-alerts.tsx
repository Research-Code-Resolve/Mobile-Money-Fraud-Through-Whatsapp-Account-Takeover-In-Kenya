import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const ALERTS = [
  { id: '1', title: 'New OTP Scam Circulating in Nairobi CBD', source: 'DCI Cybercrime Unit', time: '2 hours ago', severity: 'danger', location: 'Nairobi CBD', desc: 'Fraudsters are calling M-PESA users pretending to be Safaricom agents, requesting OTPs to "verify accounts".' },
  { id: '2', title: 'Fake Safaricom Customer Care Numbers', source: 'Safaricom', time: '5 hours ago', severity: 'warning', location: 'Nationwide', desc: 'Beware of numbers impersonating Safaricom support. The only official line is 0722 000 100.' },
  { id: '3', title: 'SIM Swap Fraud Surge in Westlands', source: 'CBK', time: '1 day ago', severity: 'warning', location: 'Westlands', desc: 'Reports of SIM swap fraud targeting mobile banking users have increased significantly.' },
  { id: '4', title: 'WhatsApp Impersonation Alert', source: 'Kenya Police', time: '2 days ago', severity: 'danger', location: 'Nationwide', desc: 'Criminals are taking over WhatsApp accounts and sending money requests to saved contacts.' },
];

const FILTERS = ['All', 'Nairobi CBD', 'Westlands', 'Nationwide'];

export default function FraudAlertsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ALERTS.filter((a) =>
    activeFilter === 'All' || a.location === activeFilter
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Fraud Alerts</Text>
        <Text style={styles.subtitle}>Live warnings from DCI, Safaricom, CBK and Kenya Police</Text>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filtersContent}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterBtn, activeFilter === f && styles.filterActive]}
              accessibilityLabel={`Filter by ${f}`}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((alert) => (
          <Card key={alert.id} style={styles.alertCard} padding="md">
            <View style={styles.alertTop}>
              <Badge
                label={alert.severity === 'danger' ? 'High Risk' : 'Medium Risk'}
                variant={alert.severity === 'danger' ? 'danger' : 'warning'}
              />
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertDesc}>{alert.desc}</Text>
            <View style={styles.alertFooter}>
              <View style={styles.alertSource}>
                <Ionicons name="shield-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.alertSourceText}>{alert.source}</Text>
              </View>
              <View style={styles.alertLocation}>
                <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                <Text style={styles.alertLocationText}>{alert.location}</Text>
              </View>
            </View>
          </Card>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={Colors.grey300} />
            <Text style={styles.emptyText}>No alerts for this area</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 4, marginBottom: Spacing.md },
  filters: { marginBottom: Spacing.md },
  filtersContent: { gap: Spacing.sm },
  filterBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, backgroundColor: Colors.grey100, borderWidth: 1, borderColor: Colors.border },
  filterActive: { backgroundColor: Colors.trustBlue, borderColor: Colors.trustBlue },
  filterText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  alertCard: { marginBottom: Spacing.sm },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  alertTime: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textDisabled },
  alertTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  alertDesc: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  alertFooter: { flexDirection: 'row', gap: Spacing.md },
  alertSource: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alertSourceText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  alertLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alertLocationText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  empty: { alignItems: 'center', marginTop: Spacing['3xl'], gap: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
});
