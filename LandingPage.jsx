import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlateShare } from '../context/PlateShareContext';
import FoodCard from '../components/FoodCard';
import ClaimModal from '../components/ClaimModal';
import FoodDetailModal from '../components/FoodDetailModal';
import {
  Utensils,
  PlusCircle,
  Search,
  Heart,
  TrendingUp,
  ShieldCheck,
  Truck,
  Users,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe2,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const { listings, metrics, currentTime } = usePlateShare();
  const [selectedForClaim, setSelectedForClaim] = useState(null);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Top 3 featured active or recently posted listings
  const featuredListings = listings
    .filter(l => l.status === 'Available')
    .slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-24">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-100/60 to-transparent rounded-3xl -z-10 blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Mission pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-100 border border-amber-300 shadow-soft-sm text-xs font-bold text-amber-950 mb-6">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Problem Statement #6: Leftover Food Sharing Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-brand-950 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Share a meal. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-600">
              Change a day.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-dark-secondary max-w-2xl mx-auto leading-relaxed font-normal">
            PlateShare connects restaurants, hotels, caterers, and households with nearby NGOs and volunteers to redistribute surplus edible food before it goes to waste.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/find"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-700 hover:bg-brand-800 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-soft hover:shadow-soft-lg transition-all transform active:scale-95"
            >
              <Search className="w-5 h-5" />
              <span>Find Available Food</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-cream-100 text-brand-900 border-2 border-brand-700/30 px-8 py-4 rounded-2xl font-bold text-base shadow-soft-sm hover:shadow-soft transition-all transform active:scale-95"
            >
              <PlusCircle className="w-5 h-5 text-brand-700" />
              <span>Donate Surplus Food</span>
            </Link>
          </div>

          {/* Impact Stats Grid */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-white border border-dark-border/80 shadow-soft-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-brand-950 font-mono">
                {metrics.servingsRescued}
              </p>
              <p className="text-xs font-bold text-dark-text mt-1">Meals Rescued</p>
              <p className="text-[11px] text-dark-secondary mt-0.5">Directly distributed to families</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-dark-border/80 shadow-soft-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-brand-950 font-mono">
                {metrics.kgSaved} <span className="text-lg font-bold">kg</span>
              </p>
              <p className="text-xs font-bold text-dark-text mt-1">Food Waste Prevented</p>
              <p className="text-[11px] text-dark-secondary mt-0.5">Kept out of local landfills</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-dark-border/80 shadow-soft-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-brand-950 font-mono">
                {metrics.activeDonors}
              </p>
              <p className="text-xs font-bold text-dark-text mt-1">Active Food Donors</p>
              <p className="text-[11px] text-dark-secondary mt-0.5">Restaurants, hotels & caterers</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-dark-border/80 shadow-soft-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-brand-950 font-mono">
                {metrics.completedPickups}
              </p>
              <p className="text-xs font-bold text-dark-text mt-1">Successful Pickups</p>
              <p className="text-[11px] text-dark-secondary mt-0.5">Verified collection passes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Food Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
              <Clock className="w-4 h-4" />
              <span>Live Surplus Feed</span>
            </div>
            <h2 className="text-3xl font-black text-brand-950">
              Available For Immediate Pickup
            </h2>
            <p className="text-sm text-dark-secondary mt-1">
              Live food packages with active freshness countdowns ready for local NGOs and volunteers.
            </p>
          </div>

          <Link
            to="/find"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition"
          >
            <span>View All ({listings.length} Listings)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <FoodCard
                key={listing.id}
                listing={listing}
                currentTime={currentTime}
                onClaim={(item) => setSelectedForClaim(item)}
                onViewDetails={(item) => setSelectedForDetail(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dark-border shadow-soft-sm">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-dark-text">No active surplus listings right now</h3>
            <p className="text-xs text-dark-secondary mt-1">Be the first to share surplus food!</p>
            <Link
              to="/donate"
              className="mt-4 inline-flex items-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" /> Post Food Listing
            </Link>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-cream-100/70 border-y border-amber-200/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 bg-brand-100/80 px-3 py-1 rounded-full">
              Seamless Redistribution
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-950 mt-3">
              How PlateShare Works
            </h2>
            <p className="text-sm text-dark-secondary mt-2">
              A transparent, two-sided workflow designed for zero food waste and maximum food safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Food Donors */}
            <div className="bg-white rounded-3xl p-8 border border-dark-border shadow-soft-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-950">For Food Donors</h3>
                  <p className="text-xs text-dark-secondary">Restaurants, Caterers, Hotels, Households</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-700 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Publish Surplus Details</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Enter portions, prepared time, temperature storage, allergens, and address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-700 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Define Safe Pickup Window</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Our freshness countdown engine tracks elapsed time to ensure collection occurs while food is fresh.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-brand-700 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Verify & Handover</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Check the receiver's digital Pickup Pass code before releasing food. Mark collection complete in 1 tap.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/donate"
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white py-3 rounded-xl font-bold text-xs shadow-soft transition"
              >
                <span>Publish Surplus Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For NGOs & Volunteers */}
            <div className="bg-white rounded-3xl p-8 border border-dark-border shadow-soft-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-dark-border">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-brand-950">For NGOs & Volunteers</h3>
                  <p className="text-xs text-dark-secondary">Food Banks, Shelters, Community Runners</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Discover Nearby Meals</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Browse surplus listings filtered by category, location, and remaining safe freshness window.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Lock In Your Claim</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Claim required portions and select an estimated arrival time. An instant Pickup Pass is generated.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-dark-text">Collect & Feed Families</h4>
                    <p className="text-xs text-dark-secondary mt-0.5 leading-relaxed">
                      Pick up food safely using insulated bags or containers and distribute immediately to vulnerable communities.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/find"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold text-xs shadow-soft transition"
              >
                <span>Find Surplus Food to Claim</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Integrity Pillar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 bg-brand-800/80 px-3 py-1 rounded-full">
              Trust & Food Safety
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built on Transparency and Hygiene Responsibility
            </h2>
            <p className="text-sm text-brand-100/90 leading-relaxed">
              Every surplus donor commits to health & hygiene handling guidelines. Our dynamic Freshness Engine locks down expired food automatically so only safe, edible meals are redistributed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2.5 text-xs text-brand-100 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                <span>Mandatory Donor Declarations</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-100 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                <span>Auto-Lock Expiry Controls</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-brand-100 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-brand-300 flex-shrink-0" />
                <span>Digital Verification Code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals for Claim & Details */}
      {selectedForClaim && (
        <ClaimModal
          listing={selectedForClaim}
          onClose={() => setSelectedForClaim(null)}
        />
      )}

      {selectedForDetail && (
        <FoodDetailModal
          listing={selectedForDetail}
          currentTime={currentTime}
          onClose={() => setSelectedForDetail(null)}
          onClaimClick={(item) => setSelectedForClaim(item)}
        />
      )}
    </div>
  );
}
