import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught a render error in:', this.props.name || 'Unknown Component');
    console.error('[ErrorBoundary] Error:', error);
    console.error('[ErrorBoundary] Component Stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.MODE === 'development';
      const componentName = this.props.name || 'This page';

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="max-w-lg w-full text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={36} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-serif text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-white/40 text-sm mb-8">
              <span className="text-white/60 font-semibold">{componentName}</span> encountered an unexpected error
              and could not render. Your data is safe.
            </p>

            {/* Dev-only error details */}
            {isDev && this.state.error && (
              <div className="text-left mb-8 rounded-2xl bg-red-950/30 border border-red-500/20 p-5 overflow-auto max-h-48">
                <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-2">
                  Error Details (dev only)
                </p>
                <pre className="text-[11px] text-red-300 whitespace-pre-wrap break-all leading-relaxed">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 border border-white/10 text-white/60 rounded-full text-sm font-bold uppercase tracking-widest hover:border-white/20 hover:text-white/80 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
