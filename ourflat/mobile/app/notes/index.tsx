import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Card, SectionHeader, EmptyState } from '@ourflat/ui';
import { Plus, FileText, FolderOpen, StickyNote } from 'lucide-react-native';

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.primary[50] }]}>
                  <StickyNote size={20} color={Colors.primary[500]} />
                </View>
                <Text style={styles.actionLabel}>New Note</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.info.light }]}>
                  <FolderOpen size={20} color={Colors.info.main} />
                </View>
                <Text style={styles.actionLabel}>New List</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <View style={[styles.actionIcon, { backgroundColor: Colors.warning.light }]}>
                  <FileText size={20} color={Colors.warning.main} />
                </View>
                <Text style={styles.actionLabel}>Documents</Text>
              </TouchableOpacity>
            </View>

            <SectionHeader title="Pinned" />
            <Card padding="md">
              <Text style={styles.emptyText}>No pinned notes</Text>
            </Card>

            <SectionHeader title="Recent Notes" />
            <Card padding="md">
              <EmptyState
                title="No notes yet"
                message="Create your first shared note or list"
              />
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
    backgroundColor: Colors.primary[500], paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg, paddingBottom: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: '#FFFFFF' },
  addButton: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg,
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