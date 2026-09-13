import React, { useState } from 'react';
import { 
  Building, 
  ShieldAlert, 
  MapPin, 
  Flame, 
  Smile, 
  AlertTriangle, 
  Landmark, 
  FileCheck2, 
  Gavel, 
  TrendingUp, 
  Users, 
  PhoneCall, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  Eye, 
  Clock, 
  ArrowUpRight, 
  Shield, 
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';
import { 
  AUTHORITY_HERITAGE_REPORTS, 
  AUTHORITY_ENFORCEMENT_ACTIONS 
} from '../../data/ecosystemData';
import { HeritageSiteReport, EnforcementAction } from '../../types/entity';
import { AuthUser } from '../../types/auth';
import { DashboardMapSection } from '../maps/DashboardMapSection';
import { IndianTimeWidget } from '../common/IndianTimeWidget';

interface AuthorityDashboardProps {
  onOpenEcosystemModal?: () => void;
  currentUser?: AuthUser | null;
  onSwitchAccount?: () => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  onOpenEcosystemModal: _onOpenEcosystemModal,
  currentUser,
  onSwitchAccount: _onSwitchAccount,
}) => {
  const [heritageReports, setHeritageReports] = useState<HeritageSiteReport[]>(AUTHORITY_HERITAGE_REPORTS);
  const [enforcementActions, setEnforcementActions] = useState<EnforcementAction[]>(AUTHORITY_ENFORCEMENT_ACTIONS);
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'heatmaps' | 'sentiment' | 'complaints' | 'heritage' | 'compliance' | 'enforcement'>('overview');

  // Interactive inspection / enforcement state
  const [selectedReport, setSelectedReport] = useState<HeritageSiteReport | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showEnforcementModal, setShowEnforcementModal] = useState(false);
  const [newEnforcement, setNewEnforcement] = useState({
    businessName: '',
    category: 'Handicrafts',
    violation: '',
    actionType: 'Penalty Fine' as const,
    amountOrPenalty: '₹10,000 Fine',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveHeritageReport = (id: string, actionNote: string) => {
    setHeritageReports(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Resolved',
          actionTaken: actionNote || 'ASI Conservation unit inspected and restored site access.'
        };
      }
      return r;
    }));
    setSelectedReport(null);
    showToast(`Heritage incident ${id} marked as inspected and resolved.`);
  };

  const handleCreateEnforcement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnforcement.businessName || !newEnforcement.violation) return;

    const action: EnforcementAction = {
      id: `ENF-2026-${Math.floor(100 + Math.random() * 900)}`,
      businessName: newEnforcement.businessName,
      category: newEnforcement.category,
      violation: newEnforcement.violation,
      actionType: newEnforcement.actionType as any,
      amountOrPenalty: newEnforcement.amountOrPenalty,
      date: 'Just now',
      status: 'Enforced',
      authorityOfficer: 'Insp. V. Sharma (Central Enforcement Control)'
    };

    setEnforcementActions(prev => [action, ...prev]);
    setShowEnforcementModal(false);
    setNewEnforcement({
      businessName: '',
      category: 'Handicrafts',
      violation: '',
      actionType: 'Penalty Fine',
      amountOrPenalty: '₹10,000 Fine',
    });
    showToast(`Enforcement order ${action.id} published to Business Dashboard and Police network.`);
  };

  const criticalHeritageCount = heritageReports.filter(r => r.status !== 'Resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#991B1B] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#EF4444] animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#FCA5A5]" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Authority Dashboard Entity Header */}
      <div className="bg-gradient-to-r from-[#881337] via-[#9F1239] to-[#BE123C] text-white rounded-3xl p-5 sm:p-7 shadow-md border border-[#E11D48]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#FECDD3] text-xs font-bold uppercase tracking-wider">
              <Building className="w-4 h-4 text-[#FDA4AF]" />
              <span>Yatra One • Authority & Governance Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ministry of Tourism, ASI & Police Telemetry
            </h1>

            <p className="text-xs sm:text-sm text-[#FFE4E6] leading-relaxed">
              <span className="font-semibold text-white">Fixes: no real-time footfall or safety intelligence, unmonitored heritage sites.</span>{' '}
              Real-time crowd heatmaps, tourist sentiment monitoring, heritage site preservation alerts, automated merchant compliance, and rapid enforcement dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/90">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <Radio className="w-3.5 h-3.5 text-[#FDA4AF] animate-pulse" />
                Live District Telemetry Active
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-[#FDA4AF]" />
                ASI Heritage Zones Monitored: 34 Sites
              </span>
              <div className="inline-flex items-center">
                <IndianTimeWidget variant="header" className="bg-[#4C0519] border-[#FDA4AF]/40 text-white" />
              </div>
              {currentUser?.officerBadgeId && (
                <span className="inline-flex items-center gap-1 bg-[#4C0519] border border-[#FDA4AF]/40 px-2.5 py-1 rounded-lg font-bold text-[#FECDD3]">
                  <span>Duty Officer: {currentUser.name} ({currentUser.officerBadgeId})</span>
                </span>
              )}
            </div>
          </div>

          {/* Authority Operational Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowEnforcementModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#4C0519] hover:bg-[#320310] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-white/20"
            >
              <Gavel className="w-4 h-4 text-[#FDA4AF]" />
              <span>Issue Enforcement Action</span>
            </button>
            <div className="text-[11px] text-[#FDA4AF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FDA4AF] animate-pulse" />
              <span>Connected to Live Safety & ASI Feeds</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Authority Features */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/15">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'map', label: 'Live Location & ASI Heritage Map', icon: MapPin },
            { id: 'heatmaps', label: 'Footfall Heatmaps', icon: Flame },
            { id: 'sentiment', label: 'Sentiment & Feedback', icon: Smile },
            { id: 'complaints', label: 'Complaint Categories', icon: AlertTriangle },
            { id: 'heritage', label: `Heritage Reports (${criticalHeritageCount})`, icon: Landmark, badge: criticalHeritageCount > 0 },
            { id: 'compliance', label: 'Compliance Monitoring', icon: FileCheck2 },
            { id: 'enforcement', label: `Enforcement (${enforcementActions.length})`, icon: Gavel },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#881337] shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Core Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Metric 1: Real-time Crowd Surge */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#BE123C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Footfall Density</span>
            <div className="p-2 rounded-xl bg-[#FFF1F2] text-[#BE123C]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#191715]">38,420 <span className="text-xs font-semibold text-[#BE123C]">Active in District</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#BE123C]" />
            <span>Peak surge: Taj Mahal Western Gate (88% Cap)</span>
          </div>
        </div>

        {/* Metric 2: Regional Sentiment */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#059669] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Tourist Sentiment</span>
            <div className="p-2 rounded-xl bg-[#ECFDF5] text-[#059669]">
              <Smile className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#191715]">82% <span className="text-xs font-bold text-[#059669]">Positive Perception</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5">
            Key positive: Clean ghats, safe night lighting, verified auto cards
          </div>
        </div>

        {/* Metric 3: Enforcement Actions */}
        <div className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-2xs">
          <div className="flex items-center justify-between text-[#991B1B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#665E55]">Compliance Enforcement</span>
            <div className="p-2 rounded-xl bg-[#FEF2F2] text-[#991B1B]">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#991B1B]">{enforcementActions.length} Actions <span className="text-xs font-bold text-[#059669]">Active this week</span></div>
          <div className="text-[11px] text-[#665E55] mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Overcharging violations decreased by 31%</span>
          </div>
        </div>

      </div>

      {/* FEATURE: DEDICATED LIVE LOCATION & HERITAGE TELEMETRY MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <DashboardMapSection
            role="authority"
            currentUser={currentUser}
          />
        </div>
      )}

      {/* OVERVIEW QUICK MAP PREVIEW CARD */}
      {activeTab === 'overview' && (
        <div className="bg-gradient-to-br from-[#881337]/5 to-[#BE123C]/10 rounded-3xl p-5 sm:p-6 border border-[#BE123C]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#BE123C] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Geospatial Command & Officer GPS Telemetry</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#191715]">
              Real-Time Location Access, Heritage Perimeters & Police Patrol Radar
            </h3>
            <p className="text-xs text-[#665E55] max-w-xl">
              Enable your device GPS to plot officer location relative to ASI 100m/200m regulated monument boundaries, monitor live police patrol beacons, and inspect reported critical crowd bottlenecks.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="px-5 py-2.5 rounded-xl bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Open Dedicated Map & Geolocation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FEATURE 1: FOOTFALL HEATMAPS (Where and why footfall changes) */}
      {(activeTab === 'overview' || activeTab === 'heatmaps') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#BE123C]">
                <Flame className="w-3.5 h-3.5" />
                <span>Feature 1: Footfall Heatmaps</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#191715]">Where and Why Footfall Changes</h2>
              <p className="text-xs text-[#665E55]">Live crowd telemetry correlating monument capacity, weather shifts, and transit arrivals.</p>
            </div>
            <div className="text-xs font-bold text-[#BE123C] bg-[#FFF1F2] px-3 py-1.5 rounded-xl border border-[#FECDD3]">
              🔴 1 Critical Bottleneck Flagged
            </div>
          </div>

          {/* Crowd Heatmap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { 
                site: 'Taj Mahal (Western Gate)', 
                density: '88% Capacity', 
                level: 'Critical', 
                visitors: '14,200', 
                reason: 'Morning ticket surge + international group arrivals via Gatimaan Express',
                color: 'border-[#EF4444] bg-[#FEF2F2]' 
              },
              { 
                site: 'Red Fort (Lahori Gate)', 
                density: '62% Capacity', 
                level: 'Moderate', 
                visitors: '9,450', 
                reason: 'Normal weekend flow; sound & light show surge anticipated at 6:30 PM',
                color: 'border-[#F59E0B] bg-[#FFFBEB]' 
              },
              { 
                site: 'Hawa Mahal & Johari Bazaar', 
                density: '74% Capacity', 
                level: 'Elevated', 
                visitors: '8,100', 
                reason: 'Evening craft shopping surge; pedestrian zone active',
                color: 'border-[#F59E0B] bg-[#FFFBEB]' 
              },
              { 
                site: 'Dashashwamedh Ghat', 
                density: '91% Capacity', 
                level: 'High Surge', 
                visitors: '16,500', 
                reason: 'Evening Ganga Aarti preparation; boat queue regulation deployed',
                color: 'border-[#EF4444] bg-[#FEF2F2]' 
              },
            ].map((zone, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${zone.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#191715]">{zone.site}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white shadow-2xs">
                    {zone.level}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#191715]">{zone.density}</span>
                  <span className="text-xs text-[#665E55]">({zone.visitors} tourists)</span>
                </div>
                <p className="text-[11px] text-[#443F38] leading-tight"><strong>Cause:</strong> {zone.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 2 & FEATURE 3: SENTIMENT/FEEDBACK & COMPLAINT CATEGORIES */}
      {(activeTab === 'overview' || activeTab === 'sentiment' || activeTab === 'complaints') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Sentiment / Feedback */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <Smile className="w-3.5 h-3.5" />
              <span>Feature 2: Sentiment & Feedback</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#191715]">Overall Sentiment Insights</h2>
            <p className="text-xs text-[#665E55]">Aggregated Natural Language sentiment from tourist app reviews, complaints, and guide ratings.</p>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#059669]">Positive (82%)</span>
                  <span className="text-[#665E55]">Neutral (12%)</span>
                  <span className="text-[#DC2626]">Negative (6%)</span>
                </div>
                <div className="h-3 w-full bg-[#EAE5DC] rounded-full overflow-hidden flex">
                  <div style={{ width: '82%' }} className="bg-[#059669] h-full" title="82% Positive" />
                  <div style={{ width: '12%' }} className="bg-[#F59E0B] h-full" title="12% Neutral" />
                  <div style={{ width: '6%' }} className="bg-[#EF4444] h-full" title="6% Negative" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <div className="font-bold text-[#166534]">Top Positive Drivers</div>
                  <div className="text-[11px] text-[#15803D] mt-1 space-y-0.5">
                    <div>• Verified ASI Guides (+34% trust)</div>
                    <div>• Fair Price rate cards on auto stands</div>
                    <div>• Clean RO water dispensers</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2]">
                  <div className="font-bold text-[#991B1B]">Top Negative Drivers</div>
                  <div className="text-[11px] text-[#B91C1C] mt-1 space-y-0.5">
                    <div>• Unofficial touts at outer parking</div>
                    <div>• Long security queue during peak 11 AM</div>
                    <div>• Lack of step-free ramps at older ghats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complaint Categories Breakdown */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#DC2626]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Feature 3: Complaint Categories</span>
            </div>
            <h2 className="text-lg font-extrabold text-[#191715]">Top Issues, Trends & Patterns</h2>
            <p className="text-xs text-[#665E55]">Categorization of tourist-reported grievances across Golden Triangle and Spiritual circuits.</p>

            <div className="space-y-2.5 pt-1 text-xs">
              {[
                { label: 'Overcharging & Auto Fare Inflation', percent: 38, count: 142, change: '-12% this week', color: 'bg-[#DC2626]' },
                { label: 'Unofficial / Fake Guides (No ASI Badge)', percent: 26, count: 98, change: '-18% after verification badge rollout', color: 'bg-[#EA580C]' },
                { label: 'Street Sanitation & Plastic Waste', percent: 19, count: 71, change: '-8% municipal pickup', color: 'bg-[#D97706]' },
                { label: 'Counterfeit Craft / False GI Claims', percent: 17, count: 64, change: '4 shops delisted', color: 'bg-[#4F46E5]' },
              ].map((cat, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE5DC] space-y-1">
                  <div className="flex justify-between font-bold text-[#191715]">
                    <span>{cat.label}</span>
                    <span>{cat.percent}% ({cat.count} cases)</span>
                  </div>
                  <div className="w-full bg-[#EAE5DC] h-1.5 rounded-full overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                  <div className="text-[10px] text-[#059669] font-medium flex items-center justify-between">
                    <span>{cat.change}</span>
                    <span className="text-[#665E55]">Target: &lt; 5% total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FEATURE 4: HERITAGE-SITE ISSUE REPORTS (Maintenance, Crowding, Safety) */}
      {(activeTab === 'overview' || activeTab === 'heritage') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#BE123C]">
                <Landmark className="w-3.5 h-3.5" />
                <span>Feature 4: Heritage-Site Issue Reports</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#191715]">Maintenance, Crowding & Safety Monitoring</h2>
              <p className="text-xs text-[#665E55]">Direct reports from ASI on-ground conservationists and verified tourist app transmissions.</p>
            </div>
            <div className="text-xs font-semibold text-[#665E55]">
              Showing {heritageReports.length} monument sector reports
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {heritageReports.map(rep => (
              <div 
                key={rep.id}
                className={`p-4 rounded-2xl border transition-all ${
                  rep.status === 'Resolved' 
                    ? 'bg-[#F0FDF4] border-[#BBF7D0]' 
                    : rep.severity === 'critical'
                    ? 'bg-[#FEF2F2] border-[#FCA5A5]'
                    : 'bg-[#FFFBEB] border-[#FDE68A]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#665E55]">{rep.id}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md text-white ${
                        rep.severity === 'critical' ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                      }`}>
                        {rep.category}
                      </span>
                      <span className="text-xs text-[#665E55]">{rep.timestamp}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#191715]">{rep.siteName} ({rep.city})</h3>
                    <p className="text-xs text-[#443F38] leading-relaxed">{rep.description}</p>
                    <div className="text-[10px] text-[#665E55]">Source: {rep.reportedBy}</div>
                  </div>

                  <span className={`text-xs font-black px-2 py-1 rounded-lg shrink-0 ${
                    rep.status === 'Resolved'
                      ? 'bg-[#059669] text-white'
                      : 'bg-[#DC2626] text-white'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                {rep.actionTaken ? (
                  <div className="mt-3 pt-2.5 border-t border-black/10 text-xs text-[#065F46] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span><strong>Action Taken:</strong> {rep.actionTaken}</span>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between">
                    <span className="text-xs text-[#DC2626] font-bold">Needs authority field dispatch</span>
                    <button
                      onClick={() => handleResolveHeritageReport(rep.id, 'Inspection completed by ASI regional unit. Restored to safe standards.')}
                      className="px-3 py-1.5 bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Dispatch & Resolve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE 5 & 6: COMPLIANCE MONITORING & ENFORCEMENT */}
      {(activeTab === 'overview' || activeTab === 'compliance' || activeTab === 'enforcement') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE4]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#991B1B]">
                <Gavel className="w-3.5 h-3.5" />
                <span>Feature 5 & 6: Compliance Monitoring & Enforcement</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#191715]">Penalties, Rank Adjustments & Delisting for Non-Compliant Businesses</h2>
              <p className="text-xs text-[#665E55]">Automatic and discretionary enforcement actions closing the feedback loop with businesses and tourists.</p>
            </div>

            <button
              onClick={() => setShowEnforcementModal(true)}
              className="px-3.5 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Enforcement</span>
            </button>
          </div>

          {/* Compliance Audit Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs">
            <div>
              <div className="text-[#665E55]">Fair-Price Compliance Rate</div>
              <div className="text-xl font-black text-[#059669]">96.2%</div>
              <div className="text-[10px] text-[#665E55]">Audited against Yatra One Fair-Price Benchmark</div>
            </div>
            <div>
              <div className="text-[#665E55]">Verified Guide Badge Coverage</div>
              <div className="text-xl font-black text-[#059669]">91.8%</div>
              <div className="text-[10px] text-[#665E55]">ASI certified badges active on ground</div>
            </div>
            <div>
              <div className="text-[#665E55]">Enforcement Turnaround Velocity</div>
              <div className="text-xl font-black text-[#191715]">1.8 hours</div>
              <div className="text-[10px] text-[#665E55]">Average time from tourist report to resolution</div>
            </div>
          </div>

          {/* Enforcement Actions Table / Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#191715]">Live Enforcement Registry</div>
            {enforcementActions.map(action => (
              <div key={action.id} className="p-4 rounded-2xl bg-white border border-[#EAE5DC] shadow-2xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#665E55]">{action.id}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        action.actionType.includes('Suspension')
                          ? 'bg-[#991B1B] text-white'
                          : 'bg-[#DC2626] text-white'
                      }`}>
                        {action.actionType}
                      </span>
                      <span className="text-xs text-[#665E55]">{action.date}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#191715]">{action.businessName}</h3>
                    <p className="text-xs text-[#443F38]"><strong>Violation:</strong> {action.violation}</p>
                    <div className="text-xs text-[#991B1B] font-bold">Penalty: {action.amountOrPenalty}</div>
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-xs font-bold">
                      {action.status}
                    </span>
                    <div className="text-[10px] text-[#665E55]">{action.authorityOfficer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enforcement Order Modal */}
      {showEnforcementModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#EAE5DC] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[#991B1B]" />
                <h3 className="text-base font-extrabold text-[#191715]">Issue Authority Enforcement Order</h3>
              </div>
              <button
                onClick={() => setShowEnforcementModal(false)}
                className="text-xs font-bold text-[#665E55] hover:text-[#191715]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateEnforcement} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#191715] block mb-1">Business or Stand Name</label>
                <input
                  type="text"
                  required
                  value={newEnforcement.businessName}
                  onChange={e => setNewEnforcement(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="E.g., Sunrise Souvenirs Shop #9"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#991B1B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#191715] block mb-1">Violation Description</label>
                <textarea
                  required
                  value={newEnforcement.violation}
                  onChange={e => setNewEnforcement(prev => ({ ...prev, violation: e.target.value }))}
                  placeholder="E.g., Quoted ₹1,800 for ₹350 marked silk scarf to foreign tourist party. Refused official receipt."
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#991B1B] min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#191715] block mb-1">Action Type</label>
                  <select
                    value={newEnforcement.actionType}
                    onChange={e => setNewEnforcement(prev => ({ ...prev, actionType: e.target.value as any }))}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#991B1B]"
                  >
                    <option value="Penalty Fine">Penalty Fine</option>
                    <option value="Rank Demotion">Rank Demotion</option>
                    <option value="Suspension / Delisting">Suspension / Delisting</option>
                    <option value="Police Warning">Police Warning</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#191715] block mb-1">Penalty Terms</label>
                  <input
                    type="text"
                    value={newEnforcement.amountOrPenalty}
                    onChange={e => setNewEnforcement(prev => ({ ...prev, amountOrPenalty: e.target.value }))}
                    placeholder="E.g., ₹15,000 Fine + 7 Day Delist"
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl p-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#991B1B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnforcementModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#EAE5DC] font-semibold text-[#665E55] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
