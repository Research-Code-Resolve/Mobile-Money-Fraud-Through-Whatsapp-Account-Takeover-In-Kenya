import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, RefreshControl, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTopFlaggedNumbers, searchNumbers, FRAUD_TYPES } from '../services/communityService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RESPONSIVE_BREAKPOINT = 380;

export default function CommunityFeedScreen({ navigation }) {
  const [flaggedNumbers, setFlaggedNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, high-risk, recent

  useEffect(() => {
    loadFlaggedNumbers();
    
    // Add listener to reload data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadFlaggedNumbers();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFlaggedNumbers = async () => {
    setIsLoading(true);
    const numbers = await getTopFlaggedNumbers(50);
    console.log('Community Feed: Loaded', numbers.length, 'flagged numbers');
    if (numbers.length > 0) {
      console.log('First number:', numbers[0]);
    }
    setFlaggedNumbers(numbers);
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFlaggedNumbers();
    setIsRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchNumbers(query);
      setFlaggedNumbers(results);
    } else {
      await loadFlaggedNumbers();
    }
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#D32F2F';
    if (score >= 50) return '#EF6C00';
    if (score >= 30) return '#FFA726';
    return '#9CA3AF';
  };

  const getRiskLabel = (score) => {
    if (score >= 70) return 'VERY HIGH';
    if (score >= 50) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  };

  const getFraudTypeInfo = (typeId) => {
    return FRAUD_TYPES.find(t => t.id === typeId) || FRAUD_TYPES[FRAUD_TYPES.length - 1];
  };

  const getFilteredNumbers = () => {
    let filtered = [...flaggedNumbers];

    if (filter === 'high-risk') {
      filtered = filtered.filter(n => n.riskScore >= 50);
    } else if (filter === 'recent') {
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(n => n.lastReportDate >= threeDaysAgo);
    }

    return filtered;
  };

  const NumberCard = ({ numberData }) => {
    const fraudType = getFraudTypeInfo(numberData.mostCommonFraudType);
    const riskColor = getRiskColor(numberData.riskScore);
    const riskLabel = getRiskLabel(numberData.riskScore);

    return (
      <TouchableOpacity
        style={styles.numberCard}
        onPress={() => navigation.navigate('NumberDetail', { phoneNumber: numberData.phoneNumber })}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.riskBadge, { backgroundColor: riskColor + '15' }]}>
            <Text style={[styles.riskScore, { color: riskColor }]}>
              {numberData.riskScore}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.phoneNumber}>{numberData.phoneNumber}</Text>
            <View style={styles.riskLabelContainer}>
              <Ionicons name="warning" size={14} color={riskColor} />
              <Text style={[styles.riskLabel, { color: riskColor }]}>
                {riskLabel} RISK
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="flag" size={16} color="#D32F2F" />
            <Text style={styles.statText}>{numberData.reportCount} reports</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubbles" size={16} color="#1565C0" />
            <Text style={styles.statText}>{numberData.commentCount} comments</Text>
          </View>
        </View>

        {/* Fraud Type */}
        <View style={[styles.fraudTypeBadge, { backgroundColor: fraudType.color + '10' }]}>
          <Ionicons name={fraudType.icon} size={14} color={fraudType.color} />
          <Text style={[styles.fraudTypeText, { color: fraudType.color }]}>
            {fraudType.label}
          </Text>
        </View>

        {/* Recent indicator */}
        {numberData.lastReportDate && (Date.now() - numberData.lastReportDate < 3 * 24 * 60 * 60 * 1000) && (
          <View style={styles.recentBadge}>
            <Text style={styles.recentText}>Recent Activity</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const displayedNumbers = getFilteredNumbers();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Community Feed</Text>
            <Text style={styles.pageSubtitle}>{displayedNumbers.length} flagged numbers</Text>
          </View>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('ReportNumber')}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.reportBtnText}>Report</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by number or description..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {[
            { id: 'all', label: 'All Reports', icon: 'list' },
            { id: 'high-risk', label: 'High Risk', icon: 'warning' },
            { id: 'recent', label: 'Recent', icon: 'time' },
          ].map((filterOption) => (
            <TouchableOpacity
              key={filterOption.id}
              style={[
                styles.filterChip,
                filter === filterOption.id && styles.filterChipActive,
              ]}
              onPress={() => setFilter(filterOption.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={filterOption.icon}
                size={16}
                color={filter === filterOption.id ? '#fff' : '#6B7280'}
              />
              <Text
                style={[
                  styles.filterChipText,
                  filter === filterOption.id && styles.filterChipTextActive,
                ]}
              >
                {filterOption.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Numbers List */}
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {isLoading ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>Loading flagged numbers...</Text>
            </View>
          ) : displayedNumbers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No Reports Yet</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No numbers match your search'
                  : 'Be the first to report a suspicious number'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('ReportNumber')}
                >
                  <Text style={styles.emptyButtonText}>Report a Number</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            displayedNumbers.map((numberData) => (
              <NumberCard key={numberData.phoneNumber} numberData={numberData} />
            ))
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 20,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 24 : 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  pageSubtitle: { fontSize: 13, color: '#6B7280' },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  reportBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },

  // Filters
  filtersContainer: { marginBottom: 16, flexGrow: 0 },
  filtersContent: { gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: '#fff' },

  // List
  list: { flex: 1 },

  // Number Card
  numberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  riskBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskScore: { fontSize: 20, fontWeight: '700' },
  phoneNumber: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  riskLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  riskLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  fraudTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  fraudTypeText: { fontSize: 11, fontWeight: '700' },
  recentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF6C00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recentText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  emptyButton: {
    backgroundColor: '#1565C0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
