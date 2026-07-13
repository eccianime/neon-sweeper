import BackgroundBlur from "@/src/assets/images/background-blur.png";
import { router } from "expo-router";
import {
  ArrowLeft,
  Bomb,
  FlagTriangleRight,
  Pickaxe,
  ShieldCheck,
  Skull,
} from "lucide-react-native";
import { ReactNode } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

function HelpItem({
  Icon,
  iconColor,
  title,
  children,
}: Readonly<{
  Icon: typeof Pickaxe;
  iconColor: string;
  title: string;
  children: ReactNode;
}>) {
  return (
    <View className="flex-row gap-3 mb-5">
      <View
        className="w-9 h-9 rounded-full items-center justify-center border mt-0.5"
        style={{ borderColor: iconColor }}
      >
        <Icon size={16} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="font-display text-lg text-[#cfe9ff] tracking-widest mb-1">
          {title}
        </Text>
        <Text className="font-mono text-base text-[#cfe9ff]/70 leading-5">
          {children}
        </Text>
      </View>
    </View>
  );
}

export default function HelpScreen() {
  return (
    <ImageBackground
      source={BackgroundBlur}
      resizeMode="cover"
      className="flex-1 bg-bgDeep py-safe"
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
          HOW TO PLAY
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-mono text-xl text-neonCyan/50 mb-6 tracking-widest text-center">
          OBJECTIVE: CLEAR THE ENTIRE GRID WITHOUT DETONATING ANY MINE
        </Text>

        <HelpItem Icon={Pickaxe} iconColor="#00f0ff" title="DIG">
          Tap a cell to reveal it. If it is empty, a safe area of cells around
          it opens automatically (cascade effect). If it shows a number, it
          tells how many mines are in the 8 neighboring cells.
        </HelpItem>

        <HelpItem Icon={FlagTriangleRight} iconColor="#f9f871" title="FLAG">
          Long-press a cell (or enable FLAG mode and tap it) to mark it with a
          flag when you suspect a mine. A flagged cell cannot be dug until you
          remove the flag.
        </HelpItem>

        <HelpItem Icon={Bomb} iconColor="#ff2a6d" title="SAFE FIRST TAP">
          Your first tap never detonates a mine: the game places mines after
          your first tap, always leaving that cell and its neighbors clear.
        </HelpItem>

        <HelpItem Icon={ShieldCheck} iconColor="#67e8f9" title="HOW TO WIN">
          You win when you reveal all cells that do not contain mines. The timer
          stops and the remaining mines are flagged automatically.
        </HelpItem>

        <HelpItem Icon={Skull} iconColor="#ec4899" title="HOW TO LOSE">
          If you dig a cell with a mine, it detonates and you lose the game. The
          entire minefield is revealed so you can see where they were.
        </HelpItem>

        <Text className="font-mono text-lg text-neonCyan/40 mt-2 tracking-widest text-center">
          TAP = DIG · LONG-PRESS = FLAG
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}
