import { useState, useRef, useCallback } from 'react';

interface Props {
  onUpload: (base64: string, dataUri: string) => void;
  onBack: () => void;
}

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_BASE64_SIZE = 2 * 1024 * 1024; // 2MB (API制限と一致)
const MAX_DIMENSION = 800;
const MIN_DIMENSION = 200;

export function PhotoUpload({ onUpload, onBack }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState('');
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setIsProcessing(true);

    // ファイル形式チェック
    if (!VALID_TYPES.includes(file.type)) {
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        setError('HEIC形式は未対応です。設定 → カメラ → フォーマットで「互換性優先」に変更してください。');
      } else {
        setError('JPEG, PNG, WebP のみ対応です。');
      }
      setIsProcessing(false);
      return;
    }

    // サイズチェック
    if (file.size > MAX_FILE_SIZE) {
      setError('5MB以下の画像を選択してください。');
      setIsProcessing(false);
      return;
    }

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      });

      // 最小サイズチェック
      if (Math.max(img.width, img.height) < MIN_DIMENSION) {
        setError('画像が小さすぎます（200px以上必要）。');
        URL.revokeObjectURL(img.src);
        setIsProcessing(false);
        return;
      }

      // リサイズ
      let w = img.width, h = img.height;
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        if (w > h) { h = Math.round(h * MAX_DIMENSION / w); w = MAX_DIMENSION; }
        else { w = Math.round(w * MAX_DIMENSION / h); h = MAX_DIMENSION; }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF'; // 透過PNG→白背景
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(img.src);

      // JPEG変換、段階的圧縮で2MB以下を保証
      let dataUri: string = '';
      const qualities = [0.85, 0.7, 0.5];
      for (const q of qualities) {
        dataUri = canvas.toDataURL('image/jpeg', q);
        const sizeBytes = Math.round((dataUri.length - 'data:image/jpeg;base64,'.length) * 0.75);
        if (sizeBytes <= MAX_BASE64_SIZE) break;
      }

      // それでも2MB超 → 解像度を下げて再圧縮
      if (Math.round((dataUri.length - 'data:image/jpeg;base64,'.length) * 0.75) > MAX_BASE64_SIZE) {
        const smallW = Math.min(w, 600);
        const smallH = Math.round(h * smallW / w);
        canvas.width = smallW;
        canvas.height = smallH;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, smallW, smallH);
        ctx.drawImage(img, 0, 0, smallW, smallH);
        dataUri = canvas.toDataURL('image/jpeg', 0.7);
      }

      const base64 = dataUri.split(',')[1];
      const sizeKB = Math.round(base64.length * 0.75 / 1024);

      setPreview(dataUri);
      setFileInfo(`${w}×${h}px, ${sizeKB}KB`);

      // 親に通知
      onUpload(base64, dataUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">写真をアップロード</h2>
      <p className="text-sm text-gray-500 mb-6">写真を1枚アップするだけで、AIが自動でカルーセルを生成します</p>

      {/* アップロードエリア */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 transition-all"
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-w-[300px] max-h-[200px] mx-auto rounded-lg" />
        ) : (
          <>
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-600">ドラッグ&ドロップ、またはクリックして選択</p>
          </>
        )}
        <p className="text-xs text-gray-400 mt-2">JPEG / PNG / WebP（5MB以下）</p>
        {fileInfo && <p className="text-xs text-gray-500 mt-1">{fileInfo}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* エラー */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 同意チェック */}
      {preview && (
        <label className="flex items-start gap-2 mt-4 text-xs text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            写真はAI分析のためAnthropicのサーバーに送信されます。処理後即破棄され、保存されません。
            <a href="/privacy" className="text-pink-500 underline ml-1">プライバシーポリシー</a>
          </span>
        </label>
      )}

      {/* 処理中 */}
      {isProcessing && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-2" />
          画像を処理中...
        </div>
      )}

      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="mt-6 text-sm text-gray-400 hover:text-gray-600"
      >
        ← モード選択に戻る
      </button>
    </div>
  );
}
