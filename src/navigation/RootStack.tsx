// src/navigation/RootStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateRecipe: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} options={{ title: 'Buat Resep' }} />
    </Stack.Navigator>
  );
}
