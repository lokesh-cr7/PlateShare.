import React, { useState } from 'react';
import { usePlateShare } from '../context/PlateShareContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  AlertTriangle,
  RotateCcw,
  QrCode,
  X,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { calculateFreshness, formatDateTime } from '../utils/freshness';

export default function PickupManagementPage() {
  const { listings, confirmPickupCollection, cancelFoodClaim, currentTime } = usePlateShare();
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'completed', 'all'
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filter listings that have been claimed or collected
  const pickupListings = listings.filter(item => {
    const isClaimed = item.status === 'Pickup scheduled' || item.status === 'Claimed';
    const isCollected = item.status === 'Collected';

    if (activeTab === 'active') return isClaimed;
    if (activeTab === 'completed') return isCollected;
    return isClaimed || isCollected;
  });

  const activeCount = listings.filter(l => l.status === 'Pickup scheduled' || l.status === 'Claimed').length;
  const completedCount = listings.filter(l => l.status === 'Collected').length;

  const handleConfirmCollection = (id) => {
    confirmPickupCollection(id);
  };

  const handleCancelClaimSubmit = (e) => {
    e.preventDefault();
    if (!cancellingId) return;
    cancelFoodClaim(cancellingId, cancelReason || 'Logistics schedule change');
    setCancellingId(null);
    setCancelReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            <Truck className="w-4 h-4" />
            <span>Redistribution Logistics Management</span>
          </div>
          <h1 className="text-3xl font-black text-brand-950">
            Pickup & Collection Schedule
          </h1>
          <p className="text-xs text-dark-secondary mt-1 max-w-2xl">
            Track active food collections, present verification passes to donors, and confirm successful rescues to update community impact metrics.
          </p>
        </div>

        {/* Quick summary cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <p className="text-xs font-semibold text-blue-900">Active Scheduled</p>
            <p className="text-xl font-black text-blue-950 font-mono">{activeCount}</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-brand-50 border border-brand-200 text-center">
            <p className="text-xs font-semibold text-brand-900">Rescued & Verified</p>
            <p className="text-xl font-black text-brand-950 font-mono">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-border pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-soft-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active Pickups ({activeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-brand-700 text-white shadow-soft-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed Rescues ({completedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-dark-text text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
          }`}
        >
          <span>All Logistics ({activeCount + completedCount})</span>
        </button>
      </div>

      {/* Pickups Grid / List */}
      {pickupListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickupListings.map(listing => {
            const freshness = calculateFreshness(listing, currentTime);
            const isCompleted = listing.status === 'Collected';
            const claim = listing.claimDetails || {};

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl p-6 border border-dark-border/80 shadow-soft-sm hover:shadow-soft transition space-y-5 flex flex-col justify-between"
              >
                <div>
                  {/* Status header & Code */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-dark-border/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-brand-100 text-brand-900 border border-brand-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}
                        >
                          {isCompleted ? 'Food Rescued & Collected' : 'Pickup Scheduled'}
                        </span>
                        {listing.isDemo && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cream-200 text-amber-900">
                            Demo
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-dark-text mt-1.5 line-clamp-1">
                        {listing.title}
                      </h3>
                    </div>

                    {/* Verification Code Badge */}
                    <div className="text-right">
                      <span className="text-[10px] text-dark-secondary font-medium block">Verification Pass</span>
                      <span className="font-mono font-black text-sm text-brand-900 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 inline-block">
                        {claim.pickupCode || 'PS-DEMO'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Weight */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-gray-50 p-3 rounded-2xl border border-dark-border/60">
                    <div>
                      <span className="text-dark-secondary block text-[11px]">Claimed Portions:</span>
                      <span className="font-black text-brand-900">{claim.servingsClaimed || listing.servings} servings</span>
                    </div>
                    <div>
                      <span className="text-dark-secondary block text-[11px]">Estimated Weight:</span>
                      <span className="font-black text-brand-900">~{listing.weightKg} kg</span>
                    </div>
                  </div>

                  {/* Donor & Receiver cards */}
                  <div className="space-y-3 text-xs">
                    {/* Donor Details */}
                    <div className="p-3 rounded-2xl bg-cream-50 border border-amber-200/60 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-dark-text">
                        <Building className="w-3.5 h-3.5 text-brand-700" />
                        <span>Donor: {listing.donorName} ({listing.donorType})</span>
                      </div>
                      <p className="text-dark-secondary flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-600 flex-shrink-0" />
                        <span className="truncate">{listing.address}, {listing.area}</span>
                      </p>
                      {listing.contactPhone && (
                        <p className="text-dark-secondary flex items-center gap-1 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-brand-600" /> {listing.contactPhone}
                        </p>
                      )}
                    </div>

                    {/* Receiver Details */}
                    <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-dark-text">
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Receiver: {claim.receiverName || 'Registered Receiver'}</span>
                        {claim.receiverType && (
                          <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-1.5 rounded">
                            {claim.receiverType}
                          </span>
                        )}
                      </div>
                      {claim.orgName && (
                        <p className="text-dark-secondary font-medium">Group: {claim.orgName}</p>
                      )}
                      {claim.preferredTime && (
                        <p className="text-dark-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" /> Window: {claim.preferredTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Freshness Countdown for active pickups */}
                  {!isCompleted && (
                    <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span className="font-semibold text-amber-950">Safe Deadline:</span>
                      </div>
                      <span className="font-mono font-bold text-amber-900">
                        {freshness.timeRemainingFormatted}
                      </span>
                    </div>
                  )}

                  {isCompleted && claim.collectedAt && (
                    <div className="mt-3 p-2.5 rounded-2xl bg-brand-50 border border-brand-200 text-xs flex items-center gap-2 text-brand-900">
                      <PackageCheck className="w-4 h-4 text-brand-700" />
                      <span>Rescued on {formatDateTime(claim.collectedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-dark-border/60 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPass(listing)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-dark-border hover:bg-gray-50 text-dark-text font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-dark-secondary" />
                    <span>View Pass</span>
                  </button>

                  {!isCompleted ? (
                    <>
                      <button
                        onClick={() => handleConfirmCollection(listing.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-1.5 transform active:scale-95"
                        title="Confirm that food has been safely picked up from donor"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Pickup</span>
                      </button>

                      <button
                        onClick={() => setCancellingId(listing.id)}
                        className="py-2.5 px-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-700 font-semibold text-xs transition"
                        title="Cancel this claim"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className="flex-1 py-2.5 px-3 rounded-xl bg-brand-100 text-brand-800 font-bold text-xs text-center border border-brand-200">
                      ✓ Rescued & Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-dark-border shadow-soft-sm max-w-lg mx-auto space-y-4">
          <Truck className="w-12 h-12 text-gray-300 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-dark-text">No pickups in this category</h3>
            <p className="text-xs text-dark-secondary mt-1">
              Explore the Find Food directory to schedule a new food rescue pickup.
            </p>
          </div>
        </div>
      )}

      {/* Digital Pickup Pass Modal */}
      {selectedPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pass-modal-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-soft-lg border border-dark-border relative animate-in fade-in zoom-in-95 space-y-5">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-dark-text hover:bg-gray-100 transition"
              aria-label="Close pass modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-bold text-brand-800 uppercase tracking-widest bg-brand-100 px-3 py-1 rounded-full border border-brand-200">
                Official Digital Pickup Pass
              </span>
              <h2 id="pass-modal-title" className="text-xl font-black text-brand-950 mt-2">
                {selectedPass.title}
              </h2>
            </div>

            {/* QR / Verification Code Visual */}
            <div className="p-6 rounded-2xl bg-cream-100 border-2 border-dashed border-amber-300 text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-brand-900 text-white flex items-center justify-center mx-auto shadow-sm">
                <QrCode className="w-10 h-10 text-brand-200" />
              </div>
              <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                Present To Donor For Verification
              </p>
              <p className="text-3xl font-black text-brand-950 font-mono tracking-widest">
                {selectedPass.claimDetails?.pickupCode || 'PS-9921'}
              </p>
            </div>

            <div className="text-xs bg-gray-50 rounded-2xl p-4 space-y-2 border border-dark-border text-dark-secondary">
              <p className="flex justify-between">
                <span>Donor Facility:</span>
                <strong className="text-dark-text">{selectedPass.donorName}</strong>
              </p>
              <p className="flex justify-between">
                <span>Pickup Address:</span>
                <strong className="text-dark-text text-right max-w-[200px] truncate">{selectedPass.address}</strong>
              </p>
              <p className="flex justify-between">
                <span>Portions Claimed:</span>
                <strong className="text-brand-800">{selectedPass.claimDetails?.servingsClaimed || selectedPass.servings} servings</strong>
              </p>
              <p className="flex justify-between">
                <span>Safe Deadline:</span>
                <strong className="text-amber-800">{formatDateTime(selectedPass.pickupDeadline)}</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-[11px] text-brand-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
              <span>
                Please check temperatures upon arrival and ensure clean transit bags or insulated coolers are utilized.
              </span>
            </div>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl font-bold text-xs shadow-soft transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Cancel Claim Confirmation Modal */}
      {cancellingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-lg border border-dark-border space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-dark-text">Cancel Scheduled Claim?</h3>
            </div>
            <p className="text-xs text-dark-secondary leading-relaxed">
              Cancelling will release this food back to the active directory so other nearby volunteers or NGOs can rescue it before the pickup deadline.
            </p>

            <form onSubmit={handleCancelClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark-text mb-1">
                  Cancellation Reason (Optional)
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Vehicle breakdown / Insufficient cold storage"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border outline-none focus:border-brand-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-dark-secondary hover:bg-gray-100"
                >
                  Keep Scheduled
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-soft transition"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
