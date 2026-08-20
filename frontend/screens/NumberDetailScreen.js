import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getNumberStats, getReportsForNumber, getComments,
  addComment, addReaction, FRAUD_TYPES,
} from '../services/communityService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_BREAKPOINT = 380;

export default function NumberDetailScreen({ navigation, route }) {
  const { phoneNumber } = route.params;
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Reload data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setIsLoading(true);
    const [statsData, reportsData, commentsData] = await Promise.all([
      getNumberStats(phoneNumber),
      getReportsForNumber(phoneNumber),
      getComments(phoneNumber),
    ]);
    setStats(statsData);
    setReports(reportsData);
    setComments(commentsData);
    setIsLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Empty Comment', 'Please write something first');
      return;
    }

    const result = await addComment(phoneNumber, newComment.trim());
    
    if (result.success) {
      setComments([...comments, result.comment]);
      setNewComment('');
      Alert.alert('✓ Comment Added', 'Thank you for contributing!');
    } else {
      Alert.alert('Error', 'Could not add comment');
    }
  };

  const handleReaction = async (reportId, reactionType) => {
    const result = await addReaction(reportId, reactionType);
    if (result.success) {
      // Reload data to show new reaction count
      await loadData();
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#D32F2F';
    if (score >= 50) return '#EF6C00';
    if (score >= 30) return '#FFA726';
    return '#9CA3AF';
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return 'VERY HIGH RISK';
    if (score >= 50) return 'HIGH RISK';
    if (score >= 30) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  const getFraudTypeInfo = (typeId) => {
    return FRAUD_TYPES.find(t => t.id === typeId) || FRAUD_TYPES[FRAUD_TYPES.length - 1];
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (isLoading || !stats) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color="#9CA3AF" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const riskColor = getRiskColor(stats.riskScore);
  const fraudType = getFraudTypeInfo(stats.mostCommonFraudType);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Number Details</Text>
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </View>
          <TouchableOpacity
            style={styles.reportMoreBtn}
            onPress={() => navigation.navigate('ReportNumber', { phoneNumber })}
          >
            <Ionicons name="flag" size={18} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Risk Score Card */}
          <View style={[styles.riskCard, { backgroundColor: riskColor + '10', borderColor: riskColor }]}>
            <View style={styles.riskHeader}>
              <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                <Text style={styles.riskScoreText}>{stats.riskScore}</Text>
                <Text style={styles.riskScoreLabel}>Risk</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.riskLabel, { color: riskColor }]}>
                  {getRiskLabel(stats.riskScore)}
                </Text>
                <Text style={styles.riskDesc}>
                  {stats.reportCount} {stats.reportCount === 1 ? 'report' : 'reports'} • {formatDate(stats.lastReportDate)}
                </Text>
              </View>
            </View>

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color={riskColor} />
              <Text style={styles.warningText}>
                {stats.riskScore >= 70
                  ? 'DO NOT send money to this number. Confirmed scam reports.'
                  : stats.riskScore >= 50
                  ? 'High risk. Verify carefully before any transactions.'
                  : stats.riskScore >= 30
                  ? 'Proceed with caution. Multiple reports filed.'
                  : 'Some concerns reported. Stay alert.'}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="flag" size={24} color="#D32F2F" />
              </View>
              <Text style={styles.statValue}>{stats.reportCount}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="chatbubbles" size={24} color="#1565C0" />
              </View>
              <Text style={styles.statValue}>{stats.commentCount}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: fraudType.color + '15' }]}>
                <Ionicons name={fraudType.icon} size={24} color={fraudType.color} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {fraudType.label.split(' ')[0]}
              </Text>
              <Text style={styles.statLabel}>Type</Text>
            </View>
          </View>

          {/* Reports Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#1565C0" />
              <Text style={styles.sectionTitle}>Community Reports ({reports.length})</Text>
            </View>

            {reports.map((report) => {
              const reportFraudType = getFraudTypeInfo(report.fraudType);
              return (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={[styles.reportIcon, { backgroundColor: reportFraudType.color + '15' }]}>
                      <Ionicons name={reportFraudType.icon} size={20} color={reportFraudType.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reportType}>{reportFraudType.label}</Text>
                      <Text style={styles.reportMeta}>
                        By {report.userName} • {formatDate(report.timestamp)}
                      </Text>
                    </View>
                    {report.hasEvidence && (
                      <View style={styles.evidenceBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
                        <Text style={styles.evidenceText}>Evidence</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reportDescription}>{report.description}</Text>

                  {report.amount && (
                    <View style={styles.amountBox}>
                      <Ionicons name="cash" size={16} color="#D32F2F" />
                      <Text style={styles.amountText}>Lost: KES {report.amount.toLocaleString()}</Text>
                    </View>
                  )}

                  {/* Reactions */}
                  <View style={styles.reactionsRow}>
                    <TouchableOpacity
                      style={styles.reactionBtn}
                      onPress={() => handleReaction(report.id, 'confirmed')}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                      <Text style={styles.reactionText}>Confirmed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reactionBtn}
                      onPress={() => handleReaction(report.id, 'helpful')}
                    >
                      <Ionicons name="thumbs-up" size={18} color="#1565C0" />
                      <Text style={styles.reactionText}>Helpful</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.reactionBtn}
                      onPress={() => handleReaction(report.id, 'disputed')}
                    >
                      <Ionicons name="alert-circle" size={18} color="#EF6C00" />
                      <Text style={styles.reactionText}>Disputed</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Comments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={20} color="#1565C0" />
              <Text style={styles.sectionTitle}>Community Discussion ({comments.length})</Text>
            </View>

            {comments.length === 0 ? (
              <View style={styles.noComments}>
                <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsDesc}>Be the first to share your experience</Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentAvatar}>
                    <Ionicons name="person" size={20} color="#6B7280" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>{comment.userName}</Text>
                      <Text style={styles.commentTime}>{formatDate(comment.timestamp)}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Add Comment Bar */}
        <View style={styles.commentInputBar}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add your comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  pageTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 2 },
  phoneNumber: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  reportMoreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Risk Card
  riskCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  riskHeader: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  riskBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskScoreText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  riskScoreLabel: { fontSize: 11, fontWeight: '600', color: '#fff', marginTop: 2 },
  riskLabel: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  riskDesc: { fontSize: 13, color: '#6B7280' },
  warningBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  warningText: { flex: 1, fontSize: 13, color: '#374151', lineHeight: 19, fontWeight: '500' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#6B7280', textAlign: 'center' },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },

  // Report Card
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportType: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  reportMeta: { fontSize: 12, color: '#6B7280' },
  evidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  evidenceText: { fontSize: 10, fontWeight: '700', color: '#2E7D32' },
  reportDescription: { fontSize: 14, color: '#374151', lineHeight: 21, marginBottom: 12 },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFEBEE',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  amountText: { fontSize: 13, fontWeight: '700', color: '#D32F2F' },
  reactionsRow: { flexDirection: 'row', gap: 8 },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  // Comments
  noComments: { alignItems: 'center', padding: 32, backgroundColor: '#fff', borderRadius: 14 },
  noCommentsText: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginTop: 12, marginBottom: 4 },
  noCommentsDesc: { fontSize: 13, color: '#6B7280' },
  commentCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentUser: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  commentTime: { fontSize: 11, color: '#9CA3AF' },
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20 },

  // Comment Input
  commentInputBar: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#9CA3AF' },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: { fontSize: 14, color: '#6B7280', marginTop: 12 },
});
