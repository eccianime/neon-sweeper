import Background from "@/src/assets/images/background.png";
import { router } from "expo-router";
import { HelpCircle, Play, Settings } from "lucide-react-native";
import React, { useEffect } from "react";
import { ImageBackground, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import NeonButton from "../components/NeonButton";
import { useGameStore } from "../store/gameStore";

export default function SplashScreen() {
  const newGame = useGameStore((s) => s.newGame);

  const titleOpacity = useSharedValue(1);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 400 });
    titleOpacity.value = withRepeat(
      withSequence(
        withDelay(3680, withTiming(0.4, { duration: 40 })),
        withTiming(1, { duration: 40 }),
        withTiming(1, { duration: 240 }),
      ),
      -1,
      false,
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const handleStart = () => {
    newGame();
    router.push("/game");
  };

  return (
    <ImageBackground
      source={Background}
      resizeMode="cover"
      className="flex-1 items-center justify-center px-8 bg-bgDeep"
    >
      <Animated.View style={containerStyle} className="w-full items-center">
        <Animated.Text
          style={[
            titleStyle,
            {
              textShadowColor: "#00f0ff",
              textShadowRadius: 14,
              textShadowOffset: { width: 0, height: 0 },
            },
          ]}
          className="font-displayBlack text-4xl tracking-widest text-neonCyan text-center"
        >
          NEON
          <Text
            style={{
              textShadowColor: "#ff2a6d",
              textShadowRadius: 14,
              textShadowOffset: { width: 0, height: 0 },
            }}
            className="text-neonPink"
          >
            SWEEPER
          </Text>
        </Animated.Text>
        <Text className="text-xl tracking-[4px] text-neonCyan/50 mt-2 mb-14 font-mono">
          {"// DEFUSE THE GRID //"}
        </Text>

        <View className="w-full gap-4">
          <NeonButton
            label="START GAME"
            Icon={Play}
            variant="primary"
            onPress={handleStart}
          />
          <NeonButton
            label="CONFIG"
            Icon={Settings}
            onPress={() => router.push("/config")}
          />
          <NeonButton
            label="CÓMO JUGAR"
            Icon={HelpCircle}
            onPress={() => router.push("/help")}
          />
        </View>
      </Animated.View>
    </ImageBackground>
  );
}
