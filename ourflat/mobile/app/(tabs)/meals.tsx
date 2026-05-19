import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, Badge, SectionHeader, EmptyState } from '@ourflat/ui';
import { UtensilsCrossed, Clock, Star, ChefHat } from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';
import { supabase } from '../../src/services/supabase';

interface MealPlanEntry {
  id: string;
  date: string;
  meal_slot: string;
  servings: number;
  recipe: {
    id: string;
    title: string;
    image_url: string | null;
    total_time_minutes: number | null;
    difficulty: string;
  };
}

export default function MealsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { household } = useHousehold();
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!household) return;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const [mealPlanResult, trendingResult] = await Promise.all([
      supabase
        .from('meal_plans')
        .select('*, recipes(*)')
        .eq('household_id', household.id)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0])
        .order('date', { ascending: true }),
      supabase
        .from('recipes')
        .select('*')
        .eq('is_trending', true)
        .limit(6),
    ]);

    setMealPlan((mealPlanResult.data ?? []) as MealPlanEntry[]);
    setTrendingRecipes(trendingResult.data ?? []);
    setIsLoading(false);
  }, [household]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMeals = mealPlan.filter((m) => m.date === todayStr);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meals</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/meals/browse')}>
          <UtensilsCrossed size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <SectionHeader
              title="Tonight's Dinner"
              right={
                <TouchableOpacity onPress={() => router.push('/meals/whats-for-dinner')}>
                  <Text style={styles.seeAll}>Suggest</Text>
                </TouchableOpacity>
              }
            />
            <Card padding="md">
              {todaysMeals.filter((m) => m.meal_slot === 'dinner').length > 0 ? (
                todaysMeals
                  .filter((m) => m.meal_slot === 'dinner')
                  .map((meal) => (
                    <TouchableOpacity
                      key={meal.id}
                      onPress={() => router.push(`/meals/recipe/${meal.recipe?.id}`)}
                    >
                      <View style={styles.recipeCard}>
                        <View style={styles.recipeInfo}>
                          <Text style={styles.recipeTitle}>{meal.recipe?.title}</Text>
                          <View style={styles.recipeMeta}>
                            {meal.recipe?.total_time_minutes && (
                              <View style={styles.metaItem}>
                                <Clock size={14} color={Colors.text.secondary.light} />
                                <Text style={styles.metaText}>
                                  {meal.recipe.total_time_minutes} min
                                </Text>
                              </View>
                            )}
                            <Badge label={meal.recipe?.difficulty ?? 'easy'} variant="primary" size="sm" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
              ) : (
                <View style={styles.emptyDinner}>
                  <ChefHat size={32} color={Colors.gray[300]} />
                  <Text style={styles.emptyDinnerText}>
                    No dinner planned yet. Let Flatmate suggest something!
                  </Text>
                </View>
              )}
            </Card>

            <SectionHeader
              title="This Week"
              right={
                <TouchableOpacity onPress={() => router.push('/meals/planner')}>
                  <Text style={styles.seeAll}>View Plan</Text>
                </TouchableOpacity>
              }
            />
            <Card padding="sm">
              {mealPlan.length > 0 ? (
                mealPlan.slice(0, 3).map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={styles.weekMealRow}
                    onPress={() => router.push(`/meals/recipe/${meal.recipe?.id}`)}
                  >
                    <View style={styles.weekMealInfo}>
                      <Text style={styles.weekMealName}>{meal.recipe?.title}</Text>
                      <Badge
                        label={meal.meal_slot}
                        variant={meal.meal_slot === 'dinner' ? 'primary' : 'gray'}
                        size="sm"
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No meals planned this week</Text>
              )}
            </Card>

            {trendingRecipes.length > 0 && (
              <>
                <SectionHeader title="Trending Recipes" />
                <FlatList
                  data={trendingRecipes}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.trendingCard}
                      onPress={() => router.push(`/meals/recipe/${item.id}`)}
                    >
                      <View style={styles.trendingContent}>
                        <Text style={styles.trendingTitle} numberOfLines={2}>
                          {item.title}
                        </Text>
                        {item.total_time_minutes && (
                          <View style={styles.metaItem}>
                            <Clock size={12} color={Colors.text.secondary.light} />
                            <Text style={styles.metaText}>{item.total_time_minutes} min</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.trendingList}
                />
              </>
            )}
          </>
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
  seeAll: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary[500],
    fontWeight: Typography.fontWeights.medium,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary.light,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.text.secondary.light,
  },
  emptyDinner: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyDinnerText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
  },
  weekMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[200],
  },
  weekMealInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekMealName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.primary.light,
    flex: 1,
  },
  emptyText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
  trendingList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  trendingCard: {
    width: 180,
    backgroundColor: Colors.card.light,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Spacing,
  },
  trendingContent: {
    padding: Spacing.md,
  },
  trendingTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.text.primary.light,
  },
});