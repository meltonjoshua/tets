import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Calendar as CalendarIcon } from 'lucide-react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>
      <View style={styles.emptyContainer}>
        <CalendarIcon size={48} color={Colors.gray[300]} />
        <Text style={styles.emptyTitle}>Shared Calendar</Text>
        <Text style={styles.emptyMessage}>
          View and manage shared events, appointments, and schedules for both partners.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text.primary.light,
    marginTop: Spacing.md,
  },
  emptyMessage: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});