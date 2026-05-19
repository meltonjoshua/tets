import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, Badge, Checkbox, SectionHeader, EmptyState } from '@ourflat/ui';
import { Plus, Check, RotateCw, Star, Clock } from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';
import { supabase } from '../../src/services/supabase';

interface ChoreWithCompletions {
  id: string;
  title: string;
  description: string | null;
  room: string | null;
  frequency: string;
  assigned_to: string | null;
  auto_rotate: boolean;
  points: number;
  estimated_minutes: number | null;
  is_one_off: boolean;
  due_date: string | null;
  lastCompleted: string | null;
}

export default function ChoresScreen() {
  const { user } = useAuth();
  const { household, members } = useHousehold();
  const [chores, setChores] = useState<ChoreWithCompletions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine' | 'today'>('all');

  const loadChores = useCallback(async () => {
    if (!household) return;

    const { data: choresData } = await supabase
      .from('chores')
      .select('*')
      .eq('household_id', household.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (choresData) {
      const choresWithCompletions = await Promise.all(
        choresData.map(async (chore) => {
          const { data: completions } = await supabase
            .from('chore_completions')
            .select('completed_at')
            .eq('chore_id', chore.id)
            .order('completed_at', { ascending: false })
            .limit(1);

          return {
            ...chore,
            lastCompleted: completions?.[0]?.completed_at ?? null,
          };
        })
      );
      setChores(choresWithCompletions);
    }

    setIsLoading(false);
  }, [household]);

  useEffect(() => {
    loadChores();
  }, [loadChores]);

  const completeChore = async (choreId: string) => {
    if (!household || !user) return;

    await supabase.from('chore_completions').insert({
      chore_id: choreId,
      household_id: household.id,
      completed_by: user.id,
    });

    loadChores();
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      custom: 'Custom',
    };
    return labels[freq] ?? freq;
  };

  const getAssignedName = (assignedTo: string | null) => {
    if (!assignedTo) return 'Anyone';
    const member = members.find((m) => m.user_id === assignedTo);
    return member?.profile?.display_name ?? 'Partner';
  };

  const filteredChores = chores.filter((chore) => {
    if (filter === 'mine') return chore.assigned_to === user?.id || !chore.assigned_to;
    return true;
  });

  const totalPoints = chores.reduce((sum, c) => sum + c.points, 0);
  const myCompletedPoints = 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chores</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'mine', 'today'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
              {f === 'all' ? 'All' : f === 'mine' ? 'Mine' : 'Today'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pointsRow}>
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Total chores</Text>
          <Text style={styles.pointsValue}>{chores.length}</Text>
        </View>
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Total points</Text>
          <Text style={styles.pointsValue}>{totalPoints}</Text>
        </View>
      </View>

      <FlatList
        data={filteredChores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card padding="md" style={styles.choreCard}>
            <View style={styles.choreRow}>
              <View style={styles.choreInfo}>
                <View style={styles.choreTitleRow}>
                  <Text style={styles.choreTitle}>{item.title}</Text>
                  <Badge
                    label={getFrequencyLabel(item.frequency)}
                    variant={item.frequency === 'daily' ? 'primary' : 'gray'}
                    size="sm"
                  />
                </View>
                <View style={styles.choreMeta}>
                  <Text style={styles.choreMetaText}>
                    {getAssignedName(item.assigned_to)}
                  </Text>
                  {item.estimated_minutes && (
                    <>
                      <Text style={styles.choreMetaDot}> · </Text>
                      <Clock size={12} color={Colors.text.secondary.light} />
                      <Text style={styles.choreMetaText}>
                        {item.estimated_minutes}min
                      </Text>
                    </>
                  )}
                  <Text style={styles.choreMetaDot}> · </Text>
                  <Text style={styles.chorePointsText}>{item.points} pts</Text>
                </View>
                {item.room && (
                  <Badge label={item.room} variant="gray" size="sm" />
                )}
              </View>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => completeChore(item.id)}
              >
                <Check size={18} color={Colors.success.main} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No chores yet"
            message="Add your first chore to start keeping track of household tasks"
          />
        }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontWeight: Typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  activeFilter: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
    color: Colors.text.secondary.light,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  pointsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  pointsCard: {
    flex: 1,
    backgroundColor: Colors.card.light,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary.light,
  },
  pointsValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary[500],
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    paddingTop: Spacing.md,
  },
  choreCard: {
    marginBottom: Spacing.sm,
  },
  choreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  choreInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  choreTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  choreTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary.light,
  },
  choreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  choreMetaText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary.light,
  },
  choreMetaDot: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray[300],
  },
  chorePointsText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.primary[500],
    fontWeight: Typography.fontWeights.semibold,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
});