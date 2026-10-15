import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { PlateShareProvider } from './context/PlateShareContext';

// Components
import JudgeDemoBar from './components/JudgeDemoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import FindFoodPage from './pages/FindFoodPage';
import DonateFoodPage from './pages/DonateFoodPage';
import PickupManagementPage from './pages/PickupManagementPage';
import DashboardPage from './pages/DashboardPage';
import ImpactPage from './pages/ImpactPage';

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
