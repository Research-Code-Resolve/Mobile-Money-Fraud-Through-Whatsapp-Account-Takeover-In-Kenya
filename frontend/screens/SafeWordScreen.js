import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 20;
const RESPONSIVE_BREAKPOINT = 380;

const SAFE_WORD_KEY = '@guardpay_safe_word';
const VERIFICATION_QUESTIONS_KEY = '@guardpay_verification_questions';

const SUGGESTED_WORDS = [
  'Mango tree', 'Nyama choma', 'Githeri', 'Chapati Tuesday',
  'Matatu 46', 'Ushago', 'Mama Mboga', 'Nairobi nights',
];

const QUESTION_TEMPLATES = [
  'What did we eat last Sunday?',
  'What\'s our family nickname for dad?',
  'Where did we go for holiday last year?',
  'What\'s the name of our childhood pet?',
  'What was mum\'s favorite song?',
];

export default function SafeWordScreen({ navigation }) {
  const [safeWord, setSafeWord] = useState('');
  const [savedSafeWord, setSavedSafeWord] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const word = await AsyncStorage.getItem(SAFE_WORD_KEY);
      const questionsData = await AsyncStorage.getItem(VERIFICATION_QUESTIONS_KEY);
      if (word) setSavedSafeWord(word);
      if (questionsData) setQuestions(JSON.parse(questionsData));
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveSafeWord = async () => {
    if (!safeWord.trim()) {
      Alert.alert('Missing safe word', 'Please enter a safe word or phrase.');
      return;
    }
    try {
      await AsyncStorage.setItem(SAFE_WORD_KEY, safeWord.trim());
      setSavedSafeWord(safeWord.trim());
      setSafeWord('');
      setShowSetup(false);
      Alert.alert('✓ Saved!', 'Your family safe word has been saved. Share it with your trusted contacts only.');
    } catch (error) {
      Alert.alert('Error', 'Could not save safe word. Please try again.');
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      Alert.alert('Missing information', 'Please enter both question and answer.');
      return;
    }
    try {
      const updated = [...questions, { id: Date.now(), question: newQuestion.trim(), answer: newAnswer.trim() }];
      await AsyncStorage.setItem(VERIFICATION_QUESTIONS_KEY, JSON.stringify(updated));
      setQuestions(updated);
      setNewQuestion('');
      setNewAnswer('');
      Alert.alert('✓ Question Added', 'Your verification question has been saved.');
    } catch (error) {
      Alert.alert('Error', 'Could not save question. Please try again.');
    }
  };

  const removeQuestion = async (id) => {
    Alert.alert(
      'Delete Question?',
      'Are you sure you want to remove this verification question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = questions.filter(q => q.id !== id);
              await AsyncStorage.setItem(VERIFICATION_QUESTIONS_KEY, JSON.stringify(updated));
              setQuestions(updated);
            } catch (error) {
              Alert.alert('Error', 'Could not remove question.');
            }
          },
        },
      ]
    );
  };

  const deleteSafeWord = () => {
    Alert.alert(
      'Delete Safe Word?',
      'Are you sure you want to delete your family safe word? This will reduce your security.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(SAFE_WORD_KEY);
              setSavedSafeWord('');
            } catch (error) {
              Alert.alert('Error', 'Could not delete safe word.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>Family Safe Word</Text>
            <Text style={styles.pageSubtitle}>Extra layer of protection</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconBox}>
            <Ionicons name="shield-checkmark" size={24} color="#1565C0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Why Safe Words?</Text>
            <Text style={styles.infoText}>
              Create a secret code word. If someone asks for money, they MUST say this word first. Scammers won't know it.
            </Text>
          </View>
        </View>

        {/* Current Safe Word or Empty State */}
        {savedSafeWord ? (
          <View style={styles.savedCard}>
            <View style={styles.savedHeader}>
              <View style={styles.savedIconBox}>
                <Ionicons name="lock-closed" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.savedLabel}>Active Safe Word</Text>
                <Text style={styles.savedStatus}>✓ Protected</Text>
              </View>
              <TouchableOpacity onPress={deleteSafeWord} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#D32F2F" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.safeWordDisplay}>
              <Ionicons name="key" size={18} color="#2E7D32" />
              <Text style={styles.safeWordText}>{savedSafeWord}</Text>
            </View>

            <View style={styles.savedFooter}>
              <Ionicons name="information-circle" size={16} color="#6B7280" />
              <Text style={styles.savedHint}>
                Share this ONLY with trusted family members. They must say it when asking for money.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="lock-open-outline" size={40} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No Safe Word Set</Text>
            <Text style={styles.emptyText}>
              Set up a secret word to verify family members before sending money
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowSetup(true)}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.primaryBtnText}>Create Safe Word</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Setup Form */}
        {showSetup && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="create" size={22} color="#1565C0" />
              <Text style={styles.cardTitle}>Create Your Safe Word</Text>
            </View>

            <Text style={styles.inputLabel}>Safe Word or Phrase</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mango tree, Githeri Friday"
              value={safeWord}
              onChangeText={setSafeWord}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.inputHint}>
              <Ionicons name="bulb-outline" size={14} color="#EF6C00" />
              <Text style={styles.hintText}>
                Use a phrase only your family knows. Mix words work best!
              </Text>
            </View>

            <Text style={styles.suggestionsTitle}>Try These Ideas:</Text>
            <View style={styles.chipsGrid}>
              {SUGGESTED_WORDS.map((word) => (
                <TouchableOpacity
                  key={word}
                  style={[styles.chip, safeWord === word && styles.chipActive]}
                  onPress={() => setSafeWord(word)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, safeWord === word && styles.chipTextActive]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.secondaryBtn, { flex: 1 }]}
                onPress={() => {
                  setShowSetup(false);
                  setSafeWord('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.primaryBtn, { flex: 1 }]} 
                onPress={saveSafeWord}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Save Word</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Verification Questions Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="help-circle" size={22} color="#1565C0" />
          <Text style={styles.sectionTitle}>Verification Questions</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Personal questions only real family can answer
        </Text>

        {questions.length > 0 && questions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            <View style={{ flex: 1 }}>
              <View style={styles.questionHeader}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#1565C0" />
                <Text style={styles.questionLabel}>Q:</Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>
              
              <View style={styles.answerHeader}>
                <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
                <Text style={styles.answerLabel}>A:</Text>
              </View>
              <Text style={styles.answerText}>{q.answer}</Text>
            </View>
            <TouchableOpacity onPress={() => removeQuestion(q.id)} style={styles.removeBtn}>
              <Ionicons name="close-circle" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add New Question */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="add" size={22} color="#1565C0" />
            <Text style={styles.cardTitle}>Add Verification Question</Text>
          </View>

          <Text style={styles.inputLabel}>Your Question</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. What's our dog's name?"
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Correct Answer</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bruno"
            value={newAnswer}
            onChangeText={setNewAnswer}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.suggestionsTitle}>Question Ideas:</Text>
          <View style={styles.templateList}>
            {QUESTION_TEMPLATES.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.templateItem}
                onPress={() => setNewQuestion(q)}
                activeOpacity={0.7}
              >
                <Ionicons name="bulb" size={16} color="#EF6C00" />
                <Text style={styles.templateText}>{q}</Text>
                <Ionicons name="arrow-forward" size={14} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, { marginTop: 16 }]} 
            onPress={addQuestion}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Add Question</Text>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={styles.howToCard}>
          <View style={styles.howToHeader}>
            <Ionicons name="book" size={20} color="#EF6C00" />
            <Text style={styles.howToTitle}>How to Use Safe Words</Text>
          </View>
          
          <View style={styles.howToStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
            <Text style={styles.stepText}>Share safe word with trusted family & friends ONLY</Text>
          </View>
          
          <View style={styles.howToStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
            <Text style={styles.stepText}>Tell them: "Always say our safe word when asking for money"</Text>
          </View>
          
          <View style={styles.howToStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
            <Text style={styles.stepText}>If they don't say it = Don't send money = Call them first</Text>
          </View>
          
          <View style={styles.howToStep}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
            <Text style={styles.stepText}>Use verification questions for extra checking</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { 
    flex: 1, 
    paddingHorizontal: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 16 : CARD_PADDING,
  },
  
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    paddingTop: 20, 
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  pageTitle: { 
    fontSize: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 24 : 28, 
    fontWeight: '700', 
    color: '#1F2937',
    marginBottom: 2,
  },
  pageSubtitle: { fontSize: 13, color: '#6B7280' },

  // Info Banner
  infoBanner: {
    flexDirection: 'row', 
    gap: 12, 
    backgroundColor: '#E3F2FD',
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 20,
    borderWidth: 1, 
    borderColor: '#BBDEFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconBox: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#374151', lineHeight: 19 },

  // Saved Card
  savedCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 20,
    borderWidth: 2, 
    borderColor: '#A5D6A7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  savedHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 14,
  },
  savedIconBox: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: '#2E7D32', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  savedLabel: { fontSize: 13, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  savedStatus: { fontSize: 12, color: '#2E7D32', fontWeight: '600' },
  deleteBtn: { 
    padding: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  safeWordDisplay: {
    flexDirection: 'row', 
    gap: 10, 
    alignItems: 'center',
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  safeWordText: { 
    fontSize: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 18 : 20, 
    fontWeight: '700', 
    color: '#1F2937',
    flex: 1,
  },
  savedFooter: {
    flexDirection: 'row', 
    gap: 8, 
    alignItems: 'flex-start',
  },
  savedHint: { flex: 1, fontSize: 12, color: '#374151', lineHeight: 18 },

  // Empty State
  emptyCard: {
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 24,
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
  },
  emptyIconBox: {
    width: 80, 
    height: 80, 
    borderRadius: 40,
    backgroundColor: '#F3F4F6', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyText: { 
    fontSize: 14, 
    color: '#6B7280', 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 20,
    paddingHorizontal: 16,
  },

  // Cards
  card: {
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 14 : 18,
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },

  // Form Elements
  inputLabel: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8, 
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5, 
    borderColor: '#E5E7EB', 
    borderRadius: 12,
    padding: SCREEN_WIDTH < RESPONSIVE_BREAKPOINT ? 12 : 14, 
    fontSize: 15, 
    color: '#1F2937', 
    backgroundColor: '#F9FAFB',
  },
  inputHint: {
    flexDirection: 'row', 
    gap: 6, 
    alignItems: 'flex-start', 
    marginTop: 8, 
    marginBottom: 4,
  },
  hintText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },

  // Suggestions & Chips
  suggestionsTitle: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#374151', 
    marginTop: 16, 
    marginBottom: 10,
  },
  chipsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#E3F2FD', 
    borderRadius: 20,
    paddingHorizontal: 14, 
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: { 
    backgroundColor: '#1565C0', 
    borderColor: '#1565C0',
  },
  chipText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#1565C0',
  },
  chipTextActive: { color: '#fff' },

  // Buttons
  btnRow: { 
    flexDirection: 'row', 
    gap: 10, 
    marginTop: 20,
  },
  primaryBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    backgroundColor: '#1565C0', 
    borderRadius: 14,
    paddingVertical: 14, 
    paddingHorizontal: 20,
  },
  primaryBtnText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#fff', 
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#E5E7EB',
  },
  secondaryBtnText: { 
    color: '#374151', 
    fontWeight: '600', 
    fontSize: 15,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  sectionDesc: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginBottom: 16, 
    lineHeight: 19,
  },

  // Question Cards
  questionCard: {
    flexDirection: 'row', 
    gap: 12, 
    backgroundColor: '#fff',
    borderRadius: 14, 
    padding: 14, 
    marginBottom: 12,
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginBottom: 6,
  },
  questionLabel: { fontSize: 12, fontWeight: '700', color: '#1565C0' },
  questionText: { 
    fontSize: 14, 
    color: '#1F2937', 
    fontWeight: '600', 
    lineHeight: 20,
    marginBottom: 10,
  },
  answerHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginBottom: 4,
  },
  answerLabel: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  answerText: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  removeBtn: { 
    padding: 4,
  },

  // Template List
  templateList: { marginBottom: 4 },
  templateItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6',
  },
  templateText: { 
    flex: 1, 
    fontSize: 13, 
    color: '#374151',
    lineHeight: 19,
  },

  // How To Card
  howToCard: {
    backgroundColor: '#FFF3E0', 
    borderRadius: 16, 
    padding: 18,
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#FFE0B2',
  },
  howToHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    marginBottom: 16,
  },
  howToTitle: { fontSize: 16, fontWeight: '700', color: '#EF6C00' },
  howToStep: {
    flexDirection: 'row', 
    gap: 12, 
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28, 
    height: 28, 
    borderRadius: 14,
    backgroundColor: '#EF6C00', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  stepNumberText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 13,
  },
  stepText: { 
    flex: 1, 
    fontSize: 13, 
    color: '#374151', 
    lineHeight: 20,
    paddingTop: 4,
  },
});
