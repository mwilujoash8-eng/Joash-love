import React, { useState } from 'react';
import {
  Utensils,
  CreditCard,
  Plus,
  Zap,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { CanteenWallet } from '../../types';

interface ParentCanteenWalletProps {
  studentNumber: string;
  studentName: string;
}

export const ParentCanteenWallet: React.FC<ParentCanteenWalletProps> = ({
  studentNumber,
  studentName,
}) => {
  const { canteenWallets, topUpCanteenWallet } = useSchool();

  const wallet: CanteenWallet = canteenWallets[studentNumber] || {
    studentNumber,
    studentName,
    currentBalanceZMW: 145,
    dietaryRestrictions: ['Strictly No Peanuts / Groundnuts (Mild allergy)'],
    dailySpendingLimitZMW: 35,
    recentTransactions: [
      { id: 'tx_c1', date: '2026-03-12', itemDescription: 'Nshima with Fresh Kariba Bream & Vegetables', amount: 25, type: 'purchase' },
      { id: 'tx_c2', date: '2026-03-11', itemDescription: 'Tropical Fruit Salad & 100% Orange Juice', amount: 15, type: 'purchase' },
      { id: 'tx_c3', date: '2026-03-08', itemDescription: 'Parent Mobile Money Top-Up (MTN MoMo)', amount: 100, type: 'top_up', channel: 'mtn_momo' },
    ],
  };

  const [topUpAmount, setTopUpAmount] = useState<number>(50);
  const [channel, setChannel] = useState<string>('MTN MoMo (*303#)');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      topUpCanteenWallet(studentNumber, topUpAmount, channel);
      setIsProcessing(false);
      setSuccessMessage(`Successfully recharged ZMW ${topUpAmount} to ${studentName}'s Meal Smart Card!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* WALLET OVERVIEW CARD */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Utensils className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-300">
                School Dining & Canteen Smart Card
              </span>
              <h3 className="text-xl font-black text-white">
                {studentName}'s Meal Wallet
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cashless campus dining card for lunch and healthy tuck-shop snacks.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl text-center sm:text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Available Balance</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
              ZMW {wallet.currentBalanceZMW.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Daily Limit: <strong>ZMW {wallet.dailySpendingLimitZMW}/day</strong>
            </div>
          </div>
        </div>

        {/* DIETARY WARNINGS */}
        {wallet.dietaryRestrictions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Dietary Alert:</strong> {wallet.dietaryRestrictions.join(', ')} (Flagged at Canteen POS Terminal).
            </span>
          </div>
        )}
      </div>

      {/* TOP-UP & TRANSACTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP UP FORM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Recharge Smart Meal Card
            </h4>
            <p className="text-xs text-slate-500">
              Instant mobile money top-up with zero transaction surcharge.
            </p>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleTopUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top-Up Amount (ZMW)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[30, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                      topUpAmount === amt
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    ZMW {amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={5}
                max={500}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="MTN MoMo (*303#)">MTN Mobile Money</option>
                <option value="Airtel Money (*778#)">Airtel Money</option>
                <option value="Zanaco Express">Zanaco Express / Xapit</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isProcessing || topUpAmount <= 0}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isProcessing ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Recharge...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top-Up ZMW {topUpAmount} Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* TRANSACTIONS LEDGER */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Dining & Snack History
              </h4>
              <p className="text-xs text-slate-500">
                Itemized receipts scanned at the school dining hall.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            {wallet.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.type === 'top_up'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {tx.type === 'top_up' ? <Plus className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {tx.itemDescription}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {tx.date}
                    </div>
                  </div>
                </div>

                <div className={`text-xs font-mono font-bold ${
                  tx.type === 'top_up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {tx.type === 'top_up' ? `+ZMW ${tx.amount}` : `-ZMW ${tx.amount}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
