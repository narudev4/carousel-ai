import { useState } from 'react';
import { loadAccountProfile } from 'shared/accountProfile';
import { ModeSelector } from './ModeSelector';
import { TextFlow } from './TextFlow';
import { PhotoFlow } from './PhotoFlow';
import { SetupWizard } from './setup/SetupWizard';

// Feature flag: 写真モードの有効/無効
const PHOTO_MODE_ENABLED = true;

export function GeneratePage() {
  const [showWizard, setShowWizard] = useState(() => loadAccountProfile() === null);
  const [mode, setMode] = useState<'text' | 'photo' | null>(
    PHOTO_MODE_ENABLED ? null : 'text'
  );

  if (showWizard) {
    return <SetupWizard onComplete={() => setShowWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
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
