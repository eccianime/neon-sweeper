import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Difficulty, useGameStore } from "../store/gameStore";

const OPTIONS: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "EASY" },
  { key: "medium", label: "MEDIUM" },
  { key: "hard", label: "HARD" },
];

function DiffButton({ opt }: { opt: { key: Difficulty; label: string } }) {
  const diff = useGameStore((s) => s.diff);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const scale = useSharedValue(1);
  const active = diff === opt.key;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.94, { duration: 80 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
        onPress={() => setDifficulty(opt.key)}
        className={`rounded py-2 items-center border ${
          active
            ? "bg-neonPink border-neonPink"
            : "bg-[rgba(10,5,25,0.72)] border-neonCyan/35"
        }`}
        style={
          active
            ? {
                shadowColor: "#ff2a6d",
                shadowOpacity: 0.6,
                shadowRadius: 14,
              }
            : undefined
        }
      >
        <Text
          className={`font-display text-xs tracking-widest ${
            active ? "text-bgDeep" : "text-[#cfe9ff]"
          }`}
        >
          {opt.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function DifficultyButtons() {
  return (
    <View className="flex-row gap-2 mb-3">
      {OPTIONS.map((opt) => (
        <DiffButton key={opt.key} opt={opt} />
      ))}
    </View>
  );
}
