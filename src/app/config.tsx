import BackgroundBlur from "@/src/assets/images/background-blur.png";
import { router } from "expo-router";
import { ArrowLeft, Info, Music, Volume2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AboutModal from "../components/AboutModal";
import NeonSwitch from "../components/NeonSwitch";
import {
  CUSTOM_MAX_MINES,
  CUSTOM_MIN_MINES,
  DifficultyOption,
  useSettingsStore,
} from "../store/settingsStore";

const DIFF_OPTIONS: { key: DifficultyOption; label: string }[] = [
  { key: "easy", label: "EASY" },
  { key: "medium", label: "MEDIUM" },
  { key: "hard", label: "HARD" },
  { key: "custom", label: "CUSTOM" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="font-display text-xs tracking-widest text-neonPurple mb-2 mt-6">
      {children}
    </Text>
  );
}

function DiffChip({ opt }: { opt: { key: DifficultyOption; label: string } }) {
  const difficulty = useSettingsStore((s) => s.difficulty);
  const setDifficulty = useSettingsStore((s) => s.setDifficulty);
  const active = difficulty === opt.key;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="flex-1">
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.94, { duration: 80 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
        onPress={() => setDifficulty(opt.key)}
        className={`rounded py-3 items-center border ${
          active
            ? "bg-neonPink border-neonPink"
            : "bg-[rgba(10,5,25,0.72)] border-neonCyan/35"
        }`}
        style={
          active
            ? { shadowColor: "#ff2a6d", shadowOpacity: 0.6, shadowRadius: 14 }
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

function CustomMinesInput() {
  const customMines = useSettingsStore((s) => s.customMines);
  const setCustomMines = useSettingsStore((s) => s.setCustomMines);
  const [text, setText] = useState(String(customMines));

  const commit = () => {
    const n = parseInt(text, 10);
    setCustomMines(Number.isFinite(n) ? n : CUSTOM_MIN_MINES);
  };

  return (
    <View className="rounded-lg px-4 py-3 bg-[rgba(10,5,25,0.72)] border border-neonPurple/40 mt-3">
      <Text className="font-mono text-base text-neonCyan/70 mb-2">
        Cantidad de minas (grilla 12 x 15) — mínimo {CUSTOM_MIN_MINES}, máximo{" "}
        {CUSTOM_MAX_MINES}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        onBlur={() => {
          commit();
          setText(String(useSettingsStore.getState().customMines));
        }}
        keyboardType="number-pad"
        maxLength={3}
        className="font-display text-lg text-neonYellow"
        placeholder={String(CUSTOM_MIN_MINES)}
        placeholderTextColor="#f9f87155"
        style={{ paddingVertical: 4 }}
      />
    </View>
  );
}

function ToggleRow({
  Icon,
  label,
  value,
  onValueChange,
}: {
  Icon: typeof Volume2;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between rounded-lg px-4 py-3 bg-[rgba(10,5,25,0.72)] border border-neonCyan/25 mb-3">
      <View className="flex-row items-center gap-3">
        <Icon size={18} color="#00f0ff" />
        <Text className="font-mono text-sm text-[#cfe9ff]">{label}</Text>
      </View>
      <NeonSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export default function ConfigScreen() {
  const difficulty = useSettingsStore((s) => s.difficulty);
  const sfxEnabled = useSettingsStore((s) => s.sfxEnabled);
  const setSfxEnabled = useSettingsStore((s) => s.setSfxEnabled);
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const setMusicEnabled = useSettingsStore((s) => s.setMusicEnabled);
  const [aboutVisible, setAboutVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 "
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={BackgroundBlur}
        resizeMode="cover"
        className="flex-1 py-safe bg-bgDeep"
      >
        <View className="flex-row items-center px-4 pt-2 pb-1">
          <Pressable
            onPress={router.back}
            className="size-12 rounded-full items-center justify-center border border-neonCyan/40 mr-3"
          >
            <ArrowLeft size={24} color="#00f0ff" />
          </Pressable>
          <Text
            className="font-display text-2xl text-neonCyan tracking-widest"
            style={{
              textShadowColor: "#00f0ff",
              textShadowRadius: 8,
              textShadowOffset: { width: 0, height: 0 },
            }}
          >
            CONFIG
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <SectionLabel>DIFICULTAD</SectionLabel>
          <View className="flex-row gap-2">
            {DIFF_OPTIONS.map((opt) => (
              <DiffChip key={opt.key} opt={opt} />
            ))}
          </View>
          {difficulty === "custom" && <CustomMinesInput />}

          <SectionLabel>AUDIO</SectionLabel>
          <ToggleRow
            Icon={Volume2}
            label="Efectos de sonido (SFX)"
            value={sfxEnabled}
            onValueChange={setSfxEnabled}
          />
          <ToggleRow
            Icon={Music}
            label="Música (próximamente)"
            value={musicEnabled}
            onValueChange={setMusicEnabled}
          />

          <SectionLabel>INFORMACIÓN</SectionLabel>
          <Pressable
            onPress={() => setAboutVisible(true)}
            className="flex-row items-center justify-between rounded-lg px-4 py-3 bg-[rgba(10,5,25,0.72)] border border-neonCyan/25"
          >
            <View className="flex-row items-center gap-3">
              <Info size={18} color="#00f0ff" />
              <Text className="font-mono text-sm text-[#cfe9ff]">About</Text>
            </View>
          </Pressable>
        </ScrollView>

        <AboutModal
          visible={aboutVisible}
          onClose={() => setAboutVisible(false)}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
