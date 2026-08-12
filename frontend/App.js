import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import VerifyScreen from './screens/VerifyScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import LearnScreen from './screens/LearnScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrustedContactsScreen from './screens/TrustedContactsScreen';
import NumberCheckScreen from './screens/NumberCheckScreen';
import MessageAnalyzerScreen from './screens/MessageAnalyzerScreen';
import SafeWordScreen from './screens/SafeWordScreen';
// Community Features
import ReportNumberScreen from './screens/ReportNumberScreen';
import CommunityFeedScreen from './screens/CommunityFeedScreen';
import NumberDetailScreen from './screens/NumberDetailScreen';
// Legal
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Verify: focused ? 'shield-checkmark' : 'shield-checkmark-outline',
            Emergency: focused ? 'warning' : 'warning-outline',
            Learn: focused ? 'book' : 'book-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Verify" component={VerifyScreen} />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ tabBarActiveTintColor: '#D32F2F' }}
      />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1565C0" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
          <Stack.Screen name="NumberCheck" component={NumberCheckScreen} />
          <Stack.Screen name="MessageAnalyzer" component={MessageAnalyzerScreen} />
          <Stack.Screen name="SafeWord" component={SafeWordScreen} />
          {/* Community Features */}
          <Stack.Screen name="ReportNumber" component={ReportNumberScreen} />
          <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
          <Stack.Screen name="NumberDetail" component={NumberDetailScreen} />
          {/* Legal */}
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
