import BackgroundBlur from "@/src/assets/images/background-blur.png";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ImageBackground, Pressable, View } from "react-native";
import Board from "../components/Board";
import Header from "../components/Header";
import ModeToggle from "../components/ModeToggle";
import StatsBar from "../components/StatsBar";

export default function GameScreen() {
  return (
    <ImageBackground
      source={BackgroundBlur}
      resizeMode="cover"
      className="flex-1 w-full self-center py-safe px-4 bg-bgDeep"
    >
      <View className="max-w-md">
        <View className="flex-row items-center mb-1">
          <Pressable
            onPress={router.back}
            className="size-12 rounded-full items-center justify-center border border-neonCyan/40"
          >
            <ArrowLeft size={24} color="#00f0ff" />
          </Pressable>
        </View>
        <Header />
        <StatsBar />
        <Board />
        <View className="mt-auto">
          <ModeToggle />
        </View>
      </View>
    </ImageBackground>
  );
}
