import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Sparkles,
  Shield,
  CreditCard,
  Phone,
  Zap,
  Users,
  Building,
  GraduationCap,
  Award,
  Clock,
  ArrowRight,
  Receipt,
  Check
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  SchoolStaffSubscriptionTier,
  ParentSubscriptionTier,
  SubscriptionPaymentMethod
} from '../../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'school' | 'parent';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'school'
}) => {
  const { currentSchool, currentUser, allUsers, updateSchoolSubscription, updateParentSubscription } = useSchool();

  const isStaff = currentUser.role === 'head_teacher' || currentUser.role === 'deputy_head_teacher' || currentUser.role === 'teacher' || currentUser.role === 'platform_admin';
  const isParent = currentUser.role === 'parent';

  const [activeTab, setActiveTab] = useState<'school' | 'parent'>(
    defaultMode === 'parent' || isParent ? 'parent' : 'school'
  );

  // School subscription state
  const currentSchoolTier: SchoolStaffSubscriptionTier = currentSchool.staffSubscription?.tier || 'medium';
  const [selectedSchoolTier, setSelectedSchoolTier] = useState<SchoolStaffSubscriptionTier>(currentSchoolTier);
  const [schoolBillingCycle, setSchoolBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [schoolPaymentMethod, setSchoolPaymentMethod] = useState<SubscriptionPaymentMethod>('airtel_money');

  // Parent subscription state
  const currentParentTier: ParentSubscriptionTier = currentUser.parentSubscription?.tier || 'medium';
  const [selectedParentTier, setSelectedParentTier] = useState<ParentSubscriptionTier>(currentParentTier);
  const [parentBillingCycle, setParentBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [parentPaymentMethod, setParentPaymentMethod] = useState<SubscriptionPaymentMethod>('airtel_money');

  // Payment form state
  const [mobileNumber, setMobileNumber] = useState(currentUser.phone || '+260 977 000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    reference: string;
    tier: string;
    amountZMW: number;
    target: string;
  } | null>(null);

  if (!isOpen) return null;

  const staffCount = allUsers.filter(
    (u) => u.schoolId === currentSchool.id && (u.role === 'head_teacher' || u.role === 'deputy_head_teacher' || u.role === 'teacher')
  ).length || 1;

  const handleSchoolSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateSchoolSubscription(currentSchool.id, selectedSchoolTier, schoolBillingCycle, schoolPaymentMethod);
      setIsProcessing(false);
      setSuccessReceipt({
        reference: `SCH-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: selectedSchoolTier === 'premium' ? 'Premium (K450/month)' : 'Medium (K400/month)',
        amountZMW: selectedSchoolTier === 'premium' ? 450 : 400,
        target: `${currentSchool.name} (Covers all ${staffCount} staff members)`
      });
    }, 800);
  };

  const handleParentSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateParentSubscription(currentUser.id, selectedParentTier, parentBillingCycle, parentPaymentMethod);
      setIsProcessing(false);
      setSuccessReceipt({
        reference: `PAR-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
        tier: selectedParentTier === 'premium' ? 'Premium (K200/month)' : 'Medium (K150/month)',
        amountZMW: selectedParentTier === 'premium' ? 200 : 150,
        target: `Parent Account (${currentUser.fullName})`
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                Official Zambian Subscriptions
              </span>
              <span className="text-slate-400 text-xs font-mono">ZMW (Kwacha)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              SchoolLink Subscription Plans
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Transparent, school-wide staff coverage and individual parent subscription tiers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('school');
              setSuccessReceipt(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'school'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-600" />
            <span>School Staff Subscription</span>
            <span className="hidden sm:inline text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Paid Once by School &bull; All Staff Covered
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('parent');
              setSuccessReceipt(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'parent'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Parent Subscription</span>
            <span className="hidden sm:inline text-[11px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
              Individual Account
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 flex-1">
          {successReceipt ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-emerald-950">Subscription Activated Successfully!</h3>
              <p className="text-xs text-emerald-800 mt-1">
                Your license tier has been verified and applied immediately to the system.
              </p>

              <div className="bg-white border border-emerald-200 rounded-xl p-4 my-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-bold text-slate-900">{successReceipt.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Tier:</span>
                  <span className="font-bold text-emerald-700">{successReceipt.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Charged:</span>
                  <span className="font-bold text-slate-900">K{successReceipt.amountZMW} ZMW / month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">{successReceipt.target}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  onClose();
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          ) : activeTab === 'school' ? (
            <div className="space-y-6">
              {/* School Banner Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <Building className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">School ID: {currentSchool.code} &bull; {currentSchool.name}</span>
                  <p className="mt-0.5 text-slate-600">
                    The School Staff subscription is paid once by the institution and automatically covers all{' '}
                    <strong className="text-emerald-700">{staffCount} faculty & staff members</strong> (Head Teacher, Deputy Head Teacher, and Teachers) connected to this School ID.
                  </p>
                </div>
              </div>

              {/* Tiers Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medium Tier */}
                <div
                  onClick={() => setSelectedSchoolTier('medium')}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition relative flex flex-col justify-between ${
                    selectedSchoolTier === 'medium'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {currentSchoolTier === 'medium' && (
                    <span className="absolute top-3 right-3 bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Current Plan
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Tier</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Medium</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">K400</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Covers all staff members connected to the School ID with complete school management fundamentals.
                    </p>

                    <div className="my-4 border-t border-slate-200 pt-3">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">Included Features:</p>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Full School & Campus Management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Staff & Faculty Rosters</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Students & Parents Profiles</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Classes & Subject Configuration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Results & Examination Management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Assignments & Test Management (CA-1 to CA-3)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Daily Attendance Registers</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>School Announcements & Basic Reports</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                      selectedSchoolTier === 'medium'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedSchoolTier === 'medium' ? 'Selected Medium' : 'Select Medium'}
                  </button>
                </div>

                {/* Premium Tier */}
                <div
                  onClick={() => setSelectedSchoolTier('premium')}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition relative flex flex-col justify-between ${
                    selectedSchoolTier === 'premium'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    Recommended
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Enterprise AI Tier</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      Premium
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">K450</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      All Medium features plus advanced analytics, AI-powered school insights, and premium tools.
                    </p>

                    <div className="my-4 border-t border-slate-200 pt-3">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">Includes All Medium Features, Plus:</p>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Advanced Institutional Analytics & Pass Rates</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>AI-Powered School & Subject Insights</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Advanced Academic & Performance Reports</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Attendance Analytics & Absenteeism Heatmaps</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Advanced Staff & Student Management</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Teacher Excel Studio & Live Video Class Tools</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                      selectedSchoolTier === 'premium'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedSchoolTier === 'premium' ? 'Selected Premium' : 'Select Premium'}
                  </button>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Zambian Payment Channel
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: 'airtel_money', label: 'Airtel Money', color: 'text-red-600' },
                    { id: 'mtn_money', label: 'MTN MoMo', color: 'text-yellow-600' },
                    { id: 'zamtel_money', label: 'Zamtel Kwacha', color: 'text-emerald-600' },
                    { id: 'card_visa_mastercard', label: 'Visa / Mastercard', color: 'text-blue-600' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSchoolPaymentMethod(m.id as SubscriptionPaymentMethod)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center text-center ${
                        schoolPaymentMethod === m.id
                          ? 'border-emerald-600 bg-white shadow-sm ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className={m.color}>{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Money / Contact Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800"
                    />
                  </div>
                  <button
                    onClick={handleSchoolSubmit}
                    disabled={isProcessing}
                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay & Activate K{selectedSchoolTier === 'premium' ? 450 : 400}/mo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Parent Banner Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Parent / Guardian Portal &bull; {currentUser.fullName}</span>
                  <p className="mt-0.5 text-slate-600">
                    Parent subscriptions are separate and individual. They grant direct visibility into your linked children's continuous assessments, term grades, daily attendance alerts, and learning trajectory.
                  </p>
                </div>
              </div>

              {/* Tiers Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medium Tier */}
                <div
                  onClick={() => setSelectedParentTier('medium')}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition relative flex flex-col justify-between ${
                    selectedParentTier === 'medium'
                      ? 'border-teal-600 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {currentParentTier === 'medium' && (
                    <span className="absolute top-3 right-3 bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Current Plan
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Parent Tier</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Medium</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">K150</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Access to linked children's results, assignments, tests, attendance, and basic progress.
                    </p>

                    <div className="my-4 border-t border-slate-200 pt-3">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">Included Features:</p>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Access to Linked Children Results</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Assignments & Homework Portal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Tests (CA-1, CA-2, CA-3) Marks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Daily Attendance Status</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>School Announcements & Circulars</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>Basic Academic Progress Summary</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                      selectedParentTier === 'medium'
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedParentTier === 'medium' ? 'Selected Medium' : 'Select Medium'}
                  </button>
                </div>

                {/* Premium Tier */}
                <div
                  onClick={() => setSelectedParentTier('premium')}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition relative flex flex-col justify-between ${
                    selectedParentTier === 'premium'
                      ? 'border-teal-600 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    Recommended
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Advanced AI & Reports</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      Premium
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">K200</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      All Medium features + advanced academic progress, AI learning insights, and detailed reports.
                    </p>

                    <div className="my-4 border-t border-slate-200 pt-3">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">Includes All Medium Features, Plus:</p>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Advanced Academic Progress & Multi-Term Trajectory</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>AI-Powered Learning Insights & Weakness Diagnosis</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Detailed Printable Report Cards with Security QR</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Advanced Attendance Timestamps & Late Records</span>
                        </li>
                        <li className="flex items-center gap-2 font-medium text-slate-900">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>Subject-Specific Comparative Analytics</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs mt-2 transition ${
                      selectedParentTier === 'premium'
                        ? 'bg-teal-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {selectedParentTier === 'premium' ? 'Selected Premium' : 'Select Premium'}
                  </button>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Zambian Payment Channel
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: 'airtel_money', label: 'Airtel Money', color: 'text-red-600' },
                    { id: 'mtn_money', label: 'MTN MoMo', color: 'text-yellow-600' },
                    { id: 'zamtel_money', label: 'Zamtel Kwacha', color: 'text-emerald-600' },
                    { id: 'card_visa_mastercard', label: 'Visa / Mastercard', color: 'text-blue-600' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setParentPaymentMethod(m.id as SubscriptionPaymentMethod)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center text-center ${
                        parentPaymentMethod === m.id
                          ? 'border-teal-600 bg-white shadow-sm ring-1 ring-teal-500'
                          : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                      }`}
                    >
                      <span className={m.color}>{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Money / WhatsApp Number</label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800"
                    />
                  </div>
                  <button
                    onClick={handleParentSubmit}
                    disabled={isProcessing}
                    className="w-full sm:w-auto mt-4 sm:mt-0 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Activating...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay & Activate K{selectedParentTier === 'premium' ? 200 : 150}/mo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
