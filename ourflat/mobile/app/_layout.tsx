import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="shopping" />
      <Stack.Screen name="meals" />
      <Stack.Screen name="chores" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="money" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="pets" />
      <Stack.Screen name="plants" />
      <Stack.Screen name="habits" />
      <Stack.Screen name="packages" />
      <Stack.Screen name="flatmate" />
    </Stack>
  );
}