import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Utensils,
  AlertTriangle,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Thermometer,
  Calendar
} from 'lucide-react';
import { calculateFreshness, formatDateTime } from '../utils/freshness';
import FreshnessMeter from './FreshnessMeter';

export default function FoodDetailModal({ listing, currentTime, onClose, onClaimClick }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!listing) return null;

  const freshness = calculateFreshness(listing, currentTime);
  const isClaimable = listing.status === 'Available' && !freshness.isExpired;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-soft-lg border border-dark-border relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-dark-text shadow-sm transition backdrop-blur"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image header */}
        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
          <img
            src={listing.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-600 text-white shadow-sm">
                {listing.category}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-black/40 backdrop-blur text-gray-200">
                {listing.donorType}
              </span>
              {listing.isDemo && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-amber-950 uppercase tracking-wider">
                  Demo Listing
                </span>
              )}
            </div>
            <h2 id="detail-modal-title" className="text-2xl font-black text-white drop-shadow-sm leading-tight">
              {listing.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Freshness Tracker Bar */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-dark-border/80">
            <FreshnessMeter listing={listing} currentTime={currentTime} />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
              <p className="text-[11px] font-medium text-dark-secondary">Portions</p>
              <p className="text-lg font-black text-brand-900 mt-0.5">{listing.servings} Servings</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
              <p className="text-[11px] font-medium text-dark-secondary">Weight</p>
              <p className="text-lg font-black text-brand-900 mt-0.5">{listing.weightKg} kg</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
              <p className="text-[11px] font-medium text-dark-secondary">Storage</p>
              <p className="text-xs font-bold text-brand-900 mt-1 truncate">{listing.storageMethod || 'Standard'}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100">
              <p className="text-[11px] font-medium text-dark-secondary">Current Status</p>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-800 mt-1">{listing.status}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-dark-text uppercase tracking-wider mb-1.5">
              Description & Packaging
            </h3>
            <p className="text-sm text-dark-secondary leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Timestamps & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-dark-text">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Time Parameters</span>
              </div>
              <p className="text-dark-secondary flex justify-between">
                <span>Prepared At:</span>
                <span className="font-medium text-dark-text">{formatDateTime(listing.preparedAt)}</span>
              </p>
              <p className="text-dark-secondary flex justify-between">
                <span>Pickup Window Closes:</span>
                <span className="font-bold text-brand-700">{formatDateTime(listing.pickupDeadline)}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-dark-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-dark-text">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Allergen Disclosures</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.isArray(listing.allergens) && listing.allergens.length > 0 ? (
                  listing.allergens.map((alg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium border border-amber-200">
                      {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-dark-secondary">No allergens disclosed</span>
                )}
              </div>
            </div>
          </div>

          {/* Pickup Address & Contact */}
          <div className="p-4 rounded-2xl bg-brand-50/40 border border-brand-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-brand-950">
              <MapPin className="w-4 h-4 text-brand-700" />
              <span>Donor & Collection Location</span>
            </div>
            <p className="font-semibold text-dark-text text-sm">{listing.donorName}</p>
            <p className="text-dark-secondary">{listing.address}, {listing.area}, {listing.city}</p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-dark-text">
              {listing.contactPhone && (
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-brand-600" /> {listing.contactPhone}
                </span>
              )}
              {listing.contactEmail && (
                <span className="flex items-center gap-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-brand-600" /> {listing.contactEmail}
                </span>
              )}
            </div>
          </div>

          {/* Food safety advisory notice */}
          <div className="p-3 rounded-xl bg-cream-100 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Food Safety Guidance:</strong> PlateShare facilitates community redistribution. Receivers must physically inspect food aromas, packaging integrity, and temperature upon pickup. Never consume food that shows signs of spoilage.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-dark-secondary hover:bg-gray-100 transition"
            >
              Close
            </button>
            {isClaimable && (
              <button
                onClick={() => {
                  onClose();
                  onClaimClick(listing);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-soft transition flex items-center gap-1.5"
              >
                <Utensils className="w-4 h-4" />
                <span>Claim This Food</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
