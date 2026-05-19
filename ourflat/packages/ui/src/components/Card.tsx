import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, style, onPress, padding = 'md' }: CardProps) {
  const content = (
    <View style={[styles.card, styles[`${padding}Padding`], style]}>
      {children}
    </View>
  );

  return content;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function CardHeader({ title, subtitle, right }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card.light,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  nonePadding: {
    padding: 0,
  },
  smPadding: {
    padding: Spacing.sm,
  },
  mdPadding: {
    padding: Spacing.lg,
  },
  lgPadding: {
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary.light,
  },
  headerSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs / 2,
  },
});