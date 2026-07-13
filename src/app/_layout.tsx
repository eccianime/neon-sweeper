import { Stack } from "expo-router";
import "../../global.css";

import {
  Orbitron_500Medium,
  Orbitron_700Bold,
  Orbitron_900Black,
} from "@expo-google-fonts/orbitron";
import { ShareTechMono_400Regular } from "@expo-google-fonts/share-tech-mono";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Orbitron_500Medium,
    Orbitron_700Bold,
    Orbitron_900Black,
    ShareTechMono_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#05010f" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
