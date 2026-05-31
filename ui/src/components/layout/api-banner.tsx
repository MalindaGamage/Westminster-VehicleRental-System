'use client';
import { useStore } from '@/lib/store';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export function ApiBanner() {
  const { loading, apiError, refresh } = useStore();

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 shadow-xl">
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        Connecting to API…
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-red-950/90 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300 shadow-xl max-w-sm">
        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="flex-1 text-xs leading-snug">{apiError}</span>
        <button
          onClick={() => refresh()}
          className="p-1 rounded-lg hover:bg-red-800/50 transition-colors flex-shrink-0"
          title="Retry"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
