import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@ourflat/ui';
import { Send, Bot, Sparkles } from 'lucide-react-native';
import { useAuth } from '../../src/providers/AuthProvider';
import { useHousehold } from '../../src/providers/HouseholdProvider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FlatmateScreen() {
  const { household } = useHousehold();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm Flatmate, your AI assistant. I can help you with meal planning, chore scheduling, shopping suggestions, and more. What would you like help with?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_AI_ENDPOINT ?? '/api/flatmate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          household_id: household?.id,
          history: messages.slice(-10),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply ?? "I'm still learning! Try asking me about meal planning, shopping, or chore schedules.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What's for dinner?",
    "Add milk to shopping list",
    "What chores are due today?",
    "Any bills coming up?",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botIcon}>
            <Sparkles size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.title}>Flatmate</Text>
            <Text style={styles.subtitle}>Your AI assistant</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            {item.role === 'assistant' && (
              <View style={styles.messageAvatar}>
                <Bot size={16} color={Colors.primary[500]} />
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesContent}
        inverted={false}
      />

      {messages.length === 1 && (
        <View style={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionChip}
              onPress={() => {
                setInput(suggestion);
              }}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask Flatmate anything..."
          placeholderTextColor={Colors.gray[400]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          editable={!isLoading}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || isLoading}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.light },
  header: {
    backgroundColor: Colors.primary[500], paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl + Spacing.lg, paddingBottom: Spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  botIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: Typography.fontSizes.xl, fontWeight: Typography.fontWeights.bold, color: '#FFFFFF' },
  subtitle: { fontSize: Typography.fontSizes.sm, color: Colors.primary[100] },
  messagesContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: Spacing.xl },
  message: { flexDirection: 'row', marginBottom: Spacing.md, alignItems: 'flex-end' },
  userMessage: { justifyContent: 'flex-end' },
  assistantMessage: { justifyContent: 'flex-start' },
  messageAvatar: {
    width: 28, height: 28, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  messageBubble: { maxWidth: '75%', borderRadius: BorderRadius.lg, padding: Spacing.md },
  userBubble: { backgroundColor: Colors.primary[500] },
  assistantBubble: { backgroundColor: Colors.gray[100] },
  messageText: { fontSize: Typography.fontSizes.md, lineHeight: Typography.fontSizes.md * 1.5 },
  userMessageText: { color: '#FFFFFF' },
  assistantMessageText: { color: Colors.text.primary.light },
  suggestions: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.gray[100],
    borderWidth: 1, borderColor: Colors.gray[200],
  },
  suggestionText: { fontSize: Typography.fontSizes.sm, color: Colors.text.primary.light },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.gray[200],
    backgroundColor: Colors.background.light, gap: Spacing.sm,
  },
  textInput: {
    flex: 1, borderWidth: 1, borderColor: Colors.gray[300],
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm, fontSize: Typography.fontSizes.md,
    maxHeight: 100, backgroundColor: Colors.background.light,
    color: Colors.text.primary.light,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500], alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
});