import React, { useState } from 'react';
import { Utensils, Sparkles, ShoppingBag } from 'lucide-react';
import { CulinaryPage } from './CulinaryPage';
import { FestivalsPage } from './FestivalsPage';
import { CraftsPage } from './CraftsPage';

type ExploreSubTab = 'culinary' | 'festivals' | 'crafts';

interface ExplorePageProps {
  accessibilityMode?: boolean;
}

const EXPLORE_TABS: { id: ExploreSubTab; label: string; icon: React.FC<{ className?: string }>; tag: string; color: string; bg: string }[] = [
  { id: 'culinary', label: 'Food & Hygiene', icon: Utensils, tag: 'FSSAI', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB] border-[#FDE68A]' },
  { id: 'festivals', label: 'Festivals', icon: Sparkles, tag: 'Live', color: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF] border-[#DDD6FE]' },
  { id: 'crafts', label: 'GI Crafts', icon: ShoppingBag, tag: 'Authentic', color: 'text-[#C84B31]', bg: 'bg-[#FFF2EE] border-[#FED7CC]' },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ accessibilityMode = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<ExploreSubTab>('culinary');

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Explore Header */}
      <div className="bg-gradient-to-r from-[#FFF5F2] via-[#FAF8F5] to-[#F0F9FF] rounded-3xl p-5 border border-[#EAE5DC] shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C84B31]/10 text-[#C84B31] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India Discovery Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1C18] tracking-tight">
          Explore <span className="text-[#C84B31]">India</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#5A524C] mt-1 leading-relaxed">
          Authentic food, cultural festivals, GI-certified crafts & verified local guides — all in one place.
        </p>
      </div>

      {/* Sub-Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {EXPLORE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`explore-subtab-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isActive
                  ? `${tab.bg} ${tab.color} shadow-sm`
                  : 'bg-white border-[#EAE5DC] text-[#665E55] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-[#9C948B]'}`} />
              {tab.label}
              {isActive && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold bg-white/70 ${tab.color}`}>
                  {tab.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Content */}
      <div key={activeSubTab} className="animate-in fade-in duration-150">
        {activeSubTab === 'culinary' && <CulinaryPage />}
        {activeSubTab === 'festivals' && <FestivalsPage />}
        {activeSubTab === 'crafts' && <CraftsPage />}
      </div>
    </div>
  );
};
