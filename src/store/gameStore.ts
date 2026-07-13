import { create } from "zustand";
import { vibrate } from "../utils/haptics";
import { playSfx } from "../utils/sound";
import { CUSTOM_GRID, useSettingsStore } from "./settingsStore";

export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "dig" | "flag";

export interface Cell {
  r: number;
  c: number;
  mine: boolean;
  revealed: boolean;
  flag: boolean;
  adj: number;
  /** Marca especial cuando fue la mina que hizo perder */
  exploded?: boolean;
  /** Bandera incorrecta mostrada al perder */
  wrongFlag?: boolean;
}

const DIFFS: Record<Difficulty, { cols: number; rows: number; mines: number }> =
  {
    easy: { cols: 9, rows: 11, mines: 12 },
    medium: { cols: 12, rows: 15, mines: 30 },
    hard: { cols: 14, rows: 18, mines: 55 },
  };

interface GameState {
  cols: number;
  rows: number;
  mines: number;
  board: Cell[][];
  firstClick: boolean;
  gameOver: boolean;
  win: boolean;
  flags: number;
  revealedCount: number;
  timer: number;
  mode: Mode;
  overlayVisible: boolean;
  // control interno del timer
  _timerHandle: ReturnType<typeof setInterval> | null;

  setMode: (m: Mode) => void;
  newGame: () => void;
  digCell: (r: number, c: number) => void;
  toggleFlag: (r: number, c: number) => void;
  tickTimer: () => void;
}

/** Resuelve cols/rows/mines actuales según la configuración guardada por el usuario */
function resolveConfig(): { cols: number; rows: number; mines: number } {
  const { difficulty, customMines } = useSettingsStore.getState();
  if (difficulty === "custom") {
    return {
      cols: CUSTOM_GRID.cols,
      rows: CUSTOM_GRID.rows,
      mines: customMines,
    };
  }
  return DIFFS[difficulty];
}

function forEachNeighbor(
  rows: number,
  cols: number,
  r: number,
  c: number,
  fn: (nr: number, nc: number) => void,
) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) fn(nr, nc);
    }
  }
}

function buildEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        r,
        c,
        mine: false,
        revealed: false,
        flag: false,
        adj: 0,
      };
    }
  }
  return board;
}

function placeMines(
  board: Cell[][],
  rows: number,
  cols: number,
  mines: number,
  safeR: number,
  safeC: number,
) {
  const safe = new Set<string>();
  forEachNeighbor(rows, cols, safeR, safeC, (nr, nc) =>
    safe.add(`${nr}_${nc}`),
  );
  safe.add(`${safeR}_${safeC}`);

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine || safe.has(`${r}_${c}`)) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let n = 0;
      forEachNeighbor(rows, cols, r, c, (nr, nc) => {
        if (board[nr][nc].mine) n++;
      });
      board[r][c].adj = n;
    }
  }
}

function revealCascade(
  board: Cell[][],
  rows: number,
  cols: number,
  cell: Cell,
  countRef: { count: number },
) {
  if (cell.revealed || cell.flag) return;
  cell.revealed = true;
  countRef.count++;
  if (cell.mine) return;
  if (cell.adj === 0) {
    forEachNeighbor(rows, cols, cell.r, cell.c, (nr, nc) => {
      const n = board[nr][nc];
      if (!n.revealed && !n.flag) revealCascade(board, rows, cols, n, countRef);
    });
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  cols: DIFFS.easy.cols,
  rows: DIFFS.easy.rows,
  mines: DIFFS.easy.mines,
  board: buildEmptyBoard(DIFFS.easy.rows, DIFFS.easy.cols),
  firstClick: true,
  gameOver: false,
  win: false,
  flags: 0,
  revealedCount: 0,
  timer: 0,
  mode: "dig",
  overlayVisible: false,
  _timerHandle: null,

  setMode: (m) => set({ mode: m }),

  newGame: () => {
    const cfg = resolveConfig();
    const handle = get()._timerHandle;
    if (handle) clearInterval(handle);
    set({
      cols: cfg.cols,
      rows: cfg.rows,
      mines: cfg.mines,
      board: buildEmptyBoard(cfg.rows, cfg.cols),
      firstClick: true,
      gameOver: false,
      win: false,
      flags: 0,
      revealedCount: 0,
      timer: 0,
      overlayVisible: false,
      _timerHandle: null,
    });
  },

  tickTimer: () => set((s) => ({ timer: s.timer + 1 })),

  digCell: (r, c) => {
    const s = get();
    if (s.gameOver) return;
    const cell = s.board[r][c];
    if (cell.revealed || cell.flag) return;

    const board = s.board.map((row) => row.map((cl) => ({ ...cl })));

    if (s.firstClick) {
      placeMines(board, s.rows, s.cols, s.mines, r, c);
      const handle = setInterval(() => get().tickTimer(), 1000);
      set({ firstClick: false, _timerHandle: handle });
    }

    const targetCell = board[r][c];

    if (targetCell.mine) {
      targetCell.revealed = true;
      targetCell.exploded = true;
      // revelar todas las minas restantes
      for (let rr = 0; rr < s.rows; rr++) {
        for (let cc = 0; cc < s.cols; cc++) {
          const cl = board[rr][cc];
          if (cl.mine && !cl.flag && cl !== targetCell) {
            cl.revealed = true;
          }
          if (!cl.mine && cl.flag) {
            cl.wrongFlag = true;
          }
        }
      }
      const handle = get()._timerHandle;
      if (handle) clearInterval(handle);
      playSfx("lose");
      vibrate([40, 30, 80]);
      set({
        board,
        gameOver: true,
        win: false,
        overlayVisible: true,
        _timerHandle: null,
      });
      return;
    }

    const countRef = { count: s.revealedCount };
    revealCascade(board, s.rows, s.cols, targetCell, countRef);

    playSfx("dig");
    vibrate(10);

    const totalSafe = s.rows * s.cols - s.mines;
    if (countRef.count === totalSafe) {
      for (let rr = 0; rr < s.rows; rr++) {
        for (let cc = 0; cc < s.cols; cc++) {
          const cl = board[rr][cc];
          if (cl.mine && !cl.flag) cl.flag = true;
        }
      }
      const handle = get()._timerHandle;
      if (handle) clearInterval(handle);
      playSfx("win");
      vibrate([30, 20, 30, 20, 60]);
      set({
        board,
        revealedCount: countRef.count,
        gameOver: true,
        win: true,
        overlayVisible: true,
        flags: s.mines,
        _timerHandle: null,
      });
      return;
    }

    set({ board, revealedCount: countRef.count });
  },

  toggleFlag: (r, c) => {
    const s = get();
    if (s.gameOver) return;
    const cell = s.board[r][c];
    if (cell.revealed) return;

    const board = s.board.map((row) => row.map((cl) => ({ ...cl })));
    const target = board[r][c];
    target.flag = !target.flag;

    playSfx("flag");
    vibrate(15);

    set({ board, flags: s.flags + (target.flag ? 1 : -1) });
  },
}));

export { DIFFS };
