import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">エラーが発生しました</h2>
          <p className="text-sm text-gray-500 mb-6">
            申し訳ありません。予期しないエラーが発生しました。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
          >
            ページを再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
