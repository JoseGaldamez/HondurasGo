/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Destination, VisitRecord, UserPassport, Category } from './types';
import { HONDURAS_DESTINATIONS, CATEGORIES } from './data/destinations';
import { 
  getStoredVisits, 
  saveVisit, 
  removeVisit, 
  getStoredPassport, 
  savePassport, 
  resetToDemoData,
  calculateBadgesProgress 
} from './services/storage';
import { GoogleMapsHero } from './components/GoogleMapsHero';
import { AirbnbPlaceList } from './components/AirbnbPlaceList';
import { PassportView } from './components/PassportView';
import { BadgesView } from './components/BadgesView';
import { VisitModal } from './components/VisitModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { OfflineManagerModal } from './components/OfflineManagerModal';

import { 
  Compass, 
  BookOpen, 
  Award, 
  MapPin, 
  Locate, 
  Wifi, 
  WifiOff, 
  Plus,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'passport' | 'badges'>('explore');
  const [activeCategory, setActiveCategory] = useState<Category>('Destacados');
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [passport, setPassport] = useState<UserPassport>(getStoredPassport());
  
  // Selected place for Google Maps focus & routing
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Modals
  const [stampingDestination, setStampingDestination] = useState<Destination | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    setVisits(getStoredVisits());
    setPassport(getStoredPassport());

    // Check offline status
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial GPS attempt
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // If denied, default to Tegucigalpa coordinates so routing is immediately demonstrative
          setUserLocation({ lat: 14.072, lng: -87.192 });
        },
        { timeout: 5000 }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSaveVisit = (visit: VisitRecord) => {
    const updated = saveVisit(visit);
    setVisits(updated);
  };

  const handleDeleteVisit = (destinationId: string) => {
    const updated = removeVisit(destinationId);
    setVisits(updated);
  };

  const handleUpdatePassport = (updatedPassport: UserPassport) => {
    const saved = savePassport(updatedPassport);
    setPassport(saved);
  };

  const handleResetDemoData = () => {
    const demo = resetToDemoData();
    setVisits(demo.visits);
    setPassport(demo.passport);
  };

  const handleImportData = (data: { visits: VisitRecord[]; passport: UserPassport }) => {
    localStorage.setItem('explora_honduras_visits_v1', JSON.stringify(data.visits));
    localStorage.setItem('explora_honduras_passport_v1', JSON.stringify(data.passport));
    setVisits(data.visits);
    setPassport(data.passport);
  };

  const handleViewLocation = (destination: Destination) => {
    setSelectedDestination(destination);
    setActiveTab('explore');
    // Smooth scroll to hero map
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterVisit = (destination: Destination) => {
    setStampingDestination(destination);
    setIsVisitModalOpen(true);
  };

  const badgeStats = calculateBadgesProgress(visits);
  const unlockedBadgesCount = badgeStats.filter(b => b.isUnlocked).length;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans pb-24 md:pb-12">
      {/* Clean Airbnb-Style Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark (Clean Airbnb travel style) */}
          <div 
            onClick={() => {
              setActiveTab('explore');
              setSelectedDestination(null);
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              HN
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-display">
                honduras<span className="text-rose-500">go</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Clean text) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('explore')}
              className={`hover:text-slate-900 transition-colors py-1 ${
                activeTab === 'explore' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
              }`}
            >
              Explorar & Mapa
            </button>
            <button
              onClick={() => setActiveTab('passport')}
              className={`hover:text-slate-900 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'passport' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
              }`}
            >
              <span>Pasaporte</span>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {visits.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`hover:text-slate-900 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'badges' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
              }`}
            >
              <span>Medallas</span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {unlockedBadgesCount}
              </span>
            </button>
          </nav>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
              title="Ajustes de datos y offline"
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                const firstPending = HONDURAS_DESTINATIONS.find(d => !visits.some(v => v.destinationId === d.id));
                handleRegisterVisit(firstPending || HONDURAS_DESTINATIONS[0]);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Visita</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 flex-1">
        {/* TAB 1: EXPLORE (HERO GOOGLE MAP + AIRBNB PLACES BY CATEGORY) */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* 3) Hero: Real Google Map of Honduras with Route Tracing */}
            <section className="space-y-2">
              <GoogleMapsHero
                destinations={HONDURAS_DESTINATIONS}
                visits={visits}
                selectedDestination={selectedDestination}
                onSelectDestination={setSelectedDestination}
                onOpenVisitModal={handleRegisterVisit}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
              />
            </section>

            {/* 2 & 3) Clean Airbnb-Style Places by Category */}
            <section className="pt-2">
              <AirbnbPlaceList
                destinations={HONDURAS_DESTINATIONS}
                visits={visits}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                onViewLocation={handleViewLocation}
                onRegisterVisit={handleRegisterVisit}
                selectedDestinationId={selectedDestination?.id}
              />
            </section>
          </div>
        )}

        {/* TAB 2: VIRTUAL PASSPORT */}
        {activeTab === 'passport' && (
          <div className="pt-2 animate-in fade-in">
            <PassportView
              passport={passport}
              visits={visits}
              destinations={HONDURAS_DESTINATIONS}
              onUpdatePassport={handleUpdatePassport}
              onOpenVisitModal={handleRegisterVisit}
              onSelectVisit={(visit) => {
                const dest = HONDURAS_DESTINATIONS.find(d => d.id === visit.destinationId);
                if (dest) {
                  setSelectedDestination(dest);
                  setIsDetailModalOpen(true);
                }
              }}
            />
          </div>
        )}

        {/* TAB 3: BADGES */}
        {activeTab === 'badges' && (
          <div className="pt-2 animate-in fade-in">
            <BadgesView
              visits={visits}
              destinations={HONDURAS_DESTINATIONS}
              onExploreTheme={(themeKey) => {
                const matched = CATEGORIES.find(c => c.id === themeKey || c.name === themeKey);
                if (matched) {
                  setActiveCategory(matched.id);
                }
                setActiveTab('explore');
              }}
            />
          </div>
        )}
      </main>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (Clean Airbnb style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-lg">
        <div className="grid grid-cols-3 items-center h-16 max-w-sm mx-auto">
          {/* Tab 1: Explorar */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'explore' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Explorar</span>
          </button>

          {/* Tab 2: Pasaporte */}
          <button
            onClick={() => setActiveTab('passport')}
            className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors ${
              activeTab === 'passport' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-5 h-5" />
              {visits.length > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {visits.length}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Pasaporte</span>
          </button>

          {/* Tab 3: Medallas */}
          <button
            onClick={() => setActiveTab('badges')}
            className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors ${
              activeTab === 'badges' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Award className="w-5 h-5" />
              {unlockedBadgesCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unlockedBadgesCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Medallas</span>
          </button>
        </div>
      </nav>

      {/* Modal: Visit Registration & Stamp Form */}
      {stampingDestination && (
        <VisitModal
          destination={stampingDestination}
          existingVisit={visits.find(v => v.destinationId === stampingDestination.id)}
          isOpen={isVisitModalOpen}
          onClose={() => {
            setIsVisitModalOpen(false);
            setStampingDestination(null);
          }}
          onSaveVisit={handleSaveVisit}
          onDeleteVisit={handleDeleteVisit}
        />
      )}

      {/* Modal: Destination Detail View */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          visit={visits.find(v => v.destinationId === selectedDestination.id)}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onOpenVisitModal={handleRegisterVisit}
          onViewOnMap={handleViewLocation}
        />
      )}

      {/* Modal: Offline Data & Backup */}
      <OfflineManagerModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineMode(prev => !prev)}
        visits={visits}
        passport={passport}
        onResetDemoData={handleResetDemoData}
        onImportData={handleImportData}
      />
    </div>
  );
}
