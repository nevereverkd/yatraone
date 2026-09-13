import React from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  Shield, 
  Sparkles, 
  Menu,
  MapPin
} from 'lucide-react';

export type MainNavTab = 
  | 'itinerary' 
  | 'map'
  | 'trust' 
  | 'safety' 
  | 'ai_planner' 
  | 'guides' 
  | 'b2b' 
  | 'transit' 
  | 'culinary' 
  | 'festivals' 
  | 'crafts' 
  | 'guide' 
  | 'profile';

export interface BottomNavBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenMenu: () => void;
  onOpenSOS?: () => void;
  accessibilityMode?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu,
  onOpenSOS: _onOpenSOS,
  accessibilityMode: _accessibilityMode,
}) => {
  // High-frequency primary sections
  const primaryNavItems: {
    id: MainNavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'trust', label: 'Fair Prices', icon: ShieldCheck },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'ai_planner', label: 'AI Planner', icon: Sparkles },
  ];

  // If the user is currently viewing a section housed in the sidebar drawer, highlight Menu
  const isDrawerSectionActive = !primaryNavItems.some((item) => item.id === activeTab);

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8E2D9] px-2 sm:px-4 py-1.5 transition-all shadow-[0_-4px_25px_rgba(25,23,21,0.07)]"
    >
      <div className="max-w-xl mx-auto grid grid-cols-6 items-center justify-items-center gap-0.5 sm:gap-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}-btn`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl transition-all cursor-pointer w-full group ${
                isActive 
                  ? 'text-[#C84B31] font-bold' 
                  : 'text-[#665E55] hover:text-[#191715] hover:bg-[#FAF8F5]'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <div className={`relative p-1 sm:p-1.5 rounded-xl transition-colors flex items-center justify-center ${
                isActive ? 'bg-[#C84B31]/12 text-[#C84B31]' : 'group-hover:bg-[#FAF8F5]'
              }`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
                )}
              </div>
              <span className={`text-[9px] sm:text-[11px] leading-tight text-center truncate max-w-full ${
                isActive ? 'font-black text-[#C84B31]' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 6th Item: Menu - Opens MainSidebarDrawer */}
        <button
          id="nav-menu-btn"
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-0.5 rounded-xl transition-all cursor-pointer w-full group ${
            isDrawerSectionActive 
              ? 'text-[#C84B31] font-bold' 
              : 'text-[#665E55] hover:text-[#191715] hover:bg-[#FAF8F5]'
          }`}
          aria-label="Open Navigation Menu"
          title="Open Menu (Transit, Guides, Food, Culture & More)"
        >
          <div className={`relative p-1 sm:p-1.5 rounded-xl transition-colors flex items-center justify-center ${
            isDrawerSectionActive ? 'bg-[#C84B31]/12 text-[#C84B31]' : 'group-hover:bg-[#FAF8F5]'
          }`}>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            {isDrawerSectionActive && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
            )}
          </div>
          <span className={`text-[9px] sm:text-[11px] leading-tight text-center truncate max-w-full ${
            isDrawerSectionActive ? 'font-black text-[#C84B31]' : 'font-medium'
          }`}>
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
