import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";

export function vibrate(pattern: number | number[]) {
  if (Array.isArray(pattern)) {
    Vibration.vibrate(pattern);
    return;
  }
  if (pattern <= 20) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  } else {
    Vibration.vibrate(pattern);
  }
}
