import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Button, Input } from '@ourflat/ui';

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>OurFlat</Text>
        <Text style={styles.tagline}>One app. Two people. Always in sync.</Text>
      </View>

      <View style={styles.form}>
        <Button
          title="Continue with Google"
          variant="outline"
          fullWidth
          size="lg"
          onPress={() => {}}
        />

        <Button
          title="Continue with Apple"
          variant="outline"
          fullWidth
          size="lg"
          onPress={() => {}}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button title="Sign In" variant="primary" fullWidth size="lg" onPress={() => {}} />

        <Button title="Create Account" variant="ghost" fullWidth size="md" onPress={() => {}} />
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
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logo: {
    fontSize: 40,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary[500],
  },
  tagline: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    marginTop: Spacing.sm,
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