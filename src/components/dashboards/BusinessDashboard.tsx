import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare, 
  Filter, 
  Sparkles, 
  HelpCircle, 
  Building2, 
  ChevronRight, 
  FileCheck,
  Send,
  RefreshCw,
  Eye,
  Percent,
  MapPin,
  Check
} from 'lucide-react';
import { 
  INITIAL_BUSINESS_PROFILE, 
  INITIAL_BUSINESS_COMPLAINTS, 
  HOURLY_FOOTFALL_DATA 
} from '../../data/ecosystemData';
import { BusinessProfile, BusinessComplaint } from '../../types/entity';
import { AuthUser } from '../../types/auth';
import { DashboardMapSection } from '../maps/DashboardMapSection';
import { IndianTimeWidget } from '../common/IndianTimeWidget';

interface BusinessDashboardProps {
  onOpenEcosystemModal?: () => void;
  currentUser?: AuthUser | null;
  onSwitchAccount?: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  onOpenEcosystemModal: _onOpenEcosystemModal,
  currentUser,
  onSwitchAccount: _onSwitchAccount,
}) => {
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    if (currentUser?.businessName) {
      return {
        ...INITIAL_BUSINESS_PROFILE,
        name: currentUser.businessName,
        gstOrLicense: currentUser.gstOrLicense || INITIAL_BUSINESS_PROFILE.gstOrLicense,
        ownerName: currentUser.name || INITIAL_BUSINESS_PROFILE.ownerName,
        location: currentUser.businessLocation || INITIAL_BUSINESS_PROFILE.location,
      };
    }
    return INITIAL_BUSINESS_PROFILE;
  });
  const [complaints, setComplaints] = useState<BusinessComplaint[]>(INITIAL_BUSINESS_COMPLAINTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pending' | 'resolved'>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'footfall' | 'complaints' | 'ratings' | 'quality_action'>('overview');
  
  // Action state
  const [selectedComplaint, setSelectedComplaint] = useState<BusinessComplaint | null>(null);
  const [actionText, setActionText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveComplaint = (id: string, actionNote: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'Resolved',
          actionTaken: actionNote || 'Corrective action committed by merchant. Pricing and standards reconciled.',
          impactOnRank: 'Rank restored. Verified Partner status fully active.'
        };
      }
      return c;
    }));
    // Bump quality score slightly when resolving complaints
    setProfile(prev => ({
      ...prev,
      qualityScore: Math.min(100, prev.qualityScore + 2)
    }));
    setSelectedComplaint(null);
    setActionText('');
    showToast('Complaint resolved & reported back to Tourist App and Authority portal!');
  };

  const filteredComplaints = complaints.filter(c => {
    if (selectedCategory === 'pending') return c.status === 'Pending' || c.status === 'Action Committed';
    if (selectedCategory === 'resolved') return c.status === 'Resolved';
    return true;
  });

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#065F46] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#10B981] animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Business Dashboard Entity Header */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#065F46] text-white rounded-3xl p-5 sm:p-7 shadow-md border border-[#059669]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#A7F3D0] text-xs font-bold uppercase tracking-wider">
              <Store className="w-4 h-4 text-[#34D399]" />
              <span>Yatra One • Business Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#D1FAE5] leading-relaxed">
              <span className="font-semibold text-white">Fixes: low visibility, no feedback loop, unclear service quality.</span>{' '}
              Access real-time tourist footfall trends, respond directly to verified customer complaints, maintain your Quality Score, and protect your search ranking.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/90">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                {profile.location}, {profile.city}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <FileCheck className="w-3.5 h-3.5 text-[#34D399]" />
                License: {profile.gstOrLicense}
              </span>
              <div className="inline-flex items-center">
                <IndianTimeWidget variant="header" className="bg-[#064E3B] border-[#34D399]/40 text-white" />
              </div>
            </div>
          </div>

          {/* Live Data Streams Indicator */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="text-xs text-[#A7F3D0] flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse shrink-0" />
              <span>Connected to Tourist & Authority Data Streams</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Business Features */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/15">
          {[
            { id: 'overview', label: 'Overview', icon: Store },
            { id: 'map', label: 'Live Location & Footfall Map', icon: MapPin },
            { id: 'footfall', label: 'Footfall Trends', icon: TrendingUp },
            { id: 'complaints', label: `Complaints (${pendingCount} New)`, icon: AlertTriangle, badge: pendingCount > 0 },
            { id: 'ratings', label: 'Service Ratings', icon: Star },
            { id: 'quality_action', label: 'Quality Score & Feedback', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#064E3B] shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Core Feature Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Footfall Trends */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#047857] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Today's Footfall</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#191715]">{profile.footfallStats.todayVisitors} <span className="text-xs font-semibold text-[#059669]">+14% vs yesterday</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#059669]" />
            <span>Peak: {profile.footfallStats.peakHours}</span>
          </div>
        </div>

        {/* Metric 2: Complaints */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#D97706] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Active Complaints</span>
            <div className="p-2 rounded-xl bg-[#FFFBEB] text-[#D97706]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#191715]">{pendingCount} <span className="text-xs font-medium text-[#DC2626]">Action needed</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>Resolution rate: 94% on-time</span>
          </div>
        </div>

        {/* Metric 3: Service Ratings */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Service Rating</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#191715]">{profile.averageRating} <span className="text-xs font-normal text-[#665E55]">/ 5.0 ({profile.totalReviews} reviews)</span></div>
          <div className="text-[11px] text-[#059669] mt-1.5 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Pricing Transparency: 4.9★</span>
          </div>
        </div>

        {/* Metric 4: Quality Score */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Quality Score</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#047857]">{profile.qualityScore}/100 <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">{profile.qualityTier} Partner</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5">
            Rank in Agra Handicrafts: <strong className="text-[#191715]">#3 of 148</strong>
          </div>
        </div>

      </div>

      {/* FEATURE: DEDICATED LIVE LOCATION & FOOTFALL MAP SECTION */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <DashboardMapSection
            role="business"
            currentUser={currentUser}
          />
        </div>
      )}

      {/* OVERVIEW QUICK MAP PREVIEW CARD */}
      {activeTab === 'overview' && (
        <div className="bg-gradient-to-br from-[#065F46]/5 to-[#059669]/10 rounded-3xl p-5 sm:p-6 border border-[#059669]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Live Commercial Catchment & GPS Telemetry</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#191715]">
              Real-Time Location Access & Footfall Density Map
            </h3>
            <p className="text-xs text-[#665E55] max-w-xl">
              Enable your device GPS to verify store coordinates ({profile.location}, {profile.city}), monitor walking visitor density within 500m, and track peak visitor flow corridors.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Dedicated Map & Geolocation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FEATURE 1: FOOTFALL TRENDS (Visitor Volume, Peak Hours, Locations) */}
      {(activeTab === 'overview' || activeTab === 'footfall') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Feature 1: Footfall Trends</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#191715]">Visitor Volume & Peak Hours Hourly Graph</h2>
              <p className="text-xs text-[#665E55]">Based on real-time anonymous tourist geolocation signals & turnstile telemetry.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                Weekly Total: {profile.footfallStats.weeklyVisitors.toLocaleString()} tourists
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#665E55] border border-[#EAE5DC]">
                Busiest Day: {profile.footfallStats.busiestDay}
              </span>
            </div>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-[#665E55] flex items-center justify-between">
              <span>Hourly Visitor Volume (Today)</span>
              <span className="text-[11px] text-[#059669] font-medium">Green bars indicate peak tourist shopping hours</span>
            </div>
            <div className="grid grid-cols-13 gap-1 sm:gap-2 items-end h-36 pt-4 pb-2 px-2 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DC]">
              {HOURLY_FOOTFALL_DATA.map((h, i) => {
                const heightPercent = Math.round((h.visitors / 180) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="text-[9px] font-bold text-[#665E55] opacity-0 group-hover:opacity-100 transition-opacity">
                      {h.visitors}
                    </div>
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        h.peak 
                          ? 'bg-[#059669] group-hover:bg-[#047857]' 
                          : 'bg-[#94A3B8] group-hover:bg-[#64748B]'
                      }`}
                      title={`${h.time} - ${h.visitors} visitors`}
                    />
                    <span className="text-[8px] sm:text-[9px] text-[#665E55] font-medium leading-none">{h.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs">
              <div className="font-bold text-[#166534]">Taj Ganj Tourist Gateway</div>
              <div className="text-[#15803D] mt-0.5">High footfall spillover from Taj Mahal Western Gate exit between 11 AM - 1 PM.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-xs">
              <div className="font-bold text-[#1E40AF]">Foreign Traveler Ratio</div>
              <div className="text-[#1D4ED8] mt-0.5">48% international visitors. Multi-lingual price tags and digital UPI/Card signs recommended.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] text-xs">
              <div className="font-bold text-[#92400E]">Staff Optimization</div>
              <div className="text-[#B45309] mt-0.5">Peak hour requires 3 sales personnel at checkout to eliminate queue drop-off.</div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2 & FEATURE 5: COMPLAINTS & ACT ON FEEDBACK */}
      {(activeTab === 'overview' || activeTab === 'complaints' || activeTab === 'quality_action') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DC2626]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Feature 2 & 5: Complaints & Act on Feedback</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#191715]">Issues Reported by Tourists & Mandatory Remediation</h2>
              <p className="text-xs text-[#DC2626] font-semibold">
                ⚠️ "Lower ranking, less reach if ignored" — Unresolved complaints reduce shop visibility in the Tourist App.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#191715] text-white'
                    : 'bg-[#FAF8F5] text-[#665E55] hover:bg-[#EFEAE1]'
                }`}
              >
                All ({complaints.length})
              </button>
              <button
                onClick={() => setSelectedCategory('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === 'pending'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-[#FAF8F5] text-[#665E55] hover:bg-[#EFEAE1]'
                }`}
              >
                Needs Action ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedCategory('resolved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === 'resolved'
                    ? 'bg-[#059669] text-white'
                    : 'bg-[#FAF8F5] text-[#665E55] hover:bg-[#EFEAE1]'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-3">
            {filteredComplaints.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'Pending'
                    ? 'bg-[#FEF2F2] border-[#FCA5A5]'
                    : item.status === 'Action Committed'
                    ? 'bg-[#FFFBEB] border-[#FDE68A]'
                    : 'bg-[#F0FDF4] border-[#BBF7D0]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#665E55]">{item.id}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        item.severity === 'high' ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B] text-white'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-[#665E55]">
                        Reported by <strong>{item.touristName}</strong> ({item.touristNationality}) • {item.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#191715]">{item.title}</h3>
                    <p className="text-xs text-[#443F38] leading-relaxed">{item.description}</p>
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg ${
                      item.status === 'Pending'
                        ? 'bg-[#DC2626] text-white'
                        : item.status === 'Action Committed'
                        ? 'bg-[#D97706] text-white'
                        : 'bg-[#059669] text-white'
                    }`}>
                      {item.status}
                    </span>
                    <div className="text-[10px] text-[#665E55] font-semibold">{item.impactOnRank}</div>
                  </div>
                </div>

                {/* Resolution action taken or Action button */}
                {item.actionTaken ? (
                  <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs text-[#065F46]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span><strong>Corrective Action Taken:</strong> {item.actionTaken}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between">
                    <span className="text-xs text-[#DC2626] font-bold">
                      Pending owner response to prevent automatic search demotion
                    </span>
                    <button
                      onClick={() => {
                        setSelectedComplaint(item);
                        setActionText('');
                      }}
                      className="px-3 py-1.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Act on Feedback</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action on Feedback Modal / Form */}
          {selectedComplaint && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#059669] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#059669]" />
                  <span className="text-xs font-extrabold text-[#191715]">
                    Commit Corrective Action for {selectedComplaint.id}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-xs text-[#665E55] hover:text-[#191715] font-bold"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-[#665E55]">
                Describe the specific steps taken to reconcile pricing, eliminate tout interference, or train staff. 
                This action will be transmitted to the tourist and verified by the Authority compliance engine to restore full search reach.
              </p>

              <textarea
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="E.g., Adjusted barcode price to match printed shelf price of ₹650. Refunded difference of ₹250 to tourist UPI. Instructed floor team on strict MRP adherence."
                className="w-full bg-white border border-[#EAE5DC] rounded-xl p-3 text-xs text-[#191715] placeholder-[#9C948B] focus:outline-none focus:border-[#059669] min-h-[75px]"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 rounded-xl border border-[#EAE5DC] text-xs font-semibold text-[#665E55] hover:bg-white"
                >
                  Close
                </button>
                <button
                  onClick={() => handleResolveComplaint(selectedComplaint.id, actionText)}
                  className="px-4 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Action & Protect Ranking</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FEATURE 3 & 4: SERVICE RATINGS & QUALITY SCORE BREAKDOWN */}
      {(activeTab === 'overview' || activeTab === 'ratings' || activeTab === 'quality_action') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Service Ratings Detail */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
              <span>Feature 3: Service Ratings</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#191715]">Average Ratings & Verified Reviews</h2>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC]">
              <div className="text-center">
                <div className="text-3xl font-black text-[#191715]">{profile.averageRating}</div>
                <div className="flex items-center justify-center text-[#F59E0B] my-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                  ))}
                </div>
                <div className="text-[10px] text-[#665E55]">{profile.totalReviews} verified tourists</div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-[#191715] mb-0.5">
                    <span>Fair Pricing & MRP Adherence</span>
                    <span>{profile.ratingBreakdown.pricing} / 5.0</span>
                  </div>
                  <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#059669] h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#191715] mb-0.5">
                    <span>Store Hygiene & Facility</span>
                    <span>{profile.ratingBreakdown.hygiene} / 5.0</span>
                  </div>
                  <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#191715] mb-0.5">
                    <span>Staff Hospitality</span>
                    <span>{profile.ratingBreakdown.hospitality} / 5.0</span>
                  </div>
                  <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#059669] h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#191715]">Recent Verified Tourist Feedback</div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191715]">Hannah Mueller (Austria)</span>
                  <span className="text-[10px] text-[#665E55]">Yesterday</span>
                </div>
                <p className="text-[#443F38]">"Transparent fixed prices for Pietra Dura inlay plates with certificate of authentic marble. No bargaining stress."</p>
                <div className="text-[10px] text-[#059669] font-semibold">✓ Verified Purchase • Yatra One Fair-Price Tagged</div>
              </div>
            </div>
          </div>

          {/* Quality Score & Ranking Protection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <Award className="w-3.5 h-3.5" />
              <span>Feature 4: Quality Score</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#191715]">Overall Performance & Tier Certification</h2>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#065F46] uppercase">Certification Status</div>
                <div className="text-2xl font-black text-[#064E3B] mt-0.5">Tier: {profile.qualityTier} Partner</div>
                <div className="text-xs text-[#047857] mt-1">
                  Enables "Recommended Verified Merchant" badge on Tourist App cards.
                </div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-white/80 backdrop-blur-md shadow-xs border border-white">
                <div className="text-3xl font-black text-[#047857]">{profile.qualityScore}</div>
                <div className="text-[10px] font-bold uppercase text-[#065F46]">Score / 100</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#191715]">Score Component Breakdown</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <div className="text-[#665E55] text-[11px]">Fair Price Adherence</div>
                  <div className="font-extrabold text-[#059669] text-sm">38 / 40 pts</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <div className="text-[#665E55] text-[11px]">Complaint Resolution</div>
                  <div className="font-extrabold text-[#059669] text-sm">28 / 30 pts</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <div className="text-[#665E55] text-[11px]">Tourist Sentiment</div>
                  <div className="font-extrabold text-[#059669] text-sm">18 / 20 pts</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC]">
                  <div className="text-[#665E55] text-[11px]">Statutory & GST Compliance</div>
                  <div className="font-extrabold text-[#059669] text-sm">10 / 10 pts</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-xs text-[#1E40AF] flex items-center justify-between">
              <span>Authority Audit Status: <strong>Verified Compliant</strong></span>
              <span className="font-bold text-[#1D4ED8] bg-white px-2.5 py-1 rounded-lg border border-[#DBEAFE]">
                ASI & District Certified ✓
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
