import { generateSampleListings, DEMO_PROFILES } from '../data/sampleListings';
import { calculateFreshness } from './freshness';

const STORAGE_KEYS = {
  LISTINGS: 'plateshare_listings_v1',
  ROLE: 'plateshare_user_role_v1',
  PROFILE: 'plateshare_user_profile_v1',
  ACTIVITIES: 'plateshare_activity_log_v1',
  INITIALIZED: 'plateshare_initialized_v1'
};

// Safe JSON parse with fallback
function safeParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

// Safe JSON write
function safeWrite(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Initial default activities
function generateDefaultActivities() {
  const now = Date.now();
  const ONE_MIN = 60 * 1000;
  return [
    {
      id: 'act-1',
      title: 'Pickup Confirmed & Rescued',
      description: 'David Chen collected 60 servings of Gourmet Deli Wraps from The Westin Grand Hotel.',
      timestamp: new Date(now - 2.5 * 60 * ONE_MIN).toISOString(),
      type: 'success'
    },
    {
      id: 'act-2',
      title: 'Food Claimed by NGO',
      description: 'Hope Community Food Pantry scheduled pickup for 35 servings of Fresh Farm Fruits.',
      timestamp: new Date(now - 45 * ONE_MIN).toISOString(),
      type: 'claim'
    },
    {
      id: 'act-3',
      title: 'New Surplus Donation Posted',
      description: 'Royal Feast Banquet & Catering published 45 servings of Vegetable Dum Biryani.',
      timestamp: new Date(now - 90 * ONE_MIN).toISOString(),
      type: 'donate'
    },
    {
      id: 'act-4',
      title: 'Safe Pickup Deadline Ended',
      description: 'Southern Spice Canteen listing expired safely. Collection window closed.',
      timestamp: new Date(now - 35 * ONE_MIN).toISOString(),
      type: 'expired'
    }
  ];
}

// Initialize storage with sample listings if empty
export function initStorage() {
  const existing = safeParse(STORAGE_KEYS.LISTINGS, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    resetToDemoData();
  } else {
    // Audit existing listings for time expiration
    autoUpdateExpirations();
  }

  // Ensure role is initialized
  if (!localStorage.getItem(STORAGE_KEYS.ROLE)) {
    localStorage.setItem(STORAGE_KEYS.ROLE, 'ngo'); // Default to NGO/Receiver to explore finding & claiming easily
  }
}

// Auto update listings whose pickup deadline has passed
export function autoUpdateExpirations() {
  const listings = safeParse(STORAGE_KEYS.LISTINGS, []);
  let updated = false;
  const now = new Date();

  const refreshed = listings.map(item => {
    if (item.status === 'Available') {
      const freshness = calculateFreshness(item, now);
      if (freshness.isExpired) {
        updated = true;
        return { ...item, status: 'Expired' };
      }
    }
    return item;
  });

  if (updated) {
    safeWrite(STORAGE_KEYS.LISTINGS, refreshed);
  }
  return refreshed;
}

// Get all listings
export function getListings() {
  const listings = autoUpdateExpirations();
  return listings;
}

// Get single listing by ID
export function getListingById(id) {
  const listings = getListings();
  return listings.find(item => item.id === id) || null;
}

// Save a newly donated listing
export function saveListing(listingData) {
  const listings = safeParse(STORAGE_KEYS.LISTINGS, []);
  
  const newListing = {
    ...listingData,
    id: `listing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'Available',
    createdAt: new Date().toISOString(),
    isDemo: false
  };

  const updated = [newListing, ...listings];
  safeWrite(STORAGE_KEYS.LISTINGS, updated);

  addActivityLog({
    title: 'New Donation Published',
    description: `${newListing.donorName} donated ${newListing.servings} servings of ${newListing.title}.`,
    type: 'donate'
  });

  return newListing;
}

// Claim a listing
export function claimListing(listingId, claimPayload) {
  const listings = safeParse(STORAGE_KEYS.LISTINGS, []);
  const index = listings.findIndex(l => l.id === listingId);

  if (index === -1) {
    throw new Error('Listing not found');
  }

  const listing = listings[index];

  // Validate state
  const freshness = calculateFreshness(listing, new Date());
  if (freshness.isExpired || listing.status === 'Expired') {
    throw new Error('This listing has expired and can no longer be claimed.');
  }

  if (listing.status !== 'Available') {
    throw new Error(`This listing is already ${listing.status.toLowerCase()}.`);
  }

  const claimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
  const pickupCode = `PS-${Math.floor(1000 + Math.random() * 9000)}`;

  const updatedListing = {
    ...listing,
    status: 'Pickup scheduled',
    claimDetails: {
      claimId,
      pickupCode,
      receiverName: claimPayload.receiverName,
      orgName: claimPayload.orgName || '',
      receiverType: claimPayload.receiverType,
      contactPhone: claimPayload.contactPhone,
      contactEmail: claimPayload.contactEmail,
      servingsClaimed: Number(claimPayload.servingsClaimed) || listing.servings,
      preferredTime: claimPayload.preferredTime,
      vehicleInfo: claimPayload.vehicleInfo || 'Standard vehicle',
      notes: claimPayload.notes || '',
      claimedAt: new Date().toISOString()
    }
  };

  listings[index] = updatedListing;
  safeWrite(STORAGE_KEYS.LISTINGS, listings);

  addActivityLog({
    title: 'Food Listing Claimed',
    description: `${claimPayload.receiverName} (${claimPayload.receiverType}) claimed ${updatedListing.claimDetails.servingsClaimed} servings of ${listing.title}. Verification Code: ${pickupCode}`,
    type: 'claim'
  });

  return updatedListing;
}

// Confirm pickup collection
export function confirmCollection(listingId) {
  const listings = safeParse(STORAGE_KEYS.LISTINGS, []);
  const index = listings.findIndex(l => l.id === listingId);

  if (index === -1) {
    throw new Error('Listing not found');
  }

  const listing = listings[index];

  if (listing.status === 'Collected') {
    throw new Error('This food has already been recorded as collected.');
  }

  const updatedListing = {
    ...listing,
    status: 'Collected',
    claimDetails: {
      ...(listing.claimDetails || {}),
      collectedAt: new Date().toISOString()
    }
  };

  listings[index] = updatedListing;
  safeWrite(STORAGE_KEYS.LISTINGS, listings);

  addActivityLog({
    title: 'Food Rescued & Collected',
    description: `Successfully collected ${listing.servings} servings (${listing.weightKg} kg) of ${listing.title}. Great job!`,
    type: 'success'
  });

  return updatedListing;
}

// Cancel a claim
export function cancelClaim(listingId, reason = 'Cancelled by receiver') {
  const listings = safeParse(STORAGE_KEYS.LISTINGS, []);
  const index = listings.findIndex(l => l.id === listingId);

  if (index === -1) {
    throw new Error('Listing not found');
  }

  const listing = listings[index];
  const freshness = calculateFreshness(listing, new Date());
  const newStatus = freshness.isExpired ? 'Expired' : 'Available';

  const updatedListing = {
    ...listing,
    status: newStatus,
    claimDetails: null
  };

  listings[index] = updatedListing;
  safeWrite(STORAGE_KEYS.LISTINGS, listings);

  addActivityLog({
    title: 'Claim Cancelled',
    description: `Claim on ${listing.title} was cancelled. Status returned to ${newStatus}.`,
    type: 'warning'
  });

  return updatedListing;
}

// Calculate application statistics dynamically
export function getPlatformStats() {
  const listings = autoUpdateExpirations();

  let availableMeals = 0;
  let totalAvailableListings = 0;
  let foodClaimedCount = 0;
  let completedPickups = 0;
  let servingsRescued = 0;
  let kgSaved = 0;
  let expiredListings = 0;

  const donorSet = new Set();
  const receiverSet = new Set();

  listings.forEach(item => {
    if (item.donorName) donorSet.add(item.donorName);

    if (item.status === 'Available') {
      availableMeals += Number(item.servings) || 0;
      totalAvailableListings += 1;
    } else if (item.status === 'Pickup scheduled' || item.status === 'Claimed') {
      foodClaimedCount += 1;
      if (item.claimDetails?.orgName || item.claimDetails?.receiverName) {
        receiverSet.add(item.claimDetails.orgName || item.claimDetails.receiverName);
      }
    } else if (item.status === 'Collected') {
      completedPickups += 1;
      servingsRescued += Number(item.servings) || 0;
      kgSaved += Number(item.weightKg) || 0;
      if (item.claimDetails?.orgName || item.claimDetails?.receiverName) {
        receiverSet.add(item.claimDetails.orgName || item.claimDetails.receiverName);
      }
    } else if (item.status === 'Expired') {
      expiredListings += 1;
    }
  });

  // Calculate environmental impact: 1 kg rescued food ≈ 2.5 kg CO2e emissions prevented
  const co2PreventedKg = Number((kgSaved * 2.5).toFixed(1));

  return {
    totalListings: listings.length,
    availableMeals,
    totalAvailableListings,
    foodClaimedCount,
    completedPickups,
    servingsRescued,
    kgSaved: Number(kgSaved.toFixed(1)),
    co2PreventedKg,
    expiredListings,
    activeDonors: Math.max(donorSet.size, 1),
    activeReceivers: Math.max(receiverSet.size, 1)
  };
}

// Activity Log helpers
export function getActivityLog() {
  return safeParse(STORAGE_KEYS.ACTIVITIES, generateDefaultActivities());
}

export function addActivityLog({ title, description, type = 'info' }) {
  const activities = safeParse(STORAGE_KEYS.ACTIVITIES, generateDefaultActivities());
  const newActivity = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    description,
    type,
    timestamp: new Date().toISOString()
  };
  const updated = [newActivity, ...activities.slice(0, 24)]; // Keep top 25
  safeWrite(STORAGE_KEYS.ACTIVITIES, updated);
  return updated;
}

// Role and Profile
export function getCurrentRole() {
  return localStorage.getItem(STORAGE_KEYS.ROLE) || 'ngo';
}

export function setCurrentRole(role) {
  if (DEMO_PROFILES[role]) {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_PROFILES[role]));
    return DEMO_PROFILES[role];
  }
  return null;
}

export function getUserProfile() {
  const role = getCurrentRole();
  const stored = safeParse(STORAGE_KEYS.PROFILE, null);
  return stored || DEMO_PROFILES[role] || DEMO_PROFILES.ngo;
}

// Reset data to default demo state
export function resetToDemoData() {
  const sampleListings = generateSampleListings();
  safeWrite(STORAGE_KEYS.LISTINGS, sampleListings);
  safeWrite(STORAGE_KEYS.ACTIVITIES, generateDefaultActivities());
  safeWrite(STORAGE_KEYS.ROLE, 'ngo');
  safeWrite(STORAGE_KEYS.PROFILE, DEMO_PROFILES.ngo);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  return sampleListings;
}
