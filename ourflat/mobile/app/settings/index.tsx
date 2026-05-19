import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, ListItem } from '@ourflat/ui';
import { User, Home, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { household } = useHousehold();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.user_metadata?.display_name?.[0]?.toUpperCase() ?? 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.user_metadata?.display_name ?? 'User'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Household</Text>
        <Card padding="none">
          <TouchableOpacity style={styles.settingRow}>
            <Home size={20} color={Colors.text.primary.light} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Household Name</Text>
              <Text style={styles.settingValue}>{household?.name ?? 'Not set'}</Text>
            </View>
            <ChevronRight size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <User size={20} color={Colors.text.primary.light} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Invite Code</Text>
              <Text style={styles.settingValue}>{household?.invite_code ?? '—'}</Text>
            </View>
            <ChevronRight size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Card padding="none">
          <TouchableOpacity style={styles.settingRow}>
            <Bell size={20} color={Colors.text.primary.light} />
            <Text style={styles.settingTitle}>Notifications</Text>
            <ChevronRight size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Shield size={20} color={Colors.text.primary.light} />
            <Text style={styles.settingTitle}>Privacy</Text>
            <ChevronRight size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <HelpCircle size={20} color={Colors.text.primary.light} />
            <Text style={styles.settingTitle}>Help & Support</Text>
            <ChevronRight size={18} color={Colors.gray[400]} />
          </TouchableOpacity>
        </Card>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <LogOut size={18} color={Colors.danger.main} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.light },
  header: {
    backgroundColor: Colors.primary[500], paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg, paddingBottom: Spacing.lg,
  },
  title: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: '#FFFFFF' },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    margin: Spacing.lg, padding: Spacing.lg, backgroundColor: Colors.card.light,
    borderRadius: BorderRadius.lg, ...Spacing,
  },
  avatar: {
    width: 52, height: 52, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100], alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.bold, color: Colors.primary[700] },
  profileInfo: { flex: 1 },
  profileName: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.semibold, color: Colors.text.primary.light },
  profileEmail: { fontSize: Typography.fontSizes.sm, color: Colors.text.secondary.light, marginTop: Spacing.xs / 2 },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: Typography.fontSizes.sm, fontWeight: Typography.fontWeights.semibold, color: Colors.text.secondary.light, marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.gray[200],
  },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: Typography.fontSizes.md, color: Colors.text.primary.light },
  settingValue: { fontSize: Typography.fontSizes.sm, color: Colors.text.secondary.light, marginTop: Spacing.xs / 2 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md, backgroundColor: Colors.danger.light,
  },
  signOutText: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.semibold, color: Colors.danger.main },
});