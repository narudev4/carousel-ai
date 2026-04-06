import { useState } from 'react';
import type { AccountProfile, GoalType, ToneType } from 'shared/accountProfile';
import { saveAccountProfile } from 'shared/accountProfile';

export interface RawAnswers {
  genre: string;
  targetAudience: string;
  sellWhat: string;
  primaryGoal: GoalType | '';
  primaryGoalOther: string;
  specificGoal: string;
  tone: ToneType | '';
  referenceAccounts: string;
  ngExpressions: string;
}

const EMPTY_ANSWERS: RawAnswers = {
  genre: '',
  targetAudience: '',
  sellWhat: '',
  primaryGoal: '',
  primaryGoalOther: '',
  specificGoal: '',
  tone: '',
  referenceAccounts: '',
  ngExpressions: '',
};

export const TOTAL_STEPS = 8;
export const CORE_STEPS = 4; // steps 0-3 are required

function buildProfile(answers: RawAnswers): AccountProfile {
  const now = new Date().toISOString();
  // When goal is 'other', use the free-text as specificGoal if specificGoal is empty
  const specificGoal =
    answers.specificGoal.trim() ||
    (answers.primaryGoal === 'other' ? answers.primaryGoalOther.trim() : '');
  return {
    identity: {
      accountName: '',
      handle: '',
      genre: answers.genre.trim(),
      targetAudience: answers.targetAudience.trim(),
      sellWhat: answers.sellWhat.trim(),
    },
    strategy: {
      primaryGoal: (answers.primaryGoal || 'growth') as GoalType,
      specificGoal,
      postFrequency: '',
      referenceAccounts: answers.referenceAccounts
        ? answers.referenceAccounts.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    },
    style: {
      tone: (answers.tone || 'friendly') as ToneType,
      strongTopics: [],
      weakTopics: [],
      ngExpressions: answers.ngExpressions
        ? answers.ngExpressions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      ctaStyle: '',
    },
    createdAt: now,
    updatedAt: now,
  };
}

function profileToAnswers(profile: AccountProfile): RawAnswers {
  return {
    genre: profile.identity.genre,
    targetAudience: profile.identity.targetAudience,
    sellWhat: profile.identity.sellWhat,
    primaryGoal: profile.strategy.primaryGoal,
    primaryGoalOther: profile.strategy.primaryGoal === 'other' ? profile.strategy.specificGoal : '',
    specificGoal: profile.strategy.specificGoal,
    tone: profile.style.tone,
    referenceAccounts: profile.strategy.referenceAccounts.join(', '),
    ngExpressions: profile.style.ngExpressions.join(', '),
  };
}

export function useSetupWizard(onComplete: () => void, initialProfile?: AccountProfile | null) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<RawAnswers>(
    initialProfile ? profileToAnswers(initialProfile) : EMPTY_ANSWERS
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  function updateAnswer<K extends keyof RawAnswers>(key: K, value: RawAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finish() {
    const profile = buildProfile(answers);
    try {
      saveAccountProfile(profile);
      onComplete();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'プロフィールの保存に失敗しました');
    }
  }

  function isCoreComplete(): boolean {
    return (
      answers.genre.trim() !== '' &&
      answers.targetAudience.trim() !== '' &&
      answers.sellWhat.trim() !== '' &&
      answers.primaryGoal !== ''
    );
  }

  function isCurrentStepValid(): boolean {
    switch (step) {
      case 0: return answers.genre.trim() !== '';
      case 1: return answers.targetAudience.trim() !== '';
      case 2: return answers.sellWhat.trim() !== '';
      case 3: return answers.primaryGoal !== '' && (answers.primaryGoal !== 'other' || answers.primaryGoalOther.trim() !== '');
      default: return true; // optional steps are always valid
    }
  }

  return {
    step,
    answers,
    saveError,
    updateAnswer,
    next,
    back,
    finish,
    isCoreComplete,
    isCurrentStepValid,
  };
}
