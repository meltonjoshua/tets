import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, right }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text.primary.light,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs / 2,
  },
});