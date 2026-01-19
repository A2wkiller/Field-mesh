import { router } from "expo-router";
import { Shield, AlertTriangle } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/contexts/AppContext";

export default function LoginScreen() {
  const { isAuthenticated, userRole, login, isLoading } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showOfficerForm, setShowOfficerForm] = useState(false);
  const [officerName, setOfficerName] = useState("");
  const [officerRole, setOfficerRole] = useState("");

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === "FIELD") {
        router.replace("/field");
      } else {
        router.replace("/hq");
      }
    }
  }, [isAuthenticated, userRole]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  const handlePinSubmit = async () => {
    setError("");
    
    if (pin === "112233" || pin === "223344") {
      if (!showOfficerForm) {
        setShowOfficerForm(true);
        return;
      }

      if (!officerName.trim() || !officerRole.trim()) {
        setError("Please enter officer name and role");
        return;
      }

      const success = await login(pin, {
        name: officerName.trim(),
        role: officerRole.trim(),
      });

      if (success) {
        if (pin === "112233") {
          router.replace("/field");
        } else {
          router.replace("/hq");
        }
      }
    } else {
      setError("Access Denied - Invalid PIN");
      setPin("");
    }
  };

  const handlePinChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 6) {
      setPin(cleaned);
      setError("");
    }
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={72} color="#0066CC" strokeWidth={2} />
          </View>
          <Text style={styles.title}>SMARTFIELD</Text>
          <Text style={styles.subtitle}>Disaster & Agriculture Management System</Text>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>OFFLINE READY</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          {!showOfficerForm ? (
            <>
              <Text style={styles.label}>ENTER SECURE PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={handlePinChange}
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
                placeholder="••••••"
                placeholderTextColor="#666"
                autoFocus
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={16} color="#FF3B30" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.button, !pin || pin.length < 6 ? styles.buttonDisabled : null]}
                onPress={handlePinSubmit}
                disabled={!pin || pin.length < 6}
              >
                <Text style={styles.buttonText}>AUTHENTICATE</Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>ACCESS ROLES</Text>
                <Text style={styles.infoText}>• FieldMesh PIN → Survey Interface</Text>
                <Text style={styles.infoText}>• SmartField PIN → Command HQ</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>OFFICER REGISTRATION</Text>
              <TextInput
                style={styles.input}
                value={officerName}
                onChangeText={setOfficerName}
                placeholder="Officer Name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                value={officerRole}
                onChangeText={setOfficerRole}
                placeholder="Officer Role (e.g., Field Surveyor, District Collector)"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <AlertTriangle size={16} color="#FF3B30" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.button} onPress={handlePinSubmit}>
                <Text style={styles.buttonText}>COMPLETE REGISTRATION</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setShowOfficerForm(false);
                  setPin("");
                  setOfficerName("");
                  setOfficerRole("");
                }}
              >
                <Text style={styles.backButtonText}>Back to PIN Entry</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GOVERNMENT OF INDIA</Text>
          <Text style={styles.footerSubtext}>Disaster Management & Agriculture Division</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#050B18",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A1628",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 102, 204, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(0, 102, 204, 0.3)",
  },
  title: {
    fontSize: 40,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E9AAF",
    marginTop: 12,
    textAlign: "center" as const,
    paddingHorizontal: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    gap: 8,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  badgeText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 1.5,
  },
  formContainer: {
    backgroundColor: "#0D1829",
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E9AAF",
    marginBottom: 12,
    letterSpacing: 1,
  },
  pinInput: {
    backgroundColor: "#050B18",
    borderWidth: 2,
    borderColor: "#0066CC",
    borderRadius: 12,
    padding: 18,
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center" as const,
    letterSpacing: 10,
    fontWeight: "600" as const,
  },
  input: {
    backgroundColor: "#050B18",
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.3)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#2C1618",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 13,
    flex: 1,
  },
  button: {
    backgroundColor: "#0066CC",
    padding: 18,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center" as const,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#1E3A5F",
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    letterSpacing: 1.5,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#8E9AAF",
    fontSize: 14,
  },
  infoBox: {
    marginTop: 28,
    padding: 18,
    backgroundColor: "rgba(0, 102, 204, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.2)",
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E9AAF",
    marginBottom: 8,
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 13,
    color: "#C5D0E6",
    marginBottom: 4,
  },
  footer: {
    marginTop: 40,
    alignItems: "center" as const,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E9AAF",
    letterSpacing: 1,
  },
  footerSubtext: {
    fontSize: 10,
    color: "#5A6B7F",
    marginTop: 4,
  },
});
