import React, { useState, useEffect, useMemo } from 'react';
import { INDIA_TRIPS } from './data/indiaTrips';
import { Trip, ItineraryItem, ItineraryCategory } from './types/travel';
import { Header } from './components/Header';
import { TripHero } from './components/TripHero';
import { TransitQuickBar } from './components/TransitQuickBar';
import { DayNavigator } from './components/DayNavigator';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { InteractiveMapModal } from './components/InteractiveMapModal';
import { AddActivityModal } from './components/AddActivityModal';
import { TouristToolkitModal } from './components/TouristToolkitModal';
import { BudgetBreakdownModal } from './components/BudgetBreakdownModal';
import { BottomNavBar, MainNavTab } from './components/BottomNavBar';
import { TransitPage } from './components/pages/TransitPage';
import { ExplorePage } from './components/pages/ExplorePage';
import { GuideMarketplacePage } from './components/guides/GuideMarketplacePage';
import { FloatingAssistantButton } from './components/chat/FloatingAssistantButton';
import { TravelAssistantModal } from './components/chat/TravelAssistantModal';
import { FairPriceScamEngine } from './components/trust/FairPriceScamEngine';
import { SafetyPage } from './components/safety/SafetyPage';
import { GlobalSOSModal } from './components/safety/GlobalSOSModal';
import { AITripPlannerPage } from './components/ai/AITripPlannerPage';
import { IndustryAuthorityPortal } from './components/b2b/IndustryAuthorityPortal';
import { RequestAssistanceModal } from './components/accessibility/RequestAssistanceModal';
import { TravelerProfilePage } from './components/profile/TravelerProfilePage';
import { FloatingSOSButton } from './components/safety/FloatingSOSButton';
import { EcosystemFlowModal } from './components/dashboards/EcosystemFlowModal';
import { BusinessDashboard } from './components/dashboards/BusinessDashboard';
import { AuthorityDashboard } from './components/dashboards/AuthorityDashboard';
import { DashboardMapSection } from './components/maps/DashboardMapSection';
import { AppEntity } from './types/entity';
import { AuthUser, DEMO_ACCOUNTS } from './types/auth';
import { LoginPage } from './components/auth/LoginPage';
import { MapPin, Check, AlertOctagon, LifeBuoy, Accessibility } from 'lucide-react';

export default function App() {
  // Trips state with localStorage caching
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('india_travel_trips_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge in any new default trips (like Indore) not yet in cache
          const existingIds = new Set(parsed.map((t: Trip) => t.id));
          const missingTrips = INDIA_TRIPS.filter(t => !existingIds.has(t.id));
          return [...parsed, ...missingTrips];
        }
      }
      return INDIA_TRIPS;
    } catch {
      return INDIA_TRIPS;
    }
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    return trips[0]?.id || 'golden-triangle';
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<ItineraryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('itinerary');
  const [mapSafetySubTab, setMapSafetySubTab] = useState<'map' | 'safety'>('map');

  // User Authentication State (Role-gated dashboards: Tourist, Business, Authority)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('bharat_yatra_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null; // Not authenticated: presents LoginPage
  });

  // Active dashboard entity is strictly locked to the authenticated user's role
  const currentEntity: AppEntity = currentUser ? currentUser.role : 'tourist';
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState(false);

  // PRD Features State
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sih_accessibility_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Modals
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number; title?: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync trips to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('india_travel_trips_2026', JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [trips]);

  // Sync accessibility mode
  useEffect(() => {
    try {
      localStorage.setItem('sih_accessibility_mode', accessibilityMode ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [accessibilityMode]);

  // Sync current entity
  useEffect(() => {
    try {
      localStorage.setItem('bharat_yatra_entity', currentEntity);
    } catch (e) {
      console.error(e);
    }
  }, [currentEntity]);

  // Find active trip
  const currentTrip = useMemo(() => {
    return trips.find(t => t.id === activeTripId) || trips[0];
  }, [trips, activeTripId]);

  // Active day
  const currentDay = useMemo(() => {
    return currentTrip.days[selectedDayIndex] || currentTrip.days[0];
  }, [currentTrip, selectedDayIndex]);

  // Compute stats across trip
  const allItems = useMemo(() => {
    return currentTrip.days.flatMap(d => d.items);
  }, [currentTrip]);

  const totalActivities = allItems.length;
  const completedActivities = allItems.filter(i => i.completed).length;
  const totalCost = allItems.reduce((acc, i) => acc + (i.cost || 0), 0);

  // Category counts for current day
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: currentDay.items.length,
      transit: 0,
      cultural_sight: 0,
      culinary: 0,
      cultural_buy: 0,
      festival: 0,
    };

    currentDay.items.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [currentDay]);

  // Filtered items for current day based on search and category
  const filteredDayItems = useMemo(() => {
    return currentDay.items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.touristTip.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        (item.transitDetails && (
          item.transitDetails.from.toLowerCase().includes(q) ||
          item.transitDetails.to.toLowerCase().includes(q) ||
          item.transitDetails.mode.toLowerCase().includes(q)
        )) ||
        (item.culinaryDetails && item.culinaryDetails.specialties.some(s => s.toLowerCase().includes(q))) ||
        (item.culturalBuyDetails && item.culturalBuyDetails.itemToBuy.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [currentDay, selectedCategory, searchQuery]);

  // Toggle completed status
  const handleToggleComplete = (itemId: string) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          days: trip.days.map(day => ({
            ...day,
            items: day.items.map(it => {
              if (it.id === itemId) {
                return { ...it, completed: !it.completed };
              }
              return it;
            })
          }))
        };
      });
    });
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          days: trip.days.map(day => ({
            ...day,
            items: day.items.filter(it => it.id !== itemId)
          }))
        };
      });
    });
    showToast('Stop removed from itinerary');
  };

  // Add item
  const handleAddItem = (newItemData: Omit<ItineraryItem, 'id'>) => {
    const newItem: ItineraryItem = {
      ...newItemData,
      id: `custom-${Date.now()}`
    };

    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id !== activeTripId) return trip;
        return {
          ...trip,
          days: trip.days.map((day, idx) => {
            if (idx === selectedDayIndex) {
              return {
                ...day,
                items: [...day.items, newItem]
              };
            }
            return day;
          })
        };
      });
    });

    showToast(`Added "${newItem.title}" to Day ${currentDay.dayNumber}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('bharat_yatra_auth_user', JSON.stringify(user));
      localStorage.setItem('bharat_yatra_entity', user.role);
    } catch (e) {
      console.error(e);
    }
    showToast(`Signed in as ${user.name} (${user.role.toUpperCase()})`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bharat_yatra_auth_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out successfully.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchAccount = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bharat_yatra_auth_user');
    } catch (e) {
      console.error(e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Trip itinerary link copied to clipboard!');
    } else {
      showToast('Itinerary ready to share!');
    }
  };

  const handleOpenTransitInfo = (_mode: string) => {
    setActiveNavTab('transit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If not authenticated, render Login/Authentication Page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F5F0]">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          initialRole={currentEntity}
        />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1F1C18] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#191715] flex flex-col font-sans selection:bg-[#C84B31]/20 selection:text-[#C84B31]">
      
      {/* Top Application Bar with User Profile & Role Info */}
      <Header
        currentTrip={currentTrip}
        allTrips={trips}
        onSelectTrip={(id) => {
          setActiveTripId(id);
          setSelectedDayIndex(0);
          setSelectedCategory('all');
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenToolkit={() => {
          setActiveNavTab('guides');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProfile={() => {
          setActiveNavTab('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Persistent Accessibility Banner (PRD Section 4.5) */}
      {accessibilityMode && (
        <div className="bg-[#0284C7] text-white px-4 py-2.5 shadow-sm border-b border-[#0369A1] animate-in fade-in duration-200">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-white/20">
                <Accessibility className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span>
                <strong>Accessibility Mode Active:</strong> Surfacing step-free monument routes, tactile audio guides, and accessible restrooms.
              </span>
            </div>

            <button
              onClick={() => setIsAssistanceOpen(true)}
              className="px-3 py-1 bg-white hover:bg-[#F0F9FF] text-[#0369A1] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Request On-Ground Sahayak</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-24">
        
        {/* ENTITY 2: BUSINESS DASHBOARD (Merchants & Hoteliers) */}
        {currentEntity === 'business' && (
          <BusinessDashboard
            currentUser={currentUser}
            onOpenEcosystemModal={() => setIsEcosystemModalOpen(true)}
          />
        )}

        {/* ENTITY 3: AUTHORITY DASHBOARD (Ministry, ASI & Police) */}
        {currentEntity === 'authority' && (
          <AuthorityDashboard
            currentUser={currentUser}
            onOpenEcosystemModal={() => setIsEcosystemModalOpen(true)}
          />
        )}

        {/* ENTITY 1: TOURIST APP (Travelers & Visitors) */}
        {currentEntity === 'tourist' && (
          <>
            {/* TAB 1: ITINERARY VIEW (Core requested view) */}
            {activeNavTab === 'itinerary' && (
              <div className="animate-in fade-in duration-200 space-y-6">
                {/* Trip Hero Header Card with Companions and Stats */}
                <TripHero
                  trip={currentTrip}
                  allTrips={trips}
                  onSelectTrip={(id) => {
                    setActiveTripId(id);
                    setSelectedDayIndex(0);
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  onSelectDay={(idx) => {
                    setSelectedDayIndex(idx);
                    setSelectedCategory('all');
                  }}
                  totalActivities={totalActivities}
                  completedActivities={completedActivities}
                  totalCost={totalCost}
                  onOpenMap={() => setIsMapOpen(true)}
                  onOpenBudget={() => setIsBudgetOpen(true)}
                  onAddActivity={() => setIsAddOpen(true)}
                  onOpenScanner={() => {}}
                  selectedDayIndex={selectedDayIndex}
                />

                {/* Multi-Modal Transit Ribbon (Train, Metro, Auto, Boat) */}
                <TransitQuickBar
                  onOpenTransitDetails={handleOpenTransitInfo}
                />

                {/* Day Selector Ribbon & Category Filter Tabs */}
                <DayNavigator
                  days={currentTrip.days}
                  selectedDayIndex={selectedDayIndex}
                  onSelectDay={(idx) => {
                    setSelectedDayIndex(idx);
                    setSelectedCategory('all');
                  }}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={categoryCounts}
                />

                {/* Day Timeline Cards */}
                <ItineraryTimeline
                  currentDay={currentDay}
                  items={filteredDayItems}
                  onToggleComplete={handleToggleComplete}
                  onDeleteItem={handleDeleteItem}
                  onAddActivity={() => setIsAddOpen(true)}
                  onSelectMapLocation={(lat, lng, title) => {
                    setFocusLocation({ lat, lng, title });
                    setIsMapOpen(true);
                  }}
                  searchQuery={searchQuery}
                />
              </div>
            )}

            {/* DEDICATED LIVE MAP + SAFETY HUB (Merged Section) */}
            {activeNavTab === 'map_safety' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Sub-tab Toggle */}
                <div className="flex items-center bg-white rounded-2xl p-1 border border-[#EAE5DC] shadow-xs w-fit gap-1">
                  <button
                    id="map-safety-subtab-map"
                    onClick={() => setMapSafetySubTab('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      mapSafetySubTab === 'map'
                        ? 'bg-[#C84B31] text-white shadow-sm'
                        : 'text-[#665E55] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Live Map
                  </button>
                  <button
                    id="map-safety-subtab-safety"
                    onClick={() => setMapSafetySubTab('safety')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                      mapSafetySubTab === 'safety'
                        ? 'bg-[#E11D48] text-white shadow-sm'
                        : 'text-[#665E55] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4" />
                    Safety & Risk
                  </button>
                </div>

                {/* Live Map Sub-view */}
                {mapSafetySubTab === 'map' && (
                  <DashboardMapSection
                    role="tourist"
                    currentUser={currentUser}
                  />
                )}

                {/* Safety Heatmap Sub-view */}
                {mapSafetySubTab === 'safety' && (
                  <SafetyPage
                    accessibilityMode={accessibilityMode}
                    onOpenSOS={() => setIsSOSOpen(true)}
                  />
                )}
              </div>
            )}

            {/* PRD TAB: FAIR PRICE & HOTEL TRUST ENGINE (Section 4.1) */}
            {activeNavTab === 'trust' && (
              <FairPriceScamEngine
                accessibilityMode={accessibilityMode}
                onOpenSOS={() => setIsSOSOpen(true)}
              />
            )}

            {/* PRD TAB: AI TRIP PLANNER & BUDGET VALIDATOR (Section 4.3) */}
            {activeNavTab === 'ai_planner' && (
              <AITripPlannerPage
                currentTrip={currentTrip}
                accessibilityMode={accessibilityMode}
                onApplyGeneratedTrip={(newTrip) => {
                  setTrips(prev => [newTrip, ...prev]);
                  setActiveTripId(newTrip.id);
                  setSelectedDayIndex(0);
                  setActiveNavTab('itinerary');
                  showToast(`Applied AI generated plan "${newTrip.title}"!`);
                }}
              />
            )}

            {/* PRD TAB: VERIFIED LOCAL GUIDE MARKETPLACE */}
            {activeNavTab === 'guides' && (
              <GuideMarketplacePage accessibilityMode={accessibilityMode} />
            )}

            {/* PRD TAB: INDUSTRY & AUTHORITY B2B PORTAL (Section 5) */}
            {activeNavTab === 'b2b' && (
              <IndustryAuthorityPortal />
            )}

            {/* TAB: TRANSIT HUB (Dedicated Full Page) */}
            {activeNavTab === 'transit' && (
              <TransitPage />
            )}

            {/* TAB: EXPLORE (Culinary + Festivals + Crafts + Guides unified) */}
            {activeNavTab === 'explore' && (
              <ExplorePage accessibilityMode={accessibilityMode} />
            )}

            {/* TAB: TRAVELER PROFILE & CREDENTIALS PAGE */}
            {activeNavTab === 'profile' && (
              <TravelerProfilePage
                accessibilityMode={accessibilityMode}
                onToggleAccessibility={() => setAccessibilityMode(!accessibilityMode)}
                onOpenSOS={() => setIsSOSOpen(true)}
                onNavigateToItinerary={() => {
                  setActiveNavTab('itinerary');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

      </main>

      {/* Floating / Docked Bottom Navigation Bar (Tourist Dashboard Only) */}
      {currentEntity === 'tourist' && (
        <BottomNavBar
          activeTab={activeNavTab}
          onSelectTab={(tab) => {
            setActiveNavTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSOS={() => setIsSOSOpen(true)}
          accessibilityMode={accessibilityMode}
        />
      )}

      {/* Global Emergency SOS Modal (PRD Section 4.2) */}
      <GlobalSOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onBroadcastSOS={(incident) => {
          showToast(`Emergency transmission ${incident.id} dispatched to Tourist Police.`);
        }}
      />

      {/* On-Ground Assistance Modal (PRD Section 4.5) */}
      <RequestAssistanceModal
        isOpen={isAssistanceOpen}
        onClose={() => setIsAssistanceOpen(false)}
        city={currentDay.city}
      />



      {/* 3-Entity Unified Ecosystem Overview Modal */}
      <EcosystemFlowModal
        isOpen={isEcosystemModalOpen}
        onClose={() => setIsEcosystemModalOpen(false)}
        currentEntity={currentEntity}
        onSelectEntity={(ent) => {
          const targetAccount = DEMO_ACCOUNTS[ent];
          if (targetAccount) {
            handleLoginSuccess(targetAccount);
          }
          setIsEcosystemModalOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Map Modal with Live Location, Direction & Navigation */}
      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={() => {
          setIsMapOpen(false);
          setFocusLocation(null);
        }}
        day={currentDay}
        items={currentDay.items}
        city={currentDay.city}
        focusLocation={focusLocation}
        initialUserCoords={userCoords}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        dayNumber={currentDay.dayNumber}
        city={currentDay.city}
        onAdd={handleAddItem}
      />

      {/* Comprehensive Tourist Toolkit Modal */}
      <TouristToolkitModal
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
      />

      {/* Budget Breakdown Modal */}
      <BudgetBreakdownModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        trip={currentTrip}
        allItems={allItems}
      />

      {/* Permanent SOS Button */}
      {currentEntity === 'tourist' && (
        <FloatingSOSButton onOpenSOS={() => setIsSOSOpen(true)} />
      )}

      {/* Floating Sahayak AI Travel Assistant Button */}
      {currentEntity === 'tourist' && (
        <FloatingAssistantButton onOpenAssistant={() => setIsAssistantOpen(true)} />
      )}

      {/* Sahayak AI Travel Assistant Modal */}
      <TravelAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpenMap={() => {
          setActiveNavTab('map_safety');
          setMapSafetySubTab('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenScanner={() => {}}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenTrust={() => {
          setActiveNavTab('trust');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTransit={() => {
          setActiveNavTab('transit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccessibility={() => setIsAssistanceOpen(true)}
        onOpenProfile={() => {
          setActiveNavTab('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuides={() => {
          setActiveNavTab('guides');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAIPlanner={() => {
          setActiveNavTab('ai_planner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1F1C18] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
