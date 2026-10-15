import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePlateShare } from '../context/PlateShareContext';
import {
  LayoutDashboard,
  Utensils,
  TrendingUp,
  Truck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  PlusCircle,
  Search,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { calculateFreshness, formatDateTime } from '../utils/freshness';

export default function DashboardPage() {
  const { listings, metrics, activities, currentTime } = usePlateShare();

  // Category distribution calculation
  const categoryStats = useMemo(() => {
    const counts = {};
    listings.forEach(l => {
      const cat = l.category || 'Other';
      counts[cat] = (counts[cat] || 0) + (Number(l.servings) || 0);
    });

    const totalServings = Object.values(counts).reduce((acc, c) => acc + c, 0) || 1;
    return Object.entries(counts).map(([cat, count]) => ({
      name: cat,
      count,
      percent: Math.round((count / totalServings) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [listings]);

  // Recently posted listings (top 4)
  const recentListings = useMemo(() => {
    return [...listings]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 4);
  }, [listings]);

  // Upcoming active pickups
  const upcomingPickups = useMemo(() => {
    return listings
      .filter(l => l.status === 'Pickup scheduled' || l.status === 'Claimed')
      .slice(0, 3);
  }, [listings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Real-Time Community Operations</span>
          </div>
          <h1 className="text-3xl font-black text-brand-950">
            PlateShare Operations Dashboard
          </h1>
          <p className="text-xs text-dark-secondary mt-1">
            Live metrics calculated from verified food listings, active claims, and completed collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-soft transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Donate Food</span>
          </Link>
          <Link
            to="/find"
            className="inline-flex items-center gap-1.5 bg-white border border-dark-border hover:bg-gray-50 text-dark-text px-4 py-2.5 rounded-xl font-bold text-xs transition"
          >
            <Search className="w-4 h-4 text-brand-700" />
            <span>Browse Directory</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-2">
            <Utensils className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-brand-950 font-mono">{metrics.totalListings}</p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">Total Listings</p>
          <p className="text-[10px] text-dark-secondary">All-time packages</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <Utensils className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">{metrics.availableMeals}</p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">Available Meals</p>
          <p className="text-[10px] text-dark-secondary">Ready for pickup now</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-blue-700 font-mono">{metrics.foodClaimedCount}</p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">Active Claims</p>
          <p className="text-[10px] text-dark-secondary">In transit / scheduled</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-brand-900 font-mono">{metrics.completedPickups}</p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">Completed Pickups</p>
          <p className="text-[10px] text-dark-secondary">Verified deliveries</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-700 font-mono">{metrics.kgSaved} <span className="text-xs">kg</span></p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">Kg Food Rescued</p>
          <p className="text-[10px] text-dark-secondary">Diverted from waste</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-dark-border shadow-soft-sm">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
            <Leaf className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-teal-700 font-mono">{metrics.co2PreventedKg} <span className="text-xs">kg</span></p>
          <p className="text-[11px] font-bold text-dark-text mt-0.5">CO₂ Offset Est.</p>
          <p className="text-[10px] text-dark-secondary">~2.5x food mass ratio</p>
        </div>
      </div>

      {/* Grid: Category Breakdown + Upcoming Pickups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-3xl p-6 border border-dark-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h2 className="text-base font-bold text-dark-text flex items-center gap-2">
              <Utensils className="w-4 h-4 text-brand-700" />
              <span>Surplus Food Categories</span>
            </h2>
            <span className="text-[11px] text-dark-secondary font-medium">By Servings</span>
          </div>

          <div className="space-y-3">
            {categoryStats.map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-dark-text">{item.name}</span>
                  <span className="font-mono text-dark-secondary">{item.count} servings ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-cream-50 border border-amber-200 text-[11px] text-amber-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>High proportion of cooked meals prioritized for fast pickup within 4 hours.</span>
          </div>
        </div>

        {/* Upcoming Scheduled Pickups */}
        <div className="bg-white rounded-3xl p-6 border border-dark-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h2 className="text-base font-bold text-dark-text flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-700" />
              <span>Upcoming Scheduled Pickups</span>
            </h2>
            <Link to="/pickups" className="text-xs font-bold text-blue-700 hover:underline">
              View All
            </Link>
          </div>

          {upcomingPickups.length > 0 ? (
            <div className="space-y-3">
              {upcomingPickups.map(item => {
                const freshness = calculateFreshness(item, currentTime);
                return (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-dark-text line-clamp-1">{item.title}</span>
                      <span className="font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                        {item.claimDetails?.pickupCode}
                      </span>
                    </div>
                    <p className="text-dark-secondary">
                      To: <strong>{item.claimDetails?.receiverName}</strong> ({item.claimDetails?.receiverType})
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-dark-secondary pt-1 border-t border-blue-100">
                      <span>Window: {item.claimDetails?.preferredTime || 'Scheduled'}</span>
                      <span className="font-bold text-amber-800">{freshness.timeRemainingFormatted}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-secondary text-xs">
              <Truck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>No active scheduled pickups at this moment.</p>
            </div>
          )}
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white rounded-3xl p-6 border border-dark-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h2 className="text-base font-bold text-dark-text flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-700" />
              <span>Recent Activity Stream</span>
            </h2>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Live
            </span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {activities.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 flex-shrink-0" />
                <div className="space-y-0.5 flex-1">
                  <p className="font-bold text-dark-text">{act.title}</p>
                  <p className="text-dark-secondary leading-snug">{act.description}</p>
                  <p className="text-[10px] text-dark-secondary font-mono">{formatDateTime(act.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Published Listings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-border shadow-soft-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-black text-brand-950">
              Recently Posted Surplus Food
            </h2>
            <p className="text-xs text-dark-secondary mt-0.5">
              Live food packages entered into the system.
            </p>
          </div>
          <Link
            to="/find"
            className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
          >
            <span>See Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentListings.map(item => {
            const freshness = calculateFreshness(item, currentTime);
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-dark-border/80 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      {item.category}
                    </span>
                    <span className="font-bold text-dark-secondary">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-dark-text line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-dark-secondary truncate">{item.donorName}</p>
                  <p className="text-xs font-black text-brand-900">{item.servings} Servings (~{item.weightKg} kg)</p>
                </div>

                <div className="pt-2 border-t border-dark-border/60 text-[11px] font-mono text-amber-800">
                  {freshness.timeRemainingFormatted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
