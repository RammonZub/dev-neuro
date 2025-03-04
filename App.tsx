/**
 * Neuro App - Mental Health Assessments and Educational Content
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';

// Import screens
import TestsScreen from './src/screens/Tests/TestsScreen';
import TakeTestScreen from './src/screens/Tests/TakeTestScreen';
import TestResultScreen from './src/screens/Tests/TestResultScreen';
import LearnScreen from './src/screens/Learn/LearnScreen';
import ReadBookScreen from './src/screens/Learn/ReadBookScreen';
import BookResultScreen from './src/screens/Learn/BookResultScreen';

// Import tab bar icons
import { TestsIcon, LearnIcon } from './src/components/TabBarIcons';

// Create stack navigators
const TestsStack = createStackNavigator();
const LearnStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TestsStackScreen() {
  return (
    <TestsStack.Navigator screenOptions={{ headerShown: false }}>
      <TestsStack.Screen name="TestsOverview" component={TestsScreen} />
      <TestsStack.Screen name="TakeTest" component={TakeTestScreen} />
      <TestsStack.Screen name="TestResult" component={TestResultScreen} />
    </TestsStack.Navigator>
  );
}

function LearnStackScreen() {
  return (
    <LearnStack.Navigator screenOptions={{ headerShown: false }}>
      <LearnStack.Screen name="BooksOverview" component={LearnScreen} />
      <LearnStack.Screen name="ReadBook" component={ReadBookScreen} />
      <LearnStack.Screen name="BookResult" component={BookResultScreen} />
    </LearnStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Tests') {
            return <TestsIcon color={color} size={size} />;
          } else if (route.name === 'Learn') {
            return <LearnIcon color={color} size={size} />;
          }
          return null;
        },
        tabBarActiveTintColor: '#0099CC',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tests" component={TestsStackScreen} />
      <Tab.Screen name="Learn" component={LearnStackScreen} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  console.log(NativeModules.RNGestureHandlerModule);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000' : '#fff'}
      />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;
