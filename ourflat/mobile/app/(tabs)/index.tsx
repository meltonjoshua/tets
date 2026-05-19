import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@ourflat/ui';
import { Card, Badge, SectionHeader } from '@ourflat/ui';
import {
  ShoppingCart,
  CheckSquare,
  UtensilsCrossed,
  Calendar,
  Receipt,
  Package,
  Droplets,
  TrendingUp,
} from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';
import { supabase } from '../../src/services/supabase';

interface DashboardData {
  todayEvents: number;
  choresRemaining: number;
  shoppingItemCount: number;
  dinnerRecipe: string | null;
  billsDue: number;
  packagesIncoming: number;
  partnerActivity: string | null;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { household, partner } = useHousehold();
  const [data, setData] = useState<DashboardData>({
    todayEvents: 0,
    choresRemaining: 0,
    shoppingItemCount: 0,
    dinnerRecipe: null,
    billsDue: 0,
    packagesIncoming: 0,
    partnerActivity: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    if (!household) return;

    const today = new Date().toISOString().split('T')[0];

    const [choresResult, shoppingResult, billsResult, packagesResult] = await Promise.all([
      supabase
        .from('chores')
        .select('id', { count: 'exact' })
        .eq('household_id', household.id)
        .eq('is_active', true),
      supabase
        .from('shopping_items')
        .select('id', { count: 'exact' })
        .eq('checked', false)
        .in(
          'list_id',
          (await supabase.from('shopping_lists').select('id').eq('household_id', household.id))
            .data?.map((l) => l.id) ?? []
        ),
      supabase
        .from('bills')
        .select('id', { count: 'exact' })
        .eq('household_id', household.id)
        .eq('is_paid', false)
        .gte('due_date', today),
      supabase
        .from('package_deliveries')
        .select('id', { count: 'exact' })
        .eq('household_id', household.id)
        .in('status', ['pending', 'shipped', 'out_for_delivery']),
    ]);

    setData({
      todayEvents: 0,
      choresRemaining: choresResult.count ?? 0,
      shoppingItemCount: shoppingResult.count ?? 0,
      dinnerRecipe: null,
      billsDue: billsResult.count ?? 0,
      packagesIncoming: packagesResult.count ?? 0,
      partnerActivity: partner ? `${partner.profile?.display_name} was last active just now` : null,
    });
  };

  useEffect(() => {
    loadDashboard();
  }, [household]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {user?.user_metadata?.display_name?.split(' ')[0] ?? 'there'}
        </Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/shopping/new-item')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary[50] }]}>
            <ShoppingCart size={20} color={Colors.primary[500]} />
          </View>
          <Text style={styles.quickActionLabel}>Add Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/chores')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: Colors.success.light }]}>
            <CheckSquare size={20} color={Colors.success.main} />
          </View>
          <Text style={styles.quickActionLabel}>Log Chore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/meals/whats-for-dinner')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: Colors.warning.light }]}>
            <UtensilsCrossed size={20} color={Colors.warning.main} />
          </View>
          <Text style={styles.quickActionLabel}>Dinner?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => router.push('/calendar/new-event')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: Colors.info.light }]}>
            <Calendar size={20} color={Colors.info.main} />
          </View>
          <Text style={styles.quickActionLabel}>Add Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sections}>
        <SectionHeader
          title="Today"
          right={
            <TouchableOpacity onPress={() => router.push('/calendar')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        />
        <Card padding="md">
          <Text style={styles.emptySectionText}>No events today</Text>
        </Card>

        <SectionHeader
          title={`Chores (${data.choresRemaining} remaining)`}
          right={
            <TouchableOpacity onPress={() => router.push('/chores')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        />
        <Card padding="md">
          <Text style={styles.emptySectionText}>
            {data.choresRemaining > 0
              ? `${data.choresRemaining} chores left to do today`
              : 'All chores done! Great job!'}
          </Text>
        </Card>

        <SectionHeader
          title={`Shopping List (${data.shoppingItemCount} items)`}
          right={
            <TouchableOpacity onPress={() => router.push('/shopping')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        />
        <Card padding="md">
          <Text style={styles.emptySectionText}>
            {data.shoppingItemCount > 0
              ? `${data.shoppingItemCount} items on your list`
              : 'Your shopping list is empty!'}
          </Text>
        </Card>

        <SectionHeader title="Dinner Tonight" />
        <Card padding="md">
          <Text style={styles.emptySectionText}>
            {data.dinnerRecipe ?? 'No meal planned yet — let Flatmate suggest something!'}
          </Text>
        </Card>

        {(data.billsDue > 0 || data.packagesIncoming > 0) && (
          <>
            <SectionHeader title="Coming Up" />
            <Card padding="md">
              {data.billsDue > 0 && (
                <View style={styles.comingUpRow}>
                  <Receipt size={18} color={Colors.danger.main} />
                  <Text style={styles.comingUpText}>
                    {data.billsDue} bill{data.billsDue > 1 ? 's' : ''} due soon
                  </Text>
                </View>
              )}
              {data.packagesIncoming > 0 && (
                <View style={styles.comingUpRow}>
                  <Package size={18} color={Colors.info.main} />
                  <Text style={styles.comingUpText}>
                    {data.packagesIncoming} package{data.packagesIncoming > 1 ? 's' : ''} incoming
                  </Text>
                </View>
              )}
            </Card>
          </>
        )}

        {partner && data.partnerActivity && (
          <>
            <SectionHeader title={`${partner.profile?.display_name ?? 'Partner'}'s Activity`} />
            <Card padding="md">
              <Text style={styles.activityText}>{data.partnerActivity}</Text>
            </Card>
          </>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary[500],
  },
  greeting: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  date: {
    fontSize: Typography.fontSizes.md,
    color: Colors.primary[100],
    marginTop: Spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginTop: -Spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  quickActionLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary.light,
    fontWeight: Typography.fontWeights.medium,
  },
  sections: {
    paddingHorizontal: Spacing.lg,
  },
  seeAll: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary[500],
    fontWeight: Typography.fontWeights.medium,
  },
  emptySectionText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
  },
  comingUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  comingUpText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.primary.light,
  },
  activityText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
  },
  bottomSpacer: {
    height: 100,
  },
});