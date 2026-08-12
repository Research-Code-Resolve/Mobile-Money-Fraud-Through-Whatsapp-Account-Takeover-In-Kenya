import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#1565C0', '#0D47A1']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.logoBox}>
          <Ionicons name="shield-checkmark" size={56} color="#fff" />
        </View>
        <Text style={styles.title}>GuardPay</Text>
        <Text style={styles.subtitle}>Your mobile money, protected.</Text>

        <View style={styles.features}>
          {[
            { icon: 'pause-circle-outline', text: 'Pause & Verify before you send money' },
            { icon: 'shield-outline', text: 'Protect yourself if your account is taken over' },
            { icon: 'book-outline', text: 'Learn to recognise fraud before it happens' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name={item.icon} size={22} color="rgba(255,255,255,0.9)" />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logoBox: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 40, marginTop: 6 },
  features: { width: '100%', gap: 16, marginBottom: 48 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureText: { fontSize: 15, color: 'rgba(255,255,255,0.9)', flex: 1, lineHeight: 22 },
  btn: {
    backgroundColor: '#fff', width: '100%',
    paddingVertical: 16, borderRadius: 16,
    alignItems: 'center',
  },
  btnText: { color: '#1565C0', fontWeight: '700', fontSize: 18 },
});
