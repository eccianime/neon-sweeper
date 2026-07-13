import { FlagTriangleRight, Pickaxe } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Mode, useGameStore } from "../store/gameStore";

function ModeButton({
  targetMode,
  label,
  Icon,
}: {
  targetMode: Mode;
  label: string;
  Icon: typeof Pickaxe;
}) {
  const mode = useGameStore((s) => s.mode);
  const setMode = useGameStore((s) => s.setMode);
  const active = mode === targetMode;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 150 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: active ? "#00f0ff" : "#00f0ff00",
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        active
          ? { shadowColor: "#00f0ff", shadowOpacity: 0.7, shadowRadius: 14 }
          : null,
      ]}
      className="flex-1 rounded-lg border border-neonCyan/35"
    >
      <Pressable
        onPress={() => setMode(targetMode)}
        className="py-3 flex-row items-center justify-center gap-2"
      >
        <Icon size={16} color={active ? "#05010f" : "#00f0ff"} />
        <Text
          className={`font-display text-sm tracking-widest ${
            active ? "text-bgDeep" : "text-neonCyan"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function ModeToggle() {
  return (
    <View>
      <View className="flex-row gap-2">
        <ModeButton targetMode="dig" label="DIG" Icon={Pickaxe} />
        <ModeButton targetMode="flag" label="FLAG" Icon={FlagTriangleRight} />
      </View>
      <Text className="text-center text-[10px] text-neonCyan/40 mt-2 tracking-widest font-mono">
        TAP TO DIG · LONG-PRESS TO FLAG
      </Text>
    </View>
  );
}
