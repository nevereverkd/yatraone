import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Locate, 
  LocateFixed, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Maximize2, 
  Minimize2, 
  Shield, 
  Store, 
  Building, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Clock, 
  IndianRupee, 
  PhoneCall, 
  Sparkles, 
  Eye, 
  ExternalLink,
  RotateCw,
  Landmark,
  Utensils,
  ShoppingBag,
  Train,
  ShieldAlert,
  Flame,
  Search
} from 'lucide-react';
import { AppEntity } from '../../types/entity';
import { AuthUser } from '../../types/auth';
import { Trip, ItineraryItem } from '../../types/travel';
import { FAMOUS_LOCATION_PRESETS, LocationPreset, calculateDistanceKm, formatDistance } from '../../utils/navigationEngine';
import { AUTHORITY_HERITAGE_REPORTS, INITIAL_BUSINESS_PROFILE } from '../../data/ecosystemData';

interface DashboardMapSectionProps {
  role: AppEntity;
  currentUser?: AuthUser | null;
  currentTrip?: Trip;
  selectedDayIndex?: number;
  onOpenSOS?: () => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const DashboardMapSection: React.FC<DashboardMapSectionProps> = ({
  role,
  currentUser,
  currentTrip,
  selectedDayIndex = 0,
  onOpenSOS,
  className = '',
  defaultExpanded = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const googleMapRef = useRef<any>(null);
  const googleUserMarkerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const zoneLayerRef = useRef<L.LayerGroup | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [mapStyle, setMapStyle] = useState<'voyager' | 'osm' | 'satellite' | 'google_roadmap' | 'google_satellite' | 'dark_heatmap'>('google_roadmap');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedEntityInfo, setSelectedEntityInfo] = useState<any | null>(null);

  // Live Location & GPS state
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    isRealGPS: boolean;
    locationName: string;
  }>(() => {
    // Role-tailored initial center coordinates
    if (role === 'business') {
      return {
        lat: 27.1751,
        lng: 78.0421,
        accuracy: 12,
        isRealGPS: false,
        locationName: 'Taj Ganj Commercial Hub, Agra'
      };
    } else if (role === 'authority') {
      return {
        lat: 28.6562,
        lng: 77.2410,
        accuracy: 10,
        isRealGPS: false,
        locationName: 'ASI Central Heritage Post, Delhi'
      };
    }
    return {
      lat: 30.7020,
      lng: 76.7150,
      accuracy: 15,
      isRealGPS: false,
      locationName: 'Mohali / Chandigarh District'
    };
  });

  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'active' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  // ----------------------------------------------------
  // Location Access / Geolocation Handler
  // ----------------------------------------------------
  // Location Access / Geolocation Handler
  // ----------------------------------------------------
  const handleEnableLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      setGpsStatus('denied');
      return;
    }

    setGpsStatus('locating');
    setErrorMessage(null);

    const onSuccess = (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = Math.round(pos.coords.accuracy);

      const coords = {
        lat,
        lng,
        accuracy,
        isRealGPS: true,
        locationName: 'Live Device Location'
      };

      setUserCoords(coords);
      setIsGpsActive(true);
      setGpsStatus('active');

      // Center Google Map or Leaflet Map
      if (googleMapRef.current && window.google) {
        googleMapRef.current.panTo({ lat, lng });
        googleMapRef.current.setZoom(16);
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
      }

      // Reverse geocode to get actual city / area name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            const shortName = data.address?.suburb || data.address?.city || data.address?.town || data.display_name.split(',')[0];
            setUserCoords(prev => ({
              ...prev,
              locationName: `📍 ${shortName} (Live GPS)`
            }));
          }
        })
        .catch(() => {});
    };

    const onError = (err: GeolocationPositionError) => {
      console.warn('Browser GPS failed/blocked, falling back to IP Geolocation:', err.message);
      
      // Fallback: Fetch location via IP Geolocation API if browser GPS permission is denied or blocked
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(ipData => {
          if (ipData && ipData.latitude && ipData.longitude) {
            const lat = ipData.latitude;
            const lng = ipData.longitude;

            const coords = {
              lat,
              lng,
              accuracy: 300,
              isRealGPS: true,
              locationName: `📍 ${ipData.city || 'Your City'}, ${ipData.region || ''} (Live IP)`
            };

            setUserCoords(coords);
            setIsGpsActive(true);
            setGpsStatus('active');

            if (googleMapRef.current && window.google) {
              googleMapRef.current.panTo({ lat, lng });
              googleMapRef.current.setZoom(14);
            } else if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
            }
          } else {
            setGpsStatus('denied');
          }
        })
        .catch(() => {
          setGpsStatus('denied');
          setErrorMessage('Unable to retrieve GPS. Click "Presets" to pick a city.');
        });
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  };

  // Continuous Position Watching
  useEffect(() => {
    if (!isGpsActive || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords(prev => ({
          ...prev,
          lat,
          lng,
          accuracy: Math.round(pos.coords.accuracy),
          isRealGPS: true,
        }));
      },
      (err) => console.warn('Watch error:', err.message),
      { enableHighAccuracy: false, maximumAge: 5000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isGpsActive]);

  const handleSelectPreset = (preset: LocationPreset) => {
    setUserCoords({
      lat: preset.lat,
      lng: preset.lng,
      accuracy: 10,
      isRealGPS: false,
      locationName: `${preset.name}, ${preset.city}`
    });
    setIsGpsActive(false);
    setGpsStatus('idle');
    setErrorMessage(null);
    setShowPresetDropdown(false);

    if (googleMapRef.current && window.google) {
      googleMapRef.current.panTo({ lat: preset.lat, lng: preset.lng });
      googleMapRef.current.setZoom(15);
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 15, { duration: 1 });
    }
  };

  const handleCenterOnUser = () => {
    if (!userCoords.isRealGPS) {
      handleEnableLocation();
      return;
    }

    if (googleMapRef.current && window.google) {
      googleMapRef.current.panTo({ lat: userCoords.lat, lng: userCoords.lng });
      googleMapRef.current.setZoom(16);
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 16, { duration: 1 });
    }
  };

  // ----------------------------------------------------
  // Role-Specific Map Data Sources
  // ----------------------------------------------------
  
  // 1. Tourist items from current trip
  const touristStops: ItineraryItem[] = useMemo(() => {
    if (!currentTrip || !currentTrip.days) return [];
    const currentDay = currentTrip.days[selectedDayIndex] || currentTrip.days[0];
    return (currentDay?.items || []).filter(i => i.coordinates && i.coordinates.lat && i.coordinates.lng);
  }, [currentTrip, selectedDayIndex]);

  // 2. Business commercial items & footfall clusters near Agra / Taj Ganj / Jaipur
  const businessItems = useMemo(() => {
    return [
      {
        id: 'biz-my-store',
        name: currentUser?.businessName || INITIAL_BUSINESS_PROFILE.name,
        category: 'my_store',
        lat: userCoords.lat + 0.0012,
        lng: userCoords.lng + 0.0018,
        description: 'Your registered storefront & verified partner showcase.',
        footfall: '284 visitors today',
        qualityScore: '94/100 (Tier Gold)',
        isStore: true,
      },
      {
        id: 'hotspot-bus-lot',
        name: 'Tourist Bus Depot & Shuttle Junction',
        category: 'footfall_hotspot',
        lat: userCoords.lat + 0.0035,
        lng: userCoords.lng - 0.0028,
        description: 'High tourist arrival cluster. Peak arrival: 10:30 AM - 1:00 PM.',
        density: 'Very High (180+ pax/hr)',
        potentialReach: 'Primary footfall funnel into your market lane',
      },
      {
        id: 'hotspot-monument-gate',
        name: 'Heritage Monument Promenade Exit',
        category: 'footfall_hotspot',
        lat: userCoords.lat - 0.0025,
        lng: userCoords.lng + 0.0032,
        description: 'Tourists exiting ticketed perimeter looking for crafts, souvenirs & dining.',
        density: 'Peak (240+ pax/hr)',
        potentialReach: 'Direct pedestrian inflow',
      },
      {
        id: 'comp-guild-1',
        name: 'Heritage Silk & Handloom Cooperative',
        category: 'partner_competitor',
        lat: userCoords.lat + 0.0042,
        lng: userCoords.lng + 0.0045,
        description: 'Verified Yatra One partner shop (Textiles & Carpets).',
        rating: '4.7 ★',
        license: 'UP Tourism Approved',
      },
      {
        id: 'comp-guild-2',
        name: 'Agra Marble Carvers Guild',
        category: 'partner_competitor',
        lat: userCoords.lat - 0.0038,
        lng: userCoords.lng - 0.0021,
        description: 'Pietra Dura inlay craft collective.',
        rating: '4.8 ★',
        license: 'Govt Certified',
      }
    ];
  }, [currentUser, userCoords]);

  // 3. Authority heritage checkpoints & live incident reports
  const authorityItems = useMemo(() => {
    return [
      {
        id: 'auth-my-unit',
        name: currentUser?.name ? `${currentUser.name} (Active Patrol)` : 'Patrol Unit #04',
        category: 'command_unit',
        lat: userCoords.lat,
        lng: userCoords.lng,
        description: 'Active enforcement officer station & field terminal.',
        badge: currentUser?.officerBadgeId || 'ASI-FLD-992',
        department: currentUser?.department || 'Archaeological Survey of India',
      },
      {
        id: 'asi-buffer-1',
        name: 'Taj Mahal / Red Fort 300m Heritage Buffer',
        category: 'heritage_buffer',
        lat: userCoords.lat + 0.0025,
        lng: userCoords.lng + 0.0035,
        description: '100m Prohibited Zone + 200m Regulated Zone under AMASR Act 1958.',
        status: 'Buffer Active: Strict Zero-Construction Enforced',
        prohibitedRadiusMeters: 100,
        regulatedRadiusMeters: 300,
      },
      {
        id: 'police-booth-01',
        name: 'Tourism Assistance Police Booth #2',
        category: 'police_booth',
        lat: userCoords.lat - 0.0028,
        lng: userCoords.lng - 0.0034,
        description: 'Stationed personnel: 2 Sub-Inspectors + Tourist Assistance Desk.',
        contact: '112 / 1363 (Tourist Helpline)',
        status: 'Operational 24x7',
      },
      {
        id: 'crowd-sensor-01',
        name: 'Entry Turnstile Automated Sensor Array',
        category: 'crowd_sensor',
        lat: userCoords.lat + 0.0032,
        lng: userCoords.lng - 0.0015,
        description: 'Turnstile live velocity: 42 entries/min. Flow index: Green (Normal).',
        capacityPct: '68% of maximum throughput',
        status: 'Optimal',
      }
    ];
  }, [currentUser, userCoords]);

  // ----------------------------------------------------
  // Leaflet Map Initialization & Rendering
  // ----------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Priority 1: Official Google Maps JavaScript API Engine
      if (window.google && window.google.maps) {
        try {
          const mapType = mapStyle === 'google_satellite' || mapStyle === 'satellite' ? 'satellite' : 'roadmap';
          const gmap = new window.google.maps.Map(mapContainerRef.current, {
            center: { lat: userCoords.lat, lng: userCoords.lng },
            zoom: 15,
            mapTypeId: mapType,
            mapTypeControl: true,
            streetViewControl: true,
            zoomControl: true,
            fullscreenControl: true,
          });

          googleMapRef.current = gmap;

          // User location marker on Google Map
          new window.google.maps.Marker({
            position: { lat: userCoords.lat, lng: userCoords.lng },
            map: gmap,
            title: userCoords.locationName,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#0284C7',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          });

          return;
        } catch (e) {
          console.warn('Google Maps SDK init warning, falling back to tile layer:', e);
        }
      }

      // Priority 2: Tile Layer Map (Google tile endpoints)
      const map = L.map(mapContainerRef.current, {
        center: [userCoords.lat, userCoords.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Tile layer (supports Google Maps API tiles & Dark Heatmap mode)
      let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      let maxZoom = 19;
      if (mapStyle === 'osm') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      } else if (mapStyle === 'satellite' || mapStyle === 'google_satellite') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      } else if (mapStyle === 'google_roadmap') {
        tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      } else if (mapStyle === 'dark_heatmap') {
        tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      }

      L.tileLayer(tileUrl, { maxZoom, subdomains: 'abcd' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; Google Maps API')
        .addTo(map);

      const zoneLayer = L.layerGroup().addTo(map);
      zoneLayerRef.current = zoneLayer;

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Render content
      renderMarkers(map, markersLayer, zoneLayer);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapStyle, isExpanded]);

  // Update markers when data changes (supports both Google Maps SDK and Leaflet)
  useEffect(() => {
    if (googleMapRef.current && window.google && window.google.maps) {
      googleMapRef.current.panTo({ lat: userCoords.lat, lng: userCoords.lng });

      if (googleUserMarkerRef.current) {
        googleUserMarkerRef.current.setMap(null);
      }

      googleUserMarkerRef.current = new window.google.maps.Marker({
        position: { lat: userCoords.lat, lng: userCoords.lng },
        map: googleMapRef.current,
        title: `📍 ${userCoords.locationName}`,
        zIndex: 99999,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#0284C7',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        }
      });
    }

    if (mapInstanceRef.current && markersLayerRef.current && zoneLayerRef.current) {
      renderMarkers(mapInstanceRef.current, markersLayerRef.current, zoneLayerRef.current);
    }
  }, [userCoords, role, touristStops, businessItems, authorityItems, activeFilter]);

  // Master marker renderer
  const renderMarkers = (map: L.Map, markersLayer: L.LayerGroup, zoneLayer: L.LayerGroup) => {
    markersLayer.clearLayers();
    zoneLayer.clearLayers();

    // 1. Live User Location Pin with Animated Pulse Ring
    const userRoleColor = role === 'tourist' ? '#0284C7' : role === 'business' ? '#059669' : '#E11D48';
    const userRoleLabel = role === 'tourist' ? 'You (Traveler)' : role === 'business' ? 'You (Merchant)' : 'You (Officer)';

    const userPulseHtml = `
      <div class="relative flex items-center justify-center" style="transform: translate(-50%, -50%);">
        <div class="absolute w-12 h-12 rounded-full gps-radar-pulse" style="background-color: ${userRoleColor}33;"></div>
        <div class="w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white" style="background-color: ${userRoleColor};">
          <div class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
        </div>
        <div class="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-lg bg-[#191715]/90 text-white text-[10px] font-black shadow-md border border-white/20 pointer-events-none">
          ${userCoords.isRealGPS ? `📍 ${userRoleLabel} • GPS` : `📍 ${userRoleLabel}`}
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'dashboard-user-marker',
      html: userPulseHtml,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    L.marker([userCoords.lat, userCoords.lng], { 
      icon: userIcon,
      zIndexOffset: 1000 
    })
      .addTo(markersLayer)
      .on('click', () => {
        setSelectedEntityInfo({
          type: 'user',
          title: userCoords.locationName,
          subtitle: `${userCoords.isRealGPS ? 'Verified Real-Time GPS' : 'Calibrated Location'} (${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E)`,
          details: `Accuracy radius: ±${userCoords.accuracy} meters. Location coordinates mapped and calibrated.`,
          badge: userCoords.isRealGPS ? 'Real GPS Active' : 'Calibrated Device',
          badgeColor: 'bg-emerald-600',
        });
      });

    // Accuracy Circle
    L.circle([userCoords.lat, userCoords.lng], {
      radius: Math.max(userCoords.accuracy, 25),
      color: userRoleColor,
      weight: 1.5,
      fillColor: userRoleColor,
      fillOpacity: 0.12
    }).addTo(zoneLayer);

    // 2. Render Role-Specific Markers
    if (role === 'tourist') {
      touristStops.forEach((item) => {
        if (!item.coordinates) return;
        const distKm = calculateDistanceKm(userCoords.lat, userCoords.lng, item.coordinates.lat, item.coordinates.lng);
        const distFormatted = formatDistance(distKm * 1000);

        const stopHtml = `
          <div class="cursor-pointer group" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#191715] border border-[#EAE5DC] shadow-lg hover:scale-105 hover:border-[#C84B31] transition-all">
              <span class="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span class="text-xs font-black truncate max-w-[120px]">${item.title}</span>
              <span class="text-[10px] text-[#665E55] font-semibold">(${distFormatted})</span>
            </div>
          </div>
        `;

        const stopIcon = L.divIcon({
          className: 'tourist-stop-marker',
          html: stopHtml,
          iconSize: [160, 36],
          iconAnchor: [80, 36]
        });

        L.marker([item.coordinates.lat, item.coordinates.lng], { icon: stopIcon })
          .addTo(markersLayer)
          .on('click', () => {
            setSelectedEntityInfo({
              type: 'tourist_stop',
              title: item.title,
              subtitle: `${item.category} • ${distFormatted} from your location`,
              details: item.description,
              tip: item.touristTip,
              cost: item.cost === 0 ? 'Free Entry' : `₹${item.cost}`,
              coords: item.coordinates,
              badge: 'Itinerary Stop',
              badgeColor: 'bg-[#C84B31]',
            });
          });
      });
    } else if (role === 'business') {
      businessItems.forEach((bItem) => {
        const isStore = bItem.category === 'my_store';
        const isHotspot = bItem.category === 'footfall_hotspot';

        if (isHotspot) {
          // Footfall Hotspot circle radius
          L.circle([bItem.lat, bItem.lng], {
            radius: 120,
            color: '#D97706',
            weight: 1,
            fillColor: '#F59E0B',
            fillOpacity: 0.2
          }).addTo(zoneLayer);
        }

        const bHtml = `
          <div class="cursor-pointer group" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-lg transition-all border ${
              isStore 
                ? 'bg-[#064E3B] text-white border-[#34D399] ring-2 ring-[#059669]/40 scale-105'
                : isHotspot
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                : 'bg-white text-[#191715] border-[#EAE5DC]'
            }">
              <span>${isStore ? '🏪' : isHotspot ? '👥' : '🏬'}</span>
              <span class="truncate max-w-[140px]">${bItem.name}</span>
            </div>
          </div>
        `;

        const bIcon = L.divIcon({
          className: 'business-map-marker',
          html: bHtml,
          iconSize: [180, 36],
          iconAnchor: [90, 36]
        });

        L.marker([bItem.lat, bItem.lng], { icon: bIcon })
          .addTo(markersLayer)
          .on('click', () => {
            setSelectedEntityInfo({
              type: 'business',
              title: bItem.name,
              subtitle: bItem.description,
              details: bItem.potentialReach || bItem.footfall || bItem.license || '',
              badge: isStore ? 'Your Business' : isHotspot ? 'Footfall Hotspot' : 'Verified Partner',
              badgeColor: isStore ? 'bg-[#059669]' : isHotspot ? 'bg-[#D97706]' : 'bg-[#0284C7]',
            });
          });
      });
    } else if (role === 'authority') {
      authorityItems.forEach((aItem) => {
        const isBuffer = aItem.category === 'heritage_buffer';
        const isUnit = aItem.category === 'command_unit';

        if (isBuffer && aItem.prohibitedRadiusMeters) {
          // ASI 100m Prohibited Zone (Red)
          L.circle([aItem.lat, aItem.lng], {
            radius: aItem.prohibitedRadiusMeters,
            color: '#DC2626',
            weight: 2,
            fillColor: '#EF4444',
            fillOpacity: 0.18
          }).addTo(zoneLayer);

          // ASI 200m Regulated Zone (Amber)
          L.circle([aItem.lat, aItem.lng], {
            radius: aItem.regulatedRadiusMeters,
            color: '#D97706',
            weight: 1.5,
            fillColor: '#F59E0B',
            fillOpacity: 0.08,
            dashArray: '5, 5'
          }).addTo(zoneLayer);
        }

        const aHtml = `
          <div class="cursor-pointer group" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-lg transition-all border ${
              isUnit
                ? 'bg-[#881337] text-white border-[#FDA4AF] ring-2 ring-[#E11D48]/40'
                : isBuffer
                ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                : 'bg-white text-[#191715] border-[#EAE5DC]'
            }">
              <span>${isUnit ? '👮' : isBuffer ? '🏛️' : '📡'}</span>
              <span class="truncate max-w-[140px]">${aItem.name}</span>
            </div>
          </div>
        `;

        const aIcon = L.divIcon({
          className: 'authority-map-marker',
          html: aHtml,
          iconSize: [180, 36],
          iconAnchor: [90, 36]
        });

        L.marker([aItem.lat, aItem.lng], { icon: aIcon })
          .addTo(markersLayer)
          .on('click', () => {
            setSelectedEntityInfo({
              type: 'authority',
              title: aItem.name,
              subtitle: aItem.description,
              details: aItem.status || aItem.department || aItem.contact || '',
              badge: isUnit ? 'Field Patrol' : isBuffer ? 'ASI Buffer Zone' : 'Telemetry Station',
              badgeColor: isUnit ? 'bg-[#E11D48]' : 'bg-[#D97706]',
            });
          });
      });

      // Also render heritage incident markers from ecosystem data
      AUTHORITY_HERITAGE_REPORTS.forEach((report) => {
        if (!report.coordinates) return;

        const isCritical = report.severity === 'critical';
        const reportHtml = `
          <div class="cursor-pointer group" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black shadow-md border ${
              isCritical
                ? 'bg-[#991B1B] text-white border-red-300 animate-bounce'
                : 'bg-[#FFFBEB] text-[#92400E] border-amber-300'
            }">
              <span>⚠️</span>
              <span class="truncate max-w-[120px]">${report.siteName.split('-')[0]}</span>
            </div>
          </div>
        `;

        const reportIcon = L.divIcon({
          className: 'incident-map-marker',
          html: reportHtml,
          iconSize: [160, 32],
          iconAnchor: [80, 32]
        });

        L.marker([report.coordinates.lat, report.coordinates.lng], { icon: reportIcon })
          .addTo(markersLayer)
          .on('click', () => {
            setSelectedEntityInfo({
              type: 'incident',
              title: report.siteName,
              subtitle: `Reported: ${report.timestamp} by ${report.reportedBy}`,
              details: report.description,
              action: report.actionTaken || 'Pending field unit inspection',
              badge: `${report.severity.toUpperCase()} INCIDENT`,
              badgeColor: isCritical ? 'bg-red-700' : 'bg-amber-600',
            });
          });
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Top Section Header & Location Access Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${
                role === 'tourist' 
                  ? 'bg-[#E0F2FE] text-[#0284C7]' 
                  : role === 'business'
                  ? 'bg-[#D1FAE5] text-[#059669]'
                  : 'bg-[#FFE4E6] text-[#E11D48]'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {role === 'tourist' 
                    ? 'Interactive Itinerary & Heritage Map' 
                    : role === 'business'
                    ? 'Commercial Footfall Radar & Merchant Map'
                    : 'Geographic Telemetry & ASI Heritage Map'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#ECFDF5] text-[#047857] text-[11px] font-bold border border-[#A7F3D0]">
                <span>Google Maps Connected ✅</span>
              </span>

              {isGpsActive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span>GPS Tracking Live</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#191715]">
              {role === 'tourist' 
                ? 'Your Live Location & Sights Explorer' 
                : role === 'business'
                ? 'Storefront Location & Footfall Density Radar'
                : 'Command Post & Protected Heritage Perimeters'}
            </h2>

            <p className="text-xs sm:text-sm text-[#665E55]">
              {role === 'tourist'
                ? 'Enable GPS to track your real-time position, see distances to monuments, fair-price stalls, and find nearby emergency police booths.'
                : role === 'business'
                ? 'Pinpoint your shop on the verified merchant grid, observe tourist flow corridors, and track active visitor density in your district.'
                : 'Monitor ASI 100m prohibited and 200m regulated buffer rings, field inspection unit positions, and live crowd telemetry.'}
            </p>
          </div>

          {/* Primary Action Buttons: Enable Location Access & Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            
            {/* Enable Location Access Button */}
            <button
              id="enable-location-access-btn"
              onClick={handleEnableLocation}
              disabled={gpsStatus === 'locating'}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isGpsActive
                  ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                  : gpsStatus === 'locating'
                  ? 'bg-[#EAE5DC] text-[#665E55] cursor-wait'
                  : 'bg-[#191715] text-white hover:bg-[#C84B31]'
              }`}
              title="Request device GPS location to map your real-time coordinates"
            >
              {gpsStatus === 'locating' ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Acquiring GPS...</span>
                </>
              ) : isGpsActive ? (
                <>
                  <LocateFixed className="w-4 h-4 animate-pulse" />
                  <span>GPS Connected (±{userCoords.accuracy}m)</span>
                </>
              ) : (
                <>
                  <Locate className="w-4 h-4" />
                  <span>Enable Location Access</span>
                </>
              )}
            </button>

            {/* Center on My Location Button */}
            <button
              id="center-user-location-btn"
              onClick={handleCenterOnUser}
              className="px-3 py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#EAE5DC] border border-[#EAE5DC] text-[#191715] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Recenter map to your location"
            >
              <Compass className="w-4 h-4 text-[#C84B31]" />
              <span className="hidden sm:inline">Center Me</span>
            </button>

            {/* Test Location Presets Dropdown (for quick testing / when GPS denied) */}
            <div className="relative">
              <button
                id="preset-location-selector-btn"
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="px-3 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EAE5DC] text-[#665E55] hover:text-[#191715] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Simulate location in iconic Indian cities"
              >
                <span>Presets</span>
                <span className="text-[10px] text-[#C84B31]">▼</span>
              </button>

              {showPresetDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EAE5DC] py-2 z-50 text-left animate-in fade-in">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8C827A] uppercase tracking-wider border-b border-[#F0ECE4]">
                    Simulate Location on Map
                  </div>
                  {FAMOUS_LOCATION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#FAF8F5] transition-colors flex flex-col cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[#191715]">{preset.name}</span>
                      <span className="text-[10px] text-[#665E55]">{preset.city} • {preset.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map Layer Style Selector Pills */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-2xl border border-[#EAE5DC] text-xs font-bold gap-1">
              <button
                onClick={() => setMapStyle('dark_heatmap')}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mapStyle === 'dark_heatmap' ? 'bg-[#0B132B] text-cyan-300 shadow-sm' : 'text-[#665E55] hover:text-[#191715]'
                }`}
                title="Neon Cyan Glowing Heatmap Theme"
              >
                🌙 Neon Heatmap
              </button>
              <button
                onClick={() => setMapStyle('google_roadmap')}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mapStyle === 'google_roadmap' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#665E55] hover:text-[#191715]'
                }`}
                title="Google Maps Roadmap View"
              >
                🗺️ Google Map
              </button>
              <button
                onClick={() => setMapStyle('google_satellite')}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mapStyle === 'google_satellite' ? 'bg-[#1E1B4B] text-white shadow-sm' : 'text-[#665E55] hover:text-[#191715]'
                }`}
                title="Google Maps Satellite Imagery"
              >
                🛰️ Satellite
              </button>
            </div>

            {/* Fullscreen Expand Button */}
            <button
              id="expand-map-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EAE5DC] text-[#191715] transition-all shadow-2xs cursor-pointer"
              title={isExpanded ? 'Collapse Map' : 'Expand Fullscreen Map'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Live Location Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2.5 h-2.5 rounded-full ${userCoords.isRealGPS ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
            <div className="font-bold text-[#191715] truncate">
              {userCoords.locationName}
            </div>
            <span className="text-[#8C827A] hidden sm:inline">•</span>
            <div className="font-mono text-[#665E55] text-[11px] hidden sm:inline">
              {userCoords.lat.toFixed(5)}°N, {userCoords.lng.toFixed(5)}°E
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#665E55]">
              Accuracy: <strong>±{userCoords.accuracy} meters</strong>
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
              userCoords.isRealGPS ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEF3C7] text-[#92400E]'
            }`}>
              {userCoords.isRealGPS ? 'Hardware GPS' : 'Calibrated Pin'}
            </span>
          </div>
        </div>

        {/* Error / Permission Guidance Banner if blocked */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#EF4444] mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Location Permission Note:</span> {errorMessage}
            </div>
          </div>
        )}

      </div>

      {/* Map Canvas Container with Floating Controls & Detail Card */}
      <div className={`relative bg-white rounded-3xl border border-[#EAE5DC] shadow-sm overflow-hidden transition-all duration-300 ${
        isExpanded ? 'h-[75vh]' : 'h-[500px]'
      }`}>
        
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Tile Style Switcher (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-[#EAE5DC] p-1 shadow-md">
          {[
            { id: 'voyager', label: 'Clean' },
            { id: 'osm', label: 'Street' },
            { id: 'satellite', label: 'Satellite' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setMapStyle(style.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mapStyle === style.id
                  ? 'bg-[#191715] text-white shadow-xs'
                  : 'text-[#665E55] hover:text-[#191715]'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Floating Zoom & Locate Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE5DC] text-[#191715] shadow-md hover:bg-[#FAF8F5] transition-all flex items-center justify-center cursor-pointer font-black"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE5DC] text-[#191715] shadow-md hover:bg-[#FAF8F5] transition-all flex items-center justify-center cursor-pointer font-black"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleCenterOnUser}
            className="w-10 h-10 rounded-2xl bg-[#0284C7] text-white shadow-md hover:bg-[#0369A1] transition-all flex items-center justify-center cursor-pointer font-black"
            title="Recenter on My Location"
          >
            <LocateFixed className="w-4 h-4" />
          </button>

        </div>

        {/* Role-Specific Legend & Quick Overlays (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-[#EAE5DC] p-3 shadow-lg space-y-1.5 hidden sm:block">
          <div className="text-[11px] font-extrabold text-[#191715] uppercase tracking-wider flex items-center justify-between">
            <span>{role === 'tourist' ? 'Explorer Legend' : role === 'business' ? 'Commercial Zones' : 'Heritage & Telemetry'}</span>
            <span className="text-[10px] text-[#8C827A]">Live Map</span>
          </div>

          <div className="space-y-1 text-xs text-[#524B43]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0284C7] border border-white shrink-0" />
              <span>Your Live Device Position</span>
            </div>

            {role === 'tourist' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] shrink-0" />
                  <span>Day Itinerary Stops & Cultural Sights</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#C84B31] shrink-0" />
                  <span>Fair-Price Stalls & Verified Food</span>
                </div>
              </>
            )}

            {role === 'business' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#064E3B] shrink-0" />
                  <span>Your Storefront Pin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-70 shrink-0" />
                  <span>Tourist Footfall Congestion Hotspot</span>
                </div>
              </>
            )}

            {role === 'authority' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444] opacity-50 shrink-0" />
                  <span>ASI 100m Prohibited Perimeter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-50 shrink-0" />
                  <span>ASI 200m Regulated Perimeter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#991B1B] shrink-0" />
                  <span>Active Incident Dispatches</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interactive Selected Location Card (Bottom Right Drawer) */}
        {selectedEntityInfo && (
          <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white rounded-2xl border border-[#EAE5DC] shadow-2xl p-4 animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`inline-flex text-[10px] font-black uppercase px-2 py-0.5 rounded-md text-white mb-1 ${selectedEntityInfo.badgeColor || 'bg-[#191715]'}`}>
                  {selectedEntityInfo.badge}
                </span>
                <h4 className="text-sm font-black text-[#191715] leading-snug">
                  {selectedEntityInfo.title}
                </h4>
                <div className="text-xs text-[#665E55] mt-0.5">
                  {selectedEntityInfo.subtitle}
                </div>
              </div>

              <button
                onClick={() => setSelectedEntityInfo(null)}
                className="text-[#8C827A] hover:text-[#191715] p-1 rounded-lg hover:bg-[#FAF8F5] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedEntityInfo.details && (
              <p className="text-xs text-[#443F38] mt-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE5DC] leading-relaxed">
                {selectedEntityInfo.details}
              </p>
            )}

            {selectedEntityInfo.tip && (
              <div className="text-[11px] text-[#059669] font-semibold mt-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Tip: {selectedEntityInfo.tip}</span>
              </div>
            )}

            {selectedEntityInfo.action && (
              <div className="text-[11px] text-[#D97706] font-semibold mt-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Action: {selectedEntityInfo.action}</span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
