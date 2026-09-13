import React from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Compass,
  Train,
  ShieldAlert
} from 'lucide-react';

export type MainNavTab = 
  | 'itinerary' 
  | 'map_safety'
  | 'trust' 
  | 'transit'
  | 'ai_planner' 
  | 'explore'
  | 'guides' 
  | 'b2b' 
  | 'culinary' 
  | 'festivals' 
  | 'crafts' 
  | 'guide' 
  | 'profile';

export interface BottomNavBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenSOS?: () => void;
  accessibilityMode?: boolean;
}

const NAV_ITEMS: { id: MainNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'itinerary',  label: 'Itinerary',    icon: Calendar    },
  { id: 'map_safety', label: 'Map & Safety', icon: ShieldAlert },
  { id: 'trust',      label: 'Fair Prices',  icon: ShieldCheck },
  { id: 'transit',    label: 'Transit',      icon: Train       },
  { id: 'ai_planner', label: 'AI Planner',   icon: Sparkles    },
  { id: 'explore',    label: 'Explore',      icon: Compass     },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8E2D9] px-2 sm:px-4 py-1.5 transition-all shadow-[0_-4px_25px_rgba(25,23,21,0.07)]"
    >
      <div className="max-w-xl mx-auto grid grid-cols-6 items-center justify-items-center gap-0.5 sm:gap-1">
        {NAV_ITEMS.map((item) => {
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
      </div>
    </nav>
  );
};
