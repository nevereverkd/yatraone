import React from 'react';
import { Bot } from 'lucide-react';

interface FloatingAssistantButtonProps {
  onOpenAssistant: () => void;
}

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ onOpenAssistant }) => {
  return (
    <div className="fixed bottom-35 sm:bottom-38 right-4 sm:right-6 z-45 group">
      {/* Main Sahayak AI Floating Button - Fully Circular */}
      <button
        id="floating-assistant-btn"
        onClick={onOpenAssistant}
        aria-label="Open Sahayak AI Travel Assistant"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#191715] hover:bg-[#C84B31] text-white font-bold shadow-[0_6px_20px_rgba(25,23,21,0.4)] border-2 border-white/90 hover:scale-108 active:scale-95 transition-all cursor-pointer select-none flex flex-col items-center justify-center"
      >
        {/* Subtle sparkle indicator badge in top-right */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] border border-white" />
        
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA07A]" />
        <span className="text-[8px] sm:text-[9px] font-bold text-white/95 leading-none mt-0.5 tracking-tight">AI</span>
      </button>

      {/* Hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap bg-[#191715] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-white/10 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
        Sahayak AI Travel & Place Guide
      </div>
    </div>
  );
};
