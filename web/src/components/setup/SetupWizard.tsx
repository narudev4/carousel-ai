import { GOAL_LABELS, TONE_LABELS } from 'shared/accountProfile';
import type { GoalType, ToneType, AccountProfile } from 'shared/accountProfile';
import { useSetupWizard, TOTAL_STEPS, CORE_STEPS } from './useSetupWizard';

interface Props {
  onComplete: () => void;
  onCancel?: () => void;
  initialProfile?: AccountProfile | null;
}

interface StepDef {
  question: string;
  hint: string;
  field: 'genre' | 'targetAudience' | 'sellWhat' | 'primaryGoal' | 'specificGoal' | 'tone' | 'referenceAccounts' | 'ngExpressions';
  type: 'text' | 'goal-radio' | 'tone-radio';
  placeholder?: string;
}

const STEPS: StepDef[] = [
  {
    question: 'どんなジャンルのアカウントですか？',
    hint: '例：カフェ、美容師、ヨガ講師、税理士',
    field: 'genre',
    type: 'text',
    placeholder: 'ジャンルを入力',
  },
  {
    question: '誰に向けて発信していますか？',
    hint: '例：30代の働く女性、子育て中のママ、個人事業主',
    field: 'targetAudience',
    type: 'text',
    placeholder: 'ターゲット層を入力',
  },
  {
    question: '何を売りたい・伝えたいですか？',
    hint: '例：自家焙煎コーヒー豆、ヨガレッスン、税務相談、自分のブランド',
    field: 'sellWhat',
    type: 'text',
    placeholder: '商品・サービス・伝えたいことを入力',
  },
  {
    question: 'Instagramで一番達成したいことは？',
    hint: 'あなたの主な目標を選んでください',
    field: 'primaryGoal',
    type: 'goal-radio',
  },
  {
    question: '具体的な数字の目標はありますか？',
    hint: '例：月10件のDM問い合わせ、フォロワー1000人、月5件の予約',
    field: 'specificGoal',
    type: 'text',
    placeholder: '具体的な目標（任意）',
  },
  {
    question: 'どんな口調で発信したいですか？',
    hint: 'AIが生成するコピーのトーンに影響します',
    field: 'tone',
    type: 'tone-radio',
  },
  {
    question: '参考にしているアカウントはありますか？',
    hint: '複数ある場合はカンマ区切りで入力（@は任意）',
    field: 'referenceAccounts',
    type: 'text',
    placeholder: '@example1, @example2（任意）',
  },
  {
    question: '使いたくない言葉や表現はありますか？',
    hint: '例：激安, 絶対, 売り込み感のある言葉',
    field: 'ngExpressions',
    type: 'text',
    placeholder: 'NG表現をカンマ区切りで入力（任意）',
  },
];

const GOAL_OPTIONS = Object.entries(GOAL_LABELS) as [GoalType, string][];
const TONE_OPTIONS = Object.entries(TONE_LABELS) as [ToneType, string][];

export function SetupWizard({ onComplete, onCancel, initialProfile }: Props) {
  const { step, answers, saveError, updateAnswer, next, back, finish, isCoreComplete, isCurrentStepValid } =
    useSetupWizard(onComplete, initialProfile);

  const stepDef = STEPS[step];
  const isOptional = step >= CORE_STEPS;
  const isLastStep = step === TOTAL_STEPS - 1;
  const canEarlyFinish = step === CORE_STEPS - 1 && isCoreComplete();

  // コアステップ中は「1/4」、オプションに入ったら「5/8」形式で表示
  const stepDisplay = isOptional
    ? `${step + 1} / ${TOTAL_STEPS}`
    : `${step + 1} / ${CORE_STEPS}`;
  const progress = isOptional
    ? ((step + 1) / TOTAL_STEPS) * 100
    : ((step + 1) / CORE_STEPS) * 100;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && isCurrentStepValid()) {
      e.preventDefault();
      if (isLastStep) finish();
      else next();
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-lg font-bold text-pink-500">carousel-ai</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 font-medium">
            {stepDisplay}
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
              aria-label="キャンセル"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 bg-gray-100"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={isOptional ? TOTAL_STEPS : CORE_STEPS}
        aria-label={`ステップ ${stepDisplay}`}
      >
        <div
          className="h-full bg-pink-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start pt-12 px-6 max-w-lg mx-auto w-full">
        {step === 0 && (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3 mb-6 leading-relaxed">
            あなた専用のInstagram投稿を生成するために、アカウントのことを教えてください。回答はデバイスに保存され、次回から自動で使われます。
          </p>
        )}

        {isOptional && (
          <span className="text-xs text-gray-400 mb-2 font-medium">任意</span>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-2">{stepDef.question}</h2>
        <p id="step-hint" className="text-sm text-gray-400 mb-6">{stepDef.hint}</p>

        {/* Save error */}
        {saveError && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {saveError}
          </div>
        )}

        {/* Text input */}
        {stepDef.type === 'text' && (
          <textarea
            autoFocus
            rows={2}
            aria-label={stepDef.question}
            aria-describedby="step-hint"
            value={answers[stepDef.field as keyof typeof answers] as string}
            onChange={(e) => {
              const field = stepDef.field as 'genre' | 'targetAudience' | 'sellWhat' | 'specificGoal' | 'referenceAccounts' | 'ngExpressions';
              updateAnswer(field, e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder={stepDef.placeholder}
            className="w-full resize-none rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none px-4 py-3 text-gray-800 text-base placeholder-gray-300 transition-colors"
          />
        )}

        {/* Goal radio */}
        {stepDef.type === 'goal-radio' && (
          <div className="space-y-2" role="radiogroup" aria-label={stepDef.question}>
            {GOAL_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="primaryGoal"
                  value={value}
                  checked={answers.primaryGoal === value}
                  onChange={() => updateAnswer('primaryGoal', value)}
                  className="w-4 h-4 accent-pink-500"
                  aria-label={label}
                />
                <span className="text-gray-700 group-hover:text-pink-500 transition-colors">
                  {label}
                </span>
              </label>
            ))}
            {answers.primaryGoal === 'other' && (
              <input
                autoFocus
                type="text"
                value={answers.primaryGoalOther}
                onChange={(e) => updateAnswer('primaryGoalOther', e.target.value)}
                placeholder="目標を入力"
                className="mt-2 w-full rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:outline-none px-4 py-2 text-gray-800 text-base placeholder-gray-300 transition-colors"
              />
            )}
          </div>
        )}

        {/* Tone radio */}
        {stepDef.type === 'tone-radio' && (
          <div className="space-y-2" role="radiogroup" aria-label={stepDef.question}>
            {TONE_OPTIONS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="tone"
                  value={value}
                  checked={answers.tone === value}
                  onChange={() => updateAnswer('tone', value)}
                  className="w-4 h-4 accent-pink-500"
                  aria-label={label}
                />
                <span className="text-gray-700 group-hover:text-pink-500 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={back}
              className="px-4 py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              ← 戻る
            </button>
          )}

          <div className="flex-1" />

          {isOptional && !isLastStep && (
            <button
              onClick={next}
              className="px-4 py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              スキップ →
            </button>
          )}

          {isOptional && isLastStep && (
            <button
              onClick={finish}
              className="px-4 py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              スキップして完了
            </button>
          )}

          {canEarlyFinish && (
            <button
              onClick={finish}
              className="px-5 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              この内容で始める →
            </button>
          )}

          {!isLastStep ? (
            <button
              onClick={next}
              disabled={!isCurrentStepValid()}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-medium transition-colors"
            >
              次へ →
            </button>
          ) : (
            <button
              onClick={finish}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors"
            >
              始める ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
