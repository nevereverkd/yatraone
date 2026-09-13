import React, { useState } from 'react';
import { 
  AlertOctagon, 
  X, 
  MapPin, 
  Clock, 
  Send, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  MessageSquare, 
  Camera, 
  Accessibility, 
  Car, 
  Building2, 
  AlertTriangle 
} from 'lucide-react';
import { SOSIncident } from '../../types/trustEngine';

interface GlobalSOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSOS: (incident: SOSIncident) => void;
  initialCategory?: string;
}

export const GlobalSOSModal: React.FC<GlobalSOSModalProps> = ({
  isOpen,
  onClose,
  onBroadcastSOS,
  initialCategory = 'safety_emergency'
}) => {
  const [category, setCategory] = useState<SOSIncident['category']>(
    (initialCategory as any) || 'safety_emergency'
  );
  const [city, setCity] = useState('Delhi');
  const [location, setLocation] = useState('Current GPS Location (28.6431° N, 77.2197° E)');
  const [notes, setNotes] = useState('');
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchedTicket, setDispatchedTicket] = useState<SOSIncident | null>(null);
  const [etaSeconds, setEtaSeconds] = useState(300); // 5 mins countdown

  if (!isOpen) return null;

  const categories = [
    { id: 'safety_emergency', label: 'Physical Danger / Medical', icon: AlertOctagon, color: 'text-[#E11D48] bg-[#FFF1F2] border-[#FECDD3]' },
    { id: 'overcharging', label: 'Scam / Extortion Dispute', icon: AlertTriangle, color: 'text-[#EA580C] bg-[#FFF7ED] border-[#FFEDD5]' },
    { id: 'transport_scam', label: 'Auto / Taxi Harassment', icon: Car, color: 'text-[#0284C7] bg-[#F0F9FF] border-[#BAE6FD]' },
    { id: 'hotel_issue', label: 'Hotel Safety / Fraud', icon: Building2, color: 'text-[#7C3AED] bg-[#F5F3FF] border-[#DDD6FE]' },
    { id: 'accessibility_need', label: 'Accessibility / Wheelchair Help', icon: Accessibility, color: 'text-[#0D9488] bg-[#F0FDFA] border-[#CCFBF1]' },
    { id: 'other', label: 'Lost / General Assistance', icon: Radio, color: 'text-[#5A524C] bg-[#FAF8F5] border-[#EAE5DC]' }
  ];

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: SOSIncident = {
      id: `SOS-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      city,
      location,
      timestamp: 'Just now',
      status: 'dispatched',
      notes: notes || 'Immediate tourist safety dispatch requested.',
      policeUnitAssigned: `${city} Tourist Police Mobile Squad #${Math.floor(1 + Math.random() * 8)}`,
      estimatedArrivalMinutes: 5
    };

    setDispatchedTicket(newIncident);
    setIsDispatched(true);
    onBroadcastSOS(newIncident);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#FECDD3] animate-in fade-in zoom-in-95">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                PRD 4.2 • Rapid Response Safety Layer
              </div>
              <h2 className="text-lg font-black tracking-tight">Tourist Emergency SOS</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {!isDispatched ? (
            <form onSubmit={handleTriggerSOS} className="space-y-4">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-[#1F1C18] mb-1.5">
                  Select Incident Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#E11D48] bg-[#FFF1F2] ring-2 ring-[#E11D48]/30 font-bold' 
                            : 'border-[#EAE5DC] bg-[#FAF8F5] hover:bg-white text-[#5A524C]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${cat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs leading-tight line-clamp-2">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City and Location */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#1F1C18] mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#1F1C18]"
                  >
                    <option value="Delhi">Delhi</option>
                    <option value="Agra">Agra</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Varanasi">Varanasi</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#1F1C18] mb-1">Location Details</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#E11D48] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1F1C18] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Notes / Evidence */}
              <div>
                <label className="block text-xs font-bold text-[#1F1C18] mb-1">
                  Situation / Evidence Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Unregistered taxi driver refusing to stop / tout demanding cash for funeral wood / trapped without ramp..."
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-2.5 text-xs text-[#1F1C18] focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Instant Action Button */}
              <button
                type="submit"
                id="broadcast-sos-confirm-btn"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-sm font-black tracking-wide shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>BROADCAST SOS TO TOURIST POLICE & AUTHORITY</span>
              </button>
            </form>
          ) : (
            /* Dispatched Active Screen */
            <div className="space-y-4 text-center animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#ECFDF5] text-[#065F46] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                  DISPATCH CONFIRMED
                </span>
                <h3 className="text-xl font-black text-[#1F1C18] mt-1.5">
                  Authority Units Alerted
                </h3>
                <p className="text-xs text-[#5A524C] mt-0.5">
                  Assigned: <strong>{dispatchedTicket?.policeUnitAssigned}</strong>
                </p>
              </div>

              {/* Status Box */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EAE5DC] text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Emergency Ticket:</span>
                  <span className="font-bold text-[#E11D48]">{dispatchedTicket?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Estimated ETA:</span>
                  <span className="font-bold text-[#10B981]">~4-6 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">GPS Broadcast:</span>
                  <span className="font-bold text-[#1F1C18] truncate max-w-[200px]">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Authority Desk:</span>
                  <span className="font-bold text-[#1F1C18]">{city} Tourist Police Control</span>
                </div>
              </div>

              {/* Simulated Offline SMS Fallback Preview */}
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] p-3 rounded-2xl text-left text-[11px] text-[#0369A1] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Offline SMS Gateway Backup (PRD Simulation)</span>
                </div>
                <p className="font-mono text-[10px] bg-white p-2 rounded-lg border border-[#E0F2FE]">
                  "SOS {dispatchedTicket?.id} | LOC: {city} | CAT: {category} | TIME: {new Date().toLocaleTimeString()} | HELP SENT TO 112 & 1363"
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1F1C18] hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
              >
                Keep Monitor Active & Close Dialog
              </button>
            </div>
          )}

          {/* Quick Helplines Call Ribbon */}
          <div className="pt-2 border-t border-[#F0ECE4]">
            <div className="text-[11px] font-bold text-[#8C827A] mb-2 uppercase tracking-wider">
              Direct Emergency Helplines (Toll-Free 24/7)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="tel:112"
                className="p-2 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-center hover:bg-[#FFE4E6] transition-colors"
              >
                <span className="text-xs font-black text-[#E11D48] block">112</span>
                <span className="text-[9px] text-[#9F1239] block font-medium">National Police</span>
              </a>

              <a
                href="tel:1363"
                className="p-2 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5] text-center hover:bg-[#FFEDD5] transition-colors"
              >
                <span className="text-xs font-black text-[#EA580C] block">1363</span>
                <span className="text-[9px] text-[#9A3412] block font-medium">Tourist Infoline</span>
              </a>

              <a
                href="tel:139"
                className="p-2 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-center hover:bg-[#E0F2FE] transition-colors"
              >
                <span className="text-xs font-black text-[#0284C7] block">139</span>
                <span className="text-[9px] text-[#075985] block font-medium">RailMadad</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
