import React, { useState, useEffect, useMemo } from 'react';
import { INDIA_TRIPS, TRANSIT_TOOLKIT, REGIONAL_FESTIVALS, FAMOUS_CULTURAL_BUYS } from './data/indiaTrips';
import { Trip, ItineraryItem, ItineraryCategory, DayPlan } from './types/travel';
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
import { CulinaryPage } from './components/pages/CulinaryPage';
import { FestivalsPage } from './components/pages/FestivalsPage';
import { CraftsPage } from './components/pages/CraftsPage';
import { TouristGuidePage } from './components/pages/TouristGuidePage';
import { FairPriceScamEngine } from './components/trust/FairPriceScamEngine';
import { SafetyPage } from './components/safety/SafetyPage';
import { GlobalSOSModal } from './components/safety/GlobalSOSModal';
import { AITripPlannerPage } from './components/ai/AITripPlannerPage';
import { GuideMarketplacePage } from './components/guides/GuideMarketplacePage';
import { IndustryAuthorityPortal } from './components/b2b/IndustryAuthorityPortal';
import { RequestAssistanceModal } from './components/accessibility/RequestAssistanceModal';

import { TravelerProfilePage } from './components/profile/TravelerProfilePage';
import { SurroundingScannerModal } from './components/SurroundingScannerModal';
import { FloatingSOSButton } from './components/safety/FloatingSOSButton';
import { FloatingAssistantButton } from './components/chat/FloatingAssistantButton';
import { TravelAssistantModal } from './components/chat/TravelAssistantModal';
import { SOSIncident } from './types/trustEngine';
import { AppEntity } from './types/entity';
import { AuthUser, DEMO_ACCOUNTS } from './types/auth';
import { LoginPage } from './components/auth/LoginPage';
import { EntitySwitcherBar } from './components/navigation/EntitySwitcherBar';
import { EcosystemFlowModal } from './components/dashboards/EcosystemFlowModal';
import { BusinessDashboard } from './components/dashboards/BusinessDashboard';
import { AuthorityDashboard } from './components/dashboards/AuthorityDashboard';
import { DashboardMapSection } from './components/maps/DashboardMapSection';
import { CulturalDiscoveryHub } from './components/discovery/CulturalDiscoveryHub';
import { FestivalModeView, getClosestFestivalTheme } from './components/festivals/FestivalModeView';
import { IndianTimeWidget } from './components/common/IndianTimeWidget';
import { 
  Sparkles, 
  MapPin, 
  Share2, 
  Check, 
  Train, 
  Utensils, 
  ShoppingBag, 
  Landmark, 
  Clock, 
  IndianRupee,
  Info,
  Accessibility,
  AlertOctagon,
  LifeBuoy,
  Compass,
  ChevronDown,
  Search,
  ArrowLeft,
  PhoneCall,
  Calendar
} from 'lucide-react';

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
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);

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
  const [festivalMode, setFestivalMode] = useState(false);


  // Modals
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number; title?: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [toolkitTab, setToolkitTab] = useState<'transit' | 'festivals' | 'culinary' | 'shopping'>('transit');
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState('Chandni Chowk, Old Delhi');
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
      
      {/* Top Header Bar with Trip Selector & Search */}
      {currentEntity === 'tourist' && (
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DC] px-3 sm:px-4 lg:px-8 py-2.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            {/* Left: Trip Selector */}
            <div className="flex items-center gap-2 min-w-0 flex-shrink relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#C84B31] flex items-center justify-center text-white shadow-xs shrink-0">
                <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-semibold text-[#8C827A] tracking-wider uppercase flex items-center gap-1 leading-none mb-0.5">
                  <span>Trip</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                </div>
                <button
                  id="header-trip-selector-btn"
                  onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                  className="flex items-center gap-1 text-[#1F1C18] font-bold text-xs sm:text-sm hover:text-[#FF6F59] transition-colors focus:outline-none cursor-pointer text-left min-w-0 max-w-full"
                >
                  <span className="truncate max-w-[140px] sm:max-w-[220px] md:max-w-[300px]">{currentTrip.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${headerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Trip Dropdown */}
                {headerDropdownOpen && (
                  <div
                    id="header-trip-dropdown"
                    className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#EAE5DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3.5 py-1.5 text-xs font-semibold text-[#9C948B] uppercase tracking-wider border-b border-[#F0ECE4]">
                      Curated Indian Itineraries
                    </div>
                    {trips.map((trip) => (
                      <button
                        key={trip.id}
                        onClick={() => {
                          setActiveTripId(trip.id);
                          setSelectedDayIndex(0);
                          setSelectedCategory('all');
                          setSearchQuery('');
                          setHeaderDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#FBF9F6] transition-colors ${
                          trip.id === currentTrip.id ? 'bg-[#FFF7F4] border-l-4 border-[#FF6F59]' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 mt-0.5">
                          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#1F1C18] truncate">{trip.title}</div>
                          <div className="text-xs text-[#827971] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#FF6F59]" />
                            <span className="truncate">{trip.region}</span>
                          </div>
                          <div className="text-[11px] text-[#8C827A] flex items-center gap-1.5 mt-0.5 font-medium">
                            <span>{trip.dateRange}</span>
                            <span>•</span>
                            <span>{trip.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>



            {/* Right: Search Bar */}
            <div className="flex-1 max-w-xs sm:max-w-sm min-w-0">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948B]" />
                <input
                  id="header-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stops, Vande Bharat, street food, crafts..."
                  className="w-full bg-white border border-[#EAE5DC] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-[#1F1C18] placeholder-[#9C948B] focus:outline-none focus:border-[#FF6F59] focus:ring-2 focus:ring-[#FF6F59]/10 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C827A] hover:text-[#1F1C18] cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>
        </header>
      )}

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
            {/* SUB-PAGE BREADCRUMB / RETURN TO ITINERARY */}
            {['transit', 'culinary', 'festivals', 'crafts', 'guide', 'guides', 'b2b'].includes(activeNavTab) && (
              <div className="mb-5 flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#EAE5DC] shadow-xs animate-in fade-in duration-150">
                <button
                  id="subpage-back-to-itinerary-btn"
                  onClick={() => {
                    setActiveNavTab('itinerary');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#665E55] hover:text-[#C84B31] transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 text-[#C84B31] group-hover:-translate-x-1 transition-transform" />
                  <span>← Back to Primary Itinerary</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#8C827A] hidden sm:inline">Living & Cultural Hub</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#C84B31] border border-[#FED7CC]">
                    {activeNavTab === 'transit' ? 'TRANSIT HUB' :
                     activeNavTab === 'culinary' ? 'FOOD SAFETY' :
                     activeNavTab === 'festivals' ? 'FESTIVALS' :
                     activeNavTab === 'crafts' ? 'GI CRAFTS' :
                     activeNavTab === 'guide' ? 'TOURIST TOOLKIT' :
                     activeNavTab === 'guides' ? 'GUIDE' : 'PORTAL'}
                  </span>
                </div>
              </div>
            )}

            {/* TAB 1: ITINERARY VIEW (Core requested view) */}
            {activeNavTab === 'itinerary' && (
              <div className="animate-in fade-in duration-200 space-y-6">

                {/* Mode Toggle: Current Itinerary ↔ Festival Mode */}
                {(() => {
                  const fest = getClosestFestivalTheme();
                  return (
                    <div className="flex items-stretch gap-2">
                      {/* Current Itinerary Tab */}
                      <button
                        id="mode-toggle-itinerary-btn"
                        onClick={() => setFestivalMode(false)}
                        className={`flex-1 px-5 py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                          !festivalMode
                            ? 'bg-[#191715] text-white border-[#191715] shadow-md'
                            : 'bg-white text-[#665E55] border-[#EAE5DC] hover:bg-[#FAF8F5] hover:border-[#191715]/30'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Current Itinerary</span>
                      </button>

                      {/* Festival Mode Tab — rich, dynamic, festive */}
                      <button
                        id="mode-toggle-festival-btn"
                        onClick={() => setFestivalMode(true)}
                        className={`flex-1 relative overflow-hidden rounded-2xl transition-all cursor-pointer border ${
                          festivalMode
                            ? `bg-gradient-to-r ${fest.gradient} text-white border-transparent shadow-lg`
                            : `bg-white border-[#EAE5DC] hover:border-transparent hover:shadow-md`
                        }`}
                      >
                        {/* Background motif (subtle) */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-[0.12] text-6xl pointer-events-none select-none" aria-hidden>
                          {fest.motif}
                        </div>

                        <div className="relative px-5 py-3 flex items-center justify-center gap-3">
                          <span className="text-xl">{fest.icon}</span>
                          <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-black leading-tight ${
                                festivalMode ? 'text-white' : 'text-[#191715]'
                              }`}>
                                {fest.name}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                                festivalMode
                                  ? 'bg-white/20 text-white'
                                  : `${fest.accentBg} ${fest.accentText} border ${fest.accentBorder}`
                              }`}>
                                {fest.daysUntil === 0 ? '🎉 Today' : `${fest.daysUntil}d away`}
                              </span>
                            </div>
                            <span className={`text-[10px] font-semibold leading-tight ${
                              festivalMode ? 'text-white/80' : 'text-[#8C827A]'
                            }`}>
                              {fest.date}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })()}

                {/* FESTIVAL MODE: Upcoming Indian Festivals & Celebration Places */}
                {festivalMode ? (
                  <FestivalModeView onViewFullFestivals={() => {
                    setFestivalMode(false);
                    setActiveNavTab('festivals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} />
                ) : (
                  /* Normal Itinerary Content */
                  <>
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
                      onOpenScanner={() => setIsScannerOpen(true)}
                      selectedDayIndex={selectedDayIndex}
                    />

                    {/* Cultural Discovery & Living Hub */}
                    <CulturalDiscoveryHub
                      onSelectFeature={(tab) => {
                        setActiveNavTab(tab);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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
                      onSelectGuides={() => {
                        setActiveNavTab('guides');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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
                  </>
                )}
              </div>
            )}

            {/* PRD TAB: FAIR PRICE & HOTEL TRUST ENGINE (Section 4.1) */}
            {activeNavTab === 'trust' && (
              <FairPriceScamEngine
                accessibilityMode={accessibilityMode}
                onOpenSOS={() => setIsSOSOpen(true)}
                onSelectTab={(tab) => {
                  setActiveNavTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* PRD TAB: SAFETY & LIVE MAP (Merged - Toggle inside DashboardMapSection) */}
            {(activeNavTab === 'safety' || activeNavTab === 'map') && (
              <div className="animate-in fade-in duration-200">
                <DashboardMapSection
                  role="tourist"
                  currentUser={currentUser}
                  onOpenSOS={() => setIsSOSOpen(true)}
                  initialMode={activeNavTab === 'safety' ? 'safety' : 'explore'}
                />
              </div>
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

            {/* PRD TAB: VERIFIED LOCAL GUIDE MARKETPLACE (Section 4.4) */}
            {activeNavTab === 'guides' && (
              <GuideMarketplacePage
                accessibilityMode={accessibilityMode}
              />
            )}

            {/* PRD TAB: INDUSTRY & AUTHORITY B2B PORTAL (Section 5) */}
            {activeNavTab === 'b2b' && (
              <IndustryAuthorityPortal />
            )}

            {/* TAB: TRANSIT HUB (Dedicated Full Page) */}
            {activeNavTab === 'transit' && (
              <TransitPage />
            )}

            {/* TAB: FOOD SAFETY & CULINARY (Dedicated Full Page) */}
            {activeNavTab === 'culinary' && (
              <CulinaryPage />
            )}

            {/* TAB: FESTIVALS & CELEBRATIONS (Dedicated Full Page) */}
            {activeNavTab === 'festivals' && (
              <FestivalsPage />
            )}

            {/* TAB: CULTURAL BUYS & GI CRAFTS (Dedicated Full Page) */}
            {activeNavTab === 'crafts' && (
              <CraftsPage />
            )}

            {/* TAB: TOURIST GUIDE & UPLOAD INFORMATION CENTER (Dedicated Full Page) */}
            {activeNavTab === 'guide' && (
              <TouristGuidePage />
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
                onSelectTab={(tab) => {
                  setActiveNavTab(tab);
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
        initialTab={toolkitTab}
      />

      {/* Budget Breakdown Modal */}
      <BudgetBreakdownModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        trip={currentTrip}
        allItems={allItems}
      />

      {/* Surrounding Area Live Scanner & Radar Modal */}
      <SurroundingScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        currentTrip={currentTrip}
        onAddStopToDay={(item) => {
          handleAddItem(item);
          showToast(`Added "${item.title}" to Day ${currentDay.dayNumber} itinerary`);
        }}
        userCoords={userCoords}
        onUpdateUserCoords={(coords) => {
          setUserCoords({ lat: coords.lat, lng: coords.lng });
          setCurrentLocationName(coords.locationName);
          showToast(`Radar locked to: ${coords.locationName}`);
        }}
        currentLocationName={currentLocationName}
      />

      {/* Permanent SOS Button in the Bottom Right Corner of the UI (Tourist Dashboard Only) */}
      {currentEntity === 'tourist' && (
        <FloatingSOSButton onOpenSOS={() => setIsSOSOpen(true)} />
      )}

      {/* Floating Sahayak AI Travel Assistant Button (Tourist Dashboard Only) */}
      {currentEntity === 'tourist' && (
        <FloatingAssistantButton onOpenAssistant={() => setIsAssistantOpen(true)} />
      )}

      {/* Dedicated Travel & App Feature Assistant Modal */}
      <TravelAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
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
