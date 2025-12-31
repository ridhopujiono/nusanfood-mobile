import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../auth/AuthContext";

export default function LoginScreen() {
  const theme = useTheme();
  const { login, isLoading, error } = useAuth();

  // Pre-fill with dummy to make testing easy
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");

  const onSubmit = async () => {
    await login(email, password);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
        Login
      </Text>

      <Text style={{ marginTop: 6, marginBottom: 18, color: theme.colors.onSurfaceVariant }}>
        Dummy account: test@test.com / 123456
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {error ? (
        <Text style={{ color: theme.colors.error, marginBottom: 10 }}>
          {error}
        </Text>
      ) : null}

      <Button mode="contained" onPress={onSubmit} loading={isLoading} disabled={isLoading}>
        Sign in
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { marginBottom: 12 },
});
