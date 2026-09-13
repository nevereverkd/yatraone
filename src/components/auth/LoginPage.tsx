import React, { useState } from 'react';
import { 
  Compass, 
  Store, 
  Building, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  FileText, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Building2,
  BadgeAlert,
  LogIn
} from 'lucide-react';
import { AuthUser, UserRole } from '../../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialRole = 'tourist',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Role-specific fields
  const [businessName, setBusinessName] = useState('');
  const [gstOrLicense, setGstOrLicense] = useState('');
  const [businessCategory, setBusinessCategory] = useState<'Hotel' | 'Restaurant' | 'Handicraft' | 'Tour Agency' | 'Transport'>('Hotel');
  
  const [officerBadgeId, setOfficerBadgeId] = useState('');
  const [department, setDepartment] = useState('Ministry of Tourism & ASI');
  const [securityPin, setSecurityPin] = useState('');

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (selectedRole === 'business' && isSignUp && (!businessName || !gstOrLicense)) {
      setErrorMsg('Business Name and GSTIN / License are required.');
      return;
    }

    // Create user object
    const newUser: AuthUser = {
      id: `usr_${selectedRole}_${Date.now().toString().slice(-4)}`,
      name: name.trim() || (selectedRole === 'tourist' ? 'Traveler User' : selectedRole === 'business' ? (businessName || 'Merchant Partner') : 'Official Inspector'),
      email: email.trim(),
      role: selectedRole,
      avatar: selectedRole === 'tourist' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : selectedRole === 'business'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: phone || '+91 98000 00000',
      ...(selectedRole === 'tourist' && {
        nationality: 'Indian',
        travelerType: 'Solo Traveler',
        kycVerified: true,
      }),
      ...(selectedRole === 'business' && {
        businessName: businessName || 'Heritage Enterprise',
        gstOrLicense: gstOrLicense || '08AAACR1234F1Z8',
        businessCategory,
        businessLocation: 'City Center, India',
        qualityScore: 92,
        qualityTier: 'Gold Tier',
      }),
      ...(selectedRole === 'authority' && {
        department: department || 'Archaeological Survey of India (ASI)',
        designation: 'Field Inspector & Compliance Officer',
        officerBadgeId: officerBadgeId || 'ASI-FLD-2024-901',
        securityClearance: 'Level 2',
        jurisdictionZone: 'State Heritage Circle',
      }),
    };

    onLoginSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-[#191715]">
      {/* Top Heritage Header Bar */}
      <header className="border-b border-[#EAE5DC] bg-white/90 backdrop-blur-md py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C84B31] text-white flex items-center justify-center font-black shadow-xs">
              <Compass className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#191715]">Bharat Yatra</span>
                <span className="bg-[#FFF2EE] text-[#C84B31] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#FED7CC]">
                  One Identity
                </span>
              </div>
              <p className="text-[11px] text-[#8C827A] hidden sm:block">
                Unified Role-Based Travel, Commerce & Authority Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5A524C]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span className="hidden sm:inline font-semibold">Government Certified & Encrypted</span>
            <span className="text-[10px] bg-[#ECFDF5] text-[#059669] px-2 py-0.5 rounded-full font-bold border border-[#A7F3D0]">
              256-Bit SSL
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
        
        {/* Hero Title & Subheading */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#FFF2EE] text-[#C84B31] text-xs font-extrabold uppercase tracking-wider border border-[#FED7CC]">
            Role-Based Authentication
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191715] tracking-tight">
            Sign in to Your Dedicated Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#665E55]">
            Select your entity role below to access tailored tools: Traveler Services, Merchant Quality & Footfall, or Authority Safety & ASI Telemetry.
          </p>
        </div>

        {/* 3 Entity Role Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-8">
          
          {/* 1. Tourist Persona Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('tourist');
              setErrorMsg(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedRole === 'tourist'
                ? 'border-[#0284C7] bg-[#F0F9FF] shadow-md ring-2 ring-[#0284C7]/20'
                : 'border-[#EAE5DC] bg-white hover:border-[#BAE6FD] hover:bg-[#FAF8F5]'
            }`}
          >
            {selectedRole === 'tourist' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            )}
            <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center mb-2.5 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-[#0F172A]">Tourist / Traveler</div>
            <div className="text-[11px] text-[#475569] mt-0.5 leading-relaxed">
              Explore 8 pillars: AI itinerary, fair-price checks, guides, transit & SOS.
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
              <span>Consumer App</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* 2. Business Persona Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('business');
              setErrorMsg(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedRole === 'business'
                ? 'border-[#059669] bg-[#ECFDF5] shadow-md ring-2 ring-[#059669]/20'
                : 'border-[#EAE5DC] bg-white hover:border-[#A7F3D0] hover:bg-[#FAF8F5]'
            }`}
          >
            {selectedRole === 'business' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#059669]" />
            )}
            <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center mb-2.5 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-[#064E3B]">Business / Merchant</div>
            <div className="text-[11px] text-[#047857] mt-0.5 leading-relaxed">
              Footfall analytics, reviews, complaint remediation & Gold Quality Score.
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#059669] uppercase tracking-wider">
              <span>Merchant Portal</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

          {/* 3. Authority Persona Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('authority');
              setErrorMsg(null);
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
              selectedRole === 'authority'
                ? 'border-[#E11D48] bg-[#FFF1F2] shadow-md ring-2 ring-[#E11D48]/20'
                : 'border-[#EAE5DC] bg-white hover:border-[#FECDD3] hover:bg-[#FAF8F5]'
            }`}
          >
            {selectedRole === 'authority' && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
            )}
            <div className="w-9 h-9 rounded-xl bg-[#E11D48] text-white flex items-center justify-center mb-2.5 shadow-xs">
              <Building className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-[#881337]">Authority / Official</div>
            <div className="text-[11px] text-[#9F1239] mt-0.5 leading-relaxed">
              ASI site telemetry, monument heatmaps, safety feeds & enforcement.
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#E11D48] uppercase tracking-wider">
              <span>Govt & ASI Console</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-[#EAE5DC] shadow-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
          
          {/* Header of Form */}
          <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                Signing In As:
              </div>
              <div className="text-lg font-black capitalize flex items-center gap-2">
                {selectedRole === 'tourist' && <span className="text-[#0284C7]">Tourist / Traveler</span>}
                {selectedRole === 'business' && <span className="text-[#059669]">Business / Merchant Partner</span>}
                {selectedRole === 'authority' && <span className="text-[#E11D48]">Ministry of Tourism & ASI Official</span>}
              </div>
            </div>

            {/* Mode switch */}
            <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE5DC] text-xs font-bold">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isSignUp ? 'bg-white text-[#191715] shadow-xs' : 'text-[#665E55] hover:text-[#191715]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isSignUp ? 'bg-white text-[#191715] shadow-xs' : 'text-[#665E55] hover:text-[#191715]'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Custom Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* If Sign Up: Name field */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="font-bold text-[#191715] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#8C827A]" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meera Nambiar"
                  className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3.5 py-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#C84B31] focus:bg-white"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-bold text-[#191715] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#8C827A]" />
                  <span>
                    {selectedRole === 'authority' ? 'Official Gov Email (.gov.in / .nic.in)' : 'Email Address'}
                  </span>
                </span>
                {selectedRole === 'authority' && (
                  <span className="text-[10px] text-[#E11D48] font-semibold">Authorized Domain</span>
                )}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'tourist'
                    ? 'traveler@gmail.com'
                    : selectedRole === 'business'
                    ? 'business@resortjaipur.in'
                    : 'officer@tourism.gov.in'
                }
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3.5 py-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#C84B31] focus:bg-white"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-bold text-[#191715] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#8C827A]" />
                  <span>Password</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#8C827A] hover:text-[#191715] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3.5 py-2.5 text-xs text-[#191715] focus:outline-none focus:border-[#C84B31] focus:bg-white"
              />
            </div>

            {/* ROLE-SPECIFIC FIELDS */}

            {/* Business Specific: Business Name & GSTIN */}
            {selectedRole === 'business' && (
              <div className="p-3.5 rounded-2xl bg-[#ECFDF5]/50 border border-[#A7F3D0] space-y-3">
                <div className="font-bold text-[#064E3B] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Business Verification Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#064E3B]">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Amer Palace Heritage Hotel"
                      className="w-full bg-white border border-[#A7F3D0] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#059669]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#064E3B]">GSTIN / Trade License</label>
                    <input
                      type="text"
                      value={gstOrLicense}
                      onChange={(e) => setGstOrLicense(e.target.value)}
                      placeholder="e.g. 08AABCT1234F1Z9"
                      className="w-full bg-white border border-[#A7F3D0] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#059669]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#064E3B]">Commercial Category</label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#A7F3D0] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#059669]"
                  >
                    <option value="Hotel">Hotel / Heritage Haveli</option>
                    <option value="Restaurant">Restaurant / Safe Food Eatery</option>
                    <option value="Handicraft">GI Crafts / Textile Emporium</option>
                    <option value="Tour Agency">Tour Operator / Guide Agency</option>
                    <option value="Transport">Authorized Cab / Multi-modal Transit</option>
                  </select>
                </div>
              </div>
            )}

            {/* Authority Specific: Badge ID & Security PIN */}
            {selectedRole === 'authority' && (
              <div className="p-3.5 rounded-2xl bg-[#FFF1F2]/60 border border-[#FECDD3] space-y-3">
                <div className="font-bold text-[#881337] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeAlert className="w-3.5 h-3.5 text-[#E11D48]" />
                  <span>Official ASI & Ministry Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#881337]">Officer Badge ID / Code</label>
                    <input
                      type="text"
                      value={officerBadgeId}
                      onChange={(e) => setOfficerBadgeId(e.target.value)}
                      placeholder="e.g. ASI-DEL-2024-441"
                      className="w-full bg-white border border-[#FECDD3] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#881337]">Official Security PIN (Optional for login)</label>
                    <input
                      type="password"
                      maxLength={6}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="e.g. 8840"
                      className="w-full bg-white border border-[#FECDD3] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#881337]">Government Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-[#FECDD3] rounded-xl px-3 py-2 text-xs text-[#191715] focus:outline-none focus:border-[#E11D48]"
                  >
                    <option value="Ministry of Tourism & ASI">Ministry of Tourism & ASI (Heritage Sites)</option>
                    <option value="State Tourism Police Taskforce">State Tourism Police & Safety Dispatch</option>
                    <option value="District Magistrate & Compliance">District Magistrate Administration</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tourist Specific: Aadhaar/KYC and Phone */}
            {selectedRole === 'tourist' && isSignUp && (
              <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                <div className="font-bold text-[#0369A1] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Traveler Verification (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#0369A1]">Contact Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#191715]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0369A1]">Nationality</label>
                    <select className="w-full bg-white border border-[#BAE6FD] rounded-xl px-3 py-2 text-xs text-[#191715]">
                      <option>Indian Citizen</option>
                      <option>International Tourist (Visa / e-Visa)</option>
                      <option>NRI / OCI Cardholder</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 ${
                selectedRole === 'tourist'
                  ? 'bg-[#0284C7] hover:bg-[#0369A1]'
                  : selectedRole === 'business'
                  ? 'bg-[#059669] hover:bg-[#047857]'
                  : 'bg-[#E11D48] hover:bg-[#BE123C]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {isSignUp ? `Register as ${selectedRole.toUpperCase()}` : `Sign In to ${selectedRole.toUpperCase()} Dashboard`}
              </span>
            </button>

          </form>

          {/* Privacy & Role Isolation Notice */}
          <div className="pt-2 text-center text-[11px] text-[#8C827A] border-t border-[#F0ECE4]">
            🔒 <strong>Strict Role Isolation:</strong> Logged-in credentials determine whether the Tourist Suite, Merchant Quality Console, or Authority Telemetry is loaded.
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE5DC] bg-white py-4 px-4 text-center text-xs text-[#8C827A]">
        Bharat Yatra • Multi-Entity Tourism System • Verified by Ministry of Tourism & ASI Standards
      </footer>
    </div>
  );
};
