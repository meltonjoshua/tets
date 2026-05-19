import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, EmptyState } from '@ourflat/ui';
import { Plus, PawPrint } from 'lucide-react-native';

export default function PetsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Care</Text>
        <View style={styles.addButton}>
          <Plus size={22} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.content}>
        <EmptyState
          title="No pets yet"
          message="Add your furry friends to track their feeding, walks, medications, and more."
          icon={<PawPrint size={48} color={Colors.gray[300]} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.light },
  header: {
    backgroundColor: Colors.primary[500], paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg, paddingBottom: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: '#FFFFFF' },
  addButton: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl },
});