import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { seedDemoDataIfEmpty, seedDemoData } from '../services/demoData';
import { getAllReports } from '../services/communityService';

export default function DashboardScreen({ navigation }) {
  const [reportCount, setReportCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
    
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      checkReportCount();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadInitialData = async () => {
    // Seed demo data if empty
    await seedDemoDataIfEmpty();
    await checkReportCount();
  };

  const checkReportCount = async () => {
    const reports = await getAllReports();
    setReportCount(reports.length);
  };

  const handleSeedDemoData = async () => {
    setIsLoadingData(true);
    const result = await seedDemoData();
    setIsLoadingData(false);

    if (result.success) {
      await checkReportCount();
      Alert.alert(
        '✓ Demo Data Added',
        `Added ${result.reportsCount} fraud reports and ${result.commentsCount} comments for demonstration.\n\nCheck the Community Feed to see them!`,
        [
          { text: 'View Community Feed', onPress: () => navigation.navigate('CommunityFeed') },
          { text: 'OK' },
        ]
      );
    } else {
      Alert.alert('Error', `Failed to seed demo data: ${result.error}`);
    }
  };

  const quickActions = [
    { icon: 'shield-checkmark-outline', label: 'Verify Before\nSending', color: '#1565C0', bg: '#E3F2FD', screen: 'Verify' },
    { icon: 'scan-outline', label: 'Analyze\nMessage', color: '#6D4C41', bg: '#EFEBE9', screen: 'MessageAnalyzer' },
    { icon: 'people-outline', label: 'Community\nFeed', color: '#9C27B0', bg: '#F3E5F5', screen: 'CommunityFeed' },
    { icon: 'warning-outline', label: 'Emergency\nHelp', color: '#D32F2F', bg: '#FFEBEE', screen: 'Emergency' },
    { icon: 'key-outline', label: 'Safe Word\nSetup', color: '#2E7D32', bg: '#E8F5E9', screen: 'SafeWord' },
    { icon: 'flag-outline', label: 'Report\nNumber', color: '#EF6C00', bg: '#FFF3E0', screen: 'ReportNumber' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>Jane Wanjiku</Text>
          </View>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>JW</Text>
          </View>
        </View>

        {/* Two-sided banner */}
        <View style={styles.banner}>
          <Ionicons name="information-circle-outline" size={20} color="#1565C0" />
          <Text style={styles.bannerText}>
            <Text style={{ fontWeight: '700', color: '#D32F2F' }}>Been hacked? </Text>
            Tap Emergency.{' '}
            <Text style={{ fontWeight: '700', color: '#1565C0' }}>Got suspicious message? </Text>
            Tap Analyze.
          </Text>
        </View>

        {/* Emergency Alert Buttons */}
        <View style={styles.emergencyButtons}>
          <TouchableOpacity 
            style={styles.emergencyCardLeft}
            onPress={() => navigation.navigate('Emergency')}
            activeOpacity={0.8}
          >
            <Ionicons name="warning" size={32} color="#D32F2F" />
            <Text style={styles.emergencyTitle}>I've Been Hacked!</Text>
            <Text style={styles.emergencyDesc}>My account was compromised</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.emergencyCardRight}
            onPress={() => navigation.navigate('MessageAnalyzer')}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={32} color="#1565C0" />
            <Text style={styles.emergencyTitleBlue}>Suspicious Message</Text>
            <Text style={styles.emergencyDescBlue}>Someone asked for money</Text>
          </TouchableOpacity>
        </View>

        {/* Security status */}
        <View style={styles.securityCard}>
          <View style={styles.securityLeft}>
            <Ionicons name="alert-circle" size={28} color="#EF6C00" />
            <View>
              <Text style={styles.securityLabel}>Security status</Text>
              <Text style={styles.securityStatus}>⚠ Action needed</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={styles.reviewBtnText}>Review</Text>
          </TouchableOpacity>
        </View>

        {/* Community Protection Banner */}
        <TouchableOpacity 
          style={styles.communityBanner}
          onPress={() => navigation.navigate('CommunityFeed')}
          activeOpacity={0.8}
        >
          <View style={styles.communityIconBox}>
            <Ionicons name="people" size={28} color="#9C27B0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.communityTitle}>Community Protection</Text>
            <Text style={styles.communityDesc}>
              {reportCount > 0 
                ? `${reportCount} fraud reports from the community` 
                : 'See flagged numbers reported by the community'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9C27B0" />
        </TouchableOpacity>

        {/* Demo Data Banner (for testing) */}
        {reportCount === 0 && (
          <TouchableOpacity 
            style={styles.demoBanner}
            onPress={handleSeedDemoData}
            activeOpacity={0.8}
            disabled={isLoadingData}
          >
            <View style={styles.demoIconBox}>
              <Ionicons name="flask" size={24} color="#1565C0" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demoTitle}>
                {isLoadingData ? 'Loading Demo Data...' : 'Try Demo Data'}
              </Text>
              <Text style={styles.demoDesc}>
                Add sample fraud reports to explore app features
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#1565C0" />
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionCard, { backgroundColor: a.bg }]}
              onPress={() => {
                if (a.screen) {
                  navigation.navigate(a.screen);
                } else if (a.tab) {
                  navigation.navigate(a.tab);
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={a.icon} size={28} color={a.color} />
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent report */}
        <Text style={styles.sectionTitle}>Recent reports</Text>
        <TouchableOpacity style={styles.reportCard} activeOpacity={0.8}>
          <View>
            <Text style={styles.reportId}>Report #GP-1024</Text>
            <Text style={styles.reportType}>Account Compromise</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Under Review</Text>
          </View>
        </TouchableOpacity>

        {/* Learning card */}
        <View style={styles.learnCard}>
          <Ionicons name="bulb-outline" size={24} color="#fff" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.learnTitle}>Can you spot this scam?</Text>
            <Text style={styles.learnSub}>Test yourself with a real Nairobi scenario.</Text>
          </View>
          <TouchableOpacity
            style={styles.learnBtn}
            onPress={() => navigation.navigate('Learn')}
          >
            <Text style={styles.learnBtnText}>Try</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 24, paddingBottom: 16,
  },
  greeting: { fontSize: 14, color: '#6B7280' },
  name: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  avatarBox: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1565C0', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  banner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#E3F2FD', borderRadius: 12,
    padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#BBDEFB',
  },
  bannerText: { flex: 1, fontSize: 13, color: '#1F2937', lineHeight: 20 },
  emergencyButtons: {
    flexDirection: 'row', gap: 12, marginBottom: 16,
  },
  emergencyCardLeft: {
    flex: 1, backgroundColor: '#FFEBEE', borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 2, borderColor: '#D32F2F',
  },
  emergencyCardRight: {
    flex: 1, backgroundColor: '#E3F2FD', borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 2, borderColor: '#1565C0',
  },
  emergencyTitle: { 
    fontSize: 15, fontWeight: '700', color: '#D32F2F', 
    textAlign: 'center', marginTop: 8, marginBottom: 4,
  },
  emergencyTitleBlue: { 
    fontSize: 15, fontWeight: '700', color: '#1565C0', 
    textAlign: 'center', marginTop: 8, marginBottom: 4,
  },
  emergencyDesc: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  emergencyDescBlue: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  securityCard: {
    backgroundColor: '#FFF3E0', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, borderWidth: 1, borderColor: '#FFE0B2',
  },
  securityLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  securityLabel: { fontSize: 13, color: '#6B7280' },
  securityStatus: { fontSize: 15, fontWeight: '700', color: '#EF6C00', marginTop: 2 },
  reviewBtn: {
    backgroundColor: '#EF6C00', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 10,
  },
  reviewBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  communityBanner: {
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  communityIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9C27B0',
    marginBottom: 4,
  },
  communityDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    width: '48%', flexGrow: 1, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 18 },
  reportCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB',
  },
  reportId: { fontSize: 15, fontWeight: '700', color: '#1565C0' },
  reportType: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: {
    backgroundColor: '#FFF3E0', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: '#EF6C00' },
  learnCard: {
    backgroundColor: '#1565C0', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center',
  },
  learnTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  learnSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  learnBtn: {
    backgroundColor: '#fff', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 10,
  },
  learnBtnText: { color: '#1565C0', fontWeight: '700', fontSize: 13 },
  
  // Demo Banner
  demoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#90CAF9',
    borderStyle: 'dashed',
  },
  demoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 2,
  },
  demoDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
});
