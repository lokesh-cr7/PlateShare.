/**
 * PlateShare Freshness & Safe Window Calculation Engine
 * 
 * DISCLAIMER:
 * Countdown and freshness indicators are operational tracking estimates
 * based on donor-specified preparation and safe pickup deadlines.
 * They do not constitute an independent laboratory food-safety certification.
 * Temperature control and physical inspection remain mandatory upon pickup.
 */

export function calculateFreshness(listing, now = new Date()) {
  if (!listing || !listing.pickupDeadline) {
    return {
      status: 'unknown',
      statusLabel: 'Time Unknown',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
      meterColor: 'bg-gray-400',
      percentRemaining: 0,
      timeRemainingFormatted: 'No deadline provided',
      isExpired: false,
      hoursRemaining: 0,
      minutesRemaining: 0,
      canClaim: false
    };
  }

  const deadline = new Date(listing.pickupDeadline).getTime();
  const prepared = listing.preparedAt ? new Date(listing.preparedAt).getTime() : (deadline - 4 * 3600 * 1000);
  const currentTime = now instanceof Date ? now.getTime() : new Date(now).getTime();

  const totalWindow = Math.max(deadline - prepared, 1000);
  const remainingMs = deadline - currentTime;
  const elapsedMs = currentTime - prepared;

  const isExpired = remainingMs <= 0;

  if (isExpired) {
    const elapsedSinceExpiry = Math.abs(remainingMs);
    const expiredMins = Math.floor(elapsedSinceExpiry / 60000);
    const expiredHours = Math.floor(expiredMins / 60);

    let expiredText = 'Expired';
    if (expiredHours > 0) {
      expiredText = `Expired ${expiredHours}h ${expiredMins % 60}m ago`;
    } else if (expiredMins > 0) {
      expiredText = `Expired ${expiredMins}m ago`;
    } else {
      expiredText = 'Expired just now';
    }

    return {
      status: 'expired',
      statusLabel: 'Expired — Collection Window Closed',
      shortLabel: 'Expired',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      meterColor: 'bg-status-expired',
      textColor: 'text-status-expired',
      percentRemaining: 0,
      timeRemainingFormatted: expiredText,
      isExpired: true,
      canClaim: false,
      hoursRemaining: 0,
      minutesRemaining: 0,
      safetyNotice: 'Expired — no longer available for collection. Food redistribution is prohibited past the safe window.'
    };
  }

  // Active Window
  const percentRemaining = Math.max(0, Math.min(100, Math.round((remainingMs / totalWindow) * 100)));
  const totalRemainingMinutes = Math.floor(remainingMs / 60000);
  const hours = Math.floor(totalRemainingMinutes / 60);
  const minutes = totalRemainingMinutes % 60;

  let formattedTime = '';
  if (hours > 0) {
    formattedTime = `${hours}h ${minutes}m left`;
  } else {
    formattedTime = `${minutes}m left`;
  }

  // Threshold: Less than 60 mins remaining OR less than 25% of window remaining
  const isExpiringSoon = remainingMs <= 60 * 60 * 1000 || percentRemaining <= 25;

  if (isExpiringSoon) {
    return {
      status: 'expiring-soon',
      statusLabel: 'Pickup Deadline Approaching',
      shortLabel: 'Expiring Soon',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      meterColor: 'bg-status-warning',
      textColor: 'text-amber-700',
      percentRemaining,
      timeRemainingFormatted: formattedTime,
      isExpired: false,
      canClaim: true,
      hoursRemaining: hours,
      minutesRemaining: minutes,
      safetyNotice: 'Urgent pickup needed! Collection deadline ends shortly.'
    };
  }

  return {
    status: 'fresh',
    statusLabel: 'Fresh — Plenty of Pickup Time',
    shortLabel: 'Fresh & Active',
    badgeColor: 'bg-brand-100 text-brand-900 border-brand-300',
    meterColor: 'bg-brand-600',
    textColor: 'text-brand-800',
    percentRemaining,
    timeRemainingFormatted: formattedTime,
    isExpired: false,
    canClaim: true,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    safetyNotice: 'Prepared recently. Standard temperature and hygiene handling guidelines apply.'
  };
}

export function formatDateTime(isoString) {
  if (!isoString) return 'Not specified';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}
