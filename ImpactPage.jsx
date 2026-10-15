import React, { useMemo } from 'react';
import { usePlateShare } from '../context/PlateShareContext';
import {
  Heart,
  TrendingUp,
  Utensils,
  Truck,
  Building2,
  Users,
  Leaf,
  Droplets,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { formatDateTime } from '../utils/freshness';

export default function ImpactPage() {
  const { listings, metrics } = usePlateShare();

  // Completed / rescued listings
  const completedListings = useMemo(() => {
    return listings.filter(l => l.status === 'Collected');
  }, [listings]);

  // Unique donors and NGOs
  const donorList = useMemo(() => {
    const map = new Map();
    listings.forEach(l => {
      if (l.donorName && !map.has(l.donorName)) {
        map.set(l.donorName, {
          name: l.donorName,
          type: l.donorType,
          area: l.area,
          servings: Number(l.servings) || 0
        });
      } else if (l.donorName) {
        const item = map.get(l.donorName);
        item.servings += Number(l.servings) || 0;
      }
    });
    return Array.from(map.values());
  }, [listings]);

  // Mock weekly trends combined with real completed statistics
  const weeklyTrends = [
    { day: 'Mon', servings: 85, height: '45%' },
    { day: 'Tue', servings: 110, height: '60%' },
    { day: 'Wed', servings: 140, height: '75%' },
    { day: 'Thu', servings: 95, height: '52%' },
    { day: 'Fri', servings: 180, height: '95%' },
    { day: 'Sat', servings: 210, height: '100%' },
    { day: 'Sun', servings: 160 + metrics.servingsRescued, height: '88%' }
  ];

  // Water footprint calculation: 1 kg rescued food ≈ 1,000 liters of virtual water conserved
  const waterLitersSaved = (metrics.kgSaved * 1050).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Social & Environmental Balance Sheet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-950">
          Community Food Rescue Impact
        </h1>
        <p className="text-sm text-dark-secondary mt-1 max-w-2xl">
          Visualizing the tangible difference made by our coalition of local kitchens, hotels, food banks, and volunteer runners.
        </p>
      </div>

      {/* Demo Disclosure Alert */}
      <div className="p-4 rounded-2xl bg-cream-100 border border-amber-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="font-bold">Hackathon Demonstration Notice:</strong> Metrics displayed on this page are computed dynamically from current mock listings, active test claims, and verified collection events in localStorage. They represent a simulated working model of community impact for demonstration purposes.
        </div>
      </div>

      {/* Primary Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-dark-border shadow-soft-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-4xl font-black text-brand-950 font-mono tracking-tight">
            {metrics.servingsRescued}
          </p>
          <p className="text-sm font-bold text-dark-text mt-1">Servings Rescued</p>
          <p className="text-xs text-dark-secondary mt-0.5">Wholesome meals redirected to communities</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-dark-border shadow-soft-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-4xl font-black text-emerald-800 font-mono tracking-tight">
            {metrics.kgSaved} <span className="text-xl font-bold">kg</span>
          </p>
          <p className="text-sm font-bold text-dark-text mt-1">Food Waste Prevented</p>
          <p className="text-xs text-dark-secondary mt-0.5">Saved from methane-producing landfills</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-dark-border shadow-soft-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-4xl font-black text-teal-800 font-mono tracking-tight">
            {metrics.co2PreventedKg} <span className="text-xl font-bold">kg</span>
          </p>
          <p className="text-sm font-bold text-dark-text mt-1">CO₂e Emissions Prevented</p>
          <p className="text-xs text-dark-secondary mt-0.5">Calculated using 2.5 kg CO₂e per kg food ratio</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-dark-border shadow-soft-sm relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-4xl font-black text-blue-800 font-mono tracking-tight">
            {metrics.completedPickups}
          </p>
          <p className="text-sm font-bold text-dark-text mt-1">Completed Pickups</p>
          <p className="text-xs text-dark-secondary mt-0.5">Delivered by registered volunteers & NGOs</p>
        </div>
      </div>

      {/* Environmental & Resource Conservation Card */}
      <div className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-8 text-white shadow-soft">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300 bg-brand-800 px-3 py-1 rounded-full">
            Ecological Return on Food Sharing
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Saving Food Means Protecting Critical Planet Resources
          </h2>
          <p className="text-xs sm:text-sm text-brand-100/90 leading-relaxed">
            Food production consumes staggering volumes of fresh water, agricultural land, and energy. Every kilogram rescued by PlateShare spares the planet unnecessary waste cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-brand-800">
          <div className="p-4 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold mb-1">
              <Droplets className="w-4 h-4" />
              <span>Virtual Water Saved</span>
            </div>
            <p className="text-2xl font-black font-mono text-white">~{waterLitersSaved} L</p>
            <p className="text-[11px] text-brand-200 mt-0.5">Conserved from agricultural supply chains</p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
              <Leaf className="w-4 h-4" />
              <span>Landfill Diversion Rate</span>
            </div>
            <p className="text-2xl font-black font-mono text-white">100%</p>
            <p className="text-[11px] text-brand-200 mt-0.5">Of claimed surplus transferred to hungry mouths</p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-800/60 border border-brand-700">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
              <Building2 className="w-4 h-4" />
              <span>Participating Donors</span>
            </div>
            <p className="text-2xl font-black font-mono text-white">{metrics.activeDonors}</p>
            <p className="text-[11px] text-brand-200 mt-0.5">Active commercial & community food providers</p>
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart + Recent Successful Rescues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-border shadow-soft-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Weekly Rhythm
            </span>
            <h3 className="text-lg font-black text-brand-950 mt-1">
              Surplus Meals Rescued Over Past 7 Days
            </h3>
            <p className="text-xs text-dark-secondary">
              Peak surplus occurs on Friday and Saturday banquet nights.
            </p>
          </div>

          {/* SVG/Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-dark-border">
            {weeklyTrends.map(item => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-dark-secondary group-hover:text-brand-700 transition">
                  {item.servings}
                </span>
                <div
                  className="w-full bg-brand-100 group-hover:bg-brand-600 rounded-t-xl transition-all duration-300 relative"
                  style={{ height: item.height }}
                />
                <span className="text-xs font-bold text-dark-text">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-dark-secondary pt-1">
            <span>Average: ~135 meals / day</span>
            <span className="text-brand-700 font-bold">Trending +22% vs last cycle</span>
          </div>
        </div>

        {/* Recent Successful Donations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-border shadow-soft-sm space-y-5">
          <div>
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              Verified Handover Feed
            </span>
            <h3 className="text-lg font-black text-brand-950 mt-1">
              Recent Confirmed Rescues
            </h3>
            <p className="text-xs text-dark-secondary">
              Logged when collection code is confirmed at handover.
            </p>
          </div>

          {completedListings.length > 0 ? (
            <div className="space-y-3">
              {completedListings.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-xs text-dark-text">{item.title}</h4>
                    <p className="text-[11px] text-dark-secondary">
                      Donated by: <strong>{item.donorName}</strong>
                    </p>
                    <p className="text-[11px] text-dark-secondary">
                      Collected by: <strong>{item.claimDetails?.receiverName || 'Community Volunteer'}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-brand-900 block font-mono">
                      +{item.servings} meals
                    </span>
                    <span className="text-[10px] text-dark-secondary block">
                      ~{item.weightKg} kg saved
                    </span>
                    <span className="text-[10px] text-brand-700 font-bold flex items-center gap-1 justify-end mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-dark-secondary text-xs">
              <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>No rescues confirmed yet. Test the flow by claiming and confirming collection!</p>
            </div>
          )}
        </div>
      </div>

      {/* Community Donor Coalition List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-border shadow-soft-sm space-y-4">
        <h3 className="text-lg font-black text-brand-950">
          Our Food Waste Reduction Champions
        </h3>
        <p className="text-xs text-dark-secondary">
          Food donors helping redistribute edible food to local communities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {donorList.map(donor => (
            <div key={donor.name} className="p-4 rounded-2xl bg-gray-50 border border-dark-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-dark-text truncate">{donor.name}</p>
                <p className="text-[10px] text-dark-secondary">{donor.type} • {donor.area || 'Metro City'}</p>
                <p className="text-[11px] font-bold text-brand-800 mt-0.5">{donor.servings} servings published</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
