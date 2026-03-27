import type { StyleTokens } from 'shared/templates';

export const minimalCleanTokens: StyleTokens = {
  id: 'minimal-clean',
  name: 'ミニマルクリーン',
  // Semantic Colors
  surface: '#FAFAFA',
  onSurface: '#1a1a1a',
  onSurfaceSecondary: '#555',
  primary: '#E91E63',      // ブランドカラーで上書きされる
  primaryVariant: '#C2185B',
  secondary: '#FFC107',    // アクセントカラーで上書きされる
  badge: '#E91E63',
  onBadge: '#fff',
  // Typography
  fontFamily: "'Noto Sans JP', sans-serif",
  titleWeight: 900,
  // Decoration
  borderRadius: '50%',     // バッジの角丸
  dividerColor: '#FFC107',
  // Photo
  coverPhotoLayout: 'bg-full',
  coverOverlay: 'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6))',
  ctaOverlay: 'linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8))',
  contentPhotoHeight: '500px',
  contentPhotoRadius: '0',
};
