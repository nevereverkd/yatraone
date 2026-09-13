import React from 'react';
import { 
  MapPin, 
  Search, 
  Bell, 
  Compass, 
  ChevronDown,
  Sparkles, 
  Share2, 
  Accessibility, 
  Menu, 
  Radio, 
  BookOpen,
  Store,
  Building,
  Building2,
  BadgeAlert,
  LogOut
} from 'lucide-react';
import { Trip } from '../types/travel';
import { AuthUser } from '../types/auth';
import { IndianTimeWidget } from './common/IndianTimeWidget';

interface HeaderProps {
  currentTrip: Trip;
  allTrips: Trip[];
  onSelectTrip: (tripId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenToolkit: () => void;
  onShare: () => void;
  onOpenSOS?: () => void;
  accessibilityMode?: boolean;
  onToggleAccessibility?: () => void;
  onToggleMenu?: () => void;
  onOpenProfile?: () => void;
  onOpenScanner?: () => void;
  onOpenAssistant?: () => void;
  currentLocationName?: string;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTrip,
  allTrips,
  onSelectTrip,
  searchQuery,
  onSearchChange,
  onOpenToolkit,
  onShare,
  onOpenSOS,
  accessibilityMode = false,
  onToggleAccessibility,
  onToggleMenu,
  onOpenProfile,
  onOpenScanner,
  onOpenAssistant,
  currentLocationName,
  currentUser,
  onLogout,
  onOpenMap,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const isMerchant = currentUser?.role === 'business';
  const isAuthority = currentUser?.role === 'authority';
  const isTourist = !isMerchant && !isAuthority;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DC] px-2.5 sm:px-4 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Left: Menu Option & Role-Specific Brand / Selector */}
        <div className="flex items-center gap-1 sm:gap-2.5 relative min-w-0 flex-shrink">
          
          {/* Menu Button in Upper Left Corner */}
          {onToggleMenu && (
            <button
              id="upper-left-menu-btn"
              onClick={onToggleMenu}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#EAE5DC] text-[#1F1C18] hover:bg-[#FAF8F5] hover:border-[#D5CECE] active:scale-95 transition-all shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.4] text-[#1F1C18]" />
            </button>
          )}

          {/* Role 1: Merchant (Business) Brand Header */}
          {isMerchant && (
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-white shadow-xs shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-extrabold text-[#059669] tracking-wider uppercase flex items-center gap-1 leading-none mb-0.5">
                  <span>Merchant Portal</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                </div>
                <div className="text-xs sm:text-sm font-black text-[#191715] truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]">
                  {currentUser?.businessName || 'Verified Merchant Partner'}
                </div>
              </div>
            </div>
          )}

          {/* Role 2: Authority & ASI Brand Header */}
          {isAuthority && (
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#881337] flex items-center justify-center text-white shadow-xs shrink-0">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-extrabold text-[#E11D48] tracking-wider uppercase flex items-center gap-1 leading-none mb-0.5">
                  <span>Authority Console</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                </div>
                <div className="text-xs sm:text-sm font-black text-[#191715] truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]">
                  {currentUser?.department || 'Ministry of Tourism & ASI'}
                </div>
              </div>
            </div>
          )}

          {/* Role 3: Tourist Trip Selector Header */}
          {isTourist && (
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C84B31] flex items-center justify-center text-white shadow-xs shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>

              <div className="relative min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-semibold text-[#8C827A] tracking-wider uppercase flex items-center gap-1 leading-none mb-0.5">
                  <span>Trip</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                </div>

                <button
                  id="trip-selector-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-[#1F1C18] font-bold text-xs sm:text-sm md:text-base hover:text-[#FF6F59] transition-colors focus:outline-none cursor-pointer text-left min-w-0 max-w-full"
                >
                  <span className="truncate max-w-[85px] xs:max-w-[125px] sm:max-w-[170px] md:max-w-[210px] lg:max-w-[260px]">{currentTrip.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown for switching India itineraries */}
                {dropdownOpen && (
                  <div 
                    id="trip-selector-menu"
                    className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#EAE5DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3.5 py-1.5 text-xs font-semibold text-[#9C948B] uppercase tracking-wider border-b border-[#F0ECE4]">
                      Curated Indian Itineraries
                    </div>
                    {allTrips.map((trip) => (
                      <button
                        key={trip.id}
                        id={`trip-option-${trip.id}`}
                        onClick={() => {
                          onSelectTrip(trip.id);
                          setDropdownOpen(false);
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
          )}

        </div>

        {/* Center: Search Bar - Dedicated on lg (>=1024px) screens */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-3 xl:mx-6 min-w-0">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948B]" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isMerchant
                  ? "Search complaints, verified invoices, transactions..."
                  : isAuthority
                  ? "Search monuments, officer logs, enforcement files..."
                  : "Search stops, Vande Bharat train, street food, crafts..."
              }
              className="w-full bg-[#FFFFFF] border border-[#EAE5DC] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1F1C18] placeholder-[#9C948B] focus:outline-none focus:border-[#FF6F59] focus:ring-2 focus:ring-[#FF6F59]/10 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C827A] hover:text-[#1F1C18]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Role-Specific Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          
          {/* Indian Standard Time (IST - Asia/Kolkata) Live WorldTimeAPI Clock */}
          <div className="hidden lg:flex items-center">
            <IndianTimeWidget variant="header" />
          </div>

          {/* Universal Map Shortcut in Header for All Dashboards */}
          {onOpenMap && (
            <button
              id="header-universal-map-btn"
              onClick={onOpenMap}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isMerchant
                  ? 'bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]'
                  : isAuthority
                  ? 'bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3]'
                  : 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]'
              }`}
              title="Open dedicated Map section and enable location access"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {isMerchant ? 'Footfall Map' : isAuthority ? 'Telemetry Map' : 'Live Map'}
              </span>
            </button>
          )}

          {/* Tourist-Exclusive Action Buttons */}
          {isTourist && (
            <>
              {/* Surrounding Area Scanner */}
              {onOpenScanner && (
                <button
                  id="header-location-scanner-btn"
                  onClick={onOpenScanner}
                  className="w-9 h-9 lg:w-auto lg:px-2.5 lg:py-1.5 xl:px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] border border-[#E8E2D9] text-[#191715] text-xs font-bold transition-all shadow-2xs cursor-pointer group flex items-center justify-center gap-1.5 shrink-0"
                  title="Scan nearby verified sights, food, and transit in your immediate area"
                  aria-label="Scan nearby radar"
                >
                  <div className="relative flex items-center justify-center">
                    <Radio className="w-4 h-4 text-[#C84B31] animate-pulse shrink-0" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="hidden xl:inline truncate max-w-[110px] text-[11px] text-[#665E55]">
                    {currentLocationName || 'Near Chandni Chowk'}
                  </span>
                  <span className="hidden lg:inline text-[11px] text-[#C84B31] font-bold group-hover:underline">Radar</span>
                </button>
              )}

              {/* Accessibility Mode Toggle */}
              {onToggleAccessibility && (
                <button
                  id="accessibility-mode-toggle-btn"
                  onClick={onToggleAccessibility}
                  className={`hidden sm:flex w-9 h-9 xl:w-auto xl:px-2.5 xl:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border items-center justify-center gap-1 shrink-0 ${
                    accessibilityMode
                      ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                      : 'bg-white text-[#5A524C] hover:bg-[#FAF8F5] border-[#EAE5DC]'
                  }`}
                  title="Toggle Accessibility Mode (Wheelchair routes, accessible toilets, assistance)"
                  aria-label="Toggle Accessibility Mode"
                >
                  <Accessibility className="w-4 h-4 shrink-0" />
                  <span className="hidden xl:inline">{accessibilityMode ? '♿ ON' : '♿ Accessible'}</span>
                </button>
              )}

              {/* Sahayak AI Assistant */}
              {onOpenAssistant && (
                <button
                  id="header-sahayak-chat-btn"
                  onClick={onOpenAssistant}
                  className="w-9 h-9 lg:w-auto lg:px-2.5 lg:py-1.5 bg-[#191715] hover:bg-[#C84B31] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  title="Sahayak AI Assistant (Travel & App Help)"
                  aria-label="Open Sahayak AI Assistant"
                >
                  <Sparkles className="w-4 h-4 text-[#FFA07A] shrink-0" />
                  <span className="hidden lg:inline">Sahayak AI</span>
                </button>
              )}

              {/* Tourist Toolkit & Guide */}
              <button
                id="tourist-guide-header-btn"
                onClick={onOpenToolkit}
                className="hidden sm:flex w-9 h-9 lg:w-auto lg:px-2.5 lg:py-1.5 bg-[#FFF2EE] hover:bg-[#FFE6DF] text-[#D94F36] rounded-xl text-xs font-semibold border border-[#FED7CC] transition-colors shadow-2xs items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                title="India Tourist Toolkit & Cultural Guide"
                aria-label="Open Tourist Guide"
              >
                <BookOpen className="w-4 h-4 text-[#FF6F59] shrink-0" />
                <span className="hidden lg:inline">Guide</span>
              </button>

              {/* Share Itinerary */}
              <button
                id="share-trip-btn"
                onClick={onShare}
                className="hidden xs:flex w-9 h-9 rounded-xl bg-white border border-[#EAE5DC] hover:bg-[#F6F4EE] text-[#5A524C] transition-colors shrink-0 items-center justify-center cursor-pointer"
                title="Share Itinerary Link"
                aria-label="Share Itinerary"
              >
                <Share2 className="w-4 h-4 shrink-0" />
              </button>
            </>
          )}

          {/* User Profile Avatar */}
          <button
            id="header-user-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 sm:gap-2 pl-0.5 sm:pl-1.5 border-l border-[#EAE5DC] hover:opacity-90 active:scale-95 transition-all cursor-pointer group shrink-0"
            title="Open Account Profile & Settings"
            aria-label="Open Account Profile"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                alt={currentUser?.name || "User Profile"}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white ring-2 ring-[#FF6F59]/30 group-hover:ring-[#FF6F59] transition-all shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-[#1F1C18] group-hover:text-[#FF6F59] transition-colors leading-tight truncate max-w-[120px]">
                {currentUser?.name || 'Guest User'}
              </div>
              <div className="text-[10px] text-[#8C827A] leading-tight capitalize">
                {currentUser?.role === 'authority' ? 'Official' : currentUser?.role === 'business' ? 'Merchant' : 'Traveler'}
              </div>
            </div>
          </button>

          {/* Sign Out Action Button */}
          {onLogout && (
            <button
              id="header-sign-out-btn"
              onClick={onLogout}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-[#FEF2F2] border border-[#EAE5DC] hover:border-[#FECACA] text-[#DC2626] text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer shrink-0"
              title="Sign out from this dashboard"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile & Tablet search bar visible on screens under lg (1024px) */}
      <div className="mt-2.5 lg:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C948B]" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isMerchant
                ? "Search complaints, verified invoices, transactions..."
                : isAuthority
                ? "Search monuments, officer logs, enforcement files..."
                : "Search stops, transit, food, spices, festivals..."
            }
            className="w-full bg-white border border-[#EAE5DC] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1F1C18] placeholder-[#9C948B] focus:outline-none focus:border-[#FF6F59]"
          />
        </div>
      </div>
    </header>
  );
};
