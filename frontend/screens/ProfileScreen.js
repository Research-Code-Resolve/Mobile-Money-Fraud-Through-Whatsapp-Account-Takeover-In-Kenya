import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Switch, SafeAreaView, Dimensions, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authService from '../services/authService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 20;
const RESPONSIVE_BREAKPOINT = 380;

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  const SecurityScoreCard = () => {
    const score = 72;
    const level = score < 50 ? 'Low' : score < 75 ? 'Medium' : 'Strong';
    const color = score < 50 ? '#D32F2F' : score < 75 ? '#EF6C00' : '#2E7D32';
    const bgColor = score < 50 ? '#FFEBEE' : score < 75 ? '#FFF3E0' : '#E8F5E9';
    
    return (
      <View style={[styles.scoreCard, { backgroundColor: bgColor, borderColor: color }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.scoreLabel}>Security Score</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginVertical: 8 }}>
            <Text style={[styles.scoreValue, { color }]}>{score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
            <View style={[styles.levelBadge, { backgroundColor: color }]}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: color }]} />
          </View>
          <Text style={styles.scoreHint}>
            {score < 75 ? '⚠️ Add safe word and trusted contacts' : '✓ You\'re well protected'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.improveBtn, { backgroundColor: color }]}
          onPress={() => navigation.navigate('SafeWord')}
        >
          <Text style={styles.improveBtnText}>Improve</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const Row = ({ icon, label, value, onPress, danger, isSwitch, switchVal, onSwitch, badge }) => (
    <TouchableOpacity 
      style={styles.row} 
      onPress={onPress} 
      disabled={isSwitch} 
      activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, danger && { backgroundColor: '#FFEBEE' }]}>
        <Ionicons name={icon} size={20} color={danger ? '#D32F2F' : '#6B7280'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: '#D32F2F' }]}>{label}</Text>
        {value && !isSwitch && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      <View style={styles.rowRight}>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
        {isSwitch ? (
          <Switch 
            value={switchVal} 
            onValueChange={onSwitch} 
            trackColor={{ false: '#D1D5DB', true: '#1565C0' }} 
            thumbColor="#fff"
            ios_backgroundColor="#D1D5DB"
          />
        ) : (
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Jane Wanjiku</Text>
            <Text style={styles.contact}>jane.wanjiku@email.com</Text>
            <Text style={styles.contact}>+254 712 345 678</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color="#1565C0" />
          </TouchableOpacity>
        </View>

        {/* Security Score */}
        <SecurityScoreCard />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('MessageAnalyzer')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="shield-checkmark" size={24} color="#1565C0" />
            </View>
            <Text style={styles.quickActionText}>Analyze</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('NumberCheck')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="search" size={24} color="#EF6C00" />
            </View>
            <Text style={styles.quickActionText}>Check</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Learn')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="book" size={24} color="#2E7D32" />
            </View>
            <Text style={styles.quickActionText}>Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Emergency')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="alert-circle" size={24} color="#D32F2F" />
            </View>
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>Security & Protection</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="key" 
              label="Family Safe Word" 
              value={null}
              onPress={() => navigation.navigate('SafeWord')} 
            />
            <View style={styles.divider} />
            <Row 
              icon="people" 
              label="Trusted Contacts" 
              value="3 contacts"
              onPress={() => navigation.navigate('TrustedContacts')} 
            />
            <View style={styles.divider} />
            <Row 
              icon="finger-print" 
              label="Biometric Lock" 
              isSwitch 
              switchVal={biometrics} 
              onSwitch={setBiometrics} 
            />
            <View style={styles.divider} />
            <Row 
              icon="lock-closed" 
              label="Change PIN" 
              onPress={() => Alert.alert('Coming Soon', 'PIN change feature will be available soon')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>My Activity</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="flag" 
              label="My Reports" 
              value="2 active"
              badge="New"
              onPress={() => Alert.alert('Reports', 'View your fraud reports')}
            />
            <View style={styles.divider} />
            <Row 
              icon="time" 
              label="Verification History" 
              value="12 checks"
              onPress={() => Alert.alert('History', 'View verification history')}
            />
            <View style={styles.divider} />
            <Row 
              icon="cellular" 
              label="Blocked Numbers" 
              value="5 blocked"
              onPress={() => Alert.alert('Blocked', 'Manage blocked numbers')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="notifications" 
              label="Fraud Alerts" 
              isSwitch 
              switchVal={notifications} 
              onSwitch={setNotifications} 
            />
            <View style={styles.divider} />
            <Row 
              icon="chatbox" 
              label="SMS Alerts" 
              isSwitch 
              switchVal={true} 
              onSwitch={() => {}} 
            />
            <View style={styles.divider} />
            <Row 
              icon="mail" 
              label="Email Reports" 
              value="Weekly"
              onPress={() => Alert.alert('Email Reports', 'Configure email frequency')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="moon" 
              label="Dark Mode" 
              isSwitch 
              switchVal={darkMode} 
              onSwitch={setDarkMode} 
            />
            <View style={styles.divider} />
            <Row 
              icon="language" 
              label="Language" 
              value="English"
              onPress={() => Alert.alert('Language', 'Choose: English, Swahili')}
            />
            <View style={styles.divider} />
            <Row 
              icon="download" 
              label="Auto-update Fraud Database" 
              isSwitch 
              switchVal={true} 
              onSwitch={() => {}} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>Support & Info</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="help-buoy" 
              label="Help & FAQs" 
              onPress={() => Alert.alert('Help', 'Access help documentation')}
            />
            <View style={styles.divider} />
            <Row 
              icon="chatbubbles" 
              label="Contact Support" 
              onPress={() => Alert.alert('Support', 'support@guardpay.ke')}
            />
            <View style={styles.divider} />
            <Row 
              icon="star" 
              label="Rate GuardPay" 
              onPress={() => Alert.alert('Rate Us', 'Thank you for your support!')}
            />
            <View style={styles.divider} />
            <Row 
              icon="information-circle" 
              label="About GuardPay" 
              value="v1.0.0"
              onPress={() => Alert.alert('About', 'GuardPay - Protecting Kenyans from fraud')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document" size={18} color="#1565C0" />
            <Text style={styles.sectionTitle}>Legal Information</Text>
          </View>
          <View style={styles.sectionCard}>
            <Row 
              icon="shield-checkmark" 
              label="Privacy Policy" 
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <View style={styles.divider} />
            <Row 
              icon="document-text" 
              label="Terms of Service" 
              onPress={() => navigation.navigate('TermsOfService')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <Row 
              icon="log-out" 
              label="Log Out" 
              danger 
              onPress={async () => {
                Alert.alert(
                  'Log Out',
                  'Are you sure you want to log out?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Log Out', 
                      style: 'destructive', 
                      onPress: async () => {
                        const result = await authService.logout();
                        if (result.success) {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'Welcome' }],
                          });
                        }
                      } 
                    },
                  ]
                );
              }} 
            />
          </View>
        </View>

        <Text style={styles.footer}>GuardPay v1.0.0 • Made in Kenya 🇰🇪</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { 
    flex: 1, 
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : CARD_PADDING,
  },

  // Profile Header
  profileHeader: {
    backgroundColor: '#fff', 
    borderRadius: 18, 
    padding: 18,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14,
    marginTop: 20, 
    marginBottom: 16,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 64, 
    height: 64, 
    borderRadius: 32,
    backgroundColor: '#1565C0', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E3F2FD',
  },
  name: { 
    fontSize: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 18 : 20, 
    fontWeight: '700', 
    color: '#1F2937',
    marginBottom: 4,
  },
  contact: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  editBtn: { 
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
  },

  // Security Score Card
  scoreCard: {
    borderRadius: 16, 
    padding: 18,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 14, 
    marginBottom: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  scoreLabel: { 
    fontSize: 13, 
    color: '#6B7280', 
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreValue: { 
    fontSize: 32, 
    fontWeight: '700',
  },
  scoreMax: { fontSize: 16, color: '#9CA3AF', fontWeight: '600' },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  levelText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  progressBar: { 
    height: 8, 
    backgroundColor: 'rgba(0,0,0,0.1)', 
    borderRadius: 4, 
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: 8, borderRadius: 4 },
  scoreHint: { fontSize: 12, color: '#374151', fontWeight: '500' },
  improveBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
  },
  improveBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#1F2937',
  },
  sectionCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  // Row
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 12 : 14,
    minHeight: 60,
  },
  rowIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  rowLabel: { 
    fontSize: 15, 
    color: '#1F2937',
    fontWeight: '500',
  },
  rowValue: { 
    fontSize: 13, 
    color: '#6B7280',
    marginTop: 2,
  },
  rowRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
    marginLeft: 'auto',
  },
  badge: {
    backgroundColor: '#EF6C00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginLeft: 66,
  },

  // Footer
  footer: { 
    textAlign: 'center', 
    fontSize: 12, 
    color: '#9CA3AF', 
    marginTop: 8,
    marginBottom: 16,
    fontWeight: '500',
  },
});
