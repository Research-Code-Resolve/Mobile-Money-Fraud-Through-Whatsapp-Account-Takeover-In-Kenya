import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Last Updated */}
          <View style={styles.updateBanner}>
            <Ionicons name="calendar" size={16} color="#6B7280" />
            <Text style={styles.updateText}>Last updated: January 2025</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              GuardPay ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information 
              when you use our mobile application.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subTitle}>1.1 Information You Provide</Text>
            <Text style={styles.paragraph}>
              • Fraud reports (phone numbers, descriptions, amounts, evidence)
            </Text>
            <Text style={styles.paragraph}>
              • Community comments and reactions
            </Text>
            <Text style={styles.paragraph}>
              • Safe word and verification questions (stored locally)
            </Text>
            <Text style={styles.paragraph}>
              • Account information (if you create an account)
            </Text>

            <Text style={styles.subTitle}>1.2 Automatically Collected Information</Text>
            <Text style={styles.paragraph}>
              • Device information (type, operating system)
            </Text>
            <Text style={styles.paragraph}>
              • App usage data (features used, frequency)
            </Text>
            <Text style={styles.paragraph}>
              • Crash reports and error logs
            </Text>
          </View>

          {/* How We Use Your Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            
            <Text style={styles.paragraph}>
              We use the information we collect to:
            </Text>
            
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Provide fraud protection services to the community
              </Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Calculate risk scores for reported phone numbers
              </Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Improve app features and user experience
              </Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Send notifications about fraud alerts (if enabled)
              </Text>
            </View>
            
            <View style={styles.bulletPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.bulletText}>
                Prevent abuse and verify report accuracy
              </Text>
            </View>
          </View>

          {/* Data Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Public Information:</Text> Fraud reports and comments 
              are visible to all GuardPay users to protect the community. Your username 
              (if provided) will be shown, but personal contact information is never shared.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Law Enforcement:</Text> We may share information with 
              police or regulatory authorities when required by Kenyan law or to prevent fraud.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>We DO NOT:</Text> Sell your data to third parties, 
              share with advertisers, or use your information for marketing purposes.
            </Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            
            <Text style={styles.paragraph}>
              We implement industry-standard security measures to protect your data:
            </Text>
            
            <View style={styles.securityCard}>
              <Ionicons name="lock-closed" size={20} color="#1565C0" />
              <Text style={styles.securityText}>
                Encrypted data transmission (HTTPS/TLS)
              </Text>
            </View>
            
            <View style={styles.securityCard}>
              <Ionicons name="shield-checkmark" size={20} color="#1565C0" />
              <Text style={styles.securityText}>
                Secure cloud storage with access controls
              </Text>
            </View>
            
            <View style={styles.securityCard}>
              <Ionicons name="eye-off" size={20} color="#1565C0" />
              <Text style={styles.securityText}>
                Safe words stored only on your device
              </Text>
            </View>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights (Kenya Data Protection Act)</Text>
            
            <Text style={styles.paragraph}>
              Under the Kenya Data Protection Act, 2019, you have the right to:
            </Text>
            
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Access:</Text> Request a copy of your data
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Rectification:</Text> Correct inaccurate information
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Erasure:</Text> Request deletion of your data
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Portability:</Text> Export your data
            </Text>
            <Text style={styles.paragraph}>
              • <Text style={styles.bold}>Withdraw Consent:</Text> Stop data processing at any time
            </Text>
            
            <Text style={styles.paragraph}>
              To exercise these rights, contact us at: privacy@guardpay.ke
            </Text>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Children's Privacy</Text>
            
            <Text style={styles.paragraph}>
              GuardPay is not intended for children under 13 years old. We do not 
              knowingly collect information from children. If you believe a child has 
              provided us with information, please contact us immediately.
            </Text>
          </View>

          {/* Data Retention */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Data Retention</Text>
            
            <Text style={styles.paragraph}>
              • Fraud reports: Retained indefinitely for community protection
            </Text>
            <Text style={styles.paragraph}>
              • Account data: Retained while account is active, deleted 90 days after closure
            </Text>
            <Text style={styles.paragraph}>
              • Usage logs: Retained for 12 months for analytics
            </Text>
          </View>

          {/* Changes to Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
            
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of 
              significant changes by posting a notice in the app or via email. Continued 
              use of GuardPay after changes means you accept the updated policy.
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Contact Us</Text>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color="#1565C0" />
                <Text style={styles.contactText}>privacy@guardpay.ke</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color="#1565C0" />
                <Text style={styles.contactText}>Nairobi, Kenya</Text>
              </View>
            </View>
            
            <Text style={styles.paragraph}>
              For data protection inquiries, you may also contact the Office of the 
              Data Protection Commissioner (ODPC) of Kenya.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={24} color="#1565C0" />
            <Text style={styles.footerText}>
              Your privacy matters. We're committed to protecting the GuardPay community.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },

  // Content
  content: { flex: 1, paddingHorizontal: 20 },

  // Update Banner
  updateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  updateText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },

  // Section
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: { fontWeight: '700', color: '#1F2937' },

  // Bullet Points
  bulletPoint: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    paddingRight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },

  // Security Cards
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },

  // Contact Card
  contactCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },

  // Footer
  footer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 19,
    fontWeight: '500',
  },
});
