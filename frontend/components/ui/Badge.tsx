import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Spacing';
import { FontFamily, FontSize } from '@/constants/Typography';

type BadgeVariant = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'info', style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  danger: {
    backgroundColor: Colors.alertRedSurface,
    borderWidth: 1,
    borderColor: Colors.alertRedLight,
  },
  warning: {
    backgroundColor: Colors.warningOrangeSurface,
    borderWidth: 1,
    borderColor: Colors.warningOrange,
  },
  success: {
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  info: {
    backgroundColor: Colors.trustBlueSurface,
    borderWidth: 1,
    borderColor: Colors.trustBlueLight,
  },
  neutral: {
    backgroundColor: Colors.grey100,
    borderWidth: 1,
    borderColor: Colors.grey300,
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
  },
  text_danger: { color: Colors.alertRed },
  text_warning: { color: Colors.warningOrange },
  text_success: { color: Colors.securityGreen },
  text_info: { color: Colors.trustBlue },
  text_neutral: { color: Colors.textSecondary },
});
