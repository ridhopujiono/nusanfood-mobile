// src/screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Text, useTheme, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <View style={styles.center}>
        <Text variant="titleLarge" style={{ color: theme.colors.text }}>
          Selamat datang
        </Text>
        <Text style={{ marginTop: 8, color: theme.colors.placeholder }}>
          Halaman Home (kosong)
        </Text>
      </View>

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateRecipe' as never)}
        style={[styles.fab, {
          backgroundColor: theme.colors.primary,
        }]}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
