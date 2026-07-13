import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function Header() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withDelay(3680, withTiming(0.4, { duration: 40 })), // ~92% de 4000ms
        withTiming(1, { duration: 40 }), // ~93-94%
        withTiming(1, { duration: 240 }), // resto del ciclo hasta completar 4s
      ),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="items-center mb-3">
      <Animated.Text
        style={[
          animatedStyle,
          {
            textShadowColor: "#00f0ff",
            textShadowRadius: 10,
            textShadowOffset: { width: 0, height: 0 },
          },
        ]}
        className="font-display text-3xl font-black tracking-widest text-neonCyan"
      >
        NEON
        <Text
          style={{
            textShadowColor: "#ff2a6d",
            textShadowRadius: 10,
            textShadowOffset: { width: 0, height: 0 },
          }}
          className="text-neonPink"
        >
          SWEEPER
        </Text>
      </Animated.Text>

      <Text className="text-[10px] tracking-[3px] text-neonCyan/60 mt-1 font-mono">
        {"// DEFUSE THE GRID //"}
      </Text>
    </View>
  );
}
