import React, { useState } from 'react';
import { usePlateShare } from '../context/PlateShareContext';
import { DEMO_PROFILES } from '../data/sampleListings';
import { Sparkles, RotateCcw, UserCheck, AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function JudgeDemoBar() {
  const { currentRole, switchRole, resetData, metrics } = usePlateShare();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  if (!isBannerVisible) {
    return (
      <button
        onClick={() => setIsBannerVisible(true)}
        className="fixed top-2 right-4 z-40 bg-brand-900 text-white text-xs px-2.5 py-1 rounded-full shadow-md hover:bg-brand-800 flex items-center gap-1.5 transition"
        title="Open Hackathon Demo Bar"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-300" />
        <span>Demo Controls</span>
      </button>
    );
  }

  return (
    <>
      <div className="bg-brand-950 text-white text-xs py-2 px-3 sm:px-6 border-b border-brand-800 shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Demo badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-800/80 text-brand-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3 h-3 text-brand-300" />
              Hackathon Judge Demo Mode
            </span>
            <span className="hidden md:inline text-brand-200/80 text-[11px]">
              Testing live: {metrics.totalAvailableListings} available listings ({metrics.availableMeals} meals)
            </span>
          </div>

          {/* Center: Role Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-300 hidden sm:inline text-[11px] font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Test As:
            </span>
            <div className="inline-flex bg-brand-900 p-0.5 rounded-lg border border-brand-700/60">
              <button
                onClick={() => switchRole('ngo')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  currentRole === 'ngo'
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-brand-200 hover:text-white hover:bg-brand-800/60'
                }`}
                title="Switch to Hope Community Food Pantry (NGO)"
              >
                NGO (Dr. Sarah)
              </button>
              <button
                onClick={() => switchRole('volunteer')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  currentRole === 'volunteer'
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-brand-200 hover:text-white hover:bg-brand-800/60'
                }`}
                title="Switch to Alex Rivera (Volunteer Runner)"
              >
                Volunteer (Alex)
              </button>
              <button
                onClick={() => switchRole('donor')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  currentRole === 'donor'
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-brand-200 hover:text-white hover:bg-brand-800/60'
                }`}
                title="Switch to Chef Marcus Vance (Donor)"
              >
                Donor (Chef Marcus)
              </button>
            </div>
          </div>

          {/* Right: Reset Data Button and Close Banner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1 text-[11px] bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 px-2.5 py-1 rounded-md transition font-medium"
              title="Reset sample listings & activities"
            >
              <RotateCcw className="w-3 h-3 text-red-400" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={() => setIsBannerVisible(false)}
              className="text-brand-400 hover:text-white p-1 rounded hover:bg-brand-800/50 transition"
              aria-label="Minimize demo banner"
              title="Minimize banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-lg border border-dark-border space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 id="reset-modal-title" className="text-lg font-bold text-dark-text">
                  Reset Demo Data?
                </h3>
                <p className="text-xs text-dark-secondary">
                  Confirm sample database restoration
                </p>
              </div>
            </div>

            <p className="text-sm text-dark-secondary leading-relaxed">
              This will restore all default mock listings, active claims, and sample impact statistics. Any customized listings you created will be reset to the original hackathon demo state.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-dark-secondary hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
