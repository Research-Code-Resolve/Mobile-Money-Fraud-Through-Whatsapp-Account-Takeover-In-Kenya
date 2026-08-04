import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const securityScore = 72;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/welcome') },
    ]);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <Card padding="none">{children}</Card>
    </View>
  );

  const SettingRow = ({
    icon, label, value, onPress, danger = false, toggle, toggleValue, onToggle,
  }: {
    icon: string; label: string; value?: string; onPress?: () => void;
    danger?: boolean; toggle?: boolean; toggleValue?: boolean; onToggle?: (v: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={toggle}
      accessibilityLabel={label}
    >
      <View style={[styles.settingIcon, { backgroundColor: danger ? Colors.alertRedSurface : Colors.grey100 }]}>
        <Ionicons name={icon as any} size={18} color={danger ? Colors.alertRed : Colors.textSecondary} />
      </View>
      <Text style={[styles.settingLabel, danger && { color: Colors.alertRed }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {toggle
          ? <Switch value={toggleValue} onValueChange={onToggle} trackColor={{ true: Colors.trustBlue }} thumbColor={Colors.white} />
          : !toggle && <Ionicons name="chevron-forward" size={18} color={Colors.grey300} />
        }
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <Card style={styles.profileCard} padding="lg">
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JW</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jane Wanjiku</Text>
              <Text style={styles.profileEmail}>jane@example.com</Text>
              <Text style={styles.profilePhone}>+254 712 345 678</Text>
            </View>
            <TouchableOpacity accessibilityLabel="Edit profile">
              <Ionicons name="pencil-outline" size={20} color={Colors.trustBlue} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Security Score */}
        <Card style={styles.scoreCard} padding="md">
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Security Score</Text>
            <Text style={styles.scoreNum}>{securityScore}/100</Text>
          </View>
          <ProgressBar
            progress={securityScore}
            color={Colors.securityGreen}
            style={{ marginVertical: Spacing.sm }}
          />
          <Text style={styles.scoreHint}>Complete the Security Center to improve your score</Text>
          <Button
            label="Go to Security Center"
            onPress={() => {}}
            variant="outline"
            size="sm"
            style={{ marginTop: Spacing.sm }}
          />
        </Card>

        {/* Account */}
        <Section title="Account">
          <SettingRow icon="document-text-outline" label="My Reports" value="3 reports" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="bookmark-outline" label="Saved Articles" value="5 saved" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="shield-outline" label="Security Settings" onPress={() => {}} />
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <SettingRow
            icon="notifications-outline"
            label="Fraud Alerts"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            toggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
          />
          <View style={styles.divider} />
          <SettingRow icon="language-outline" label="Language" value="English" onPress={() => {}} />
        </Section>

        {/* Support */}
        <Section title="Support">
          <SettingRow icon="help-circle-outline" label="Help &amp; FAQ" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="information-circle-outline" label="About GuardPay" onPress={() => {}} />
          <View style={styles.divider} />
          <SettingRow icon="mail-outline" label="Contact Support" onPress={() => {}} />
        </Section>

        {/* Danger Zone */}
        <Section title="">
          <SettingRow icon="log-out-outline" label="Log Out" onPress={handleLogout} danger />
        </Section>

        <Text style={styles.version}>GuardPay v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  profileCard: { marginBottom: Spacing.md },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.trustBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.white },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  profilePhone: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, marginTop: 2 },
  scoreCard: { marginBottom: Spacing.lg },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary },
  scoreNum: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.securityGreen },
  scoreHint: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  section: { marginBottom: Spacing.lg },
  sectionLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  settingValue: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.lg + 36 + Spacing.md },
  version: { textAlign: 'center', fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textDisabled, marginTop: Spacing.sm },
});
