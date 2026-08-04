import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const ARTICLES = [
  { id: 'whatsapp-takeover', title: 'WhatsApp Account Takeover', icon: 'logo-whatsapp', color: Colors.securityGreen, readTime: '5 min' },
  { id: 'otp-scams', title: 'OTP Theft & How to Avoid It', icon: 'key-outline', color: Colors.trustBlue, readTime: '4 min' },
  { id: 'sim-swap', title: 'SIM Swap Fraud Explained', icon: 'phone-portrait-outline', color: Colors.warningOrange, readTime: '6 min' },
  { id: 'impersonation', title: 'Impersonation Scams', icon: 'person-outline', color: Colors.alertRed, readTime: '4 min' },
  { id: 'social-engineering', title: 'Social Engineering Tactics', icon: 'people-outline', color: Colors.trustBlue, readTime: '7 min' },
  { id: 'safe-mpesa', title: 'Safe Mobile Money Practices', icon: 'wallet-outline', color: Colors.securityGreen, readTime: '5 min' },
];

export default function LearnScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredArticles = ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Know how scams work and how to stay safe</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor={Colors.textDisabled}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Search articles"
          />
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          {[
            { label: 'All', icon: 'grid-outline' },
            { label: 'WhatsApp', icon: 'logo-whatsapp' },
            { label: 'M-PESA', icon: 'wallet-outline' },
            { label: 'Security', icon: 'shield-outline' },
          ].map((cat) => (
            <TouchableOpacity key={cat.label} style={styles.catBtn} accessibilityLabel={`Category: ${cat.label}`}>
              <Ionicons name={cat.icon as any} size={16} color={Colors.trustBlue} />
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Articles */}
        {filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            onPress={() => router.push(`/learn/${article.id}`)}
            accessibilityLabel={`Read ${article.title}`}
          >
            <Card style={styles.articleCard} padding="md">
              <View style={styles.articleRow}>
                <View style={[styles.articleIcon, { backgroundColor: article.color + '20' }]}>
                  <Ionicons name={article.icon as any} size={24} color={article.color} />
                </View>
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleMeta}>
                    <Ionicons name="time-outline" size={12} color={Colors.textDisabled} />
                    <Text style={styles.readTime}>{article.readTime} read</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.grey300} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Empty state */}
        {filteredArticles.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.grey300} />
            <Text style={styles.emptyText}>No articles found</Text>
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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginBottom: Spacing.md, height: 48, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary },
  categories: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  catBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.trustBlueSurface, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderWidth: 1, borderColor: Colors.trustBlueLight },
  catLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.trustBlue },
  articleCard: { marginBottom: Spacing.sm },
  articleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  articleIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  articleContent: { flex: 1 },
  articleTitle: { fontSize: FontSize.base, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: 4 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readTime: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textDisabled },
  empty: { alignItems: 'center', marginTop: Spacing['3xl'], gap: Spacing.sm },
  emptyText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary },
});
