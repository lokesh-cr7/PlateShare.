import React from 'react';
import { calculateFreshness } from '../utils/freshness';
import { Clock, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function FreshnessMeter({ listing, currentTime, compact = false }) {
  const freshness = calculateFreshness(listing, currentTime);

  let StatusIcon = ShieldCheck;
  if (freshness.status === 'expiring-soon') StatusIcon = AlertTriangle;
  if (freshness.status === 'expired') StatusIcon = AlertCircle;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${freshness.badgeColor}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{compact ? freshness.shortLabel : freshness.statusLabel}</span>
        </span>
        <span className={`font-mono font-bold flex items-center gap-1 ${freshness.textColor}`}>
          <Clock className="w-3.5 h-3.5" />
          {freshness.timeRemainingFormatted}
        </span>
      </div>

      {/* Visual meter bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 rounded-full ${freshness.meterColor}`}
          style={{ width: `${freshness.percentRemaining}%` }}
          role="progressbar"
          aria-valuenow={freshness.percentRemaining}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Freshness meter: ${freshness.percentRemaining}% remaining`}
        />
      </div>

      {!compact && (
        <p className="text-[11px] text-dark-secondary italic leading-tight">
          {freshness.safetyNotice}
        </p>
      )}
    </div>
  );
}
