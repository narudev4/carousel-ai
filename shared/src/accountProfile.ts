export type GoalType = 'growth' | 'sales' | 'awareness' | 'inquiries' | 'other';
export type ToneType = 'friendly' | 'trustworthy' | 'expert' | 'casual';

export const GOAL_LABELS: Record<GoalType, string> = {
  growth: 'フォロワーを増やしたい',
  sales: '商品・サービスを売りたい',
  awareness: '認知を広げたい',
  inquiries: 'DM問い合わせを増やしたい',
  other: 'その他',
};

export const TONE_LABELS: Record<ToneType, string> = {
  friendly: 'フレンドリー・親しみやすい',
  trustworthy: '丁寧・信頼感',
  expert: '専門的・権威感',
  casual: 'カジュアル・等身大',
};

export interface AccountProfile {
  identity: {
    accountName: string;
    handle: string;
    genre: string;
    targetAudience: string;
    sellWhat: string;
  };
  strategy: {
    primaryGoal: GoalType;
    specificGoal: string;
    postFrequency: string;
    referenceAccounts: string[];
  };
  style: {
    tone: ToneType;
    strongTopics: string[];
    weakTopics: string[];
    ngExpressions: string[];
    ctaStyle: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const ACCOUNT_PROFILE_KEY = 'carousel-ai:account-profile';

export function loadAccountProfile(): AccountProfile | null {
  try {
    const raw = localStorage.getItem(ACCOUNT_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as AccountProfile) : null;
  } catch {
    return null;
  }
}

export function saveAccountProfile(profile: AccountProfile): void {
  localStorage.setItem(ACCOUNT_PROFILE_KEY, JSON.stringify(profile));
}
