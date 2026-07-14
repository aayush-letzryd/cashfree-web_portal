/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Coins,
  ChevronUp,
  AlertCircle,
  Route,
  Activity,
  Calculator,
  Compass
} from 'lucide-react';
import { HisaabWeek } from '../types';

interface HisaabScreenProps {
  weeks: HisaabWeek[];
  weekIndex: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  loginType: 'driver' | 'operator';
  onPayClick: (amount: number) => void;
  t: (key: string, fallback: string) => string;
}

export const HisaabScreen: React.FC<HisaabScreenProps> = ({
  weeks,
  weekIndex,
  onPrevWeek,
  onNextWeek,
  loginType,
  onPayClick,
  t
}) => {
  const [uberOpen, setUberOpen] = useState(true);
  const [olaOpen, setOlaOpen] = useState(false);
  const [rapidoOpen, setRapidoOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [gpsOpen, setGpsOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(true);

  if (weeks.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 stroke-[1.2] opacity-35 mb-3" />
        <p className="text-sm font-semibold">{t('hisaab.noData', 'No records found')}</p>
      </div>
    );
  }

  const w = weeks[weekIndex];

  const formatCurrency = (val: number, decimals: number = 2) => {
    return (val < 0 ? '-' : '') + '₹' + Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getWeekRangeShort = (start: string, end: string) => {
    const fDate = (s: string) => {
      const d = new Date(s + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };
    return `${fDate(start)} – ${fDate(end)}`;
  };

  const getWeekLabel = (status: 'in_progress' | 'to_collect' | 'settled_pay', index: number) => {
    if (status === 'in_progress') return t('hisaab.inProgress', 'In Progress');
    if (index === 1) return 'Last Week';
    return 'Settled Period';
  };

  const renderPlatformSection = (
    platformKey: 'uber' | 'ola' | 'rapido',
    title: string,
    isOpen: boolean,
    setIsOpen: (val: boolean) => void,
    colorClass: string,
    accentBorder: string
  ) => {
    const plat = w.platforms[platformKey];
    if (!plat) return null;

    const netAmt = plat.revenue + plat.cashCollection + plat.toll + plat.incentive + plat.subscription;

    return (
      <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden transition-all duration-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3.5 bg-bg-elevated flex items-center gap-3 cursor-pointer text-left focus:outline-none"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-opacity-10 ${colorClass}`}>
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-text-primary flex-1">{title} {t('hisaab.earnings', 'Earnings')}</span>
          <span className={`text-xs font-black mr-1 ${netAmt >= 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
            {formatCurrency(netAmt)}
          </span>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="p-4 space-y-3 border-t border-border-subtle text-left">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.tripsCompleted">Trips Completed</span>
              <span className="text-text-primary font-black font-mono">{plat.trips} rides</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.digitalEarnings">Digital Earnings</span>
              <span className="text-success-brand font-black font-mono">+{formatCurrency(plat.revenue)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.cashCollected">Cash Collected</span>
                <p className="text-[10px] text-text-muted leading-none">Driver holds fares</p>
              </div>
              <span className="text-danger-brand font-black font-mono">-{formatCurrency(Math.abs(plat.cashCollection))}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.tollPassThrough">Toll Refund</span>
              <span className="text-success-brand font-black font-mono">+{formatCurrency(plat.toll)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.incentives">Platform Incentives</span>
              <span className="text-success-brand font-black font-mono">+{formatCurrency(plat.incentive)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.subscription">Subscription Deduction</span>
              <span className="text-danger-brand font-black font-mono">-{formatCurrency(Math.abs(plat.subscription))}</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-primary font-black uppercase tracking-wider text-[10px]" data-i18n="hisaab.netPosition">Net Position</span>
              <span className={`text-sm font-black font-mono ${netAmt >= 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
                {formatCurrency(netAmt)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Compute overall totals for platform
  const totalUberNet = w.platforms.uber.revenue + w.platforms.uber.cashCollection + w.platforms.uber.toll + w.platforms.uber.incentive + w.platforms.uber.subscription;
  const totalOlaNet = w.platforms.ola ? (w.platforms.ola.revenue + w.platforms.ola.cashCollection + w.platforms.ola.toll + w.platforms.ola.incentive + w.platforms.ola.subscription) : 0;
  const totalRapidoNet = w.platforms.rapido ? (w.platforms.rapido.revenue + w.platforms.rapido.cashCollection + w.platforms.rapido.toll + w.platforms.rapido.incentive + w.platforms.rapido.subscription) : 0;
  const totalPlatformEarnings = totalUberKm => totalUberKm; // placeholder

  // Render correct summary card style
  const getSummaryStyle = () => {
    if (w.status === 'in_progress') {
      return {
        bg: 'from-summary-progress-from to-summary-progress-to border-summary-progress-border text-summary-progress-text',
        badge: 'bg-info-dim text-summary-progress-text border-summary-progress-border/40',
        text: 'Estimated Net',
        statusLabel: t('hisaab.inProgress', 'In Progress')
      };
    } else if (w.toCollect > 0) {
      return {
        bg: 'from-summary-due-from to-summary-due-to border-summary-due-border text-summary-due-text',
        badge: 'bg-danger-dim text-summary-due-text border-summary-due-border/40',
        text: 'You Owe LetzRyd',
        statusLabel: 'Pending Due'
      };
    } else {
      return {
        bg: 'from-summary-settled-from to-summary-settled-to border-summary-settled-border text-summary-settled-text',
        badge: 'bg-success-dim text-summary-settled-text border-summary-settled-border/40',
        text: 'LetzRyd Paid You',
        statusLabel: 'Settled Payout'
      };
    }
  };

  const cardConfig = getSummaryStyle();

  return (
    <div className="space-y-4 text-left">
      {/* Week Navigation */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-3 flex items-center justify-between shadow-sm">
        <button
          onClick={onPrevWeek}
          disabled={weekIndex >= weeks.length - 1}
          className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:text-text-primary cursor-pointer transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-black text-text-primary leading-none">
            {getWeekRangeShort(w.weekStart, w.weekEnd)}
          </p>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">
            {getWeekLabel(w.status, weekIndex)}
          </p>
        </div>
        <button
          onClick={onNextWeek}
          disabled={weekIndex <= 0}
          className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:text-text-primary cursor-pointer transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Hero Card */}
      <div className={`bg-gradient-to-br ${cardConfig.bg} border rounded-2xl p-5 text-center shadow-lg relative overflow-hidden`}>
        <span className="text-[10px] text-current uppercase tracking-widest font-black opacity-75">
          {cardConfig.text}
        </span>
        <div className="text-4xl font-black mt-4 leading-none tracking-tight">
          {w.status === 'in_progress' ? formatCurrency(-w.currentWeekOs) : w.toCollect > 0 ? formatCurrency(w.toCollect) : formatCurrency(w.toPay)}
        </div>
        <p className="text-xs text-current mt-2 font-medium opacity-80">
          {w.status === 'in_progress' ? 'Settlement scheduled on Sunday midnight' : w.toCollect > 0 ? 'Please settle at your earliest' : 'Payment disbursed successfully'}
        </p>
        <div className="mt-3.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${cardConfig.badge}`}>
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            {cardConfig.statusLabel}
          </span>
        </div>
      </div>

      {/* Settle Action Button */}
      {w.toCollect > 0 && loginType === 'driver' && (
        <button
          onClick={() => onPayClick(w.toCollect)}
          className="w-full py-4 rounded-xl bg-danger-brand text-white font-black hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-danger-brand/10 hover:-translate-y-0.5 transition-all"
        >
          <Calculator className="w-4.5 h-4.5" />
          Pay {formatCurrency(w.toCollect)} to LetzRyd
        </button>
      )}

      {/* Quick Plan Info */}
      {loginType === 'driver' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-purple-500/10 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider leading-none">Rental Plan</p>
            <p className="text-xs font-black text-text-primary mt-1">Standard · ₹1,000/active day</p>
          </div>
          <span className="text-[10px] font-bold text-text-muted">7d billing</span>
        </div>
      )}

      {/* collapsible breakdown sections */}
      <div className="space-y-2.5">
        {/* Uber */}
        {renderPlatformSection('uber', 'Uber', uberOpen, setUberOpen, 'bg-success-brand text-success-brand', 'border-success-brand/25')}

        {/* Ola */}
        {renderPlatformSection('ola', 'Ola', olaOpen, setOlaOpen, 'bg-warning-brand text-warning-brand', 'border-warning-brand/25')}

        {/* Rapido */}
        {renderPlatformSection('rapido', 'Rapido', rapidoOpen, setRapidoOpen, 'bg-danger-brand text-danger-brand', 'border-danger-brand/25')}

        {/* Vehicle Rent Accordion */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
          <button
            onClick={() => setRentOpen(!rentOpen)}
            className="w-full px-4 py-3.5 bg-bg-elevated flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-text-primary flex-1" data-i18n="hisaab.rent">Vehicle Rent</span>
            <span className="text-xs font-black mr-1 text-danger-brand">-{formatCurrency(w.rent.netWeeklyRent)}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${rentOpen ? 'rotate-180' : ''}`} />
          </button>

          {rentOpen && (
            <div className="p-4 space-y-3 border-t border-border-subtle text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.dailyRate">Daily Rate</span>
                <span className="text-text-primary font-black font-mono">{formatCurrency(w.rent.dailyRate, 0)} / day</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.activeDays">Active Days</span>
                <span className="text-text-primary font-black font-mono">{w.activeDays} days</span>
              </div>
              <div className="h-[1px] bg-border-subtle" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-primary font-black uppercase tracking-wider text-[10px]" data-i18n="hisaab.totalWeeklyRent">Total Weekly Rent</span>
                <span className="text-sm font-black text-danger-brand font-mono">-{formatCurrency(w.rent.netWeeklyRent)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Deductions & Fines Accordion */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
          <button
            onClick={() => setDeductionsOpen(!deductionsOpen)}
            className="w-full px-4 py-3.5 bg-bg-elevated flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-danger-dim text-danger-brand">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-text-primary flex-1" data-i18n="hisaab.deductionsFines">Deductions & Fines</span>
            <span className="text-xs font-black mr-1 text-danger-brand">
              -{formatCurrency(w.tds + w.challan + w.accident + Math.max(0, w.adjustment))}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${deductionsOpen ? 'rotate-180' : ''}`} />
          </button>

          {deductionsOpen && (
            <div className="p-4 space-y-3 border-t border-border-subtle text-left">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-text-secondary font-semibold" data-i18n="hisaab.tds">TDS Deduction (1%)</span>
                  <p className="text-[10px] text-text-muted leading-none">Standard withholdings</p>
                </div>
                <span className="text-danger-brand font-black font-mono">-{formatCurrency(w.tds)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-text-secondary font-semibold" data-i18n="hisaab.trafficChallan">Traffic Challan Fines</span>
                  <p className="text-[10px] text-text-muted leading-none">Road violations</p>
                </div>
                <span className="text-danger-brand font-black font-mono">-{formatCurrency(w.challan)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.accidentPenalty">Accident Penalty</span>
                <span className="text-danger-brand font-black font-mono">-{formatCurrency(w.accident)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-text-secondary font-semibold" data-i18n="hisaab.manualAdjustment">Manual Adjustment</span>
                  <p className="text-[10px] text-text-muted leading-none">Lump sum corrections</p>
                </div>
                <span className={`font-black font-mono ${w.adjustment < 0 ? 'text-success-brand' : 'text-text-primary'}`}>
                  {w.adjustment !== 0 ? (w.adjustment < 0 ? `+${formatCurrency(Math.abs(w.adjustment))}` : `-${formatCurrency(w.adjustment)}`) : '₹0.00'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* GPS & Dead KM Accordion */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
          <button
            onClick={() => setGpsOpen(!gpsOpen)}
            className="w-full px-4 py-3.5 bg-bg-elevated flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-info-dim text-info-brand">
              <Route className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-text-primary flex-1" data-i18n="hisaab.gpsAndDeadKm">GPS & Dead KM</span>
            <span className="text-xs font-black mr-1 text-danger-brand">-{formatCurrency(w.gps.deadKmPenalty)}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${gpsOpen ? 'rotate-180' : ''}`} />
          </button>

          {gpsOpen && (
            <div className="p-4 space-y-4 border-t border-border-subtle text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.platformKm">Rides Platform KM</span>
                <span className="text-text-primary font-black font-mono">
                  {(w.platforms.uber.km + w.platforms.ola.km + w.platforms.rapido.km).toFixed(2)} km
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.idealGpsKm">Ideal Allowed KM</span>
                <span className="text-text-primary font-black font-mono">{w.gps.idealGpsKm.toFixed(2)} km</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-semibold" data-i18n="hisaab.actualGpsKm">Actual Tracker KM</span>
                <span className="text-text-primary font-black font-mono">{w.gps.totalGpsKm.toFixed(2)} km</span>
              </div>

              {/* Progress scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  <span data-i18n="hisaab.gpsVsIdeal">GPS vs Allowed Delta</span>
                  <span className={`font-black ${w.gps.deadMilePct > 20 ? 'text-danger-brand' : w.gps.deadMilePct > 0 ? 'text-warning-brand' : 'text-success-brand'}`}>
                    {w.gps.deadMilePct.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden border border-border-subtle">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      w.gps.deadMilePct > 20 ? 'bg-danger-brand' : w.gps.deadMilePct > 0 ? 'bg-warning-brand' : 'bg-success-brand'
                    }`}
                    style={{ width: `${Math.min((w.gps.totalGpsKm / w.gps.idealGpsKm) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Explainer banner */}
              <div className="p-3 rounded-xl bg-bg-elevated border border-border-subtle text-[11px] leading-relaxed">
                {w.gps.deadMilePct > 20 ? (
                  <p className="text-danger-brand font-semibold">
                    GPS Mileage {w.gps.deadMilePct.toFixed(1)}% exceeds 20% free dead-miles threshold. Penalty of ₹5/km charged on extra {w.gps.deadMile.toFixed(2)} km.
                  </p>
                ) : (
                  <p className="text-success-brand font-semibold">
                    GPS Mileage matches parameters. Excess mileage is within 20% free allowance; no penalties apply.
                  </p>
                )}
              </div>

              <div className="h-[1px] bg-border-subtle" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-text-primary font-black uppercase tracking-wider text-[10px]" data-i18n="hisaab.deadKmPenalty">Dead KM Penalty</span>
                <span className="text-sm font-black text-danger-brand font-mono">-{formatCurrency(w.gps.deadKmPenalty)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Settlement Summary Accordion */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden">
          <button
            onClick={() => setSettlementOpen(!settlementOpen)}
            className="w-full px-4 py-3.5 bg-bg-elevated flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 bg-success-dim text-success-brand">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-text-primary flex-1" data-i18n="hisaab.settlement">Settlement Balance</span>
            <span className="text-xs font-black mr-1 text-text-primary">Summary</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${settlementOpen ? 'rotate-180' : ''}`} />
          </button>

          {settlementOpen && (
            <div className="p-4 space-y-4 border-t border-border-subtle text-left">
              <div className="bg-bg-elevated rounded-xl p-3.5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold" data-i18n="hisaab.currentWeekOs">Current Week Outstanding</span>
                  <span className={`font-black font-mono ${w.currentWeekOs < 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
                    {w.currentWeekOs < 0 ? 'LetzRyd pays you' : 'You pay LetzRyd'}<br />
                    <span className="text-right block text-sm mt-0.5">{formatCurrency(w.currentWeekOs)}</span>
                  </span>
                </div>
                <div className="h-[1px] bg-border-subtle" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold" data-i18n="hisaab.pendingDues">Pending Prior Dues</span>
                  <span className="text-text-primary font-black font-mono">{formatCurrency(w.pendingDue)}</span>
                </div>
                <div className="h-[1.5px] border-t border-dashed border-border-bright mt-1 pt-3" />
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-text-primary uppercase tracking-wider text-[10px]" data-i18n="hisaab.totalOs">Cumulative Total Outstanding</span>
                  <span className={`text-base font-black font-mono ${w.totalOs < 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
                    {formatCurrency(w.totalOs)}
                  </span>
                </div>
              </div>

              {/* Explainer note */}
              <div className="p-3.5 rounded-xl bg-bg-card border border-border-subtle text-[11px] text-text-muted leading-relaxed">
                <strong className="text-text-secondary font-bold">Calculation Formula:</strong><br />
                Net Outstanding = Rent + TDS + Challans + GPS Penalties + Adjustments − Net Platform Earnings.<br />
                <span className="text-success-brand font-bold">• Negative (-) balance:</span> LetzRyd credits payout to driver bank.<br />
                <span className="text-danger-brand font-bold">• Positive (+) balance:</span> Driver pays remaining due to LetzRyd.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Week specific notification notes */}
      {w.notes && (
        <div className="p-4 rounded-xl bg-info-dim/15 border border-info-brand/20 text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-info-brand shrink-0 mt-0.5" />
          <div>{w.notes}</div>
        </div>
      )}
    </div>
  );
};
