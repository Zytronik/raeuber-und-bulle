import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { AxiosError, isAxiosError } from "axios";

export default function LoginScreen() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      await login({ email, password });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(
          axiosErr.response?.data?.message ||
            axiosErr.message ||
            "Login failed",
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  };

  const inputStyle = (field: "email" | "password") => {
    const value = field === "email" ? email : password;
    const isEmpty = value.trim() === "";
    const isEmailInvalid =
      field === "email" && value && !emailRegex.test(value);
    return [
      styles.input,
      touched[field] && (isEmpty || isEmailInvalid) && { borderColor: "red" },
    ];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TextInput
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#0000003f"
              value={email}
              onChangeText={setEmail}
              style={inputStyle("email")}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <TextInput
              ref={passwordInputRef}
              placeholder="Password"
              secureTextEntry
              value={password}
              placeholderTextColor="#0000003f"
              onChangeText={setPassword}
              style={inputStyle("password")}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              onSubmitEditing={handleLogin}
            />

            <Button
              title={loading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              disabled={loading}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 15,
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
