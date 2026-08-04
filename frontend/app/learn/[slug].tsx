import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

// Mock article data — backend will provide real content
const ARTICLE_DATA: Record<string, { title: string; content: string[]; warningSign: string[]; howToProtect: string[] }> = {
  'whatsapp-takeover': {
    title: 'WhatsApp Account Takeover',
    content: [
      'WhatsApp account takeover is one of the most common mobile money scams in Kenya. Fraudsters use stolen or cloned SIM cards to intercept the verification code sent when registering WhatsApp on a new device.',
      'Once they gain access, they impersonate the victim and send urgent money requests to contacts, exploiting trust and social relationships.',
    ],
    warningSign: [
      'Sudden loss of WhatsApp connectivity',
      'Unable to send or receive WhatsApp messages',
      'Contacts report receiving strange requests from your number',
      'You receive an unexpected WhatsApp verification code',
    ],
    howToProtect: [
      'Enable two-step verification in WhatsApp (Settings → Account → Two-step verification)',
      'Never share WhatsApp OTP codes with anyone',
      'Avoid registering your WhatsApp on untrusted devices',
      'Contact Safaricom immediately if you lose phone connectivity',
    ],
  },
  'otp-scams': {
    title: 'OTP Theft & How to Avoid It',
    content: [
      'One-Time Password (OTP) scams involve fraudsters tricking victims into sharing verification codes sent via SMS.',
      'These codes are used to access mobile money accounts, banking apps, or take over WhatsApp accounts.',
    ],
    warningSign: [
      'Receiving OTP codes you did not request',
      'Calls or messages asking you to share OTP codes',
      'Requests claiming to be from Safaricom or your bank',
    ],
    howToProtect: [
      'Never share OTP codes with anyone — not even customer support',
      'Treat OTP codes like your PIN — they are passwords',
      'If you receive an unexpected OTP, change your passwords immediately',
    ],
  },
};

export default function ArticleScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const article = ARTICLE_DATA[slug as string] || ARTICLE_DATA['whatsapp-takeover'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaText}>5 min read</Text>
        </View>

        {article.content.map((para, i) => (
          <Text key={i} style={styles.paragraph}>{para}</Text>
        ))}

        <Card variant="warning" style={styles.section} padding="md">
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={20} color={Colors.warningOrange} />
            <Text style={styles.sectionTitle}>Warning Signs</Text>
          </View>
          {article.warningSign.map((sign, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{sign}</Text>
            </View>
          ))}
        </Card>

        <Card variant="success" style={styles.section} padding="md">
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.securityGreen} />
            <Text style={[styles.sectionTitle, { color: Colors.securityGreen }]}>How to Protect Yourself</Text>
          </View>
          {article.howToProtect.map((step, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.listText}>{step}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Articles</Text>
          {['OTP Scams', 'SIM Swap Fraud'].map((title) => (
            <TouchableOpacity key={title} style={styles.relatedCard} accessibilityLabel={`Read ${title}`}>
              <Text style={styles.relatedText}>{title}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.trustBlue} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize['3xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, lineHeight: 36, marginBottom: Spacing.sm },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.lg },
  metaText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textSecondary },
  paragraph: { fontSize: FontSize.base, fontFamily: FontFamily.regular, color: Colors.textPrimary, lineHeight: 26, marginBottom: Spacing.md },
  section: { marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.warningOrange },
  listItem: { flexDirection: 'row', marginTop: Spacing.sm, gap: Spacing.sm },
  bullet: { fontSize: FontSize.base, fontFamily: FontFamily.bold, color: Colors.textSecondary, width: 16 },
  listText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textPrimary, lineHeight: 22 },
  relatedSection: { marginTop: Spacing.lg },
  relatedTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  relatedCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 8, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  relatedText: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, color: Colors.trustBlue },
});
