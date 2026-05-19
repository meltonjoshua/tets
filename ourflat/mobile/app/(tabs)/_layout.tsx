import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors, Typography } from '@ourflat/ui';
import {
  Home,
  ShoppingCart,
  UtensilsCrossed,
  CheckSquare,
  Calendar,
  MoreHorizontal,
} from 'lucide-react-native';
import { useAuth } from '../src/providers/AuthProvider';
import { useHousehold } from '../src/providers/HouseholdProvider';

export default function TabLayout() {
  const { session, isLoading: authLoading } = useAuth();
  const { household, isLoading: householdLoading } = useHousehold();

  if (authLoading || householdLoading) {
    return <View style={styles.loading} />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (!household) {
    return <Redirect href="/auth/join" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: 'Chores',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <MoreHorizontal size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 4,
    paddingBottom: 8,
    height: 88,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});