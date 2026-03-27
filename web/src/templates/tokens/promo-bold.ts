import type { StyleTokens } from 'shared/templates';

export const promoBoldTokens: StyleTokens = {
  id: 'promo-bold',
  name: 'プロモボールド',
  // Semantic Colors — コントラスト強、訴求力
  surface: '#1A1A1A',
  onSurface: '#FFFFFF',
  onSurfaceSecondary: '#B0BEC5',
  primary: '#FF5252',        // 赤（ブランドカラーで上書き）
  primaryVariant: '#D32F2F',
  secondary: '#FFD740',      // 黄
  badge: '#FF5252',
  onBadge: '#fff',
  // Typography — 極太
  fontFamily: "'Noto Sans JP', sans-serif",
  titleWeight: 900,
  // Decoration — 角ばった、太い
  borderRadius: '8px',
  dividerColor: '#FFD740',
  // Photo
  coverPhotoLayout: 'bg-full',
  coverOverlay: 'linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7))',
  ctaOverlay: 'linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.85))',
  contentPhotoHeight: '500px',
  contentPhotoRadius: '0',
};
