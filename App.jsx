import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './ToastContext';
import { PlateShareProvider } from './PlateShareContext';

// Components
import JudgeDemoBar from './JudgeDemoBar';
import Navbar from './Navbar';
import Footer from './Footer';

// Pages
import LandingPage from './LandingPage';
import FindFoodPage from './FindFoodPage';
import DonateFoodPage from './DonateFoodPage';
import PickupManagementPage from './PickupManagementPage';
import DashboardPage from './DashboardPage';
import ImpactPage from './ImpactPage';

export default function App() {
  return (
    <ToastProvider>
      <PlateShareProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#17231B] font-sans antialiased">
            {/* Top Hackathon Judge Demo Bar */}
            <JudgeDemoBar />

            {/* Main Application Navigation */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/find" element={<FindFoodPage />} />
                <Route path="/donate" element={<DonateFoodPage />} />
                <Route path="/pickups" element={<PickupManagementPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Application Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </PlateShareProvider>
    </ToastProvider>
  );
}
