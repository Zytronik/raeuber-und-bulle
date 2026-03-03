import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text style={{ color: "white" }}>Welcome!</Text>;
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
