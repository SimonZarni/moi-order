# Tasks requiring a new EAS native build

These features are partially implemented via OTA but need a native rebuild
to reach their final behaviour. Run `eas build --platform all` when ready.

---

## 1. One-tap clipboard copy on LINE Pay screen

**Status:** Working via OTA (Share sheet fallback) — needs EAS build for silent one-tap copy

**What's in place:**
- `expo-clipboard ~8.0.8` is already in `package.json`
- `useFoodOrderDetailScreen.ts → handleCopyMessage` tries `Clipboard.setStringAsync` first,
  falls back to `Share.share` (the native OS share sheet) if the native module is absent

**Current UX (OTA):**
User taps clipboard icon → iOS/Android share sheet opens → user taps "Copy"

**UX after EAS build:**
User taps clipboard icon → text silently copied → clipboard icon turns green ✓ for 2 s

**Files already updated:**
- `moi-order-frontend/package.json` — `expo-clipboard ~8.0.8` added
- `src/features/food/hooks/useFoodOrderDetailScreen.ts` — `handleCopyMessage`
- `src/features/food/components/OrderProgressBar.tsx` — clipboard button + `hasCopied` state
- `src/features/food/components/OrderProgressBar.styles.ts` — `copyCard`, `copyRow`, `copyHint`, `copyMessageText`, `copyBtn` styles

**No code changes needed after build** — the try/catch auto-promotes to the native path.

---
