import type { Slide } from './types';

// ===== Style Tokens =====

export interface StyleTokens {
  id: string;
  name: string;
  // Semantic Colors
  surface: string;
  onSurface: string;
  onSurfaceSecondary: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
  badge: string;
  onBadge: string;
  // Typography
  fontFamily: string;
  titleWeight: number;
  // Decoration
  borderRadius: string;
  dividerColor: string;
  // Photo
  coverPhotoLayout: 'bg-full' | 'left-half' | 'rounded-top';
  coverOverlay: string;
  ctaOverlay: string;
  contentPhotoHeight: string;
  contentPhotoRadius: string;
}

// ===== Design Style =====

export interface DesignStyle {
  id: string;
  name: string;
  tokens: StyleTokens;
  categoryMatch: string[];
}

// ===== Render Interface =====

export interface RenderResult {
  style: string;
  innerHTML: string;
}

export interface RenderOptions {
  brandColor: string;
  accentColor: string;
  photoDataUri?: string;
}
