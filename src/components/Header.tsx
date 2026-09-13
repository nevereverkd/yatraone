import React from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  ChevronDown,
  BookOpen,
  Store,
  Building,
  LogOut
} from 'lucide-react';
import { Trip } from '../types/travel';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  currentTrip: Trip;
  allTrips: Trip[];
  onSelectTrip: (tripId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenToolkit: () => void;
  onShare?: () => void;
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
  onOpenProfile,
  currentUser,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const isMerchant = currentUser?.role === 'business';
  const isAuthority = currentUser?.role === 'authority';
  const isTourist = !isMerchant && !isAuthority;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DC] px-3 sm:px-5 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* Left: Brand / Role Selector */}
        <div className="flex items-center gap-2 relative min-w-0 flex-shrink">

          {/* Role 1: Merchant Brand */}
          {isMerchant && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-white shadow-xs shrink-0">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-extrabold text-[#059669] tracking-wider uppercase leading-none mb-0.5">
                  Merchant Portal
                </div>
                <div className="text-xs sm:text-sm font-black text-[#191715] truncate max-w-[140px] sm:max-w-[220px]">
                  {currentUser?.businessName || 'Verified Merchant Partner'}
                </div>
              </div>
            </div>
          )}

          {/* Role 2: Authority Brand */}
          {isAuthority && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#881337] flex items-center justify-center text-white shadow-xs shrink-0">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-extrabold text-[#E11D48] tracking-wider uppercase leading-none mb-0.5">
                  Authority Console
                </div>
                <div className="text-xs sm:text-sm font-black text-[#191715] truncate max-w-[140px] sm:max-w-[220px]">
                  {currentUser?.department || 'Ministry of Tourism & ASI'}
                </div>
              </div>
            </div>
          )}

          {/* Role 3: Tourist Trip Selector */}
          {isTourist && (
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C84B31] flex items-center justify-center text-white shadow-xs shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </div>

              <div className="relative min-w-0 flex-1">
                <div className="text-[9px] sm:text-[10px] font-semibold text-[#8C827A] tracking-wider uppercase flex items-center gap-1 leading-none mb-0.5">
                  <span>Trip</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </div>

                <button
                  id="trip-selector-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-[#1F1C18] font-bold text-xs sm:text-sm md:text-base hover:text-[#FF6F59] transition-colors focus:outline-none cursor-pointer text-left min-w-0"
                >
                  <span className="truncate max-w-[85px] xs:max-w-[125px] sm:max-w-[170px] md:max-w-[230px] lg:max-w-[290px]">
                    {currentTrip.title}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Trip Dropdown */}
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

        {/* Center: Search Bar (lg+) — premium pill style */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-4 xl:mx-6 min-w-0">
          <div className="relative w-full group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6F59]/10 to-[#C84B31]/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C84B31] transition-colors" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isMerchant
                  ? 'Search complaints, verified invoices, transactions...'
                  : isAuthority
                  ? 'Search monuments, officer logs, enforcement files...'
                  : 'Search stops, Vande Bharat, street food, crafts...'
              }
              className="w-full bg-white border-2 border-[#EAE5DC] rounded-2xl pl-10 pr-10 py-2.5 text-sm text-[#1F1C18] placeholder-[#B0A89E] focus:outline-none focus:border-[#C84B31] focus:shadow-[0_0_0_4px_rgba(200,75,49,0.08)] transition-all shadow-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EAE5DC] hover:bg-[#C84B31] hover:text-white text-[#665E55] flex items-center justify-center transition-all text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Guide + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Tourist Guide button → opens Guides page */}
          {isTourist && (
            <button
              id="tourist-guide-header-btn"
              onClick={onOpenToolkit}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFF2EE] hover:bg-[#FFE6DF] text-[#D94F36] rounded-xl text-xs font-semibold border border-[#FED7CC] transition-colors shadow-2xs cursor-pointer"
              title="Verified Local Guides"
              aria-label="Open Guides"
            >
              <BookOpen className="w-4 h-4 text-[#FF6F59] shrink-0" />
              <span className="hidden sm:inline">Guides</span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            id="header-user-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-[#EAE5DC] hover:opacity-90 active:scale-95 transition-all cursor-pointer group shrink-0"
            title="Open Account Profile & Settings"
            aria-label="Open Account Profile"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser?.name || 'User Profile'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white ring-2 ring-[#FF6F59]/30 group-hover:ring-[#FF6F59] transition-all shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981] ring-2 ring-white" />
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
        </div>
      </div>

      {/* Mobile Search Bar — premium pill style */}
      <div className="mt-2.5 lg:hidden">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C84B31]" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isMerchant
                ? 'Search complaints, invoices...'
                : isAuthority
                ? 'Search monuments, officer logs...'
                : 'Search stops, transit, food, festivals...'
            }
            className="w-full bg-white border-2 border-[#EAE5DC] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#1F1C18] placeholder-[#B0A89E] focus:outline-none focus:border-[#C84B31] focus:shadow-[0_0_0_4px_rgba(200,75,49,0.08)] transition-all shadow-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EAE5DC] hover:bg-[#C84B31] hover:text-white text-[#665E55] flex items-center justify-center transition-all text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
