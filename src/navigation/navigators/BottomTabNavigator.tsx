import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ROUTES from '../routes/Routes';
import HomeScreen from '../../screens/HomeScreen';
import SubscriptionScreen from '../../screens/SubscriptionScreen';
import MenuScreen from '../../screens/MenuScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type BottomTabParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SUBSCRIPTION]: undefined;
  [ROUTES.MENU]: undefined;
};

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof BottomTabParamList };
      }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          textDecorationLine: 'none',
        },
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
          let iconName = '';
          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.SUBSCRIPTION) {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === ROUTES.MENU) {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? '#FEBE10' : 'gray'}
            />
          );
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.SUBSCRIPTION} component={SubscriptionScreen} />
      <Tab.Screen name={ROUTES.MENU} component={MenuScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
