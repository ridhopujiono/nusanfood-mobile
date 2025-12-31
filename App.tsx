// App.tsx
import 'react-native-gesture-handler'; // MUST be top
import React, { JSX } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import RootStack from './src/navigation/RootStack';
import theme from './src/theme';
import { AuthProvider } from './src/auth/AuthContext';

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <RootStack />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
