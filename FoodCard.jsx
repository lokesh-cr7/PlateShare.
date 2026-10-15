import React from 'react';
import {
  MapPin,
  Utensils,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { calculateFreshness, formatDateTime } from '../utils/freshness';
import FreshnessMeter from './FreshnessMeter';

export default function FoodCard({ listing, currentTime, onClaim, onViewDetails }) {
  const freshness = calculateFreshness(listing, currentTime);
  const isExpired = freshness.isExpired || listing.status === 'Expired';
  const isClaimed = listing.status === 'Pickup scheduled' || listing.status === 'Claimed';
  const isCollected = listing.status === 'Collected';
  const isAvailable = listing.status === 'Available' && !isExpired;

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-dark-border/80 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col group">
      {/* Top Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-brand-900 shadow-sm backdrop-blur flex items-center gap-1">
            <Utensils className="w-3 h-3 text-brand-600" />
            {listing.category}
          </span>

          <div className="flex items-center gap-1.5">
            {listing.isDemo && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-amber-950 border border-amber-300 shadow-sm">
                Demo
              </span>
            )}
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                isCollected
                  ? 'bg-brand-600 text-white'
                  : isClaimed
                  ? 'bg-blue-600 text-white'
                  : isExpired
                  ? 'bg-red-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isCollected
                ? 'Rescued'
                : isClaimed
                ? 'Claimed'
                : isExpired
                ? 'Expired'
                : 'Available'}
            </span>
          </div>
        </div>

        {/* Bottom portion stats on image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="font-extrabold bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg">
            {listing.servings} Servings (~{listing.weightKg} kg)
          </span>
          <span className="text-[11px] text-gray-200 bg-black/40 backdrop-blur px-2 py-0.5 rounded">
            {listing.storageMethod || 'Packaged'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-bold text-base text-dark-text group-hover:text-brand-800 transition line-clamp-1">
            {listing.title}
          </h3>

          {/* Donor Info & Area */}
          <div className="flex items-center justify-between text-xs text-dark-secondary">
            <span className="font-medium text-dark-text flex items-center gap-1 truncate max-w-[170px]" title={listing.donorName}>
              <Building className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              {listing.donorName}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-semibold text-gray-700">
              {listing.donorType}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-dark-secondary">
            <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="truncate">{listing.area || listing.address}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-dark-secondary line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Freshness Meter Section */}
        <div className="pt-2 border-t border-dark-border/60">
          <FreshnessMeter listing={listing} currentTime={currentTime} compact={true} />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(listing)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-dark-border hover:bg-gray-50 text-dark-text font-bold text-xs transition flex items-center justify-center gap-1.5"
            aria-label={`View details for ${listing.title}`}
          >
            <Eye className="w-3.5 h-3.5 text-dark-secondary" />
            <span>Details</span>
          </button>

          {isAvailable ? (
            <button
              onClick={() => onClaim(listing)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-1.5 transform active:scale-95"
              aria-label={`Claim ${listing.title}`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Claim Food</span>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1 border border-gray-200"
              title={
                isCollected
                  ? 'This food has already been collected and rescued.'
                  : isClaimed
                  ? 'Pickup is already scheduled for this listing.'
                  : 'Safe pickup deadline has passed.'
              }
            >
              {isCollected
                ? 'Collected'
                : isClaimed
                ? 'Claimed'
                : 'Expired'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
