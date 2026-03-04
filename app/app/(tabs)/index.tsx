import { useAuthStore } from "@/stores/auth.store";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { logout } = useAuthStore();

  return (
    <SafeAreaView>
      <Text>Welcome!</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
