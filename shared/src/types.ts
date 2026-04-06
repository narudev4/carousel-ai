// ===== スライドタイプ =====

export type SlideType =
  | 'cover'
  | 'tip'
  | 'before'
  | 'after'
  | 'explanation'
  | 'benefit'
  | 'cta';

// ===== AI生成リクエスト/レスポンス =====

export interface GenerateRequest {
  category: string;
  format: string; // "tips" | "before_after" | "campaign"
  theme: string; // 5〜200文字
  brandColor?: string; // HEX 6桁 /^#[0-9A-Fa-f]{6}$/
  accentColor?: string;
  cta?: string; // 最大100文字
  additionalInfo?: string; // 最大500文字
  accountProfile?: import('./accountProfile').AccountProfile; // アカウント記憶（任意）
}

export interface Slide {
  type: SlideType;
  number?: number;
  title: string;
  body?: string;
  emphasis?: string;
  imageUrl?: string;
}

// ===== 写真分析リクエスト/レスポンス =====

export interface PhotoAnalyzeRequest {
  image: string; // base64エンコード画像
  mimeType: string; // "image/jpeg" | "image/png" | "image/webp"
}

export interface PhotoVisionResult {
  category: string;
  theme: string;
  mood: string;
}

export interface GenerateResponse {
  slides: Slide[];
  caption: string; // 200-400文字
  hashtags: string[]; // 10-15個
  metadata: {
    format: string;
    category: string;
    hookType: string;
  };
}

export interface PhotoAnalyzeResponse extends GenerateResponse {
  vision: PhotoVisionResult;
  recommendedStyleId: string;
  availableStyles: string[];
}

// ===== フォーマット定義 =====

export interface SlideInstruction {
  type: SlideType;
  number?: number;
  instruction: string;
}

export interface Format {
  id: string;
  name: string;
  description: string;
  slides: SlideInstruction[];
  promptFragment: string;
}

// ===== カテゴリ定義 =====

export interface Category {
  id: string;
  name: string;
  icon: string;
  context: string;
}
