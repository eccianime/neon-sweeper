import { Bomb, RotateCcw, Timer, Volume2, VolumeX } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useGameStore } from "../store/gameStore";
import { setMuted } from "../utils/sound";

const pad = (n: number) =>
  String(Math.min(999, Math.max(0, n))).padStart(3, "0");

export default function StatsBar() {
  const mines = useGameStore((s) => s.mines);
  const flags = useGameStore((s) => s.flags);
  const timer = useGameStore((s) => s.timer);
  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const newGame = useGameStore((s) => s.newGame);
  const win = useGameStore((s) => s.win);
  const gameOver = useGameStore((s) => s.gameOver);

  const mineCountDisplay = win && gameOver ? 0 : Math.max(0, mines - flags);

  return (
    <View className="rounded-lg px-3 py-2 mb-3 flex-row items-center justify-between bg-[rgba(10,5,25,0.72)] border border-neonCyan/35">
      <View className="flex-row items-center gap-2">
        <Bomb size={16} color="#ff2a6d" />
        <Text className="font-display text-lg text-neonPink ml-1">
          {pad(mineCountDisplay)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            toggleMute();
            setMuted(!muted);
          }}
          className={`rounded-full w-10 h-10 items-center justify-center border ${
            muted ? "border-neonPink" : "border-neonCyan"
          } bg-[rgba(10,5,25,0.72)] mr-2`}
        >
          {muted ? (
            <VolumeX size={20} color="#ff2a6d" />
          ) : (
            <Volume2 size={20} color="#00f0ff" />
          )}
        </Pressable>
        <Pressable
          onPress={newGame}
          className="rounded-full w-10 h-10 items-center justify-center border border-neonCyan bg-[rgba(10,5,25,0.72)]"
        >
          <RotateCcw size={20} color="#00f0ff" />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="font-display text-lg text-neonCyan mr-1">
          {pad(timer)}
        </Text>
        <Timer size={16} color="#00f0ff" />
      </View>
    </View>
  );
}
