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
          CÓMO JUGAR
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-mono text-xl text-neonCyan/50 mb-6 tracking-widest text-center">
          OBJETIVO: DESPEJA TODA LA GRILLA SIN DETONAR NINGUNA MINA
        </Text>

        <HelpItem Icon={Pickaxe} iconColor="#00f0ff" title="CAVAR (DIG)">
          Toca una celda para revelarla. Si está vacía, se abrirá
          automáticamente un área de celdas seguras a su alrededor (efecto
          cascada). Si tiene un número, indica cuántas minas hay en las 8 celdas
          vecinas.
        </HelpItem>

        <HelpItem
          Icon={FlagTriangleRight}
          iconColor="#f9f871"
          title="MARCAR (FLAG)"
        >
          Mantén presionada una celda (o activa el modo FLAG y tócala) para
          marcarla con una bandera cuando sospeches que hay una mina. Una celda
          marcada no se puede cavar hasta que quites la bandera.
        </HelpItem>

        <HelpItem Icon={Bomb} iconColor="#ff2a6d" title="PRIMER TOQUE SEGURO">
          Tu primer clic nunca detona una mina: el juego coloca las minas
          después de tu primer toque, dejando siempre esa celda y sus vecinas
          despejadas.
        </HelpItem>

        <HelpItem Icon={ShieldCheck} iconColor="#67e8f9" title="CÓMO GANAR">
          Ganas cuando revelas todas las celdas que no contienen minas. El
          cronómetro se detiene y las minas restantes se marcan automáticamente.
        </HelpItem>

        <HelpItem Icon={Skull} iconColor="#ec4899" title="CÓMO PERDER">
          Si cavas una celda con una mina, esta detona y pierdes la partida. Se
          revelará todo el campo minado para que veas dónde estaban.
        </HelpItem>

        <Text className="font-mono text-lg text-neonCyan/40 mt-2 tracking-widest text-center">
          TAP = CAVAR · LONG-PRESS = BANDERA
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}
