import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text variant="titleLarge" style={{ color: theme.colors.onBackground }}>
          Selamat datang
        </Text>
        <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
          Halaman Home (kosong)
        </Text>
      </View>

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateRecipe' as never)}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 24 },
});
