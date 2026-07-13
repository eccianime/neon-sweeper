# Neon Sweeper — React Native (Expo)

Conversión completa del buscaminas "NEON SWEEPER" (HTML/CSS/JS) a **React Native + NativeWind + Reanimated + Zustand**.

## Instalación

```bash
npm install
npx expo start
```

Requiere Expo SDK 51 (React Native 0.74). Si usas un proyecto Expo ya creado, copia las carpetas `app/`, `App.tsx`, `tailwind.config.js`, `babel.config.js`, `metro.config.js` y agrega las dependencias del `package.json`.

## Estructura

```
app/
  components/
    Header.tsx          -> título con animación "flicker" (Reanimated)
    DifficultyButtons.tsx-> selector EASY/MEDIUM/HARD
    StatsBar.tsx         -> contador de minas, mute, reset, timer
    Board.tsx            -> grilla responsive del tablero
    Cell.tsx             -> celda individual (tap = cavar, long-press = bandera)
    ModeToggle.tsx        -> selector de modo DIG/FLAG (para dispositivos sin long-press cómodo)
    GameOverlay.tsx       -> pantalla de victoria/derrota
  store/
    gameStore.ts          -> TODA la lógica del juego en Zustand (tablero, minas, cascada, timer)
  utils/
    sound.ts              -> sintetizador de efectos de sonido (equivalente al Web Audio original) vía expo-av
    haptics.ts             -> vibración/haptics (equivalente a navigator.vibrate)
  theme/
    colors.ts              -> paleta neón compartida
  global.css               -> directivas de Tailwind requeridas por NativeWind v4
App.tsx                    -> composición de pantalla + carga de fuentes (Orbitron / Share Tech Mono)
```

## Decisiones de la conversión

- **Estado global (Zustand)**: todo el estado mutable del juego original (tablero, minas, flags, timer, gameOver, modo, mute) vive en `useGameStore`. Los componentes se suscriben solo a lo que necesitan para minimizar renders.
- **Animaciones (Reanimated)**:
  - El "flicker" del título usa `withRepeat` + `withSequence` replicando los keyframes CSS (92%-94% de opacidad).
  - Las celdas usan `withSpring` al presionar (equivalente a `.covered:active { transform: scale(0.9) }`).
  - El overlay de victoria/derrota hace fade + scale al aparecer.
  - Los botones de dificultad y modo animan su estado activo.
- **Gestos**: el tap-para-cavar y long-press-para-bandera del original (350ms) se implementaron con `onPressIn`/`onPressOut` + `setTimeout`, igual que la lógica original de `pressTimer`.
- **Sonido**: Web Audio API no existe en RN. Se sintetizan WAVs cortos en base64 en runtime (onda cuadrada / ruido) y se reproducen con `expo-av`, manteniendo el mismo carácter chiptune sin necesitar archivos de audio externos.
- **Vibración**: se usa `Vibration.vibrate()` para patrones largos y `expo-haptics` para toques cortos (se siente más nativo).
- **Fuentes**: Orbitron y Share Tech Mono se cargan vía `@expo-google-fonts`.
- **Iconos**: `lucide-react-native` reemplaza a `lucide` (misma librería, versión RN).
- **Layout responsive del tablero**: se mide el ancho del panel con `onLayout` y se calcula el tamaño de celda igual que `sizeGrid()` en el original.

## Pendientes / mejoras opcionales

- Persistencia de `muted` (el original usaba `localStorage`) — se puede agregar con `@react-native-async-storage/async-storage` y el middleware `persist` de Zustand.
- Scanlines / grid de fondo decorativo (`background-image` con gradientes) se omitió por simplicidad; se puede recrear con un `Svg` de fondo si se desea el detalle visual completo.
