import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

const WARNING_MESSAGE = `⚠️ IMPORTANT NOTICE ⚠️

My WhatsApp account has been compromised by scammers.

Please IGNORE any messages from my number asking for money, OTPs, or personal information.

I am working to recover my account. I will confirm with you personally once it is secured.

DO NOT send any money to requests from my number until I confirm my account is back.

- Sent via GuardPay Emergency Alert`;

export default function NotifyContactsScreen() {
  const router = useRouter();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as const });

  const handleCopy = async () => {
    await Clipboard.setStringAsync(WARNING_MESSAGE);
    setToast({ visible: true, message: 'Message copied to clipboard!', type: 'success' });
  };

  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync('', { dialogTitle: 'Share Warning Message', UTI: 'public.plain-text' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="people" size={32} color={Colors.trustBlue} />
          </View>
          <Text style={styles.title}>Warn Your Contacts</Text>
          <Text style={styles.subtitle}>
            Share this message with your WhatsApp contacts, family groups, and friends immediately.
          </Text>
        </View>

        <Card variant="warning" style={styles.messageCard} padding="lg">
          <Text style={styles.messageLabel}>Warning Message</Text>
          <Text style={styles.messageText} selectable>{WARNING_MESSAGE}</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            label="Copy Message"
            onPress={handleCopy}
            variant="primary"
            size="lg"
            leftIcon={<Ionicons name="copy-outline" size={18} color={Colors.white} />}
          />
          <View style={{ height: Spacing.sm }} />
          <Button
            label="Share Now"
            onPress={handleShare}
            variant="secondary"
            size="lg"
            leftIcon={<Ionicons name="share-social-outline" size={18} color={Colors.white} />}
          />
        </View>

        <Card variant="flat" padding="md" style={styles.tip}>
          <View style={styles.tipRow}>
            <Ionicons name="bulb-outline" size={18} color={Colors.trustBlue} />
            <Text style={styles.tipText}>
              Share in your WhatsApp groups, with close family, and anyone who might receive a suspicious request from your number.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  iconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.trustBlueSurface, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSize['2xl'], fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginTop: Spacing.sm },
  messageCard: { marginBottom: Spacing.lg },
  messageLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.semiBold, color: Colors.warningOrange, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  messageText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textPrimary, lineHeight: 22 },
  actions: { marginBottom: Spacing.lg },
  tip: {},
  tipRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textSecondary, lineHeight: 20 },
});
