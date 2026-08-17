import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-rose-800 p-8 rounded-3xl max-w-lg shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">Terjadi Kendala pada Sesi Aplikasi</h2>
            <p className="text-xs text-slate-400">
              Data sesi lokal sebelumnya mungkin perlu disinkronkan ulang. Klik tombol di bawah untuk memuat ulang dengan data resmi.
            </p>
            <div className="text-[11px] font-mono text-rose-300 bg-slate-950 p-3 rounded-xl max-h-24 overflow-y-auto text-left">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('JARRAKPOS_ACTIVE_PLATFORM_V1');
                window.location.reload();
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg shadow-rose-900/40"
            >
              Muat Ulang Aplikasi &amp; Reset Sesi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
