import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAuth } from "../auth/AuthContext";

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="titleLarge" style={{ color: theme.colors.onBackground }}>
        Settings
      </Text>

      <Text style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
        Logged in as: {user?.email}
      </Text>

      <Button style={{ marginTop: 16 }} mode="outlined" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
});
