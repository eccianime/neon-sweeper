import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";

/**
 * El original usaba navigator.vibrate(ms) con patrones (ej: [40, 30, 80]).
 * En RN usamos Vibration.vibrate para patrones y expo-haptics para toques
 * cortos individuales, que se sienten más "nativos" en iOS/Android.
 */
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
