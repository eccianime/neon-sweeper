import { ShieldCheck, Skull } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useGameStore } from "../store/gameStore";

export default function GameOverlay() {
  const overlayVisible = useGameStore((s) => s.overlayVisible);
  const win = useGameStore((s) => s.win);
  const timer = useGameStore((s) => s.timer);
  const newGame = useGameStore((s) => s.newGame);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (overlayVisible) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, { duration: 250 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      scale.value = withTiming(0.9, { duration: 150 });
    }
  }, [overlayVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!overlayVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          borderRadius: 8,
          zIndex: 40,
        },
      ]}
      className="items-center justify-center px-6"
    >
      <View className="mb-3">
        {win ? (
          <ShieldCheck size={56} color="#67e8f9" />
        ) : (
          <Skull size={56} color="#ec4899" />
        )}
      </View>

      <Text
        className={`font-display text-3xl font-black tracking-widest text-center ${
          win ? "text-neonCyan" : "text-neonPink"
        }`}
        style={{
          textShadowColor: win ? "#00f0ff" : "#ff2a6d",
          textShadowRadius: 10,
          textShadowOffset: { width: 0, height: 0 },
        }}
      >
        {win ? "GRID SECURED" : "SYSTEM BREACH"}
      </Text>

      <Text className="text-lg text-neonCyan/70 mt-2 mb-5 text-center font-mono">
        {win
          ? `All mines defused in ${timer}s.\nSystem restored.`
          : "A mine detonated.\nThe grid is lost."}
      </Text>

      <Pressable
        onPress={newGame}
        className="border border-neonCyan rounded px-6 py-2 bg-[rgba(10,5,25,0.72)]"
      >
        <Text className="font-display tracking-widest text-lg text-neonCyan">
          PLAY AGAIN
        </Text>
      </Pressable>
    </Animated.View>
  );
}
