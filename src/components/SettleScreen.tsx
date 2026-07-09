/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Copy, Smartphone, Wallet, QrCode, Info, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';

// Declare Cashfree as a global (loaded via <script> in index.html)
declare const Cashfree: (config: { mode: string }) => {
  checkout: (options: { paymentSessionId: string; redirectTarget: string }) => Promise<{
    error?: unknown;
    redirect?: boolean;
    paymentDetails?: unknown;
  }>;
};

interface SettleScreenProps {
  amount: number;
  weekRange: string;
  upiId: string;
  driverName?: string;
  driverPhone?: string;
  driverId?: string;
  onCopyUpi: () => void;
  onConfirmPayment: () => void;
  onBack: () => void;
  t: (key: string, fallback: string) => string;
}

export const SettleScreen: React.FC<SettleScreenProps> = ({
  amount,
  weekRange,
  upiId,
  driverName,
  driverPhone,
  driverId,
  onCopyUpi,
  onConfirmPayment,
  onBack,
  t
}) => {
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return '₹' + Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('LetzRyd')}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('LetzRyd Settle ' + weekRange)}`;

  const handleCashfreePayment = async () => {
    setPayLoading(true);
    setPayError(null);

    try {
      // 1. Create order on our backend
      const res = await fetch('https://cashfree-web.onrender.com/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          driverName: driverName || 'Driver',
          driverPhone: driverPhone || '9999999999',
          driverId: driverId || 'driver_001',
          weekRange
        })
      });

      const data = await res.json();

      if (data.error) {
        setPayError(data.error);
        setPayLoading(false);
        return;
      }

      // 2. Open Cashfree checkout modal
      const cashfree = Cashfree({ mode: 'sandbox' });

      const result = await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_modal'
      });

      if (result.paymentDetails) {
        // Payment succeeded — mark as settled
        onConfirmPayment();
      } else {
        // Dismissed or failed
        setPayError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      setPayError('Could not connect to payment server. Is the API server running?');
    }

    setPayLoading(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-bright cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-text-primary" data-i18n="settle.title">
            {t('settle.title', 'Settle Hisaab')}
          </h2>
          <p className="text-xs text-text-secondary">
            {t('settle.forWeek', 'For week')} {weekRange}
          </p>
        </div>
      </div>

      {/* Invoice Hero Box */}
      <div className="bg-gradient-to-br from-emerald-950/80 to-teal-950 border border-emerald-500/25 rounded-2xl p-6 text-center shadow-lg shadow-emerald-950/10">
        <p className="text-[10px] text-emerald-400/70 font-bold uppercase letter-spacing: 1px" data-i18n="settle.payTo">
          Amount to Settle
        </p>
        <div className="text-4xl font-black text-success mt-4 leading-none tracking-tight">
          {formatCurrency(amount)}
        </div>
        <p className="text-xs text-emerald-400/50 mt-2 font-medium" data-i18n="settle.payToLetzryd">
          Payable to LetzRyd Fleet Management
        </p>
      </div>

      {/* ── CASHFREE PAYMENT BUTTON ── */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          Pay Online (Cards · UPI · Net Banking · Wallets)
        </h3>

        {payError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-medium">
            {payError}
          </div>
        )}

        <button
          id="cashfree-pay-btn"
          onClick={handleCashfreePayment}
          disabled={payLoading}
          className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', border: '1px solid rgba(255,100,100,0.3)', color: 'white', boxShadow: '0 8px 25px -8px rgba(255,50,50,0.3)' }}
        >
          {payLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Opening checkout...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay {formatCurrency(amount)} via Cashfree
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-text-muted">Secured by Cashfree Payments · PCI DSS Compliant</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">OR pay manually via UPI</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      {/* UPI Address Clipboard */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="settle.upiPayment">
          UPI Payment Address
        </h3>
        <div className="bg-bg-elevated border border-border-bright rounded-xl p-4 flex justify-between items-center shadow-inner">
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider">LetzRyd Corporate VPA</p>
            <p className="text-base font-bold font-mono text-accent-brand mt-0.5">{upiId}</p>
          </div>
          <button
            onClick={onCopyUpi}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-subtle text-xs font-bold text-text-secondary hover:text-accent-brand hover:border-accent-brand cursor-pointer transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            {t('settle.copy', 'Copy')}
          </button>
        </div>
      </div>

      {/* App Redirections */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="settle.payWith">
          Fast App Checkout
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`phonepe://pay?${upiDeepLink.split('?')[1]}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-surface border border-border-subtle hover:border-border-bright transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#5C2D8F] text-white flex items-center justify-center text-sm font-black shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary leading-tight">PhonePe</p>
              <p className="text-[9px] text-text-muted mt-0.5" data-i18n="settle.open">Tap to open</p>
            </div>
          </a>

          <a
            href={`tez://upi/pay?${upiDeepLink.split('?')[1]}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-surface border border-border-subtle hover:border-border-bright transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-white text-[#4285F4] flex items-center justify-center text-base font-extrabold shrink-0">
              G
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary leading-tight">GPay</p>
              <p className="text-[9px] text-text-muted mt-0.5" data-i18n="settle.open">Tap to open</p>
            </div>
          </a>

          <a
            href={`paytmmp://pay?${upiDeepLink.split('?')[1]}`}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-surface border border-border-subtle hover:border-border-bright transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00BAF2] text-white flex items-center justify-center text-sm font-black shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary leading-tight">Paytm</p>
              <p className="text-[9px] text-text-muted mt-0.5" data-i18n="settle.open">Tap to open</p>
            </div>
          </a>

          <a
            href={upiDeepLink}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-surface border border-border-subtle hover:border-border-bright transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-dim text-accent-brand flex items-center justify-center text-sm font-black shrink-0 border border-accent-brand/10">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-primary leading-tight">Any UPI App</p>
              <p className="text-[9px] text-text-muted mt-0.5" data-i18n="settle.open">Tap to open</p>
            </div>
          </a>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 rounded-xl bg-info-dim/20 border border-info-brand/15 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-info-brand shrink-0 mt-0.5" />
        <div className="text-[11px] text-text-secondary leading-relaxed space-y-1">
          <p className="font-extrabold text-text-primary uppercase tracking-wider" data-i18n="settle.howToPay">
            How to Pay
          </p>
          <p>1. Use the <strong className="text-accent-brand">Pay via Cashfree</strong> button above for instant online payment.</p>
          <p>2. Or copy the UPI ID and pay manually via PhonePe, GPay, or Paytm.</p>
          <p>3. After paying manually, press <strong className="text-accent-brand">"I Have Paid"</strong> to notify us.</p>
          <p>4. Accounting logs verify transactions within 2–4 hours.</p>
        </div>
      </div>

      {/* Manual Confirm Button (for UPI manual payments) */}
      <div className="space-y-3">
        <button
          onClick={onConfirmPayment}
          className="w-full py-3.5 rounded-xl bg-accent-brand text-black font-black hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-accent-brand/10"
        >
          <CheckCircle2 className="w-4 h-4" />
          {t('settle.iHavePaid', 'I Have Paid (Manual)')}
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-transparent border border-border-subtle text-text-secondary font-bold hover:text-text-primary hover:border-border-bright text-xs cursor-pointer transition-all"
        >
          {t('settle.backToHisaab', 'Cancel & Back to Hisaab')}
        </button>
      </div>
    </div>
  );
};
