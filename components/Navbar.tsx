'use client';

import { Compass, PlusCircle, RefreshCw, Server } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isFetching: boolean;
}

export function Navbar({ onOpenCreateModal, onRefresh, isFetching }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
              Wanderlust
            </span>
          </div>
        </div>

        {/* Status Indicator & Quick Actions */}
        <div className="flex items-center gap-3">

          <button
            onClick={onRefresh}
            disabled={isFetching}
            title="Refresh packages from API"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-medium text-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Package</span>
          </button>
        </div>
      </div>
    </header>
  );
}
