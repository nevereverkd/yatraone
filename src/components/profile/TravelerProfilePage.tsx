import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  Heart, 
  MapPin, 
  Calendar, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  Save, 
  Download, 
  Compass, 
  Activity, 
  Accessibility, 
  Languages, 
  Utensils, 
  CreditCard,
  QrCode,
  Share2,
  FileText,
  Clock,
  Briefcase,
  Camera,
  Train,
  Check
} from 'lucide-react';

import { Trip } from '../../types/travel';
import { AuthUser } from '../../types/auth';
import { LogOut, ArrowRightLeft } from 'lucide-react';
import { MainNavTab } from '../BottomNavBar';
import { CulturalDiscoveryHub } from '../discovery/CulturalDiscoveryHub';
import { IndianTimeWidget } from '../common/IndianTimeWidget';

interface TravelerProfileProps {
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
  onOpenSOS: () => void;
  onNavigateToItinerary: () => void;
  onSelectTab?: (tab: MainNavTab) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
}

export const TravelerProfilePage: React.FC<TravelerProfileProps> = ({
  accessibilityMode,
  onToggleAccessibility,
  onOpenSOS,
  onNavigateToItinerary,
  onSelectTab,
  currentUser,
  onLogout,
  onSwitchAccount,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'safety' | 'contributions' | 'card' | 'toolkits'>('profile');

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser?.name || 'Arjun Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'arjun.sharma@traveler.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [nationality, setNationality] = useState('India (Domestic Tourist)');
  const [homeCity, setHomeCity] = useState('New Delhi, NCR');
  const [travelerStyle, setTravelerStyle] = useState('Cultural Explorer & Solo Backpacker');
  const [dietaryPref, setDietaryPref] = useState('Vegetarian (Eggitarian OK)');
  const [primaryLang, setPrimaryLang] = useState('English & Hindi');
  const [bio, setBio] = useState('Exploring historic circuits of North India. Passionate about handloom GI textiles, Mughal architecture, clean street food spots, and accessible heritage monuments.');

  // Safety & ICE States
  const [emergencyContactName, setEmergencyContactName] = useState('Rajesh Sharma (Father)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98111 22334');
  const [bloodGroup, setBloodGroup] = useState('B+ Positive');
  const [medicalNotes, setMedicalNotes] = useState('Penicillin allergy; Mild asthma (carries inhaler)');
  const [autoShareLocation, setAutoShareLocation] = useState(true);
  const [smsSosEnabled, setSmsSosEnabled] = useState(true);

  // Notifications / Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Traveler profile updated and securely synchronized with local storage.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner: Profile Header & KYC Badges */}
      <div className="bg-gradient-to-r from-[#1F1C18] via-[#2A241E] to-[#1F1C18] text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-[#3E3831] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#FF6F59]/15 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            {/* Profile Avatar */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Traveler Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-3 border-white/20 shadow-md ring-2 ring-[#FF6F59]"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] rounded-full border-2 border-[#1F1C18] flex items-center justify-center text-white" title="Verified Traveler">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            {/* Traveler Bio / Meta */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>DigiYatra & KYC Verified</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#D5CECE]">
                {travelerStyle} • Based in {homeCity}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#A8A096]">
                <span className="flex items-center gap-1 text-[#FFA07A]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{nationality}</span>
                </span>
                <span>•</span>
                <span>ID: BY-IND-2026-849</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setActiveSubTab('card')}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#FFA07A]" />
              <span>Digital Travel ID</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-[#991B1B]/80 hover:bg-[#991B1B] text-white text-xs font-bold rounded-xl border border-[#EF4444]/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Sign out from this account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}

            <button
              onClick={onOpenSOS}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer animate-pulse"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Travel Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[#A8A096] text-[11px] block">Community Trust Score</span>
            <span className="text-xl font-black text-[#10B981] font-mono mt-0.5 block">98 / 100</span>
            <span className="text-[10px] text-[#D5CECE]">Honest price reporter</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[#A8A096] text-[11px] block">Karma Tokens Earned</span>
            <span className="text-xl font-black text-[#FFA07A] font-mono mt-0.5 block">480 🪙</span>
            <span className="text-[10px] text-[#D5CECE]">Redeemable for audio guides</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[#A8A096] text-[11px] block">Indian Circuits Visited</span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">4 Cities</span>
            <span className="text-[10px] text-[#D5CECE]">Delhi, Agra, Varanasi, Jaipur</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[#A8A096] text-[11px] block">Heritage Monuments</span>
            <span className="text-xl font-black text-[#38BDF8] font-mono mt-0.5 block">14 Sites</span>
            <span className="text-[10px] text-[#D5CECE]">ASI verified badge holder</span>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-white/10">
          {[
            { id: 'profile', label: '1. Traveler Details & Settings', icon: User },
            { id: 'safety', label: '2. Safety & ICE Emergency Profile', icon: AlertOctagon },
            { id: 'contributions', label: '3. Community Fair Price Contributions', icon: Award },
            { id: 'card', label: '4. Tourist Emergency Card', icon: QrCode },
            { id: 'toolkits', label: '5. Living Toolkits & Cultural Guides', icon: Compass },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6F59] text-white shadow-sm'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: TRAVELER DETAILS & SETTINGS */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#1F1C18]">Traveler Information & Cultural Preferences</h2>
              <p className="text-xs text-[#8C827A]">Used by AI Trip Planner, verified local guides, and hotel booking engine</p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#FF6F59] hover:bg-[#E85C46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Full Legal Name (as on Passport / Aadhaar)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Nationality / Traveler Category</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Home City & State</label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Traveler Profile & Persona</label>
              <select
                value={travelerStyle}
                onChange={(e) => setTravelerStyle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              >
                <option value="Solo Female Explorer">Solo Female Explorer</option>
                <option value="Cultural Explorer & Solo Backpacker">Cultural Explorer & Solo Backpacker</option>
                <option value="Family with Children">Family with Children</option>
                <option value="Senior Citizen Traveler">Senior Citizen Traveler</option>
                <option value="Accessible / Wheelchair Traveler">Accessible / Wheelchair Traveler</option>
                <option value="International Heritage Tourist">International Heritage Tourist</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Dietary Preferences (For Food Safety & Halwai tips)</label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              >
                <option value="Pure Vegetarian (Lacto-Vegetarian)">Pure Vegetarian (Lacto-Vegetarian)</option>
                <option value="Jain Vegetarian (No Onion, No Garlic, No Root Veg)">Jain Vegetarian (No Onion, No Garlic, No Root Veg)</option>
                <option value="Vegetarian (Eggitarian OK)">Vegetarian (Eggitarian OK)</option>
                <option value="Non-Vegetarian (Mughlai & Regional Fish/Meat)">Non-Vegetarian (Mughlai & Regional Fish/Meat)</option>
                <option value="Halal Certified Only">Halal Certified Only</option>
                <option value="Vegan & Plant Based">Vegan & Plant Based</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Preferred Languages for Guides & Audio</label>
              <input
                type="text"
                value={primaryLang}
                onChange={(e) => setPrimaryLang(e.target.value)}
                placeholder="e.g. English, Hindi, French, Spanish"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F1C18] mb-1 text-xs">Traveler Bio & Exploration Goals</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-3 text-xs text-[#1F1C18] font-medium"
            />
          </div>

          {/* Accessibility Settings in Profile (PRD 4.5) */}
          <div className="p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0369A1]">
                <Accessibility className="w-4 h-4" />
                <span>Sugamya Bharat Accessible Tourism Mode</span>
              </div>
              <p className="text-[#0284C7]">
                Always display wheelchair ramps, step-free ASI monument gates, and station porter assistance across all itinerary stops.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleAccessibility}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                accessibilityMode
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-white text-[#0369A1] border border-[#BAE6FD] hover:bg-[#E0F2FE]'
              }`}
            >
              {accessibilityMode ? 'Enabled ✓' : 'Enable Mode'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onNavigateToItinerary}
              className="text-xs font-bold text-[#FF6F59] hover:underline flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Back to Active Itinerary</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1F1C18] hover:bg-[#332E27] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: SAFETY & ICE EMERGENCY PROFILE */}
      {activeSubTab === 'safety' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#1F1C18]">In Case of Emergency (ICE) & Safety Config</h2>
              <p className="text-xs text-[#8C827A]">Directly injected into Tourist Police SOS broadcasts when emergency triggers</p>
            </div>

            <span className="px-3 py-1 rounded-xl bg-[#FFF1F2] text-[#E11D48] text-xs font-bold border border-[#FECDD3] flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>PRD 4.2 Integrated</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Primary Emergency Contact (ICE Name & Relation) *</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Emergency Contact Phone Number *</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F1C18] mb-1">Key Medical Notes & Allergies (For ER Doctors)</label>
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2 text-[#1F1C18] font-medium"
              />
            </div>
          </div>

          {/* Safety Toggles */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#1F1C18] block">Live Location Telemetry Sharing</span>
                <span className="text-[#8C827A] text-[11px]">Encrypts and shares your route coordinates with designated family during night travel</span>
              </div>
              <input
                type="checkbox"
                checked={autoShareLocation}
                onChange={(e) => setAutoShareLocation(e.target.checked)}
                className="w-5 h-5 accent-[#FF6F59] rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#1F1C18] block">Emergency SMS Beacon</span>
                <span className="text-[#8C827A] text-[11px]">Sends automated SMS with Google Maps link to {emergencyContactName} if SOS is held for 3 seconds</span>
              </div>
              <input
                type="checkbox"
                checked={smsSosEnabled}
                onChange={(e) => setSmsSosEnabled(e.target.checked)}
                className="w-5 h-5 accent-[#FF6F59] rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => showToast('Safety preferences & ICE details saved.')}
              className="px-5 py-2.5 bg-[#FF6F59] hover:bg-[#E85C46] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Emergency Configuration</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: COMMUNITY FAIR PRICE CONTRIBUTIONS */}
      {activeSubTab === 'contributions' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#1F1C18]">My Trust Contributions & Verified Reports</h2>
              <p className="text-xs text-[#8C827A]">Rewarding travelers who help keep India free from gouging and touts</p>
            </div>

            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-xl">
              Level 4 Guardian
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-1">
              <span className="text-[#8C827A] font-semibold text-[11px]">Fair Prices Submitted</span>
              <span className="text-2xl font-black text-[#1F1C18] block">6 Submissions</span>
              <span className="text-[#10B981] text-[11px] font-medium">All 6 verified by community</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-1">
              <span className="text-[#8C827A] font-semibold text-[11px]">Scams Flagged</span>
              <span className="text-2xl font-black text-[#E11D48] block">2 Reports</span>
              <span className="text-[#5A524C] text-[11px] font-medium">Saved ~140 tourists from tout traps</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-1">
              <span className="text-[#8C827A] font-semibold text-[11px]">Karma Rewards</span>
              <span className="text-2xl font-black text-[#FF6F59] block">480 Tokens</span>
              <span className="text-[#5A524C] text-[11px] font-medium">Unlocked Free ASI Audio Tour</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs text-[#1F1C18] uppercase tracking-wider">Recent Activity Log</h3>
            
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1F1C18]">Verified Auto Fare: ₹60 from Connaught Place to India Gate</span>
                  <p className="text-[#8C827A] text-[11px]">Meter reading verified with photo receipt • 2 days ago</p>
                </div>
                <span className="text-[#10B981] font-bold">+50 🪙</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1F1C18]">Flagged "Taj Closed VIP Pass" tout scam outside Taj East Gate</span>
                  <p className="text-[#8C827A] text-[11px]">Verified and added to Tourist Police live alert feed • 4 days ago</p>
                </div>
                <span className="text-[#10B981] font-bold">+120 🪙</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1F1C18]">Verified authentic Varanasi Silk shop price: ₹3,200 for pure Katan saree</span>
                  <p className="text-[#8C827A] text-[11px]">GI Tag certificate matched • 1 week ago</p>
                </div>
                <span className="text-[#10B981] font-bold">+60 🪙</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TOURIST EMERGENCY CARD */}
      {activeSubTab === 'card' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
            <div>
              <h2 className="text-base font-bold text-[#1F1C18]">Tourist Digital Emergency Pass</h2>
              <p className="text-xs text-[#8C827A]">Keep this accessible offline or take a screenshot on your phone</p>
            </div>

            <button
              onClick={() => showToast('Emergency card screenshot summary generated.')}
              className="px-3.5 py-1.5 bg-[#FAF8F5] border border-[#EAE5DC] hover:bg-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Card</span>
            </button>
          </div>

          {/* Printable / Visual Emergency Card */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-[#1F1C18] to-[#2D261E] text-white rounded-3xl p-5 border-2 border-[#FF6F59]/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FFA07A]" />
                <span className="font-extrabold text-sm tracking-wide">BHARAT YATRA PASS</span>
              </div>
              <span className="text-[10px] bg-[#10B981] text-white font-black px-2 py-0.5 rounded-full">
                VERIFIED TRAVELER
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Profile photo"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white"
              />
              <div>
                <div className="text-base font-bold">{fullName}</div>
                <div className="text-xs text-[#D5CECE]">{nationality}</div>
                <div className="text-[11px] text-[#FFA07A] font-mono mt-0.5">Blood: {bloodGroup}</div>
              </div>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl text-xs space-y-1 font-mono">
              <div className="text-[10px] text-[#FFA07A] uppercase font-bold tracking-wider">
                Emergency Contact (आपातकालीन संपर्क)
              </div>
              <div className="font-bold text-sm text-white">{emergencyContactName}</div>
              <div className="text-[#10B981]">{emergencyPhone}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[#A8A096] block">Tourist Police</span>
                <span className="font-bold text-white">1363 (Toll Free)</span>
              </div>
              <div className="p-2 bg-white/5 rounded-xl">
                <span className="text-[#A8A096] block">National Helpline</span>
                <span className="font-bold text-[#FFA07A]">112 (Emergency)</span>
              </div>
            </div>

            <div className="p-2.5 bg-white/5 rounded-xl text-[11px] font-mono border border-white/10 space-y-0.5">
              <div className="flex justify-between text-[#A8A096]">
                <span>Issued (DD/MM/YYYY):</span>
                <span className="text-white font-bold">05/09/2026</span>
              </div>
              <div className="flex justify-between text-[#A8A096]">
                <span>Valid Till:</span>
                <span className="text-[#10B981] font-bold">04/09/2027</span>
              </div>
              <div className="flex justify-between text-[#A8A096]">
                <span>Active Circuit:</span>
                <span className="text-[#FFA07A] font-bold">05/09/2026 – 10/09/2026</span>
              </div>
            </div>

            <div className="text-[10px] text-center text-[#A8A096] pt-1">
              Ministry of Tourism Verified Identity Protocol • Indian Standard Time (IST)
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CULTURAL TOOLKITS & LIVING GUIDES */}
      {activeSubTab === 'toolkits' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CulturalDiscoveryHub
            onSelectFeature={(tab) => {
              if (onSelectTab) {
                onSelectTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Integrated Living Toolkits & Cultural Discovery"
            description="Explore official transit schedules, FSSAI street food hygiene, sacred rituals, certified GI handicrafts, and ASI guides."
          />

          {/* Indian Standard Time & National Emergency Info Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-[#191715] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C84B31]" />
              <span>Official Indian Standard Time (IST) & Emergency Services</span>
            </h3>
            
            <IndianTimeWidget variant="full" showRefresh={true} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EAE5DC] text-xs">
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-[#8C827A] text-[11px] block">MoT Tourist Helpline</span>
                  <span className="font-bold text-[#191715]">1363 (24/7 Toll Free)</span>
                </div>
                <PhoneCall className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-[#8C827A] text-[11px] block">National Emergency</span>
                  <span className="font-bold text-[#E11D48]">112 (Police/Medical)</span>
                </div>
                <AlertOctagon className="w-4 h-4 text-[#E11D48]" />
              </div>
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DC] flex items-center justify-between">
                <div>
                  <span className="text-[#8C827A] text-[11px] block">Railway Helpline</span>
                  <span className="font-bold text-[#0284C7]">139 (Rail Seva)</span>
                </div>
                <Train className="w-4 h-4 text-[#0284C7]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1F1C18] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
