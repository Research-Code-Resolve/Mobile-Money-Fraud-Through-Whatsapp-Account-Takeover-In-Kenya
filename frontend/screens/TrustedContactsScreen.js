import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, Alert, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getContacts, addContact, removeContact, subscribe } from '../services/contactsService';

const RELATIONS = ['Family', 'Friend', 'Work', 'Other'];

export default function TrustedContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState(getContacts());
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Family');

  useEffect(() => {
    const unsub = subscribe(setContacts);
    return unsub;
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing info', 'Please enter both a name and phone number.');
      return;
    }
    addContact({ name: name.trim(), phone: phone.trim(), relation });
    setName('');
    setPhone('');
    setRelation('Family');
    setModalVisible(false);
  };

  const handleRemove = (id, contactName) => {
    Alert.alert(
      'Remove contact',
      `Remove ${contactName} from trusted contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeContact(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Trusted Contacts</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="people-outline" size={22} color="#1565C0" />
          <Text style={styles.infoText}>
            These contacts will be alerted instantly if you trigger an emergency. Add the people most likely to send you money.
          </Text>
        </View>

        {contacts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="person-add-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyText}>No trusted contacts yet. Add some to enable instant alerts.</Text>
          </View>
        ) : (
          contacts.map((c) => (
            <View key={c.id} style={styles.contactCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{c.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{c.name}</Text>
                <Text style={styles.contactPhone}>{c.phone}</Text>
                <View style={styles.relationPill}>
                  <Text style={styles.relationText}>{c.relation}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemove(c.id, c.name)} style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={18} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Trusted Contact</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Trusted Contact</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mum"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +254712345678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <Text style={styles.label}>Relation</Text>
            <View style={styles.relationRow}>
              {RELATIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.relationOption, relation === r && styles.relationOptionActive]}
                  onPress={() => setRelation(r)}
                >
                  <Text style={[styles.relationOptionText, relation === r && styles.relationOptionTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleAdd}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, marginBottom: 16 },
  backBtn: { padding: 4 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  infoCard: {
    flexDirection: 'row', gap: 10, backgroundColor: '#E3F2FD',
    borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#BBDEFB',
  },
  infoText: { flex: 1, fontSize: 13, color: '#1F2937', lineHeight: 19 },
  emptyCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16,
  },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1565C0', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  contactName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  contactPhone: { fontSize: 13, color: '#6B7280', marginTop: 1 },
  relationPill: {
    alignSelf: 'flex-start', backgroundColor: '#F3F4F6',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4,
  },
  relationText: { fontSize: 11, fontWeight: '600', color: '#6B7280' },
  removeBtn: { padding: 6 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1565C0', borderRadius: 14, paddingVertical: 14, marginTop: 4,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 10,
    padding: 12, fontSize: 15, color: '#1F2937', backgroundColor: '#F9FAFB',
  },
  relationRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  relationOption: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  relationOptionActive: { borderColor: '#1565C0', backgroundColor: '#E3F2FD' },
  relationOptionText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  relationOptionTextActive: { color: '#1565C0' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  cancelBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },
  saveBtn: { backgroundColor: '#1565C0' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});