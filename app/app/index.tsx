import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/auth.store";
import { useEffect } from "react";

export default function Index() {
  const { token, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
