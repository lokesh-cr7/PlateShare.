import React, { useState, useMemo } from 'react';
import { usePlateShare } from '../context/PlateShareContext';
import FoodCard from '../components/FoodCard';
import ClaimModal from '../components/ClaimModal';
import FoodDetailModal from '../components/FoodDetailModal';
import { calculateFreshness } from '../utils/freshness';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Utensils,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Cooked meals',
  'Rice and biryani',
  'Bakery items',
  'Fruits and vegetables',
  'Packaged food',
  'Other'
];

export default function FindFoodPage() {
  const { listings, currentTime } = usePlateShare();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [availabilityFilter, setAvailabilityFilter] = useState('available'); // 'available', 'expiring-soon', 'all', 'claimed', 'expired'
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'newest', 'servings'

  const [selectedForClaim, setSelectedForClaim] = useState(null);
  const [selectedForDetail, setSelectedForDetail] = useState(null);

  // Extract unique areas from listings
  const uniqueAreas = useMemo(() => {
    const set = new Set();
    listings.forEach(l => {
      if (l.area) set.add(l.area);
    });
    return ['All Areas', ...Array.from(set)];
  }, [listings]);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter(item => {
        // Search filter
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch = !query ||
          item.title.toLowerCase().includes(query) ||
          item.donorName.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.area && item.area.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        // Category filter
        if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
          return false;
        }

        // Area filter
        if (selectedArea !== 'All Areas' && item.area !== selectedArea) {
          return false;
        }

        // Availability filter
        const freshness = calculateFreshness(item, currentTime);
        if (availabilityFilter === 'available') {
          return item.status === 'Available' && !freshness.isExpired;
        }
        if (availabilityFilter === 'expiring-soon') {
          return item.status === 'Available' && freshness.status === 'expiring-soon';
        }
        if (availabilityFilter === 'claimed') {
          return item.status === 'Pickup scheduled' || item.status === 'Claimed';
        }
        if (availabilityFilter === 'expired') {
          return item.status === 'Expired' || freshness.isExpired;
        }

        return true; // 'all'
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.pickupDeadline).getTime() - new Date(b.pickupDeadline).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || b.preparedAt).getTime() - new Date(a.createdAt || a.preparedAt).getTime();
        }
        if (sortBy === 'servings') {
          return (Number(b.servings) || 0) - (Number(a.servings) || 0);
        }
        return 0;
      });
  }, [listings, searchTerm, selectedCategory, selectedArea, availabilityFilter, sortBy, currentTime]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedArea('All Areas');
    setAvailabilityFilter('all');
    setSortBy('deadline');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 mb-1">
          <Utensils className="w-4 h-4" />
          <span>Surplus Food Discovery Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-950">
          Find Surplus Food Nearby
        </h1>
        <p className="text-sm text-dark-secondary mt-1 max-w-2xl">
          Discover available edible meals from restaurants, banquet halls, hotels, and markets. Verified pickup passes protect against food waste and hunger.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-dark-border shadow-soft-sm space-y-4">
        {/* Top search & selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-dark-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food name, donor, or area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-border focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-text text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Area Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-dark-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-dark-border bg-white focus:border-brand-600 outline-none text-xs cursor-pointer"
            >
              {uniqueAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-dark-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-dark-border bg-white focus:border-brand-600 outline-none text-xs cursor-pointer"
            >
              <option value="deadline">Sort: Safe Deadline (Soonest)</option>
              <option value="newest">Sort: Newly Published</option>
              <option value="servings">Sort: Largest Portions</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-dark-secondary mr-1 flex items-center gap-1 flex-shrink-0">
            <Layers className="w-3.5 h-3.5" /> Category:
          </span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white shadow-soft-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Availability Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dark-border/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-dark-secondary mr-1">Status:</span>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'available'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
              }`}
            >
              Available Now
            </button>
            <button
              onClick={() => setAvailabilityFilter('expiring-soon')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                availabilityFilter === 'expiring-soon'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Expiring Soon
            </button>
            <button
              onClick={() => setAvailabilityFilter('claimed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'claimed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
              }`}
            >
              Claimed / Scheduled
            </button>
            <button
              onClick={() => setAvailabilityFilter('expired')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'expired'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
              }`}
            >
              Expired
            </button>
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                availabilityFilter === 'all'
                  ? 'bg-dark-text text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-dark-secondary'
              }`}
            >
              All Listings
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-secondary">
              Showing <strong>{filteredListings.length}</strong> listings
            </span>
            {(searchTerm || selectedCategory !== 'All Categories' || selectedArea !== 'All Areas' || availabilityFilter !== 'available') && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
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
        /* Empty Results State */
        <div className="bg-white rounded-3xl p-12 text-center border border-dark-border shadow-soft-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-amber-700 flex items-center justify-center mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text">No listings match your filters</h3>
            <p className="text-xs text-dark-secondary mt-1">
              Try adjusting your category, search keyword, or status filters to discover available surplus food.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-soft transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset All Filters
          </button>
        </div>
      )}

      {/* Modals */}
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
