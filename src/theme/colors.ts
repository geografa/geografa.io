export const colors = {
  ink: "#162321",
  cream: "#f4f1de",
  gold: "#eee9c5",
  goldLight: "#eaeca3",
  green: "#2d5a3d",
  red: "#e07a5f",
  muted: "#40564b",
  cardBg: "#fffdf8",
  border: "#142623",
} as const;

export type BrandColor = keyof typeof colors;

/** CSS custom property names keyed to brand tokens */
export const cssVars: Record<string, string> = {
  "--ink": colors.ink,
  "--cream": colors.cream,
  "--gold": colors.gold,
  "--gold-light": colors.goldLight,
  "--red": colors.red,
  "--green": colors.green,
  "--muted": colors.muted,
  "--card-bg": colors.cardBg,
  "--border": colors.border,
};

export function applyTheme(): void {
  const root = document.documentElement;
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
