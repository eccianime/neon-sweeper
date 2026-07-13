import React, { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const PADDING = 3;

export default function NeonSwitch({ value, onValueChange, disabled }: Props) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(207,233,255,0.08)", "#00f0ff"],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ["rgba(0,240,255,0.35)", "#00f0ff"],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value * (TRACK_WIDTH - THUMB_SIZE - PADDING * 2),
      },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#cfe9ff", "#05010f"],
    ),
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Animated.View
        style={[
          trackStyle,
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            borderWidth: 1,
            padding: PADDING,
            justifyContent: "center",
          },
        ]}
      >
        <Animated.View
          style={[
            thumbStyle,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
