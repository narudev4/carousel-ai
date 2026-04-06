import { test, expect } from '@playwright/test';

// Mock response matching GenerateResponse type
const MOCK_GENERATE_RESPONSE = {
  slides: [
    { type: 'cover', title: 'プロが教えるカフェ集客3つの方法' },
    { type: 'tip', number: 1, title: 'SNSで写真映えを演出する', body: 'ライティングと構図にこだわり、保存されやすい写真を投稿する' },
    { type: 'tip', number: 2, title: 'リピーターを育てる仕組み', body: 'スタンプカードやLINE登録特典で来店頻度を上げる' },
    { type: 'tip', number: 3, title: '口コミを自然に広げる', body: 'お客様の体験を大切にして、自発的なシェアを促す' },
    { type: 'cta', title: 'プロフのリンクから予約', body: 'お席のご予約はプロフィールのリンクからどうぞ' },
  ],
  caption: 'カフェ集客でお悩みの方へ。今日からすぐ実践できる3つの方法をご紹介します。SNS活用・リピーター施策・口コミ拡散、それぞれ具体的なアクションに落とし込んでいます。ぜひ保存して読み返してください。',
  hashtags: ['#カフェ集客', '#カフェ経営', '#小規模ビジネス'],
  metadata: { format: 'tips', category: 'food', hookType: 'authority' },
};

test.describe('wizard → generate flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/generate');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('completes setup wizard, generates carousel, shows preview', async ({ page }) => {
    // 1. Setup wizard should appear (no profile in localStorage)
    await expect(page.getByText('carousel-ai')).toBeVisible();
    await expect(page.getByText('1 / 8')).toBeVisible();

    // Step 1: ジャンル
    await page.getByRole('textbox', { name: 'どんなジャンルのアカウントですか？' }).fill('カフェ');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 2: ターゲット層
    await page.getByRole('textbox', { name: '誰に向けて発信していますか？' }).fill('30代の働く女性');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 3: 売りたいもの
    await page.getByRole('textbox', { name: '何を売りたい・伝えたいですか？' }).fill('自家焙煎コーヒーとランチ');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 4: 主目標（radio）
    await page.getByRole('radio', { name: 'フォロワーを増やしたい' }).check();
    // Core complete: "この内容で始める →" button should appear
    await expect(page.getByRole('button', { name: 'この内容で始める →' })).toBeVisible();
    await page.getByRole('button', { name: 'この内容で始める →' }).click();

    // 2. Account profile saved to localStorage
    const profile = await page.evaluate(() => localStorage.getItem('carousel-ai:account-profile'));
    expect(profile).not.toBeNull();
    const parsed = JSON.parse(profile!);
    expect(parsed.identity.genre).toBe('カフェ');
    expect(parsed.identity.targetAudience).toBe('30代の働く女性');

    // 3. Mode selector visible
    await expect(page.getByText('テキストモード')).toBeVisible();

    // 4. Select text mode
    await page.getByText('テキストモード').click();

    // 5. Category selection
    await expect(page.getByText('カテゴリを選択')).toBeVisible();
    await page.getByRole('button', { name: /飲食・カフェ/ }).click();
    await page.getByRole('button', { name: '次へ →' }).click();

    // 6. Format selection
    await expect(page.getByText('フォーマットを選択').or(page.getByText('Tips型'))).toBeVisible();
    await page.getByRole('button', { name: /Tips型/ }).click();
    await page.getByRole('button', { name: '次へ →' }).click();

    // 7. Detail form: enter theme
    await expect(page.getByText('詳細を入力')).toBeVisible();
    await page.getByPlaceholder('例: 秋の新メニュー紹介').fill('カフェ集客を増やす3つの方法');

    // 8. Mock API before submitting
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GENERATE_RESPONSE),
      });
    });

    // 9. Submit
    await page.getByRole('button', { name: '生成する ✨' }).click();

    // 10. Preview visible
    await expect(page.getByText('生成完了')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('プレビュー')).toBeVisible();
    // First slide title should appear in preview
    await expect(page.getByText('1 / 5')).toBeVisible();
  });

  test('profile edit mode pre-fills wizard answers', async ({ page }) => {
    // Set an existing profile in localStorage
    const existingProfile = {
      identity: { accountName: '', handle: '', genre: '美容師', targetAudience: '20代女性', sellWhat: 'カット・カラー' },
      strategy: { primaryGoal: 'sales', specificGoal: '月20件の予約', postFrequency: '', referenceAccounts: [] },
      style: { tone: 'friendly', strongTopics: [], weakTopics: [], ngExpressions: [], ctaStyle: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await page.evaluate((p) => localStorage.setItem('carousel-ai:account-profile', JSON.stringify(p)), existingProfile);

    await page.goto('/generate');

    // Should show mode selector (not wizard) since profile exists
    await expect(page.getByText('テキストモード')).toBeVisible();

    // Click "アカウント設定を変更"
    await page.getByRole('button', { name: 'アカウント設定を変更' }).click();

    // Wizard should open with pre-filled values
    await expect(page.getByRole('textbox', { name: 'どんなジャンルのアカウントですか？' })).toHaveValue('美容師');
  });
});
