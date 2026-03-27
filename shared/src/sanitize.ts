/**
 * HTMLタグを除去する（DOMPurify不要のシンプル版。Workers環境でDOMがないため）
 */
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * テキスト入力をサニタイズ
 */
export function sanitizeInput(text: string, maxLength: number): string {
  let result = text;
  result = stripHtml(result);
  result = result.normalize('NFKC');
  result = result.trim();
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
  }
  return result;
}

/**
 * HTMLエスケープ。slide.title/bodyをinnerHTMLに埋め込む前に必ず通す。
 */
export function escapeHtml(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * HEXカラーをバリデーション。不正値はデフォルトを返す
 */
export function sanitizeHexColor(
  color: string | undefined,
  defaultColor: string,
): string {
  if (!color) return defaultColor;
  const hex = color.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
  return defaultColor;
}
