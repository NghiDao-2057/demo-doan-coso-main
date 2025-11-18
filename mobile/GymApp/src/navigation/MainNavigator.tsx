import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreenWeb from '../screens/HomeScreenWeb'; // Design mới giống Web
import ProfileScreen from '../screens/ProfileScreen';
import ClassesScreen from '../screens/ClassesScreen';
import MembershipScreen from '../screens/MembershipScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ClubsScreen from '../screens/ClubsScreen';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const iconStyles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});

const HomeIcon = () => <Text style={iconStyles.icon}>🏠</Text>;
const ClassesIcon = () => <Text style={iconStyles.icon}>💪</Text>;
const ServicesIcon = () => <Text style={iconStyles.icon}>🎯</Text>;
const ClubsIcon = () => <Text style={iconStyles.icon}>🏋️</Text>;
const MembershipIcon = () => <Text style={iconStyles.icon}>💳</Text>;
const ProfileIcon = () => <Text style={iconStyles.icon}>👤</Text>;

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ec4899',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: '#1e1b4b',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#1e1b4b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenWeb}
        options={{
          title: 'Trang chủ',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          title: 'Lớp học',
          tabBarIcon: ClassesIcon,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Dịch vụ',
          tabBarIcon: ServicesIcon,
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubsScreen}
        options={{
          title: 'Câu lạc bộ',
          tabBarIcon: ClubsIcon,
        }}
      />
      <Tab.Screen
        name="Membership"
        component={MembershipScreen}
        options={{
          title: 'Gói tập',
          tabBarIcon: MembershipIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
