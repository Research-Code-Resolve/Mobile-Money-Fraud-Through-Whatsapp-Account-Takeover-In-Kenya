import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Shadow, Spacing } from '@/constants/Spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'danger' | 'success' | 'warning';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, style, variant = 'default', padding = 'md' }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`padding_${padding}`],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.cardBackground,
  },
  default: {
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  elevated: {
    ...Shadow.lg,
  },
  flat: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  danger: {
    backgroundColor: Colors.alertRedSurface,
    borderWidth: 1,
    borderColor: Colors.alertRedLight,
  },
  success: {
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warningOrangeSurface,
    borderWidth: 1,
    borderColor: Colors.warningOrange,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: Spacing.sm,
  },
  padding_md: {
    padding: Spacing.md,
  },
  padding_lg: {
    padding: Spacing.lg,
  },
});
