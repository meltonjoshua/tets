import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'primary', size = 'sm' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[`${variant}Badge`], styles[`${size}Badge`]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  primaryBadge: { backgroundColor: Colors.primary[50] },
  successBadge: { backgroundColor: Colors.success.light },
  warningBadge: { backgroundColor: Colors.warning.light },
  dangerBadge: { backgroundColor: Colors.danger.light },
  infoBadge: { backgroundColor: Colors.info.light },
  grayBadge: { backgroundColor: Colors.gray[100] },
  smBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs / 2 },
  mdBadge: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  text: {
    fontWeight: Typography.fontWeights.medium,
  },
  primaryText: { color: Colors.primary[700] },
  successText: { color: Colors.success.dark },
  warningText: { color: Colors.warning.dark },
  dangerText: { color: Colors.danger.dark },
  infoText: { color: Colors.info.dark },
  grayText: { color: Colors.gray[600] },
  smText: { fontSize: Typography.fontSizes.xs },
  mdText: { fontSize: Typography.fontSizes.sm },
});