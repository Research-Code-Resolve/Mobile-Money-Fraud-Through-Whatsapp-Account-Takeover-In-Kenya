// GuardPay Design System — Typography
import { StyleSheet } from 'react-native';

export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const Typography = StyleSheet.create({
  displayLarge: {
    fontSize: FontSize['4xl'],
    fontFamily: FontFamily.bold,
    lineHeight: FontSize['4xl'] * 1.2,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: FontSize['3xl'],
    fontFamily: FontFamily.bold,
    lineHeight: FontSize['3xl'] * 1.2,
    letterSpacing: -0.3,
  },
  headingLarge: {
    fontSize: FontSize['2xl'],
    fontFamily: FontFamily.bold,
    lineHeight: FontSize['2xl'] * 1.3,
  },
  headingMedium: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.semiBold,
    lineHeight: FontSize.xl * 1.3,
  },
  headingSmall: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    lineHeight: FontSize.lg * 1.4,
  },
  bodyLarge: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.base * 1.5,
  },
  bodyMedium: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.sm * 1.5,
  },
  bodySmall: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    lineHeight: FontSize.xs * 1.5,
  },
  labelLarge: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    lineHeight: FontSize.sm * 1.4,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    lineHeight: FontSize.xs * 1.4,
    letterSpacing: 0.5,
  },
  buttonText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    lineHeight: FontSize.base * 1.2,
    letterSpacing: 0.1,
  },
});

export default Typography;
