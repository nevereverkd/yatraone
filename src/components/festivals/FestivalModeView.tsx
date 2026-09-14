import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  Flame,
  Star,
  Clock,
  Users,
  Camera,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface FestivalModeViewProps {
  onViewFullFestivals: () => void;
}

interface FestivalTheme {
  headerGradient: string;
  headerGlow: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  cardActiveBorder: string;
  cardActiveRing: string;
  tagBg: string;
  tagText: string;
  ctaText: string;
  motif: string; // Subtle background pattern/emoji
}

interface UpcomingFestival {
  name: string;
  shortName: string;
  date: string;
  startDate: string; // ISO parseable date for calculating daysUntil
  season: string;
  icon: string;
  description: string;
  tagline: string;
  celebrationPlaces: {
    city: string;
    state: string;
    famousFor: string;
    imageUrl: string;
    rating: string;
    crowdLevel: 'low' | 'medium' | 'high' | 'extreme';
  }[];
  etiquetteTip: string;
  photoTip: string;
  gradient: string;
  theme: FestivalTheme;
}

const UPCOMING_FESTIVALS: UpcomingFestival[] = [
  {
    name: 'Navratri & Durga Puja',
    shortName: 'Navratri',
    date: '02 Oct – 11 Oct 2026',
    startDate: '2026-10-02',
    season: 'Autumn',
    icon: '🪔',
    tagline: 'Nine nights of devotion, dance & vibrant Dandiya Raas',
    description: 'Nine nights of dance, devotion, and vibrant Dandiya Raas celebrations across India. Kolkata transforms into a giant art gallery with elaborate pandals.',
    celebrationPlaces: [
      {
        city: 'Kolkata',
        state: 'West Bengal',
        famousFor: 'UNESCO-recognized Durga Puja pandals, 4,000+ themed installations across the city',
        imageUrl: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        crowdLevel: 'extreme'
      },
      {
        city: 'Ahmedabad',
        state: 'Gujarat',
        famousFor: 'Largest open-air Garba dance festival with 50,000+ dancers nightly at GMDC Ground',
        imageUrl: 'https://images.unsplash.com/photo-1567591414240-e9c1e839850c?auto=format&fit=crop&w=800&q=80',
        rating: '4.8',
        crowdLevel: 'extreme'
      },
      {
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        famousFor: 'Ram Lila performances at Ramnagar Fort & sacred Ganga Aarti during festival',
        imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
        rating: '4.7',
        crowdLevel: 'high'
      }
    ],
    etiquetteTip: 'Remove shoes before entering pandals. Dress modestly for temple visits. Enjoy prasad (sacred food) with both hands.',
    photoTip: 'Best photography during evening illuminations. Avoid flash in inner sanctums.',
    gradient: 'from-orange-500 to-red-500',
    theme: {
      headerGradient: 'from-orange-600 via-red-600 to-pink-600',
      headerGlow: 'shadow-orange-500/25',
      accentBg: 'bg-orange-50',
      accentText: 'text-orange-700',
      accentBorder: 'border-orange-200',
      cardActiveBorder: 'border-orange-400',
      cardActiveRing: 'ring-orange-100',
      tagBg: 'bg-orange-100',
      tagText: 'text-orange-700',
      ctaText: 'text-orange-600 hover:text-orange-800',
      motif: '🪔'
    }
  },
  {
    name: 'Dussehra (Vijayadashami)',
    shortName: 'Dussehra',
    date: '11 Oct 2026',
    startDate: '2026-10-11',
    season: 'Autumn',
    icon: '🏹',
    tagline: 'The triumph of good over evil — burning of Ravana effigies',
    description: 'Triumph of good over evil, marked by burning of towering Ravana effigies across North India and grand Mysore Dasara processions in the South.',
    celebrationPlaces: [
      {
        city: 'Delhi',
        state: 'NCR',
        famousFor: 'Ramlila Maidan: 75-foot tall Ravana effigies set ablaze, attended by millions',
        imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
        rating: '4.7',
        crowdLevel: 'extreme'
      },
      {
        city: 'Mysuru (Mysore)',
        state: 'Karnataka',
        famousFor: 'Royal Dasara: illuminated palace, caparisoned elephants, and grand heritage procession',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        crowdLevel: 'high'
      },
      {
        city: 'Kullu',
        state: 'Himachal Pradesh',
        famousFor: 'Week-long Dussehra with 200+ local deities paraded through the valley',
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        rating: '4.8',
        crowdLevel: 'medium'
      }
    ],
    etiquetteTip: 'Arrive 2-3 hours early for effigy burning. Maintain safe distance from fire. Stay for the dramatic fireworks finale.',
    photoTip: 'The moment Ravana catches fire is most spectacular. Use burst mode on camera.',
    gradient: 'from-red-500 to-amber-500',
    theme: {
      headerGradient: 'from-red-700 via-red-600 to-amber-600',
      headerGlow: 'shadow-red-500/25',
      accentBg: 'bg-red-50',
      accentText: 'text-red-700',
      accentBorder: 'border-red-200',
      cardActiveBorder: 'border-red-400',
      cardActiveRing: 'ring-red-100',
      tagBg: 'bg-red-100',
      tagText: 'text-red-700',
      ctaText: 'text-red-600 hover:text-red-800',
      motif: '🏹'
    }
  },
  {
    name: 'Diwali (Festival of Lights)',
    shortName: 'Diwali',
    date: '08 Nov 2026',
    startDate: '2026-11-08',
    season: 'Autumn',
    icon: '🪔',
    tagline: 'A billion lights illuminate India — the grand Festival of Lights',
    description: 'The grandest pan-Indian celebration: every home, shop, and temple illuminated with oil lamps, LED lights, and rangoli patterns. A festival of joy, sweets, and family.',
    celebrationPlaces: [
      {
        city: 'Jaipur',
        state: 'Rajasthan',
        famousFor: 'Nahargarh Fort illumination, Jaipur Walled City light festival & heritage haveli decorations',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        crowdLevel: 'high'
      },
      {
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        famousFor: 'Millions of diyas on all 84 ghats, Ganga Aarti at Dashashwamedh, boat rides under lit skyline',
        imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
        rating: '5.0',
        crowdLevel: 'extreme'
      },
      {
        city: 'Amritsar',
        state: 'Punjab',
        famousFor: 'Golden Temple illuminated magnificently, fireworks over Sarovar, free langar feast',
        imageUrl: 'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        crowdLevel: 'high'
      }
    ],
    etiquetteTip: 'Wear new or festive bright clothes. Accept sweets and diyas offered by locals graciously. Avoid loud firecrackers near hospitals.',
    photoTip: 'Shoot during blue hour (just after sunset) for the best diya and light contrast.',
    gradient: 'from-amber-500 to-yellow-400',
    theme: {
      headerGradient: 'from-amber-600 via-orange-500 to-yellow-500',
      headerGlow: 'shadow-amber-500/30',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-700',
      accentBorder: 'border-amber-200',
      cardActiveBorder: 'border-amber-400',
      cardActiveRing: 'ring-amber-100',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-700',
      ctaText: 'text-amber-600 hover:text-amber-800',
      motif: '✨'
    }
  },
  {
    name: 'Dev Deepawali',
    shortName: 'Dev Deepawali',
    date: '24 Nov 2026',
    startDate: '2026-11-24',
    season: 'Late Autumn',
    icon: '🔥',
    tagline: 'When the Gods celebrate Diwali — 1.2 million lamps on the Ganges',
    description: 'The Diwali of the Gods: 15 days after Diwali, Varanasi\'s 84 ghats glow with over 1.2 million earthen oil lamps in a breathtaking spectacle on the Ganges.',
    celebrationPlaces: [
      {
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        famousFor: 'All 84 ghats lit with 1.2 million+ diyas, boat processions, classical music concerts',
        imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
        rating: '5.0',
        crowdLevel: 'extreme'
      }
    ],
    etiquetteTip: 'Book boats 2-3 months in advance. Wear warm layers as November nights are cool on the river.',
    photoTip: 'A boat on the Ganges provides the best panoramic view of the illuminated ghats.',
    gradient: 'from-orange-600 to-red-600',
    theme: {
      headerGradient: 'from-orange-700 via-red-600 to-rose-600',
      headerGlow: 'shadow-orange-500/25',
      accentBg: 'bg-orange-50',
      accentText: 'text-orange-700',
      accentBorder: 'border-orange-200',
      cardActiveBorder: 'border-orange-400',
      cardActiveRing: 'ring-orange-100',
      tagBg: 'bg-orange-100',
      tagText: 'text-orange-700',
      ctaText: 'text-orange-600 hover:text-orange-800',
      motif: '🔥'
    }
  },
  {
    name: 'Pushkar Camel Fair',
    shortName: 'Pushkar Mela',
    date: '18 Nov – 24 Nov 2026',
    startDate: '2026-11-18',
    season: 'Late Autumn',
    icon: '🐫',
    tagline: 'World\'s largest camel spectacle in the Thar Desert',
    description: 'World\'s largest camel and livestock trading spectacular in the Thar Desert, featuring folk musicians, artisan markets, hot air balloon rides, and competition events.',
    celebrationPlaces: [
      {
        city: 'Pushkar',
        state: 'Rajasthan',
        famousFor: 'Thar Desert fairgrounds, 50,000+ camels, mustache contests, folk performances',
        imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        rating: '4.8',
        crowdLevel: 'high'
      }
    ],
    etiquetteTip: 'Ask permission before close-up portraits of camel herders. Bargain gently at artisan stalls.',
    photoTip: 'Golden hour light in the desert is magnificent. Sunrise with camels is the classic shot.',
    gradient: 'from-yellow-500 to-orange-500',
    theme: {
      headerGradient: 'from-yellow-600 via-amber-500 to-orange-500',
      headerGlow: 'shadow-yellow-500/25',
      accentBg: 'bg-yellow-50',
      accentText: 'text-yellow-700',
      accentBorder: 'border-yellow-200',
      cardActiveBorder: 'border-yellow-400',
      cardActiveRing: 'ring-yellow-100',
      tagBg: 'bg-yellow-100',
      tagText: 'text-yellow-700',
      ctaText: 'text-yellow-600 hover:text-yellow-800',
      motif: '🐫'
    }
  },
  {
    name: 'Holi (Festival of Colors)',
    shortName: 'Holi',
    date: '03 Mar 2027',
    startDate: '2027-03-03',
    season: 'Spring',
    icon: '🎨',
    tagline: 'Spring explosion of color, music & joyful celebrations',
    description: 'Joyful celebration marking the arrival of spring with organic colored herbal powders (gulal) and flower petals. Mathura and Vrindavan host the most legendary celebrations.',
    celebrationPlaces: [
      {
        city: 'Mathura & Vrindavan',
        state: 'Uttar Pradesh',
        famousFor: 'Lathmar Holi at Barsana, flower Holi at Banke Bihari Temple, week-long celebrations',
        imageUrl: 'https://images.unsplash.com/photo-1583244972934-8c887467776b?auto=format&fit=crop&w=800&q=80',
        rating: '4.9',
        crowdLevel: 'extreme'
      },
      {
        city: 'Jaipur',
        state: 'Rajasthan',
        famousFor: 'Elephant Festival, City Palace celebrations, Holi parties at heritage hotels',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        rating: '4.7',
        crowdLevel: 'high'
      }
    ],
    etiquetteTip: 'Apply coconut oil to skin and hair beforehand. Wear white clothes you\'re ready to discard. Use only organic herbal powders.',
    photoTip: 'Use waterproof camera protection. Action shots during color throwing are the best.',
    gradient: 'from-pink-500 to-violet-500',
    theme: {
      headerGradient: 'from-pink-500 via-fuchsia-500 to-violet-500',
      headerGlow: 'shadow-pink-500/25',
      accentBg: 'bg-pink-50',
      accentText: 'text-pink-700',
      accentBorder: 'border-pink-200',
      cardActiveBorder: 'border-pink-400',
      cardActiveRing: 'ring-pink-100',
      tagBg: 'bg-pink-100',
      tagText: 'text-pink-700',
      ctaText: 'text-pink-600 hover:text-pink-800',
      motif: '🎨'
    }
  }
];

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const crowdBadge = (level: string) => {
  switch (level) {
    case 'extreme': return { label: 'Extreme Crowd', color: 'bg-red-100 text-red-700 border-red-200' };
    case 'high': return { label: 'High Crowd', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    case 'medium': return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    default: return { label: 'Peaceful', color: 'bg-green-100 text-green-700 border-green-200' };
  }
};

export const FestivalModeView: React.FC<FestivalModeViewProps> = ({ onViewFullFestivals }) => {
  const [expandedFestival, setExpandedFestival] = useState<number>(0);

  // Calculate days until each festival & find the closest one
  const festivalsWithDays = useMemo(() => {
    return UPCOMING_FESTIVALS.map(f => ({
      ...f,
      daysUntil: getDaysUntil(f.startDate)
    })).sort((a, b) => a.daysUntil - b.daysUntil);
  }, []);

  const closestFestival = festivalsWithDays[0];
  const theme = closestFestival.theme;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Dynamic Festival Theme Header */}
      <div className={`bg-gradient-to-r ${theme.headerGradient} rounded-3xl p-5 sm:p-6 text-white shadow-lg ${theme.headerGlow} relative overflow-hidden`}>
        {/* Floating motif background */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none flex items-center justify-center" aria-hidden>
          <span className="text-[200px] leading-none select-none">{theme.motif}</span>
        </div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{closestFestival.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                    {closestFestival.daysUntil === 0 ? '🎉 Happening Now!' : `${closestFestival.daysUntil} days away`}
                  </span>
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                    {closestFestival.season}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  {closestFestival.name}
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-lg leading-relaxed">
              {closestFestival.tagline}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-white/70 font-semibold">
              <Calendar className="w-3 h-3" />
              <span>{closestFestival.date}</span>
            </div>
          </div>
          <button
            id="view-full-festivals-btn"
            onClick={onViewFullFestivals}
            className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
          >
            <span>View Full Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Festival Cards — sorted by proximity */}
      <div className="space-y-4">
        <h3 className={`text-xs font-black uppercase tracking-wider ${theme.accentText} flex items-center gap-2`}>
          <Sparkles className="w-3.5 h-3.5" />
          All Upcoming Celebrations
        </h3>

        {festivalsWithDays.map((festival, idx) => {
          const isExpanded = expandedFestival === idx;
          const isClosest = idx === 0;
          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl border transition-all shadow-xs hover:shadow-md ${
                isExpanded
                  ? `${theme.cardActiveBorder} ring-2 ${theme.cardActiveRing}`
                  : 'border-[#EAE5DC]'
              }`}
            >
              {/* Festival Header */}
              <button
                id={`festival-card-${idx}`}
                onClick={() => setExpandedFestival(isExpanded ? -1 : idx)}
                className="w-full p-5 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${festival.gradient} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                    {festival.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="text-sm sm:text-base font-black text-[#191715]">
                        {festival.name}
                      </h3>
                      {isClosest && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.tagBg} ${theme.tagText} border ${theme.accentBorder} animate-pulse`}>
                          ✨ Next Up
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        festival.daysUntil <= 30
                          ? `${theme.tagBg} ${theme.tagText} border ${theme.accentBorder}`
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {festival.daysUntil === 0 ? 'Today!' : `In ${festival.daysUntil} days`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#665E55]">
                      <Calendar className="w-3 h-3 text-[#C84B31]" />
                      <span className="font-semibold">{festival.date}</span>
                    </div>
                    <p className="text-xs text-[#665E55] mt-1 line-clamp-2 leading-relaxed max-w-xl">
                      {festival.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-[#8C827A] shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded: Celebration Places */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-1 fade-in duration-200">
                  <div className="pt-3 border-t border-[#EAE5DC]">
                    <h4 className="text-xs font-black text-[#191715] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C84B31]" />
                      Famous Celebration Places
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {festival.celebrationPlaces.map((place, pIdx) => {
                        const crowd = crowdBadge(place.crowdLevel);
                        return (
                          <div
                            key={pIdx}
                            className="rounded-2xl border border-[#EAE5DC] overflow-hidden bg-[#FAF8F5] hover:bg-white transition-all hover:shadow-md group"
                          >
                            <div className="relative h-36 w-full overflow-hidden">
                              <img
                                src={place.imageUrl}
                                alt={`${festival.name} in ${place.city}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                              <div className="absolute top-2.5 left-2.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${crowd.color}`}>
                                  {crowd.label}
                                </span>
                              </div>
                              <div className="absolute top-2.5 right-2.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-amber-700 flex items-center gap-0.5 shadow-2xs">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                  {place.rating}
                                </span>
                              </div>
                              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                                <div className="text-xs font-black">{place.city}</div>
                                <div className="text-[10px] text-white/80 font-medium">{place.state}</div>
                              </div>
                            </div>
                            <div className="p-3">
                              <p className="text-xs text-[#524B44] leading-relaxed line-clamp-2">
                                {place.famousFor}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Etiquette & Photo Tips */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-2xl ${theme.accentBg} border ${theme.accentBorder} text-xs space-y-1.5`}>
                      <div className={`font-bold ${theme.accentText} flex items-center gap-1.5 uppercase tracking-wider text-[11px]`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Etiquette & Tips
                      </div>
                      <p className="text-[#524B44] leading-relaxed">{festival.etiquetteTip}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Camera className="w-3.5 h-3.5" />
                        Photography Guide
                      </div>
                      <p className="text-amber-900/80 leading-relaxed">{festival.photoTip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-2">
        <button
          onClick={onViewFullFestivals}
          className={`text-xs font-bold ${theme.ctaText} transition-colors cursor-pointer flex items-center gap-1 mx-auto`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          View Complete Festival Calendar & Cultural Experiences
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// Export theme info for the toggle button in App.tsx
export function getClosestFestivalTheme() {
  const sorted = UPCOMING_FESTIVALS
    .map(f => ({ ...f, daysUntil: getDaysUntil(f.startDate) }))
    .sort((a, b) => a.daysUntil - b.daysUntil);
  const closest = sorted[0];
  return {
    gradient: closest.theme.headerGradient,
    icon: closest.icon,
    name: closest.shortName,
    fullName: closest.name,
    daysUntil: closest.daysUntil,
    date: closest.date,
    tagline: closest.tagline,
    season: closest.season,
    accentBg: closest.theme.accentBg,
    accentText: closest.theme.accentText,
    accentBorder: closest.theme.accentBorder,
    motif: closest.theme.motif,
  };
}
