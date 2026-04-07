import { useState } from 'react';
import { loadAccountProfile } from 'shared/accountProfile';
import type { AccountProfile } from 'shared/accountProfile';
import { ModeSelector } from './ModeSelector';
import { TextFlow } from './TextFlow';
import { PhotoFlow } from './PhotoFlow';
import { SetupWizard } from './setup/SetupWizard';

// Feature flag: 写真モードの有効/無効
const PHOTO_MODE_ENABLED = true;

export function GeneratePage() {
  const [showWizard, setShowWizard] = useState(() => loadAccountProfile() === null);
  const [editProfile, setEditProfile] = useState<AccountProfile | null>(null);
  const [mode, setMode] = useState<'text' | 'photo' | null>(
    PHOTO_MODE_ENABLED ? null : 'text'
  );

  if (showWizard || editProfile !== null) {
    return (
      <SetupWizard
        initialProfile={editProfile}
        onComplete={() => {
          setShowWizard(false);
          setEditProfile(null);
        }}
        onCancel={editProfile !== null ? () => setEditProfile(null) : undefined}
      />
    );
  }

  function handleEditProfile() {
    setEditProfile(loadAccountProfile());
    setMode(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* プロフィール編集リンク */}
        {mode === null && (
          <div className="text-right mb-2">
            <button
              onClick={handleEditProfile}
              className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
            >
              アカウント設定を変更
            </button>
          </div>
        )}

        {mode === null && (
          <ModeSelector onSelect={setMode} />
        )}

        {mode === 'text' && (
          <TextFlow onBack={() => setMode(null)} />
        )}

        {mode === 'photo' && (
          <PhotoFlow onBack={() => setMode(null)} />
        )}
      </div>
    </div>
  );
}
