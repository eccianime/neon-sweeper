import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { useGameStore } from "../store/gameStore";
import Cell from "./Cell";
import GameOverlay from "./GameOverlay";

const GAP = 3;
const PANEL_PADDING = 16; // p-2 (8px) en ambos lados

export default function Board() {
  const board = useGameStore((s) => s.board);
  const cols = useGameStore((s) => s.cols);
  const rows = useGameStore((s) => s.rows);
  const [panelWidth, setPanelWidth] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setPanelWidth(e.nativeEvent.layout.width);
  }, []);

  const avail = panelWidth - PANEL_PADDING;
  let cellSize = cols > 0 ? Math.floor((avail - GAP * (cols - 1)) / cols) : 0;
  cellSize = Math.max(14, cellSize || 14);

  return (
    <View className="relative items-center justify-start mb-4">
      <View
        onLayout={onLayout}
        className="rounded-lg p-2 relative w-full items-center justify-center bg-[rgba(10,5,25,0.72)] border border-neonCyan/35"
      >
        <View style={{ width: cellSize * cols + GAP * (cols - 1) }}>
          {board.map((row, r) => (
            <View
              key={r}
              style={{
                flexDirection: "row",
                marginBottom: r < rows - 1 ? GAP : 0,
              }}
            >
              {row.map((cell, c) => (
                <View key={c} style={{ marginRight: c < cols - 1 ? GAP : 0 }}>
                  <Cell cell={cell} size={cellSize} />
                </View>
              ))}
            </View>
          ))}
        </View>

        <GameOverlay />
      </View>
    </View>
  );
}
