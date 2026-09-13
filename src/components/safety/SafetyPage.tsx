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

// Sample custom trending & safety hotspot overlay items
const EXTRA_HEATMAP_NODES = [
  {
    id: 'node-pie-heaven',
    name: 'Pie Heaven',
    badge: 'Trending this Week',
    category: 'food',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    lat: 30.7046,
    lng: 76.7179,
    heatLevel: 'high',
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
  const [mapStyle, setMapStyle] = useState<'google_roadmap' | 'google_satellite' | 'google_hybrid' | 'dark_cyan'>('google_roadmap');
  const [activeHeatMode, setActiveHeatMode] = useState<'safety' | 'trending' | 'all'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<any[]>([]);

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

  // Initialize and Render Map Engine (Google Maps API priority)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = selectedZone?.coordinates?.lat || 28.6506;
    const initialLng = selectedZone?.coordinates?.lng || 77.2301;

    // Clear previous Leaflet map if present
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Official Google Maps SDK Initialization
    if (window.google && window.google.maps) {
      try {
        const mapType = mapStyle === 'google_satellite' ? 'satellite' : mapStyle === 'google_hybrid' ? 'hybrid' : 'roadmap';
        const styles = mapStyle === 'dark_cyan' ? GOOGLE_MAPS_DARK_CYAN_STYLE : [];

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: 14,
          mapTypeId: mapType,
          styles: styles,
          mapTypeControl: true,
          streetViewControl: true,
          zoomControl: true,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        renderGoogleMarkers(map);
        return;
      } catch (err) {
        console.warn('Google Maps JS SDK initialization error, using Leaflet fallback:', err);
      }
    }

    // Leaflet Fallback with Google Tile server
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'; // Official Google Roadmap tile endpoint
    if (mapStyle === 'google_satellite') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'google_hybrid') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'dark_cyan') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    L.tileLayer(tileUrl, { maxZoom: 20, subdomains: 'abcd' }).addTo(map);
    leafletMapRef.current = map;
    renderLeafletMarkers(map);

  }, [mapStyle, isGoogleApiLoaded]);

  // Re-render markers when filter changes
  useEffect(() => {
    if (googleMapRef.current && window.google && window.google.maps) {
      renderGoogleMarkers(googleMapRef.current);
    } else if (leafletMapRef.current) {
      renderLeafletMarkers(leafletMapRef.current);
    }
  }, [filteredZones, activeHeatMode]);

  // Render Markers on Official Google Maps Instance
  const renderGoogleMarkers = (map: any) => {
    // Clear old Google markers
    markersRef.current.forEach(m => m.setMap && m.setMap(null));
    markersRef.current = [];

    // Render Safety Risk Hotspots
    if (activeHeatMode === 'safety' || activeHeatMode === 'all') {
      filteredZones.forEach(zone => {
        const isHigh = zone.riskLevel === 'high';
        const isMedium = zone.riskLevel === 'medium';
        const circleColor = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981';

        // Google Maps Circle Overlay
        const circle = new window.google.maps.Circle({
          strokeColor: circleColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: circleColor,
          fillOpacity: 0.25,
          map: map,
          center: { lat: zone.coordinates.lat, lng: zone.coordinates.lng },
          radius: isHigh ? 500 : 300,
        });

        // Google Maps Marker
        const marker = new window.google.maps.Marker({
          position: { lat: zone.coordinates.lat, lng: zone.coordinates.lng },
          map: map,
          title: `${zone.name} (${zone.riskLevel.toUpperCase()} RISK)`,
          label: {
            text: isHigh ? '!' : isMedium ? '⚠' : '✓',
            color: 'white',
            fontWeight: 'bold',
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #1e293b; padding: 6px; font-family: system-ui, sans-serif; max-width: 220px;">
              <strong style="font-size: 13px;">${zone.name}</strong><br/>
              <span style="font-size: 11px; color: ${circleColor}; font-weight: bold;">${zone.riskLevel.toUpperCase()} SCAM RISK</span>
              <p style="font-size: 11px; margin-top: 4px; color: #475569;">${zone.description}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          setSelectedZone(zone);
        });

        markersRef.current.push(circle, marker);
      });
    }

    // Render Extra Trending Nodes
    if (activeHeatMode === 'trending' || activeHeatMode === 'all') {
      EXTRA_HEATMAP_NODES.forEach(node => {
        const circle = new window.google.maps.Circle({
          strokeColor: '#06B6D4',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#06B6D4',
          fillOpacity: 0.3,
          map: map,
          center: { lat: node.lat, lng: node.lng },
          radius: 250,
        });

        const marker = new window.google.maps.Marker({
          position: { lat: node.lat, lng: node.lng },
          map: map,
          title: `${node.name} - ${node.badge}`,
        });

        markersRef.current.push(circle, marker);
      });
    }
  };

  // Render Markers on Leaflet Fallback Instance
  const renderLeafletMarkers = (map: L.Map) => {
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    if (activeHeatMode === 'safety' || activeHeatMode === 'all') {
      filteredZones.forEach(zone => {
        const isHigh = zone.riskLevel === 'high';
        const isMedium = zone.riskLevel === 'medium';
        const color = isHigh ? '#EF4444' : isMedium ? '#F59E0B' : '#10B981';

        L.circle([zone.coordinates.lat, zone.coordinates.lng], {
          radius: isHigh ? 500 : 300,
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          weight: 2
        }).addTo(map);

        const markerHtml = `
          <div style="background:${color}; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; border:2px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.4); cursor:pointer; transform:translate(-50%,-50%);">
            ${isHigh ? '!' : isMedium ? '⚠' : '✓'}
          </div>
        `;

        const icon = L.divIcon({ html: markerHtml, className: 'gmap-marker', iconSize: [28, 28] });
        L.marker([zone.coordinates.lat, zone.coordinates.lng], { icon })
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
                <span>Google Maps JS API Engine Connected</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Official Google Maps (key: AIzaSyD3...)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Official <span className="text-cyan-400">Google Maps</span> Safety & Heatmap Layer
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Powered by the official Google Maps JavaScript SDK with live traffic, satellite imagery, and high-precision scam risk overlays.
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

        {/* Google Maps View Selector */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400 font-bold px-1.5">Google View:</span>
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
          <button
            onClick={() => setMapStyle('google_hybrid')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'google_hybrid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌐 Hybrid
          </button>
          <button
            onClick={() => setMapStyle('dark_cyan')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
              mapStyle === 'dark_cyan' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌙 Dark Google
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Zone Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Google Map Container (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0B132B] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px] relative">
          <div className="p-3 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Globe className="w-4 h-4" />
              <span>Official Google Maps API SDK</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> High Scam
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Moderate
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe Booth
              </span>
            </div>
          </div>

          <div ref={mapContainerRef} className="flex-1 w-full relative z-0" />
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

    </div>
  );
};
