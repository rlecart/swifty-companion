import React, { useState, useEffect } from 'react';

import { AppState, Image, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StudentFinderScreen from './src/Views/StudentFinderScreen';
import FriendsListScreen from './src/Views/FriendsListScreen';
import StudentProfileScreen from './src/Views/StudentProfileScreen';

import db from './src/db/db';
import { initLanguage } from './src/db/initDB';

import { useOrientation } from './src/hooks/useOrientation';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const initializeDBIfNeeded = async () => {
  try {
    const isTheFirstLaunch = await db.isTheFirstLaunch();

    if (isTheFirstLaunch) {
      await db.setLanguage(initLanguage);
    }
    await db.setFirstLaunch();
  } catch (error) {
    console.log('error initializing DB: ', error);
    Promise.reject(error);
  }
};

const App = () => {
  // AsyncStorage.clear();

  const orientation = useOrientation();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeDBIfNeeded().then(() => setIsLoaded(true));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='StudentFinder'>

        <Stack.Screen name="StudentFinder" options={{ headerShown: false }}>
          {props => <StudentFinderScreen {...props} isLoaded={isLoaded} />}
        </Stack.Screen>

        <Stack.Screen name="FriendsListScreen" options={{ headerShown: false, gestureDirection: 'horizontal-inverted' }}>
          {props => <FriendsListScreen {...props} isLoaded={isLoaded} />}
        </Stack.Screen>

        <Stack.Screen name="StudentProfileScreen" options={{ headerShown: false }}>
          {props => <StudentProfileScreen {...props} isLoaded={isLoaded} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const style = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F9F9F9F0',
    position: 'absolute',
    zIndex: 1
  },
  tabBarLandscape: {
    backgroundColor: '#F9F9F9F0',
    position: 'absolute',
    zIndex: 1,
    height: 70,
  },
});

export default App;