import {
  Orbitron_500Medium,
  Orbitron_700Bold,
  Orbitron_900Black,
} from "@expo-google-fonts/orbitron";
import { ShareTechMono_400Regular } from "@expo-google-fonts/share-tech-mono";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { StatusBar, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Board from "../components/Board";
import DifficultyButtons from "../components/DifficultyButtons";
import Header from "../components/Header";
import ModeToggle from "../components/ModeToggle";
import StatsBar from "../components/StatsBar";

SplashScreen.preventAutoHideAsync().catch(() => {});

function GameScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-bgDeep"
      style={{
        paddingTop: Math.max(16, insets.top),
        paddingBottom: Math.max(24, insets.bottom),
        paddingHorizontal: 12,
      }}
    >
      <View className="flex-1 w-full max-w-md self-center">
        <Header />
        <DifficultyButtons />
        <StatsBar />
        <Board />
        <View className="mt-auto">
          <ModeToggle />
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Orbitron_500Medium,
    Orbitron_700Bold,
    Orbitron_900Black,
    ShareTechMono_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor="#05010f" />
      <GameScreen />
    </SafeAreaProvider>
  );
}
