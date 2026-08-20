// Emergency alert service.
// Sends SMS alerts to trusted contacts when account is compromised.
// For production: integrate with Africa's Talking / Twilio SMS API

import { getContacts } from './contactsService';
import { Linking, Platform } from 'react-native';

const ALERT_TEMPLATE = (name) =>
  `⚠️ FRAUD ALERT from GuardPay:\n\n${name}'s WhatsApp may be HACKED. DO NOT send money if they ask, even if urgent. Call them on their known number first.\n\nThis is an automated alert.`;

// Simulated network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send emergency alerts to all trusted contacts
 * In production, this would call backend API which sends actual SMS
 */
export async function sendEmergencyAlert(contacts, userName = 'Your contact') {
  try {
    const results = [];
    
    for (const contact of contacts) {
      await delay(300); // Simulate API call
      results.push({
        contact: contact.name,
        phone: contact.phone,
        message: ALERT_TEMPLATE(userName),
        sent: true,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      sent: results.length,
      total: contacts.length,
      results,
    };
  } catch (error) {
    return {
      success: false,
      sent: 0,
      total: contacts.length,
      error: error.message,
    };
  }
}

/**
 * Send alert using all trusted contacts
 */
export async function sendEmergencyAlerts(userName = 'Jane Wanjiku') {
  const contacts = getContacts();
  return await sendEmergencyAlert(contacts, userName);
}

/**
 * Open SMS app to manually send alert to specific contact
 */
export function openSMSAlert(contact, userName = 'Your contact') {
  const message = ALERT_TEMPLATE(userName);
  
  const smsUrl = Platform.select({
    ios: `sms:${contact.phone}&body=${encodeURIComponent(message)}`,
    android: `sms:${contact.phone}?body=${encodeURIComponent(message)}`,
  });

  Linking.openURL(smsUrl).catch(err => {
    console.error('Could not open SMS:', err);
  });
}

// Build the alert message for preview purposes
export function buildAlertMessage(name) {
  return ALERT_TEMPLATE(name);
}