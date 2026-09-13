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

declare global {
  interface Window {
    google: any;
  }
}

interface SafetyPageProps {
  onOpenSOS: () => void;
  accessibilityMode?: boolean;
}

// Official Google Maps Dark Cyan Map Styling JSON Array
const GOOGLE_MAPS_DARK_CYAN_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0b132b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#748cad" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b132b" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1c2a4a" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#0284c7" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#075985" }] }
];

// Well-spaced default locations (Mohali / Chandigarh region matching user reference image)
const DEFAULT_MOHALI_NODES = [
  {
    id: 'node-pie-heaven',
    name: 'Pie Heaven',
    badge: 'Trending this Week',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lat: 30.7140,
    lng: 76.7110, // North-West
  },
  {
    id: 'node-3b2-market',
    name: '3B2 Market',
    badge: 'Top Pick',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    lat: 30.7090,
    lng: 76.7260, // North-East
  },
  {
    id: 'node-letseat',
    name: 'Letseat',
    badge: 'Verified Stalls',
    icon: '🍱',
    lat: 30.7020,
    lng: 76.7010, // West
  },
  {
    id: 'node-fit-chai',
    name: 'Fit Chai',
    badge: 'Popular Spot',
    icon: '☕',
    lat: 30.6930,
    lng: 76.7110, // South-West
  },
  {
    id: 'node-cp67-mall',
    name: 'CP67 Mall',
    badge: 'Top Pick',
    icon: '🛍️',
    lat: 30.6910,
    lng: 76.7250, // South-East
  }
];

// Central Red Heat Spot (Mataur High Density Zone)
const CENTRAL_HEAT_SPOT = {
  lat: 30.7010,
  lng: 76.7155,
  name: 'Mataur Central Hotspot',
};

export const SafetyPage: React.FC<SafetyPageProps> = ({
  onOpenSOS,
  accessibilityMode = false
}) => {
  const [selectedZone, setSelectedZone] = useState<RiskZone>(LIVE_RISK_ZONES[0]);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'dark_cyan' | 'google_roadmap' | 'google_satellite' | 'google_hybrid'>('dark_cyan');
  const [activeHeatMode, setActiveHeatMode] = useState<'safety' | 'trending' | 'all'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  const filteredZones = LIVE_RISK_ZONES.filter(z => {
    const matchCity = cityFilter === 'all' || z.city.toLowerCase() === cityFilter.toLowerCase();
    const matchRisk = riskLevelFilter === 'all' || z.riskLevel === riskLevelFilter;
    return matchCity && matchRisk;
  });

  // Check Google Maps API availability
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleApiLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsGoogleApiLoaded(true);
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize Map Engine with Mohali/Chandigarh default center (30.7020°N, 76.7150°E)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center set to Mohali / Chandigarh matching reference screenshot
    const defaultLat = 30.7020;
    const defaultLng = 76.7150;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Official Google Maps SDK Engine Initialization
    if (window.google && window.google.maps) {
      try {
        const mapType = mapStyle === 'google_satellite' ? 'satellite' : mapStyle === 'google_hybrid' ? 'hybrid' : 'roadmap';
        const styles = mapStyle === 'dark_cyan' ? GOOGLE_MAPS_DARK_CYAN_STYLE : [];

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: defaultLat, lng: defaultLng },
          zoom: 14,
          mapTypeId: mapType,
          styles: styles,
          mapTypeControl: true,
          streetViewControl: true,
          zoomControl: true,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        return;
      } catch (err) {
        console.warn('Google Maps JS SDK warning, using Leaflet engine:', err);
      }
    }

    // Leaflet Heatmap Engine (with dark cyan backdrop)
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'google_roadmap') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'google_satellite') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'google_hybrid') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }

    L.tileLayer(tileUrl, { maxZoom: 20, subdomains: 'abcd' }).addTo(map);
    leafletMapRef.current = map;
    renderLeafletMarkers(map);

  }, [mapStyle, isGoogleApiLoaded]);

  // Re-render Leaflet Markers when filter/tab changes
  useEffect(() => {
    if (leafletMapRef.current) {
      renderLeafletMarkers(leafletMapRef.current);
    }
  }, [filteredZones, activeHeatMode]);

  // Render Well-Spaced Unclustered Heatmap Nodes & Radial Red Heat Spot
  const renderLeafletMarkers = (map: L.Map) => {
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // 1. Central Radial Glowing Red Heat Spot (NO sharp outline circle border!)
    const redSpotHtml = `
      <div class="relative flex items-center justify-center pointer-events-none" style="transform: translate(-50%, -50%);">
        <div style="
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: radial-gradient(circle, #E11D48 0%, #EA580C 35%, #F59E0B 60%, rgba(6, 182, 212, 0.35) 80%, transparent 100%);
          box-shadow: 0 0 35px rgba(225, 29, 72, 0.9), 0 0 65px rgba(6, 182, 212, 0.4);
          animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        "></div>
      </div>
    `;

    const redSpotIcon = L.divIcon({
      html: redSpotHtml,
      className: 'radial-red-heat-spot',
      iconSize: [84, 84],
      iconAnchor: [42, 42]
    });

    L.marker([CENTRAL_HEAT_SPOT.lat, CENTRAL_HEAT_SPOT.lng], { icon: redSpotIcon }).addTo(map);

    // 2. Well-Spaced Mohali Avatar Pins & Badges
    DEFAULT_MOHALI_NODES.forEach(node => {
      // Soft cyan radial background glow around node
      const cyanGlowHtml = `
        <div class="pointer-events-none" style="transform: translate(-50%, -50%);">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.7) 0%, rgba(20, 184, 166, 0.3) 60%, transparent 100%);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
          "></div>
        </div>
      `;

      const cyanIcon = L.divIcon({ html: cyanGlowHtml, className: 'cyan-glow-spot', iconSize: [48, 48] });
      L.marker([node.lat, node.lng], { icon: cyanIcon }).addTo(map);

      // Clean, spacious avatar label card
      const cardHtml = `
        <div class="relative flex items-center cursor-pointer hover:scale-105 transition-transform" style="transform: translate(-16px, -16px);">
          ${node.avatar ? `
            <div class="w-8 h-8 rounded-full border-2 border-[#FFD700] shadow-xl overflow-hidden shrink-0 bg-slate-900 ring-2 ring-cyan-500/40">
              <img src="${node.avatar}" alt="${node.name}" class="w-full h-full object-cover" />
            </div>
          ` : `
            <div class="w-7 h-7 rounded-full border border-orange-400 bg-[#1E293B] text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0">
              ${node.icon || '📍'}
            </div>
          `}

          <div class="ml-1.5 px-2.5 py-0.5 rounded-full bg-[#0F172A]/90 text-white border border-cyan-400/30 shadow-lg backdrop-blur-md flex flex-col pointer-events-none">
            <span class="text-[11px] font-extrabold leading-tight text-cyan-200">${node.name}</span>
            <span class="text-[9px] font-bold text-amber-300 tracking-wide">${node.badge}</span>
          </div>
        </div>
      `;

      const cardIcon = L.divIcon({ html: cardHtml, className: 'unclustered-node-card', iconSize: [160, 36] });
      L.marker([node.lat, node.lng], { icon: cardIcon }).addTo(map);
    });

    // 3. Render Risk Zones in Other Cities
    if (activeHeatMode === 'safety' || activeHeatMode === 'all') {
      filteredZones.forEach(zone => {
        const isHigh = zone.riskLevel === 'high';
        const color = isHigh ? '#EF4444' : '#F59E0B';

        const zoneGlowHtml = `
          <div class="pointer-events-none cursor-pointer" style="transform: translate(-50%, -50%);">
            <div style="
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background: radial-gradient(circle, ${color} 0%, rgba(6, 182, 212, 0.4) 70%, transparent 100%);
              box-shadow: 0 0 25px ${color};
            "></div>
          </div>
        `;

        const zoneIcon = L.divIcon({ html: zoneGlowHtml, className: 'zone-heat-glow', iconSize: [56, 56] });
        L.marker([zone.coordinates.lat, zone.coordinates.lng], { icon: zoneIcon })
          .addTo(map)
          .on('click', () => setSelectedZone(zone));
      });
    }
  };

  const handleSelectZone = (zone: RiskZone) => {
    setSelectedZone(zone);
    if (googleMapRef.current && window.google) {
      googleMapRef.current.panTo({ lat: zone.coordinates.lat, lng: zone.coordinates.lng });
      googleMapRef.current.setZoom(14);
    } else if (leafletMapRef.current) {
      leafletMapRef.current.setView([zone.coordinates.lat, zone.coordinates.lng], 14, { animate: true });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] rounded-3xl p-5 sm:p-7 border border-cyan-500/30 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider border border-cyan-400/30">
                <AlertOctagon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Google Maps API Engine Connected</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Default Region: Mohali / Chandigarh</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Real-Time <span className="text-cyan-400">Radial Heat Spot</span> & Safety Layer
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unclustered, well-spaced heatmap layout featuring soft glowing radial red heat spots, Google Maps tile integration, and local trending food & shopping picks.
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

      {/* Map Mode & Provider Control Bar */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-4 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        {/* Heatmap Category Switcher */}
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
            <span>Scam Risk</span>
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
          {['all', 'Mohali', 'Delhi', 'Agra', 'Varanasi', 'Jaipur'].map(city => (
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

        {/* Google Maps View Selector */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 font-bold px-1.5">View Style:</span>
          <button
            onClick={() => setMapStyle('dark_cyan')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'dark_cyan' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌙 Neon Dark Heatmap
          </button>
          <button
            onClick={() => setMapStyle('google_roadmap')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'google_roadmap' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Google Roadmap
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

      {/* Main Grid: Interactive Heatmap Container & Selected Zone Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Heatmap Target View (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B132B] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[540px] relative">
          
          <div className="p-3 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Mohali / Chandigarh Heatmap (Default Region)</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> Radial Red Heat Spot
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Soft Glow Node
              </span>
            </div>
          </div>

          {/* Leaflet Map / Google Maps Canvas */}
          <div ref={mapContainerRef} className="flex-1 w-full relative z-0" />

          {/* Right Floating Overlay Stack matching image */}
          <div className="absolute right-4 bottom-6 z-20 flex flex-col items-center gap-3">
            <button
              onClick={onOpenSOS}
              className="relative group w-11 h-11 rounded-full bg-slate-900/90 border-2 border-cyan-400 shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
              title="User Profile / Emergency SOS"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                👤
              </div>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900 animate-ping" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900" />
            </button>

            <button
              onClick={() => setShowSettingsModal(!showSettingsModal)}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-700 shadow-xl flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer backdrop-blur-md"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMapStyle(prev => prev === 'dark_cyan' ? 'google_roadmap' : prev === 'google_roadmap' ? 'google_satellite' : 'dark_cyan')}
              className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 shadow-xl flex items-center justify-center text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer backdrop-blur-md"
            >
              <Layers className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-slate-900/95 border border-slate-700 shadow-xl flex flex-col items-center justify-center text-white backdrop-blur-md cursor-pointer hover:border-cyan-400">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] font-black text-slate-300">N</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Zone Details Card (5 Cols) */}
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

    </div>
  );
};
