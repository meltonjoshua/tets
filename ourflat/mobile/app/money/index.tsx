import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, Badge, SectionHeader } from '@ourflat/ui';
import { Plus, ArrowUpRight, ArrowDownLeft, Receipt, CreditCard, PiggyBank } from 'lucide-react-native';

export default function MoneyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Money</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>You owe</Text>
              <Text style={styles.balanceAmount}>£0.00</Text>
              <Text style={styles.balanceSubtext}>All settled up!</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.primary[50] }]}>
                  <ArrowUpRight size={20} color={Colors.primary[500]} />
                </View>
                <Text style={styles.actionLabel}>Add Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.success.light }]}>
                  <ArrowDownLeft size={20} color={Colors.success.main} />
                </View>
                <Text style={styles.actionLabel}>Settle Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.warning.light }]}>
                  <Receipt size={20} color={Colors.warning.main} />
                </View>
                <Text style={styles.actionLabel}>Scan Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.info.light }]}>
                  <PiggyBank size={20} color={Colors.info.main} />
                </View>
                <Text style={styles.actionLabel}>Savings Goal</Text>
              </TouchableOpacity>
            </View>

            <SectionHeader title="Upcoming Bills" />
            <Card padding="md">
              <Text style={styles.emptyText}>No upcoming bills</Text>
            </Card>

            <SectionHeader title="Subscriptions" />
            <Card padding="md">
              <Text style={styles.emptyText}>No subscriptions tracked yet</Text>
            </Card>

            <SectionHeader title="Recent Expenses" />
            <Card padding="md">
              <Text style={styles.emptyText}>No expenses recorded yet</Text>
            </Card>
          </>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.light },
  header: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg,
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: '#FFFFFF' },
  addButton: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  balanceCard: {
    margin: Spacing.lg, padding: Spacing.xl, backgroundColor: Colors.success.light,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  balanceLabel: { fontSize: Typography.fontSizes.sm, color: Colors.success.dark },
  balanceAmount: { fontSize: 36, fontWeight: Typography.fontWeights.bold, color: Colors.success.main },
  balanceSubtext: { fontSize: Typography.fontSizes.md, color: Colors.success.dark, marginTop: Spacing.xs },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg,
  },
  actionCard: { alignItems: 'center', gap: Spacing.xs },
  actionIcon: {
    width: 52, height: 52, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: Typography.fontSizes.xs, color: Colors.text.secondary.light, fontWeight: Typography.fontWeights.medium },
  listContent: { paddingBottom: Spacing.xxxl },
  emptyText: { fontSize: Typography.fontSizes.md, color: Colors.text.secondary.light, textAlign: 'center' },
});