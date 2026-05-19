import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@ourflat/ui';
import { Button, Card, Input, Checkbox, Badge, EmptyState } from '@ourflat/ui';
import { Plus, ShoppingCart, Trash2, Check } from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';
import { supabase } from '../../src/services/supabase';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string | null;
  category: string | null;
  priority: boolean;
  checked: boolean;
  assigned_to: string | null;
  notes: string | null;
}

interface ShoppingListData {
  id: string;
  name: string;
  items: ShoppingItem[];
}

export default function ShoppingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { household } = useHousehold();
  const [lists, setLists] = useState<ShoppingListData[]>([]);
  const [activeList, setActiveList] = useState<ShoppingListData | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadLists = useCallback(async () => {
    if (!household) return;

    const { data: listsData } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('household_id', household.id)
      .order('sort_order', { ascending: true });

    if (listsData && listsData.length > 0) {
      const listsWithItems = await Promise.all(
        listsData.map(async (list) => {
          const { data: items } = await supabase
            .from('shopping_items')
            .select('*')
            .eq('list_id', list.id)
            .order('created_at', { ascending: true });

          return { ...list, items: items ?? [] };
        })
      );

      setLists(listsWithItems);
      setActiveList(listsWithItems[0]);
    }

    setIsLoading(false);
  }, [household]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const toggleItem = async (itemId: string, checked: boolean) => {
    await supabase.from('shopping_items').update({ checked: !checked }).eq('id', itemId);
    if (activeList) {
      setActiveList({
        ...activeList,
        items: activeList.items.map((item) =>
          item.id === itemId ? { ...item, checked: !checked } : item
        ),
      });
    }
  };

  const addItem = async () => {
    if (!newItemName.trim() || !activeList) return;

    const { data } = await supabase
      .from('shopping_items')
      .insert({
        list_id: activeList.id,
        name: newItemName.trim(),
        quantity: 1,
        created_by: user!.id,
      })
      .select()
      .single();

    if (data) {
      setActiveList({
        ...activeList,
        items: [...activeList.items, data as ShoppingItem],
      });
      setNewItemName('');
    }
  };

  const clearCompleted = async () => {
    if (!activeList) return;

    Alert.alert('Clear completed items?', 'This will remove all checked items.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await supabase
            .from('shopping_items')
            .delete()
            .eq('list_id', activeList.id)
            .eq('checked', true);
          loadLists();
        },
      },
    ]);
  };

  const uncheckedItems = activeList?.items.filter((i) => !i.checked) ?? [];
  const checkedItems = activeList?.items.filter((i) => i.checked) ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping</Text>
        <View style={styles.tabRow}>
          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              style={[
                styles.tab,
                activeList?.id === list.id && styles.activeTab,
              ]}
              onPress={() => setActiveList(list)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeList?.id === list.id && styles.activeTabText,
                ]}
              >
                {list.name}
              </Text>
              {list.items.filter((i) => !i.checked).length > 0 && (
                <Badge
                  label={String(list.items.filter((i) => !i.checked).length)}
                  variant="primary"
                  size="sm"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.addRow}>
        <Input
          placeholder="Add item..."
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={addItem}
          containerStyle={styles.addInput}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Plus size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={uncheckedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => toggleItem(item.id, item.checked)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
              {item.checked && <Check size={14} color="#FFFFFF" />}
            </View>
            <View style={styles.itemContent}>
              <Text style={[styles.itemName, item.priority && styles.priorityItem]}>
                {item.name}
              </Text>
              {item.quantity > 1 && (
                <Text style={styles.itemQuantity}>
                  {item.quantity} {item.unit}
                </Text>
              )}
            </View>
            {item.priority && <Badge label="!" variant="danger" size="sm" />}
          </TouchableOpacity>
        )}
        ListFooterComponent={
          checkedItems.length > 0 ? (
            <View style={styles.completedSection}>
              <TouchableOpacity
                onPress={clearCompleted}
                style={styles.clearButton}
              >
                <Trash2 size={14} color={Colors.danger.main} />
                <Text style={styles.clearText}>Clear completed ({checkedItems.length})</Text>
              </TouchableOpacity>
              {checkedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemRow, styles.completedItem]}
                  onPress={() => toggleItem(item.id, item.checked)}
                >
                  <View style={[styles.checkbox, styles.checkboxChecked]}>
                    <Check size={14} color="#FFFFFF" />
                  </View>
                  <Text style={styles.completedItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
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
  tabRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: Typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: Typography.fontWeights.medium,
  },
  activeTabText: {
    color: Colors.primary[600],
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray[200],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.primary.light,
  },
  priorityItem: {
    fontWeight: Typography.fontWeights.semibold,
  },
  itemQuantity: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.text.secondary.light,
  },
  completedSection: {
    marginTop: Spacing.lg,
  },
  completedItem: {
    opacity: 0.6,
  },
  completedItemText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.text.secondary.light,
    textDecorationLine: 'line-through',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  clearText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.danger.main,
  },
});