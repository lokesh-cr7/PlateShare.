import React, { useState, useEffect } from 'react';
import { usePlateShare } from '../context/PlateShareContext';
import {
  X,
  AlertCircle,
  Clock,
  MapPin,
  Utensils,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { formatDateTime } from '../utils/freshness';

export default function ClaimModal({ listing, onClose }) {
  const { claimFood, userProfile, currentRole } = usePlateShare();

  const [receiverName, setReceiverName] = useState(userProfile?.name || '');
  const [orgName, setOrgName] = useState(userProfile?.organization || '');
  const [receiverType, setReceiverType] = useState(
    currentRole === 'ngo' ? 'NGO' : currentRole === 'volunteer' ? 'Volunteer' : 'Community Group'
  );
  const [contactPhone, setContactPhone] = useState(userProfile?.phone || '');
  const [contactEmail, setContactEmail] = useState(userProfile?.email || '');
  const [servingsClaimed, setServingsClaimed] = useState(listing.servings);
  const [preferredTime, setPreferredTime] = useState('Within 60-90 minutes');
  const [vehicleInfo, setVehicleInfo] = useState(
    userProfile?.vehicle || 'Van with insulated thermal bags'
  );
  const [notes, setNotes] = useState('');
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccessData, setClaimSuccessData] = useState(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!receiverName.trim()) {
      setError('Receiver contact name is required.');
      return;
    }
    if (!contactPhone.trim() && !contactEmail.trim()) {
      setError('Please provide at least a contact phone number or email.');
      return;
    }
    if (Number(servingsClaimed) <= 0 || Number(servingsClaimed) > listing.servings) {
      setError(`Servings requested must be between 1 and ${listing.servings}.`);
      return;
    }
    if (!safetyAccepted) {
      setError('You must confirm the hygiene & prompt pickup declaration.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = claimFood(listing.id, {
        receiverName,
        orgName,
        receiverType,
        contactPhone,
        contactEmail,
        servingsClaimed: Number(servingsClaimed),
        preferredTime,
        vehicleInfo,
        notes
      });
      setClaimSuccessData(updated);
    } catch (err) {
      setError(err.message || 'Error processing food claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-soft-lg border border-dark-border relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-dark-text hover:bg-gray-100 transition"
          aria-label="Close claim modal"
        >
          <X className="w-5 h-5" />
        </button>

        {claimSuccessData ? (
          /* Success Screen */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider border border-brand-200">
                Claim Confirmed & Scheduled
              </span>
              <h2 className="text-2xl font-black text-brand-950 mt-2">
                Pickup Pass Generated
              </h2>
              <p className="text-sm text-dark-secondary mt-1">
                Your surplus food reservation has been successfully locked in.
              </p>
            </div>

            {/* Verification Code Box */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-amber-300 text-center">
              <p className="text-xs font-semibold text-amber-900 uppercase tracking-widest">
                Pickup Verification Code
              </p>
              <p className="text-3xl font-black text-brand-900 font-mono tracking-widest mt-1">
                {claimSuccessData.claimDetails?.pickupCode}
              </p>
              <p className="text-[11px] text-amber-800 mt-1">
                Share this code with {listing.donorName} at collection.
              </p>
            </div>

            <div className="text-left bg-gray-50 rounded-2xl p-4 space-y-2 border border-dark-border text-xs">
              <div className="flex items-center justify-between">
                <span className="text-dark-secondary">Food Item:</span>
                <span className="font-bold text-dark-text">{listing.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-secondary">Portions:</span>
                <span className="font-bold text-dark-text">{claimSuccessData.claimDetails?.servingsClaimed} servings (~{listing.weightKg} kg)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-secondary">Collection Address:</span>
                <span className="font-semibold text-dark-text text-right max-w-[240px] truncate">{listing.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-secondary">Safe Pickup Deadline:</span>
                <span className="font-bold text-brand-700">{formatDateTime(listing.pickupDeadline)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3 px-6 rounded-xl font-bold text-sm shadow-soft transition"
            >
              Done — View in Pickups
            </button>
          </div>
        ) : (
          /* Claim Form */
          <div>
            <div className="flex items-start gap-4 pb-4 border-b border-dark-border/80">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Claim Surplus Food
                </span>
                <h2 id="claim-modal-title" className="text-xl font-black text-brand-950 mt-1">
                  {listing.title}
                </h2>
                <p className="text-xs text-dark-secondary flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {listing.donorName} • {listing.area}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Organization / Group Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Hope Community Food Pantry"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Receiver Type
                  </label>
                  <select
                    value={receiverType}
                    onChange={(e) => setReceiverType(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-dark-border bg-white focus:border-brand-600 outline-none"
                  >
                    <option value="NGO">NGO / Food Bank</option>
                    <option value="Volunteer">Volunteer Runner</option>
                    <option value="Community Group">Community Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Phone Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Servings to Claim *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={listing.servings}
                    value={servingsClaimed}
                    onChange={(e) => setServingsClaimed(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Preferred Collection Window
                  </label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    placeholder="e.g. Within 45 minutes / Today by 4 PM"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-text mb-1">
                    Transport / Storage Method
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    placeholder="e.g. Insulated cold boxes in car"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              {/* Food safety declaration checkbox */}
              <div className="p-3.5 rounded-2xl bg-cream-100 border border-amber-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyAccepted}
                    onChange={(e) => setSafetyAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-brand-700 focus:ring-brand-600 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-[11px] leading-relaxed text-amber-950">
                    <span className="font-bold">Receiver Commitment:</span> I confirm our organization has safe transit containers (insulated/clean), will inspect the food on collection, and will redistribute promptly before the safe deadline.
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-dark-secondary hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-soft transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming...' : 'Confirm & Lock Claim'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
