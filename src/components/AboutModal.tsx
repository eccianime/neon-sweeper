import { GitBranch, Globe, Mail, X } from "lucide-react-native";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AUTHOR = {
  name: "Jean Paul Rojas Véliz",
  role: "Developer / Mobile Designer",
  bio: "Creator of Neon Sweeper, a cyberpunk-style minesweeper built with React Native.",
  email: "ingjeanpaulrojas@gmail.com",
  github: "https://github.com/eccianime",
  website: "https://eccianime.github.io",
  version: "1.0.0",
};

export default function AboutModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 items-center justify-center px-6">
        <View className="w-full max-w-sm rounded-lg bg-[#0a0519] border border-neonCyan/40 p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="font-display text-lg text-neonCyan tracking-widest"
              style={{
                textShadowColor: "#00f0ff",
                textShadowRadius: 8,
                textShadowOffset: { width: 0, height: 0 },
              }}
            >
              ABOUT ME
            </Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full items-center justify-center border border-neonPink/60"
            >
              <X size={16} color="#ff2a6d" />
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 320 }}>
            <Text className="font-display text-2xl text-[#cfe9ff] mb-1">
              {AUTHOR.name}
            </Text>
            <Text className="font-mono text-lg text-neonPurple mb-3">
              {AUTHOR.role}
            </Text>
            <Text className="font-mono text-lg text-[#cfe9ff]/80 leading-5 mb-4">
              {AUTHOR.bio}
            </Text>

            <View className="gap-3">
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => Linking.openURL(`mailto:${AUTHOR.email}`)}
              >
                <Mail size={20} color="#00f0ff" />
                <Text className="font-mono text-base text-neonCyan">
                  {AUTHOR.email}
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => Linking.openURL(AUTHOR.github)}
              >
                <GitBranch size={20} color="#00f0ff" />
                <Text className="font-mono text-base text-neonCyan">
                  {AUTHOR.github}
                </Text>
              </Pressable>
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => Linking.openURL(AUTHOR.website)}
              >
                <Globe size={20} color="#00f0ff" />
                <Text className="font-mono text-base text-neonCyan">
                  {AUTHOR.website}
                </Text>
              </Pressable>
            </View>

            <Text className="font-mono text-lg text-[#cfe9ff]/40 mt-5 tracking-widest text-center">
              VERSION {AUTHOR.version}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
