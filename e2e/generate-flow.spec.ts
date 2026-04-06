import { test, expect } from 'playwright/test';

const MOCK_GENERATE_RESPONSE = {
  slides: [
    { type: 'cover', title: '春メニューで迷わない3つのコツ' },
    { type: 'tip', number: 1, title: '最初に香りで選ぶ', body: '季節限定ドリンクは香りの印象で選ぶと満足度が上がります。' },
    { type: 'tip', number: 2, title: '温度で気分を変える', body: '朝はホット、午後はアイスなど時間帯で飲み分ける提案が効果的です。' },
    { type: 'tip', number: 3, title: '写真映えも添える', body: '色味やトッピングの見せ方を一言添えると保存率が上がります。' },
    { type: 'cta', title: '続きはプロフから予約', body: '春のおすすめ一覧はプロフィールのリンクからチェックしてください。' },
  ],
  caption: '春限定メニューをどう見せるかで来店率は大きく変わります。今回はカフェアカウント向けに、保存されやすく予約につながる構成でまとめました。',
  hashtags: ['#カフェ集客', '#インスタ運用', '#春メニュー'],
  metadata: { format: 'tips', category: 'food', hookType: 'number' },
};

test.describe('wizard → generate flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generate');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('completes setup wizard, generates carousel, shows preview', async ({ page }) => {
    // 1. Wizard appears (no profile)
    await expect(page.getByText('carousel-ai')).toBeVisible();
    await expect(page.getByText('1 / 8')).toBeVisible();

    // Step 1: ジャンル
    await page.getByRole('textbox', { name: 'どんなジャンルのアカウントですか？' }).fill('カフェ');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 2: ターゲット層
    await page.getByRole('textbox', { name: '誰に向けて発信していますか？' }).fill('20代後半の働く女性');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 3: 売りたいもの
    await page.getByRole('textbox', { name: '何を売りたい・伝えたいですか？' }).fill('春の新メニュー');
    await page.getByRole('button', { name: '次へ →' }).click();

    // Step 4: 主目標
    await page.getByLabel('商品・サービスを売りたい').check();
    await expect(page.getByRole('button', { name: 'この内容で始める →' })).toBeVisible();
    await page.getByRole('button', { name: 'この内容で始める →' }).click();

    // 2. Profile saved to localStorage
    const storedProfile = await page.evaluate(() => localStorage.getItem('carousel-ai:account-profile'));
    expect(storedProfile).not.toBeNull();
    const parsed = JSON.parse(storedProfile!);
    expect(parsed.identity.genre).toBe('カフェ');
    expect(parsed.strategy.primaryGoal).toBe('sales');

    // 3. Mode selector
    await expect(page.getByRole('heading', { name: 'カルーセルを作る' })).toBeVisible();
    await page.getByRole('button', { name: 'テキストで作る' }).click();

    // 4. Category
    await page.getByRole('button', { name: /飲食・カフェ/ }).click();
    await page.getByRole('button', { name: '次へ →' }).click();

    // 5. Format
    await page.getByRole('button', { name: /Tips型/ }).click();
    await page.getByRole('button', { name: '次へ →' }).click();

    // 6. Detail form + API mock
    await page.getByPlaceholder('例: 秋の新メニュー紹介').fill('春の新メニュー紹介');

    await page.route('**/api/generate', async (route) => {
      const body = route.request().postDataJSON();
      expect(body.category).toBe('food');
      expect(body.format).toBe('tips');
      expect(body.accountProfile?.identity?.genre).toBe('カフェ');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GENERATE_RESPONSE),
      });
    });

    await page.getByRole('button', { name: '生成する ✨' }).click();

    // 7. Preview
    await expect(page.getByRole('heading', { name: '生成完了' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('プレビュー')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'キャプション' })).toBeVisible();
  });

  test('profile edit mode pre-fills wizard answers', async ({ page }) => {
    const existingProfile = {
      identity: { accountName: '', handle: '', genre: '美容師', targetAudience: '20代女性', sellWhat: 'カット・カラー' },
      strategy: { primaryGoal: 'sales', specificGoal: '月20件の予約', postFrequency: '', referenceAccounts: [] },
      style: { tone: 'friendly', strongTopics: [], weakTopics: [], ngExpressions: [], ctaStyle: '' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await page.evaluate((p) => localStorage.setItem('carousel-ai:account-profile', JSON.stringify(p)), existingProfile);
    await page.goto('/generate');

    // Should show mode selector, not wizard
    await expect(page.getByRole('heading', { name: 'カルーセルを作る' })).toBeVisible();

    // Edit profile
    await page.getByRole('button', { name: 'アカウント設定を変更' }).click();

    // Wizard opens with pre-filled value
    await expect(page.getByRole('textbox', { name: 'どんなジャンルのアカウントですか？' })).toHaveValue('美容師');
  });
});
