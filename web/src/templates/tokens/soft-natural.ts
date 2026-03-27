import type { StyleTokens } from 'shared/templates';

export const softNaturalTokens: StyleTokens = {
  id: 'soft-natural',
  name: 'ソフトナチュラル',
  // Semantic Colors — 温かみ、パステル、親しみ
  surface: '#FFF8F0',
  onSurface: '#3E2723',
  onSurfaceSecondary: '#6D4C41',
  primary: '#FF8A80',        // コーラル（ブランドカラーで上書き）
  primaryVariant: '#E57373',
  secondary: '#80CBC4',      // ミント
  badge: '#FF8A80',
  onBadge: '#fff',
  // Typography
  fontFamily: "'Noto Sans JP', sans-serif",
  titleWeight: 700,
  // Decoration — 角丸大きめ、柔らかい
  borderRadius: '16px',
  dividerColor: '#80CBC4',
  // Photo
  coverPhotoLayout: 'bg-full',
  coverOverlay: 'linear-gradient(rgba(62,39,35,0.4),rgba(62,39,35,0.4))',
  ctaOverlay: 'linear-gradient(rgba(62,39,35,0.5),rgba(62,39,35,0.5))',
  contentPhotoHeight: '400px',
  contentPhotoRadius: '16px',
};
