import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { usePlateShare } from '../context/PlateShareContext';
import {
  UtensilsCrossed,
  PlusCircle,
  Search,
  Truck,
  LayoutDashboard,
  HeartHandshake,
  Menu,
  X,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const { currentRole, userProfile, metrics } = usePlateShare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/find', label: 'Find Food', badge: metrics.totalAvailableListings },
    { to: '/donate', label: 'Donate Food' },
    { to: '/pickups', label: 'Pickups', badge: metrics.foodClaimedCount },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/impact', label: 'Impact' },
  ];

  return (
    <header className="sticky top-0 z-30 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center text-white shadow-soft group-hover:bg-brand-800 transition duration-300">
              <UtensilsCrossed className="w-6 h-6 transform group-hover:scale-110 transition duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-brand-900">
                  Plate<span className="text-brand-600">Share</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200 uppercase">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-dark-secondary -mt-1 hidden sm:block">
                Surplus Food Redistribution
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-dark-border/60 shadow-sm" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-full text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-dark-text hover:text-brand-700 hover:bg-brand-50/60'
                  }`
                }
              >
                <span>{link.label}</span>
                {Boolean(link.badge) && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-brand-100 text-brand-900 font-bold border border-brand-200">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Role Indicator & Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Active profile chip */}
            {userProfile && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 border border-amber-200/80 text-xs">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-300 flex-shrink-0 bg-white">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 m-1.5 text-amber-800" />
                  )}
                </div>
                <div className="text-left leading-tight">
                  <p className="font-bold text-dark-text truncate max-w-[130px]">{userProfile.name}</p>
                  <p className="text-[10px] text-amber-800 font-medium capitalize">{userProfile.roleLabel}</p>
                </div>
              </div>
            )}

            <Link
              to="/donate"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-soft hover:shadow-soft-lg transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Food</span>
            </Link>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white border border-dark-border text-dark-text hover:bg-brand-50 hover:text-brand-700 transition"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-dark-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4">
          {userProfile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-100 border border-amber-200 mb-2">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold text-dark-text">{userProfile.name}</p>
                <p className="text-xs text-amber-800 font-medium">{userProfile.roleLabel} • {userProfile.organization}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-700 text-white'
                      : 'bg-gray-50 text-dark-text hover:bg-brand-50'
                  }`
                }
              >
                <span>{link.label}</span>
                {Boolean(link.badge) && (
                  <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-brand-200 text-brand-900 font-bold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white p-3 rounded-xl font-bold text-sm shadow-soft"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Donate Surplus Food</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
