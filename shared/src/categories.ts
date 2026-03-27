import type { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'beauty',
    name: '美容・サロン',
    icon: '💇',
    context: '美容室、エステ、ネイルサロン等の施術メニュー紹介、Before/After、美容Tips。※効果には個人差があります等の免責を自動付与。',
  },
  {
    id: 'food',
    name: '飲食・カフェ',
    icon: '🍽️',
    context: '飲食店、カフェ、ベーカリー等のメニュー紹介、季節限定メニュー、食材のこだわり紹介。',
  },
  {
    id: 'fitness',
    name: 'フィットネス',
    icon: '💪',
    context: 'ジム、パーソナルトレーニング、ヨガスタジオ等のトレーニングTips、ビフォーアフター、レッスン紹介。',
  },
  {
    id: 'consulting',
    name: 'コンサル・士業',
    icon: '📊',
    context: 'コンサルタント、税理士、弁護士、社労士等の専門知識共有、事例紹介、お役立ち情報。',
  },
  {
    id: 'retail',
    name: '小売・EC',
    icon: '🛍️',
    context: 'アパレル、雑貨、EC等の商品紹介、セール告知、コーディネート提案。',
  },
  {
    id: 'education',
    name: 'スクール',
    icon: '📚',
    context: '学習塾、習い事教室、オンラインスクール等のレッスン紹介、生徒の成果、学びのTips。',
  },
  {
    id: 'realestate',
    name: '不動産',
    icon: '🏠',
    context: '不動産仲介、リフォーム等の物件紹介、住まいのTips、エリア情報。',
  },
  {
    id: 'medical',
    name: 'クリニック',
    icon: '🏥',
    context: 'クリニック、歯科、整骨院等の健康Tips、施術紹介。※効果には個人差があります等の免責を自動付与。医療広告ガイドラインに配慮。',
  },
  {
    id: 'other',
    name: 'その他',
    icon: '✨',
    context: '上記に当てはまらない業種。汎用的なビジネス向けコンテンツ。',
  },
];
