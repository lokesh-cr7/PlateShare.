import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Globe2, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white pt-16 pb-12 border-t border-brand-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-900">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-soft">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Plate<span className="text-brand-400">Share</span>
              </span>
            </Link>
            <p className="text-xs text-brand-200/80 leading-relaxed">
              Connecting restaurants, hotels, event organizers, and households with local NGOs and volunteers to redistribute surplus edible food before it goes to waste.
            </p>
            <div className="text-[11px] text-brand-300/70 font-mono">
              Hackathon Problem ID: #6 • Leftover Food Sharing
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-brand-200/80">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-white transition">Find Food Directory</Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition">Donate Surplus Food</Link>
              </li>
              <li>
                <Link to="/pickups" className="hover:text-white transition">Pickup Management</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">Live Dashboard</Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition">Community Impact</Link>
              </li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Safety & Standards
            </h4>
            <ul className="space-y-2 text-xs text-brand-200/80">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Food Hygiene Declarations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Real-Time Freshness Tracking</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Verification Pass Code Locking</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                <span>Strict Expiry Prevention</span>
              </li>
            </ul>
          </div>

          {/* Food Safety Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Food Safety Notice
            </h4>
            <p className="text-[11px] text-brand-200/70 leading-relaxed">
              PlateShare is a community coordination platform. Timers and freshness indicators are operational tracking estimates. All donors and receivers must adhere to local food hygiene guidelines and inspect items before distribution.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-brand-900 border border-brand-800 text-brand-300">
                <Heart className="w-3 h-3 text-red-400" /> Powered by Community Love
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-300/70 gap-4">
          <p>
            © {new Date().getFullYear()} PlateShare. Built for social impact and food waste reduction.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] bg-brand-900/60 px-2 py-0.5 rounded border border-brand-800 text-brand-300">
              Modular Architecture (Backend Ready)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
