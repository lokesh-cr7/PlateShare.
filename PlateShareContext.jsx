import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initStorage,
  getListings,
  saveListing,
  claimListing,
  confirmCollection,
  cancelClaim,
  getPlatformStats,
  getActivityLog,
  getCurrentRole,
  setCurrentRole,
  getUserProfile,
  resetToDemoData
} from '../utils/storage';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

const PlateShareContext = createContext(null);

export function PlateShareProvider({ children }) {
  const { showToast } = useToast();
  
  const [listings, setListings] = useState([]);
  const [metrics, setMetrics] = useState({
    totalListings: 0,
    availableMeals: 0,
    totalAvailableListings: 0,
    foodClaimedCount: 0,
    completedPickups: 0,
    servingsRescued: 0,
    kgSaved: 0,
    co2PreventedKg: 0,
    expiredListings: 0,
    activeDonors: 0,
    activeReceivers: 0
  });
  const [activities, setActivities] = useState([]);
  const [currentRole, setRoleState] = useState('ngo');
  const [userProfile, setUserProfile] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refresh data from storage
  const refreshState = useCallback(() => {
    const currentListings = getListings();
    setListings(currentListings);
    setMetrics(getPlatformStats());
    setActivities(getActivityLog());
    const role = getCurrentRole();
    setRoleState(role);
    setUserProfile(getUserProfile());
  }, []);

  // Initialize on mount
  useEffect(() => {
    initStorage();
    refreshState();
  }, [refreshState]);

  // Periodic ticker: advance clock every 15s to update freshness meter & auto-expire listings
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      refreshState();
    }, 15000);
    return () => clearInterval(timer);
  }, [refreshState]);

  // Change active demo role
  const switchRole = useCallback((newRole) => {
    const updatedProfile = setCurrentRole(newRole);
    setRoleState(newRole);
    setUserProfile(updatedProfile);
    showToast(`Switched active demo view to: ${updatedProfile?.roleLabel || newRole}`, 'info');
  }, [showToast]);

  // Post a new surplus donation
  const createListing = useCallback((formData) => {
    try {
      const created = saveListing(formData);
      refreshState();
      showToast(`Success! "${created.title}" posted with ${created.servings} available servings.`, 'success');
      
      // Joyful burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#166534', '#22C55E', '#86EFAC']
        });
      } catch {
        // ignore
      }
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to publish listing', 'error');
      throw err;
    }
  }, [refreshState, showToast]);

  // Claim a listing
  const claimFood = useCallback((listingId, claimData) => {
    try {
      const updated = claimListing(listingId, claimData);
      refreshState();
      showToast(`Pickup scheduled! Verification Code: ${updated.claimDetails.pickupCode}`, 'success');
      
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#166534', '#F59E0B', '#22C55E']
        });
      } catch {
        // ignore
      }
      return updated;
    } catch (err) {
      showToast(err.message || 'Unable to claim listing', 'error');
      throw err;
    }
  }, [refreshState, showToast]);

  // Confirm collection of food
  const confirmPickupCollection = useCallback((listingId) => {
    try {
      const updated = confirmCollection(listingId);
      refreshState();
      showToast(`Collection verified! ${updated.servings} meals marked rescued!`, 'success');
      
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#166534', '#F59E0B', '#DCFCE7', '#EAB308']
        });
      } catch {
        // ignore
      }
      return updated;
    } catch (err) {
      showToast(err.message || 'Unable to confirm collection', 'error');
      throw err;
    }
  }, [refreshState, showToast]);

  // Cancel an existing claim
  const cancelFoodClaim = useCallback((listingId, reason) => {
    try {
      const updated = cancelClaim(listingId, reason);
      refreshState();
      showToast(`Claim cancelled. Listing status reverted to ${updated.status}.`, 'warning');
      return updated;
    } catch (err) {
      showToast(err.message || 'Unable to cancel claim', 'error');
      throw err;
    }
  }, [refreshState, showToast]);

  // Reset entire dataset to pristine demo state
  const resetData = useCallback(() => {
    resetToDemoData();
    refreshState();
    showToast('Platform reset to original demo state with sample listings.', 'info');
  }, [refreshState, showToast]);

  return (
    <PlateShareContext.Provider
      value={{
        listings,
        metrics,
        activities,
        currentRole,
        userProfile,
        currentTime,
        switchRole,
        createListing,
        claimFood,
        confirmPickupCollection,
        cancelFoodClaim,
        resetData,
        refreshState
      }}
    >
      {children}
    </PlateShareContext.Provider>
  );
}

export function usePlateShare() {
  const context = useContext(PlateShareContext);
  if (!context) {
    throw new Error('usePlateShare must be used within a PlateShareProvider');
  }
  return context;
}
