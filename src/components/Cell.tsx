import { FlagTriangleRight } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { Cell as CellType, useGameStore } from "../store/gameStore";
import { COLORS } from "../theme/colors";

interface Props {
  cell: CellType;
  size: number;
}

const LONG_PRESS_MS = 350;

export default function Cell({ cell, size }: Props) {
  const mode = useGameStore((s) => s.mode);
  const digCell = useGameStore((s) => s.digCell);
  const toggleFlag = useGameStore((s) => s.toggleFlag);
  const gameOver = useGameStore((s) => s.gameOver);

  const scale = useSharedValue(1);
  const revealProgress = useSharedValue(cell.revealed ? 1 : 0);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    revealProgress.value = withTiming(cell.revealed ? 1 : 0, { duration: 160 });
  }, [cell.revealed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: cell.exploded
      ? COLORS.neonPink
      : cell.revealed
        ? withTiming("rgba(0,240,255,0.05)")
        : "rgba(0,240,255,0)",
  }));

  const handlePressIn = () => {
    if (gameOver) return;
    longPressed.current = false;
    scale.value = withSpring(0.9, { damping: 14 });
    if (!cell.revealed) {
      longPressTimer.current = setTimeout(() => {
        longPressed.current = true;
        toggleFlag(cell.r, cell.c);
      }, LONG_PRESS_MS);
    }
  };

  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14 });
    clearTimer();
    if (gameOver || longPressed.current) return;
    if (mode === "flag") {
      toggleFlag(cell.r, cell.c);
    } else {
      digCell(cell.r, cell.c);
    }
  };

  const numberColor = cell.adj > 0 ? COLORS.numberColors[cell.adj] : undefined;

  let content: React.ReactNode = null;
  if (cell.wrongFlag) {
    content = (
      <Text style={{ color: COLORS.neonPink, fontSize: size * 0.5 }}>✕</Text>
    );
  } else if (cell.flag) {
    content = (
      <FlagTriangleRight size={size * 0.55} color={COLORS.neonYellow} />
    );
  } else if (cell.revealed) {
    if (cell.mine) {
      content = (
        <Text style={{ fontSize: size * 0.5 }}>
          {cell.exploded ? "✸" : "✸"}
        </Text>
      );
    } else if (cell.adj > 0) {
      content = (
        <Text
          style={{
            color: numberColor,
            fontSize: size * 0.5,
            fontWeight: "700",
            textShadowColor: numberColor,
            textShadowRadius: 6,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          {cell.adj}
        </Text>
      );
    }
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: 3,
          borderWidth: 1,
          borderColor:
            cell.mine && cell.revealed
              ? COLORS.neonPink
              : cell.revealed
                ? "rgba(0,240,255,0.18)"
                : "rgba(176,38,255,0.45)",
        },
      ]}
      className="items-center justify-center overflow-hidden"
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}
