import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
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
              Welcome to GuardPay! These Terms of Service ("Terms") govern your use of 
              the GuardPay mobile application. By using GuardPay, you agree to these Terms.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Please read carefully.</Text> If you don't agree, 
              please don't use the app.
            </Text>
          </View>

          {/* Acceptance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            
            <Text style={styles.paragraph}>
              By accessing or using GuardPay, you agree to be bound by these Terms and 
              our Privacy Policy. If you're using GuardPay on behalf of an organization, 
              you represent that you have authority to bind that organization.
            </Text>
          </View>

          {/* Service Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Service Description</Text>
            
            <Text style={styles.paragraph}>
              GuardPay is a community-powered fraud prevention platform that:
            </Text>
            
            <View style={styles.featureBox}>
              <Ionicons name="shield-checkmark" size={18} color="#1565C0" />
              <Text style={styles.featureText}>
                Allows users to check phone numbers against community fraud reports
              </Text>
            </View>
            
            <View style={styles.featureBox}>
              <Ionicons name="people" size={18} color="#1565C0" />
              <Text style={styles.featureText}>
                Enables users to report suspected fraud to protect others
              </Text>
            </View>
            
            <View style={styles.featureBox}>
              <Ionicons name="analytics" size={18} color="#1565C0" />
              <Text style={styles.featureText}>
                Provides risk scores based on community data
              </Text>
            </View>
            
            <View style={styles.featureBox}>
              <Ionicons name="school" size={18} color="#1565C0" />
              <Text style={styles.featureText}>
                Offers educational content about fraud prevention
              </Text>
            </View>
          </View>

          {/* User-Generated Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User-Generated Content</Text>
            
            <View style={styles.warningBox}>
              <Ionicons name="alert-circle" size={24} color="#EF6C00" />
              <Text style={styles.warningText}>
                IMPORTANT: All reports and comments are user-generated content. GuardPay 
                does not verify the accuracy of reports before publication.
              </Text>
            </View>
            
            <Text style={styles.subTitle}>3.1 Your Responsibility</Text>
            <Text style={styles.paragraph}>
              When you submit a report or comment, you agree that:
            </Text>
            
            <Text style={styles.paragraph}>
              • Your information is truthful and accurate to the best of your knowledge
            </Text>
            <Text style={styles.paragraph}>
              • You have personal experience or evidence for your report
            </Text>
            <Text style={styles.paragraph}>
              • You will not submit false, defamatory, or malicious reports
            </Text>
            <Text style={styles.paragraph}>
              • You will not harass, threaten, or abuse others
            </Text>
            
            <Text style={styles.subTitle}>3.2 Content Guidelines</Text>
            <Text style={styles.paragraph}>
              You may NOT post content that:
            </Text>
            
            <View style={styles.prohibitedItem}>
              <Ionicons name="close-circle" size={18} color="#D32F2F" />
              <Text style={styles.prohibitedText}>
                Is false, misleading, or defamatory
              </Text>
            </View>
            
            <View style={styles.prohibitedItem}>
              <Ionicons name="close-circle" size={18} color="#D32F2F" />
              <Text style={styles.prohibitedText}>
                Violates someone's privacy or intellectual property
              </Text>
            </View>
            
            <View style={styles.prohibitedItem}>
              <Ionicons name="close-circle" size={18} color="#D32F2F" />
              <Text style={styles.prohibitedText}>
                Contains hate speech, threats, or harassment
              </Text>
            </View>
            
            <View style={styles.prohibitedItem}>
              <Ionicons name="close-circle" size={18} color="#D32F2F" />
              <Text style={styles.prohibitedText}>
                Promotes illegal activity
              </Text>
            </View>
          </View>

          {/* Disclaimers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Disclaimers & Limitations</Text>
            
            <View style={styles.disclaimerBox}>
              <Ionicons name="information-circle" size={24} color="#1565C0" />
              <View style={{ flex: 1 }}>
                <Text style={styles.disclaimerTitle}>No Guarantee of Accuracy</Text>
                <Text style={styles.disclaimerText}>
                  GuardPay relies on community reports. We cannot guarantee the accuracy 
                  of information. Always verify independently before making financial decisions.
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimerBox}>
              <Ionicons name="information-circle" size={24} color="#1565C0" />
              <View style={{ flex: 1 }}>
                <Text style={styles.disclaimerTitle}>Not Legal or Financial Advice</Text>
                <Text style={styles.disclaimerText}>
                  GuardPay provides information only. We do not offer legal, financial, 
                  or professional advice. Consult appropriate experts for your situation.
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimerBox}>
              <Ionicons name="information-circle" size={24} color="#1565C0" />
              <View style={{ flex: 1 }}>
                <Text style={styles.disclaimerTitle}>No Liability for User Content</Text>
                <Text style={styles.disclaimerText}>
                  We are not responsible for user-submitted reports. Users are solely 
                  responsible for their own content.
                </Text>
              </View>
            </View>
          </View>

          {/* Acceptable Use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Acceptable Use Policy</Text>
            
            <Text style={styles.paragraph}>
              You agree NOT to:
            </Text>
            
            <Text style={styles.paragraph}>
              • Submit false reports to harm others
            </Text>
            <Text style={styles.paragraph}>
              • Use GuardPay for illegal purposes
            </Text>
            <Text style={styles.paragraph}>
              • Attempt to hack, disrupt, or compromise the app
            </Text>
            <Text style={styles.paragraph}>
              • Scrape or collect data for commercial purposes
            </Text>
            <Text style={styles.paragraph}>
              • Impersonate others or create fake accounts
            </Text>
            <Text style={styles.paragraph}>
              • Spam or abuse the reporting system
            </Text>
          </View>

          {/* Moderation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Content Moderation</Text>
            
            <Text style={styles.paragraph}>
              We reserve the right to:
            </Text>
            
            <View style={styles.rightBox}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.rightText}>
                Remove content that violates these Terms
              </Text>
            </View>
            
            <View style={styles.rightBox}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.rightText}>
                Suspend or ban users who abuse the platform
              </Text>
            </View>
            
            <View style={styles.rightBox}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.rightText}>
                Investigate suspicious reports
              </Text>
            </View>
            
            <View style={styles.rightBox}>
              <Ionicons name="checkmark" size={16} color="#2E7D32" />
              <Text style={styles.rightText}>
                Cooperate with law enforcement
              </Text>
            </View>
          </View>

          {/* Limitation of Liability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            
            <View style={styles.legalBox}>
              <Text style={styles.legalText}>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, GUARDPAY AND ITS DEVELOPERS SHALL 
                NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, 
                INCLUDING LOSS OF MONEY, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR 
                USE OF THE APP.
              </Text>
              
              <Text style={styles.legalText}>
                GuardPay is provided "AS IS" without warranties of any kind, express or implied.
              </Text>
            </View>
          </View>

          {/* Intellectual Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>GuardPay's IP:</Text> The GuardPay app, including 
              design, code, and trademarks, is owned by GuardPay. You may not copy, modify, 
              or distribute our app without permission.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Your Content:</Text> You retain ownership of reports 
              and comments you submit, but you grant GuardPay a license to display and 
              distribute your content to provide the service.
            </Text>
          </View>

          {/* Termination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Termination</Text>
            
            <Text style={styles.paragraph}>
              You may stop using GuardPay at any time. We may suspend or terminate your 
              access if you violate these Terms.
            </Text>
            
            <Text style={styles.paragraph}>
              Upon termination, you may request deletion of your account data by contacting 
              us at privacy@guardpay.ke.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
            
            <Text style={styles.paragraph}>
              We may update these Terms from time to time. We'll notify you of significant 
              changes by posting a notice in the app. Continued use after changes means 
              you accept the new Terms.
            </Text>
          </View>

          {/* Governing Law */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Governing Law</Text>
            
            <Text style={styles.paragraph}>
              These Terms are governed by the laws of the Republic of Kenya. Any disputes 
              will be resolved in Kenyan courts.
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Us</Text>
            
            <View style={styles.contactCard}>
              <Text style={styles.contactTitle}>Questions about these Terms?</Text>
              
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color="#1565C0" />
                <Text style={styles.contactText}>legal@guardpay.ke</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color="#1565C0" />
                <Text style={styles.contactText}>Nairobi, Kenya</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="document-text" size={24} color="#1565C0" />
            <Text style={styles.footerText}>
              By using GuardPay, you agree to these Terms. Thank you for helping protect 
              the community from fraud!
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

  // Feature Boxes
  featureBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 19,
  },

  // Warning Box
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE0B2',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
    fontWeight: '500',
  },

  // Prohibited Items
  prohibitedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
    paddingLeft: 8,
  },
  prohibitedText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },

  // Disclaimer Boxes
  disclaimerBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },

  // Rights Boxes
  rightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
    paddingLeft: 8,
  },
  rightText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },

  // Legal Box
  legalBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  legalText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 19,
    marginBottom: 10,
    fontStyle: 'italic',
  },

  // Contact Card
  contactCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
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
    backgroundColor: '#E3F2FD',
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
    color: '#1565C0',
    lineHeight: 19,
    fontWeight: '500',
  },
});
