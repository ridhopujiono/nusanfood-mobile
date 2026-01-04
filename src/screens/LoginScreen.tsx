import React, { useMemo, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  Card,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../auth/AuthContext";

const isValidEmail = (email: string) =>
  /^\S+@\S+\.\S+$/.test(email.trim().toLowerCase());

export default function LoginScreen() {
  const theme = useTheme();
  const { login, isLoading, error } = useAuth();

  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const passwordOk = useMemo(() => password.length >= 6, [password]);

  const canSubmit = emailOk && passwordOk && !isLoading;

  const onSubmit = async () => {
    setTouched({ email: true, password: true });
    if (!emailOk || !passwordOk) return;
    await login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text
          variant="headlineMedium"
          style={{ textAlign: "center", marginBottom: 6 }}
        >
          NusanFood
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
            marginBottom: 18,
          }}
        >
          Sign in to continue
        </Text>

        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" />}
              error={touched.email && !emailOk}
            />
            <HelperText type="error" visible={touched.email && !emailOk}>
              Please enter a valid email.
            </HelperText>

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword((s) => !s)}
                />
              }
              error={touched.password && !passwordOk}
            />
            <HelperText type="error" visible={touched.password && !passwordOk}>
              Password must be at least 6 characters.
            </HelperText>

            {error ? (
              <Text style={{ color: theme.colors.error, marginTop: 6 }}>
                {error}
              </Text>
            ) : null}

            <Button
              mode="contained"
              onPress={onSubmit}
              loading={isLoading}
              disabled={!canSubmit}
              style={{ marginTop: 12 }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Sign in
            </Button>

            <Button
              mode="text"
              onPress={() => {
                // TODO: navigate to Register / Forgot Password
              }}
              style={{ marginTop: 6 }}
            >
              Forgot password?
            </Button>
          </Card.Content>
        </Card>

        <Text
          variant="bodySmall"
          style={{
            marginTop: 12,
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          Dummy: test@test.com / 123456
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: { borderRadius: 16 },
  input: { marginBottom: 6 },
});
