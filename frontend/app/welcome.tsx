import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.trustBlue, Colors.trustBlueDark]}
        style={styles.gradient}
      >
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.white} />
          </View>
          <Text style={styles.appName}>GuardPay</Text>
          <Text style={styles.tagline}>Your mobile money, protected.</Text>
        </View>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: 'scan-outline', text: 'Detect scam messages instantly' },
            { icon: 'flash-outline', text: 'Emergency recovery in minutes' },
            { icon: 'book-outline', text: 'Learn to stay safe online' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={item.icon as any} size={20} color={Colors.trustBlue} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.actions}>
          <Button
            label="Create Account"
            onPress={() => router.push('/auth/register')}
            variant="secondary"
            size="lg"
          />
          <View style={styles.gap} />
          <Button
            label="Log In"
            onPress={() => router.push('/auth/login')}
            variant="outline"
            size="lg"
            style={styles.outlineBtn}
            textStyle={{ color: Colors.white }}
          />
          <View style={styles.gap} />
          <Button
            label="Continue as Guest"
            onPress={() => router.replace('/(tabs)')}
            variant="ghost"
            size="md"
            textStyle={{ color: Colors.white, opacity: 0.8 }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  logoArea: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  features: {
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: Colors.white,
    flex: 1,
  },
  actions: {
    paddingBottom: Spacing.md,
  },
  gap: {
    height: Spacing.sm,
  },
  outlineBtn: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
});
