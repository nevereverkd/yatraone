import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertOctagon, 
  ShieldCheck, 
  MapPin, 
  Radio, 
  Search, 
  AlertTriangle, 
  PhoneCall, 
  Navigation, 
  CheckCircle2, 
  Info, 
  Users, 
  ExternalLink,
  LifeBuoy,
  Layers,
  Settings,
  Compass,
  Sparkles,
  Flame,
  Shield,
  Eye,
  RotateCw,
  Globe
} from 'lucide-react';
import { LIVE_RISK_ZONES, INITIAL_SCAM_ALERTS } from '../../data/trustEngineData';
import { RiskZone } from '../../types/trustEngine';

interface SafetyPageProps {
  onOpenSOS: () => void;
  accessibilityMode?: boolean;
}

// Sample custom trending & safety hotspot overlay items (matching user heatmap preview)
const EXTRA_HEATMAP_NODES = [
  {
    id: 'node-pie-heaven',
    name: 'Pie Heaven',
    badge: 'Trending this Week',
    category: 'food',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lat: 30.7046,
    lng: 76.7179,
    heatLevel: 'high', // cyan/teal glow with red core
    type: 'trending'
  },
  {
    id: 'node-3b2-market',
    name: '3B2 Market',
    badge: 'Top Pick',
    category: 'shopping',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    lat: 30.7088,
    lng: 76.7265,
    heatLevel: 'high',
    type: 'trending'
  },
  {
    id: 'node-fit-chai',
    name: 'Fit Chai',
    badge: 'Popular Spot',
    category: 'cafe',
    icon: '☕',
    lat: 30.6965,
    lng: 76.7102,
    heatLevel: 'medium',
    type: 'food'
  },
  {
    id: 'node-cp67-mall',
    name: 'CP67 Mall',
    badge: 'Top Pick',
    category: 'mall',
    icon: '🛍️',
    lat: 30.6922,
    lng: 76.7215,
    heatLevel: 'high',
    type: 'shopping'
  },
  {
    id: 'node-letseat',
    name: 'Letseat',
    badge: 'Verified Stalls',
    category: 'food',
    icon: '🍱',
    lat: 30.7010,
    lng: 76.7020,
    heatLevel: 'medium',
    type: 'food'
  }
];

export const SafetyPage: React.FC<SafetyPageProps> = ({
  onOpenSOS,
  accessibilityMode = false
}) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone>(LIVE_RISK_ZONES[0]);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'dark_cyan' | 'google_roadmap' | 'google_satellite' | 'voyager'>('dark_cyan');
  const [activeHeatMode, setActiveHeatMode] = useState<'safety' | 'trending' | 'all'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const heatCirclesGroupRef = useRef<L.LayerGroup | null>(null);

  const filteredZones = LIVE_RISK_ZONES.filter(z => {
    const matchCity = cityFilter === 'all' || z.city.toLowerCase() === cityFilter.toLowerCase();
    const matchRisk = riskLevelFilter === 'all' || z.riskLevel === riskLevelFilter;
    return matchCity && matchRisk;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = selectedZone?.coordinates?.lat || 28.6506;
    const initialLng = selectedZone?.coordinates?.lng || 77.2301;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Tile Layer based on selected style (with Google Maps Integration)
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'; // Neon dark mode default
    if (mapStyle === 'google_roadmap') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'google_satellite') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'voyager') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const heatCirclesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    heatCirclesGroupRef.current = heatCirclesGroup;
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    renderHeatmapNodes(map, markersGroup, heatCirclesGroup);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle]);

  // Re-render markers when filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current || !heatCirclesGroupRef.current) return;
    renderHeatmapNodes(mapInstanceRef.current, markersGroupRef.current, heatCirclesGroupRef.current);
  }, [filteredZones, activeHeatMode]);

  // Render high-intensity glowing heatmap spots & avatar markers
  const renderHeatmapNodes = (map: L.Map, markersGroup: L.LayerGroup, heatCirclesGroup: L.LayerGroup) => {
    markersGroup.clearLayers();
    heatCirclesGroup.clearLayers();

    // 1. Render Safety Risk Zones
    if (activeHeatMode === 'safety' || activeHeatMode === 'all') {
      filteredZones.forEach(zone => {
        const isHigh = zone.riskLevel === 'high';
        const isMedium = zone.riskLevel === 'medium';
        const heatColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981';
        const auraColor = isHigh ? 'rgba(239, 68, 68, 0.45)' : isMedium ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.25)';

        // Glowing outer radial heatmap aura (Leaflet Circles)
        L.circle([zone.coordinates.lat, zone.coordinates.lng], {
          radius: isHigh ? 650 : 400,
          color: heatColor,
          weight: 1,
          fillColor: heatColor,
          fillOpacity: 0.18,
        }).addTo(heatCirclesGroup);

        L.circle([zone.coordinates.lat, zone.coordinates.lng], {
          radius: isHigh ? 300 : 180,
          color: '#06B6D4', // Cyan outer ring like user's image
          weight: 1.5,
          fillColor: '#06B6D4',
          fillOpacity: 0.3,
        }).addTo(heatCirclesGroup);

        // Core pulsating neon heat spot HTML icon
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group" style="transform: translate(-50%, -50%);">
            <!-- Pulsing Cyan/Red Heat Glow Aura -->
            <div class="absolute w-16 h-16 rounded-full animate-ping" style="background: radial-gradient(circle, ${auraColor} 0%, transparent 70%);"></div>
            <div class="absolute w-10 h-10 rounded-full shadow-lg" style="background: radial-gradient(circle, ${heatColor} 0%, #06B6D4 100%); opacity: 0.85;"></div>
            
            <!-- Center Core -->
            <div class="w-4 h-4 rounded-full bg-white shadow-md border-2 border-red-500 z-10"></div>

            <!-- Floating Label Pill -->
            <div class="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0F172A]/90 text-white text-[11px] font-bold shadow-xl border border-cyan-500/40 flex items-center gap-1.5 backdrop-blur-md transition-all group-hover:scale-110">
              <span class="w-2 h-2 rounded-full" style="background-color: ${heatColor}"></span>
              <span>${zone.name.split(' ')[0]}</span>
              <span class="text-[9px] uppercase px-1.5 py-0.2 rounded ${isHigh ? 'bg-red-500/30 text-red-300' : 'bg-emerald-500/30 text-emerald-300'} font-extrabold">
                ${zone.riskLevel}
              </span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'safety-glowing-heat-marker',
          iconSize: [64, 64],
          iconAnchor: [32, 32]
        });

        const marker = L.marker([zone.coordinates.lat, zone.coordinates.lng], { icon: customIcon });

        marker.on('click', () => {
          setSelectedZone(zone);
          map.setView([zone.coordinates.lat, zone.coordinates.lng], 14, { animate: true });
        });

        markersGroup.addLayer(marker);
      });
    }

    // 2. Render Extra Trending Spots & Local Picks (matching screenshot style)
    if (activeHeatMode === 'trending' || activeHeatMode === 'all') {
      EXTRA_HEATMAP_NODES.forEach(node => {
        // Glowing heatmap pulse behind node
        L.circle([node.lat, node.lng], {
          radius: 350,
          color: '#06B6D4',
          weight: 1,
          fillColor: '#06B6D4',
          fillOpacity: 0.25,
        }).addTo(heatCirclesGroup);

        L.circle([node.lat, node.lng], {
          radius: 120,
          color: '#EF4444',
          weight: 2,
          fillColor: '#EF4444',
          fillOpacity: 0.7,
        }).addTo(heatCirclesGroup);

        // Avatar / Pill Marker matching the image format exactly
        const markerHtml = `
          <div class="relative flex items-center cursor-pointer group hover:scale-105 transition-all" style="transform: translate(-20px, -20px);">
            ${node.avatar ? `
              <div class="relative z-10 w-9 h-9 rounded-full border-2 border-[#FFD700] shadow-xl overflow-hidden shrink-0 bg-slate-900">
                <img src="${node.avatar}" alt="${node.name}" class="w-full h-full object-cover" />
              </div>
            ` : `
              <div class="relative z-10 w-8 h-8 rounded-full border-2 border-orange-400 bg-[#1E293B] text-white flex items-center justify-center text-xs font-bold shadow-lg shrink-0">
                ${node.icon || '📍'}
              </div>
            `}

            <!-- Text Tag Pill -->
            <div class="ml-1.5 px-3 py-1 rounded-full bg-[#0F172A]/90 text-white border border-cyan-400/40 shadow-xl backdrop-blur-md flex flex-col pointer-events-none">
              <span class="text-xs font-extrabold leading-tight text-cyan-200">${node.name}</span>
              <span class="text-[9px] font-semibold text-orange-300 tracking-wide">${node.badge}</span>
            </div>
          </div>
        `;

        const avatarIcon = L.divIcon({
          html: markerHtml,
          className: 'trending-avatar-heat-marker',
          iconSize: [180, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([node.lat, node.lng], { icon: avatarIcon });
        markersGroup.addLayer(marker);
      });
    }
  };

  // Pan to selected zone
  const handleSelectZone = (zone: RiskZone) => {
    setSelectedZone(zone);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([zone.coordinates.lat, zone.coordinates.lng], 14, { animate: true });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Header Banner with Emergency SOS Callout */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] rounded-3xl p-5 sm:p-7 border border-cyan-500/30 shadow-xl relative overflow-hidden text-white">
        {/* Neon Background Accents */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30">
                <AlertOctagon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Live Tourist Safety & Risk Heatmap</span>
              </div>

              {/* Google Maps Connected Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Google Maps Connected</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Real-Time Scam Density & <span className="text-cyan-400">Safety Glowing Heatmap</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Interactive high-precision cyan/red heat clusters mapping scam corridors, tout zones, footfall density, and 24/7 monitored tourist police booths.
            </p>
          </div>

          {/* Actionable Emergency SOS Trigger Button */}
          <button
            id="safety-page-sos-btn"
            onClick={onOpenSOS}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-sm font-black tracking-wide shadow-xl shadow-red-500/30 flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 border border-red-400/40"
          >
            <Radio className="w-5 h-5 animate-ping text-white" />
            <span>TRIGGER EMERGENCY SOS (24/7 POLICE)</span>
          </button>
        </div>
      </div>

      {/* Filter and Heatmap Control Toolbar */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-4 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Heatmap Mode Selector Tabs */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 gap-1 text-xs">
          <button
            onClick={() => setActiveHeatMode('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeatMode === 'all' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>All Hotspots</span>
          </button>
          <button
            onClick={() => setActiveHeatMode('safety')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeatMode === 'safety' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Safety & Risk</span>
          </button>
          <button
            onClick={() => setActiveHeatMode('trending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeatMode === 'trending' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trending Picks</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-400 mr-1">City:</span>
          {['all', 'Delhi', 'Agra', 'Varanasi', 'Jaipur'].map(city => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer text-xs ${
                cityFilter === city
                  ? 'bg-slate-700 text-white border border-cyan-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {city === 'all' ? 'All' : city}
            </button>
          ))}
        </div>

        {/* Map Layer Selector (Google Maps vs Dark Mode) */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 font-bold px-1.5">Style:</span>
          <button
            onClick={() => setMapStyle('dark_cyan')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'dark_cyan' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌙 Neon Dark
          </button>
          <button
            onClick={() => setMapStyle('google_roadmap')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'google_roadmap' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Google Map
          </button>
          <button
            onClick={() => setMapStyle('google_satellite')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'google_satellite' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛰️ Satellite
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map with Floating Controls & Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Center / Left Map Container with Floating Controls Overlay (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B132B] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px] relative">
          
          {/* Map Top Bar Legend */}
          <div className="p-3 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Live Neon Heatmap Layer</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> High Scam
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Moderate
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Trending Pick
              </span>
            </div>
          </div>

          {/* Leaflet Map Target */}
          <div ref={mapContainerRef} className="flex-1 w-full relative z-0" />

          {/* Floating UI Controls Overlay on Right Side (Matching User Reference Image) */}
          <div className="absolute right-4 bottom-6 z-20 flex flex-col items-center gap-3">
            
            {/* Snapchat / Avatar Profile Floating Action Button */}
            <button
              onClick={onOpenSOS}
              className="relative group w-11 h-11 rounded-full bg-slate-900/90 border-2 border-cyan-400 shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
              title="Emergency SOS / User Profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                👤
              </div>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900 animate-ping" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900" />
            </button>

            {/* Map Settings Gear Button */}
            <button
              onClick={() => setShowSettingsModal(!showSettingsModal)}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 shadow-xl flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md"
              title="Map Settings & Layer Controls"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Layer Switcher Button (Glowing Cyan) */}
            <button
              onClick={() => setMapStyle(prev => prev === 'dark_cyan' ? 'google_roadmap' : prev === 'google_roadmap' ? 'google_satellite' : 'dark_cyan')}
              className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer backdrop-blur-md"
              title="Toggle Heatmap Layer Style"
            >
              <Layers className="w-5 h-5" />
            </button>

            {/* Compass Dial Widget ('N' Indicator) */}
            <div className="w-10 h-10 rounded-full bg-slate-900/95 border border-slate-700 shadow-xl flex flex-col items-center justify-center text-white backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all">
              <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[9px] font-black tracking-tighter text-slate-300">N</span>
            </div>

          </div>

          {/* Quick Info Toast Footer */}
          <div className="absolute left-4 bottom-4 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/80 text-slate-300 text-[11px] font-mono border border-slate-800 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Heat Telemetry Engine Active • 5 Local Hotspots Mapped</span>
          </div>
        </div>

        {/* Right: Selected Zone Inspector Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Location Risk Level Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-[#8C827A] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6F59]" />
                  <span>{selectedZone.city} District</span>
                </span>
                <h3 className="text-lg font-bold text-[#1F1C18] mt-0.5">
                  {selectedZone.name}
                </h3>
              </div>

              <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                selectedZone.riskLevel === 'high'
                  ? 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECDD3]'
                  : selectedZone.riskLevel === 'medium'
                  ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                  : 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
              }`}>
                {selectedZone.riskLevel.toUpperCase()} RISK
              </span>
            </div>

            <p className="text-xs text-[#5A524C] leading-relaxed">
              {selectedZone.description}
            </p>

            {/* Active Incidents Pill */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DC] text-xs flex items-center justify-between">
              <span className="text-[#8C827A]">Active Community Scam Reports:</span>
              <span className="font-extrabold text-[#E11D48]">{selectedZone.activeIncidentsCount} cases logged</span>
            </div>

            {/* Official Safety Advice */}
            <div className="bg-[#FFF7ED] border border-[#FFEDD5] p-3.5 rounded-2xl text-xs text-[#9A3412] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#C2410C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Recommended Precaution</span>
              </div>
              <p className="leading-relaxed">
                {selectedZone.safetyAdvice}
              </p>
            </div>

            {/* Tourist Police Booth Contact */}
            <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
              <span className="text-[#8C827A]">Nearest Monitored Post:</span>
              <span className="font-bold text-[#0284C7] font-mono">{selectedZone.touristPoliceContact}</span>
            </div>
          </div>

          {/* Quick Zone Selector List */}
          <div className="bg-white rounded-3xl p-4 border border-[#EAE5DC] shadow-xs space-y-2">
            <div className="text-xs font-bold text-[#8C827A] uppercase tracking-wider mb-2">
              Browse Indian Scam & Safe Hotspots ({filteredZones.length})
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {filteredZones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    selectedZone.id === zone.id
                      ? 'bg-[#FFF2EE] border-l-4 border-[#FF6F59] font-bold text-[#1F1C18]'
                      : 'hover:bg-[#FAF8F5] text-[#5A524C]'
                  }`}
                >
                  <span className="truncate pr-2">{zone.name}</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${
                    zone.riskLevel === 'high' ? 'bg-[#FEE2E2] text-[#B91C1C]' : zone.riskLevel === 'medium' ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#ECFDF5] text-[#065F46]'
                  }`}>
                    {zone.riskLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Map Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Heatmap & Map Settings</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5">Map Engine Provider</label>
                <select
                  value={mapStyle}
                  onChange={(e) => setMapStyle(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-semibold"
                >
                  <option value="dark_cyan">🌙 Neon Cyan Dark Mode (Custom Heatmap)</option>
                  <option value="google_roadmap">🗺️ Google Maps Roadmap (Standard)</option>
                  <option value="google_satellite">🛰️ Google Maps Satellite View</option>
                  <option value="voyager">🧭 Carto Voyager Light</option>
                </select>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-1 text-slate-300">
                <div className="font-bold text-cyan-300">Google Maps Status: Connected ✅</div>
                <div className="text-[11px] text-slate-400">
                  Using VITE_GOOGLE_MAPS_API_KEY from .env for tile rendering & geocoding.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
