import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Printer,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  QrCode
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentChannel, ParentFeeStatement } from '../../types';

interface ParentFeePaymentPortalProps {
  studentNumber: string;
  studentName: string;
  className: string;
}

export const ParentFeePaymentPortal: React.FC<ParentFeePaymentPortalProps> = ({
  studentNumber,
  studentName,
  className,
}) => {
  const { currentSchool, parentFeeStatements, makeFeePayment } = useSchool();

  // Selected statement or fallback
  const statement: ParentFeeStatement = parentFeeStatements[studentNumber] || {
    studentNumber,
    studentName,
    className,
    academicYear: currentSchool.academicYear,
    termId: currentSchool.activeTerm,
    totalInvoiced: 2850,
    totalPaid: 2150,
    balanceDue: 700,
    dueDate: '2026-02-28',
    items: [
      { id: 'fee_1', name: 'Government Subsidized Tuition & Boarding Grant', amount: 1200, amountZMW: 1200, category: 'tuition', isPaid: true },
      { id: 'fee_2', name: 'PTA Solar Backup Power & Water Borehole Levy', amount: 450, amountZMW: 450, category: 'pta_levy', isPaid: true },
      { id: 'fee_3', name: 'Science Laboratory & STEM Consumables', amount: 350, amountZMW: 350, category: 'lab_fee', isPaid: true },
      { id: 'fee_4', name: 'ICT Computer Lab & High-Speed Starlink Access', amount: 300, amountZMW: 300, category: 'ict_levy', isPaid: true },
      { id: 'fee_5', name: 'Continuous Assessment & Term Examination Materials', amount: 250, amountZMW: 250, category: 'tuition', isPaid: false },
      { id: 'fee_6', name: 'Sports, House Jersey & Health Clinic Fee', amount: 300, amountZMW: 300, category: 'sports_club', isPaid: false },
    ],
    transactions: [
      {
        id: 'tx_demo_1',
        receiptNumber: 'KT-REC-2026-8821',
        studentNumber,
        studentName,
        parentId: 'user_parent_mweemba',
        parentName: 'Mr. Patrick Mweemba',
        amount: 1500,
        termId: currentSchool.activeTerm,
        academicYear: currentSchool.academicYear,
        channel: 'mtn_momo',
        referenceNumber: 'MTN-774921-X',
        timestamp: '2026-01-14T09:30:00Z',
        status: 'completed',
        feeItemName: 'Term 1 Tuition & Boarding (First Installment)',
      },
      {
        id: 'tx_demo_2',
        receiptNumber: 'KT-REC-2026-9142',
        studentNumber,
        studentName,
        parentId: 'user_parent_mweemba',
        parentName: 'Mr. Patrick Mweemba',
        amount: 650,
        termId: currentSchool.activeTerm,
        academicYear: currentSchool.academicYear,
        channel: 'airtel_money',
        referenceNumber: 'AIR-992381-K',
        timestamp: '2026-02-04T14:15:00Z',
        status: 'completed',
        feeItemName: 'PTA Solar Levy & Science Lab',
      },
    ],
  };

  // Payment Form State
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('mtn_momo');
  const [paymentAmount, setPaymentAmount] = useState<number>(statement.balanceDue > 0 ? statement.balanceDue : 500);
  const [payerPhone, setPayerPhone] = useState<string>('0966 892 110');
  const [selectedItemName, setSelectedItemName] = useState<string>('Term Fee Settlement');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'statement' | 'pay' | 'history'>('statement');

  const percentPaid = Math.min(
    100,
    Math.round(((statement.totalPaid || 0) / (statement.totalInvoiced || 1)) * 100)
  );

  const downloadOfficialReceipt = (receiptNo: string, amount: number, channel: string, dateStr?: string) => {
    const receiptContent = `=====================================================
OFFICIAL PAYMENT RECEIPT - ${currentSchool.name.toUpperCase()}
Ministry of Education Registered Centre #${currentSchool.code}
=====================================================
Receipt Number: ${receiptNo}
Date Issued: ${dateStr || new Date().toLocaleDateString('en-GB')}
Student Name: ${studentName} (${studentNumber})
Amount Cleared: ZMW ${amount.toLocaleString()}.00
Payment Channel: ${channel.toUpperCase().replace('_', ' ')}
Validation Status: VERIFIED & LEDGER SYNCHRONIZED
Processed by: SchoolLink Digital Revenue Gateway
=====================================================
Thank you for your payment. Please retain for your records.`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${receiptNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const receipt = makeFeePayment(
        studentNumber,
        paymentAmount,
        selectedChannel,
        selectedItemName,
        `Mobile money transfer via ${payerPhone}`
      );
      setIsProcessing(false);
      setLastReceipt(receipt);
      setActiveTab('statement');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH STATS & PROGRESS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Official Account Statement
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentSchool.name} • {currentSchool.academicYear} {currentSchool.activeTerm.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Fee & Levy Portal — {studentName} ({studentNumber})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Class: <strong>{className}</strong> • Registered Bursary Category: <strong>General Government & PTA Subsidized</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('statement')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'statement'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Statement & Invoices
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pay')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pay'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Make Mobile Payment</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Receipts Ledger ({statement.transactions.length})
            </button>
          </div>
        </div>

        {/* FINANCIAL SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Term Invoiced</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              ZMW {statement.totalInvoiced.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">6 Authorized Bill Items</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Paid & Cleared</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ZMW {statement.totalPaid.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600/80 font-medium">
              {percentPaid}% of term obligations settled
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            statement.balanceDue > 0
              ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50'
          }`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              statement.balanceDue > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
            }`}>
              Outstanding Balance
            </span>
            <div className={`text-xl font-black mt-1 ${
              statement.balanceDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              ZMW {statement.balanceDue.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">
              {statement.balanceDue === 0 ? '100% Fully Cleared for Term' : `Due by ${statement.dueDate}`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">Term Fee Clearance Status</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{percentPaid}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentPaid}%` }}
            />
          </div>
        </div>
      </div>

      {/* RECENT RECEIPT BANNER (IF JUST PAID) */}
      {lastReceipt && (
        <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-200">
                Payment Verified & Receipt Issued
              </div>
              <h3 className="text-lg font-black text-white">
                Official Receipt #{lastReceipt.receiptNumber}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                ZMW {lastReceipt.amount.toLocaleString()} paid via {lastReceipt.channel.toUpperCase()} (Ref: {lastReceipt.referenceNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadOfficialReceipt(lastReceipt.receiptNumber, lastReceipt.amount, lastReceipt.channel, lastReceipt.timestamp)}
              className="px-3.5 py-2 bg-white text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-50 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setLastReceipt(null)}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: ITEMIZED STATEMENT */}
      {activeTab === 'statement' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Approved Ministry of Education & PTA Fee Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Authorized for Kabwe Secondary & Technical Board for {currentSchool.academicYear}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('pay')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Pay Outstanding ZMW {statement.balanceDue}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {statement.items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.isPaid
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {item.isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize">
                      Category: {item.category.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    ZMW {(item.amountZMW || item.amount).toLocaleString()}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.isPaid
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                  }`}>
                    {item.isPaid ? 'Cleared' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MAKE PAYMENT VIA ZAMBIAN MOBILE MONEY / BANK */}
      {activeTab === 'pay' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="max-w-xl mx-auto space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Instant Automated Settlement
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Pay School Fees & PTA Levies
              </h3>
              <p className="text-xs text-slate-500">
                Official integrations with MTN MoMo, Airtel Money, and Zanaco SchoolPay Bill Payment.
              </p>
            </div>

            {/* PAYMENT CHANNEL SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Zambian Payment Channel:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'mtn_momo', name: 'MTN MoMo', code: '*303#', color: 'bg-yellow-400 text-slate-900 border-yellow-500' },
                  { id: 'airtel_money', name: 'Airtel Money', code: '*778#', color: 'bg-red-600 text-white border-red-700' },
                  { id: 'zanaco_bill', name: 'Zanaco Pay', code: 'Bill 9021', color: 'bg-orange-500 text-white border-orange-600' },
                  { id: 'bank_transfer', name: 'Bank EFT', code: 'Direct Ref', color: 'bg-blue-600 text-white border-blue-700' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChannel(ch.id as PaymentChannel)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      selectedChannel === ch.id
                        ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{ch.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{ch.code}</div>
                    </div>
                    {selectedChannel === ch.id && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Purpose / Fee Item
                </label>
                <select
                  value={selectedItemName}
                  onChange={(e) => setSelectedItemName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Term Fee Settlement (Full Outstanding)">Full Outstanding Balance Settlement (ZMW {statement.balanceDue})</option>
                  <option value="Tuition & Boarding Grant (Partial)">Tuition & Boarding Grant</option>
                  <option value="PTA Solar Power & Borehole Levy">PTA Solar Backup & Water Levy</option>
                  <option value="Science Laboratory Consumables">Science Laboratory & STEM Fee</option>
                  <option value="ICT & Starlink Internet Levy">ICT Computer Lab & Starlink Fee</option>
                  <option value="Examination Assessment Fee">Continuous Assessment & Exam Fee</option>
                  <option value="School Sports Uniform & Clinic">Sports Uniform & Health Clinic</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Amount to Pay (ZMW)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">ZMW</span>
                    <input
                      type="number"
                      min={10}
                      max={10000}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full text-xs font-mono font-bold pl-12 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Money / Account Phone
                  </label>
                  <input
                    type="text"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    required
                    placeholder="0966XXXXXX or 0977XXXXXX"
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Payments are cleared instantly into the Kabwe Secondary & Technical Board Ministry of Finance TSA Account. A stamped receipt with QR verification will be issued immediately.
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || paymentAmount <= 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-900/20"
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Communicating with {selectedChannel.toUpperCase()} Gateway...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize Payment of ZMW {paymentAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY & OFFICIAL RECEIPTS LEDGER */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Official Stamped Receipts & Transaction Ledger
              </h3>
              <p className="text-xs text-slate-500">
                All confirmed electronic and bank payments for {studentName} ({studentNumber})
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>

          <div className="space-y-3">
            {statement.transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No payment transactions recorded yet this term.
              </div>
            ) : (
              statement.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                          Receipt #{tx.receiptNumber}
                        </span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                          VERIFIED
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {tx.feeItemName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span>Channel: <strong>{tx.channel.replace('_', ' ').toUpperCase()}</strong></span>
                        <span>•</span>
                        <span>Ref: <code className="font-mono">{tx.referenceNumber}</code></span>
                        <span>•</span>
                        <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                    <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ZMW {tx.amount.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadOfficialReceipt(tx.receiptNumber, tx.amount, tx.channel, tx.timestamp)}
                      className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1 mt-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
