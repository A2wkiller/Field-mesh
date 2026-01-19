import { Link, Stack } from "expo-router";
import { AlertTriangle } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
      <View style={styles.container}>
        <AlertTriangle size={60} color="#FF9800" />
        <Text style={styles.title}>ACCESS DENIED</Text>
        <Text style={styles.subtitle}>This route does not exist in SMARTFIELD</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>← Return to Authentication</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0A1628",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginTop: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E9AAF",
    marginTop: 8,
    textAlign: "center" as const,
  },
  link: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#0066CC",
    borderRadius: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
});
