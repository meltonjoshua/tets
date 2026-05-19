import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Button, Input } from '@ourflat/ui';

export default function JoinScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join a Household</Text>
        <Text style={styles.subtitle}>
          Enter the invite code from your partner to join their household, or create a new one.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Invite Code"
          placeholder="Enter 6-character code"
          autoCapitalize="characters"
          maxLength={6}
        />

        <Button
          title="Join Household"
          variant="primary"
          fullWidth
          size="lg"
          onPress={() => {}}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Create New Household"
          variant="outline"
          fullWidth
          size="lg"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.text.primary.light,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    marginTop: Spacing.sm,
    lineHeight: Typography.fontSizes.md * Typography.lineHeights.normal,
  },
  form: {
    gap: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[300],
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
  },
});