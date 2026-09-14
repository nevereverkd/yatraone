import React from 'react';
import { Plus, Sparkles, MapPin, Compass, Search } from 'lucide-react';
import { ItineraryItem, DayPlan } from '../types/travel';
import { ItineraryCard } from './ItineraryCard';

interface ItineraryTimelineProps {
  currentDay: DayPlan;
  items: ItineraryItem[];
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddActivity: () => void;
  onSelectMapLocation?: (lat: number, lng: number, title: string) => void;
  searchQuery: string;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  currentDay,
  items,
  onToggleComplete,
  onDeleteItem,
  onAddActivity,
  onSelectMapLocation,
  searchQuery,
}) => {
  return (
    <div className="space-y-4">
      
      {/* Timeline Items List */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EAE5DC] p-8 text-center my-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF2EE] text-[#FF6F59] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F1C18] mb-1 font-display">
            No stops match your filter
          </h3>
          <p className="text-xs text-[#8C827A] max-w-sm mx-auto mb-4">
            {searchQuery 
              ? `No results for "${searchQuery}". Try searching for another monument, street food, or transit mode.` 
              : "There are no stops in this category for this day. You can add one below!"}
          </p>
          <button
            id="empty-state-add-btn"
            onClick={onAddActivity}
            className="px-4 py-2 rounded-xl bg-[#FF6F59] text-white text-xs font-bold hover:bg-[#F25C44] transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Stop</span>
          </button>
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-4 sm:before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-[#EAE5DC] before:hidden">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              <ItineraryCard
                item={item}
                index={index}
                onToggleComplete={onToggleComplete}
                onDeleteItem={onDeleteItem}
                onSelectMapLocation={onSelectMapLocation}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Stop Prompt Card (Dribbble Add CTA) */}
      <button
        id="add-stop-bottom-cta"
        onClick={onAddActivity}
        className="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-[#DCD5C9] hover:border-[#FF6F59] bg-[#FAF8F5]/50 hover:bg-[#FFF7F4] flex items-center justify-center gap-2 text-[#736A62] hover:text-[#FF6F59] text-sm font-bold transition-all group shadow-2xs"
      >
        <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#FF6F59] text-[#736A62] group-hover:text-white border border-[#DCD5C9] group-hover:border-[#FF6F59] flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span>Add a stop or transit leg to {currentDay.city} (Day {currentDay.dayNumber})</span>
      </button>

    </div>
  );
};
