import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const toastConfig = {
  success: { bg: Colors.successSurface, border: Colors.success, icon: 'checkmark-circle' as const, color: Colors.securityGreen },
  error: { bg: Colors.alertRedSurface, border: Colors.alertRed, icon: 'close-circle' as const, color: Colors.alertRed },
  warning: { bg: Colors.warningOrangeSurface, border: Colors.warningOrange, icon: 'warning' as const, color: Colors.warningOrange },
  info: { bg: Colors.trustBlueSurface, border: Colors.trustBlue, icon: 'information-circle' as const, color: Colors.trustBlue },
};

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const config = toastConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(duration),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor: config.bg, borderColor: config.border }]}>
      <Ionicons name={config.icon} size={20} color={config.color} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    zIndex: 9999,
    ...Shadow.lg,
  },
  message: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
});
