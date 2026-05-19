import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@ourflat/ui';
import {
  Receipt,
  CreditCard,
  ShoppingBag,
  PawPrint,
  Flower2,
  Target,
  Package,
  FileText,
  Settings,
  Bell,
  HelpCircle,
} from 'lucide-react-native';

interface MoreItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export default function MoreScreen() {
  const router = useRouter();

  const sections: MoreItem[][] = [
    [
      { id: 'money', title: 'Money & Bills', subtitle: 'Split expenses, track bills', icon: <CreditCard size={22} color={Colors.success.main} />, route: '/money', color: Colors.success.light },
      { id: 'notes', title: 'Notes & Documents', subtitle: 'Shared notes, document vault', icon: <FileText size={22} color={Colors.info.main} />, route: '/notes', color: Colors.info.light },
      { id: 'pets', title: 'Pet Care', subtitle: 'Feeding, walks, vet visits', icon: <PawPrint size={22} color={Colors.primary[500]} />, route: '/pets', color: Colors.primary[50] },
      { id: 'plants', title: 'Plant Care', subtitle: 'Watering, fertilizing', icon: <Flower2 size={22} color={Colors.success.main} />, route: '/plants', color: Colors.success.light },
    ],
    [
      { id: 'habits', title: 'Habits & Goals', subtitle: 'Track habits, set goals', icon: <Target size={22} color={Colors.warning.main} />, route: '/habits', color: Colors.warning.light },
      { id: 'packages', title: 'Packages & Errands', subtitle: 'Track deliveries, run errands', icon: <Package size={22} color={Colors.danger.main} />, route: '/packages', color: Colors.danger.light },
    ],
    [
      { id: 'notifications', title: 'Notifications', subtitle: 'Manage alerts', icon: <Bell size={22} color={Colors.gray[500]} />, route: '/notifications', color: Colors.gray[100] },
      { id: 'settings', title: 'Settings', subtitle: 'Account, household, preferences', icon: <Settings size={22} color={Colors.gray[500]} />, route: '/settings', color: Colors.gray[100] },
      { id: 'help', title: 'Help & Feedback', subtitle: 'Support, suggestions', icon: <HelpCircle size={22} color={Colors.gray[500]} />, route: '/help', color: Colors.gray[100] },
    ],
  ];

  const renderItem = ({ item }: { item: MoreItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(item.route as any)}
      activeOpacity={0.7}
    >
      <View style={[styles.itemIcon, { backgroundColor: item.color }]}>{item.icon}</View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.chevron}>{'\u203A'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      <FlatList
        data={sections.flatMap((section, i) => [
          ...section.map((item) => ({ ...item, sectionIndex: i })),
        ] as any[]}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card.light,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary.light,
  },
  itemSubtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs / 2,
  },
  chevron: {
    fontSize: 20,
    color: Colors.gray[400],
  },
  separator: {
    height: Spacing.xs,
  },
});