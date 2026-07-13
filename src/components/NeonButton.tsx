import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, ViewStyle } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

interface Props {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  variant?: "primary" | "outline";
  style?: ViewStyle;
}

/**
 * Botón grande estilo neón para pantallas de menú (Start / Config / Help).
 * Anima un leve "press-scale" con Reanimated, igual que las celdas del tablero.
 */
export default function NeonButton({
  label,
  onPress,
  Icon,
  variant = "outline",
  style,
}: Props) {
  const scale = useSharedValue(1);
  const isPrimary = variant === "primary";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.96, { damping: 14 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 14 }))}
        onPress={onPress}
        className={`flex-row items-center justify-center gap-2 rounded-lg py-4 px-6 border ${
          isPrimary
            ? "bg-neonCyan border-neonCyan"
            : "bg-[rgba(10,5,25,0.72)] border-neonCyan/40"
        }`}
        style={
          isPrimary
            ? { shadowColor: "#00f0ff", shadowOpacity: 0.6, shadowRadius: 16 }
            : undefined
        }
      >
        {Icon ? (
          <Icon size={20} color={isPrimary ? "#05010f" : "#00f0ff"} />
        ) : null}
        <Text
          className={`font-display text-base tracking-widest ${
            isPrimary ? "text-bgDeep" : "text-neonCyan"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
