import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function RecipesScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="titleLarge" style={{ color: theme.colors.onBackground }}>
        Recipes
      </Text>
      <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
        Daftar resep akan muncul di sini.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
