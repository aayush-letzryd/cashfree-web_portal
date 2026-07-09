/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Coins,
  Route,
  Activity,
  Calculator
} from 'lucide-react';
import { FleetVehicle, HisaabWeek } from '../types';

interface VendorVehicleScreenProps {
  vehicle: FleetVehicle;
  weekIndex: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onBack: () => void;
  t: (key: string, fallback: string) => string;
}

export const VendorVehicleScreen: React.FC<VendorVehicleScreenProps> = ({
  vehicle,
  weekIndex,
  onPrevWeek,
  onNextWeek,
  onBack,
  t
}) => {
  const [uberOpen, setUberOpen] = useState(true);
  const [olaOpen, setOlaOpen] = useState(false);
  const [rapidoOpen, setRapidoOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [gpsOpen, setGpsOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(true);

  // Reset collapsible sections when selected vehicle changes
  useEffect(() => {
    setUberOpen(true);
    setOlaOpen(false);
    setRapidoOpen(false);
    setRentOpen(false);
    setDeductionsOpen(false);
    setGpsOpen(false);
    setSettlementOpen(true);
  }, [vehicle]);

  const weeks = vehicle.hisaabWeeks;
  if (!weeks || weeks.length === 0) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-bright cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-black text-text-primary font-mono">{vehicle.number}</h2>
            <p className="text-xs text-text-secondary">{vehicle.driverName}</p>
          </div>
        </div>
        <div className="py-12 text-center text-text-muted flex flex-col items-center justify-center">
          <Activity className="w-12 h-12 stroke-[1.2] opacity-35 mb-3" />
          <p className="text-sm font-semibold">{t('hisaab.noData', 'No data registered')}</p>
        </div>
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

  const getWeekLabelLocal = (status: 'in_progress' | 'to_collect' | 'settled_pay', idx: number) => {
    if (status === 'in_progress') return t('hisaab.inProgress', 'In Progress');
    if (idx === 1) return 'Last Week';
    return 'Settled Period';
  };

  const renderPlatformSectionLocal = (
    platformKey: 'uber' | 'ola' | 'rapido',
    title: string,
    isOpen: boolean,
    setIsOpen: (val: boolean) => void,
    colorClass: string
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
          <div className="p-4 space-y-3 border-t border-border-subtle text-left mb-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.tripsCompleted">Trips Completed</span>
              <span className="text-text-primary font-bold">{plat.trips} trips</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.digitalEarnings">Digital Earnings</span>
              <span className="text-success-brand font-bold font-mono">+{formatCurrency(plat.revenue)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.cashCollected">Cash Collected (Held)</span>
              <span className="text-danger-brand font-bold font-mono">-{formatCurrency(Math.abs(plat.cashCollection))}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.tollPassThrough">Toll Refund</span>
              <span className="text-success-brand font-bold font-mono">+{formatCurrency(plat.toll)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.incentives">Platform Incentives</span>
              <span className="text-success-brand font-bold font-mono">+{formatCurrency(plat.incentive)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold" data-i18n="hisaab.subscription">Subscription Fee</span>
              <span className="text-danger-brand font-bold font-mono">-{formatCurrency(Math.abs(plat.subscription))}</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-text-primary uppercase tracking-wider text-[10px]" data-i18n="hisaab.netPosition">Net Position</span>
              <span className={netAmt >= 0 ? 'text-success-brand' : 'text-danger-brand'}>{formatCurrency(netAmt)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getSummaryCardStyle = (week: HisaabWeek) => {
    if (week.status === 'in_progress') return 'bg-[#0F172A] border-info-brand/20 shadow-md';
    if (week.toCollect > 0) return 'bg-danger-dim/30 border-danger-brand/20 shadow-md shadow-danger-brand/5';
    return 'bg-success-dim/30 border-success-brand/20 shadow-md shadow-success-brand/5';
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
          <h2 className="text-xl font-black text-text-primary font-mono">{vehicle.number}</h2>
          <p className="text-xs text-text-secondary">
            {vehicle.make} {vehicle.model} • {vehicle.driverName}
          </p>
        </div>
      </div>

      {/* Week nav */}
      <div className="bg-bg-surface border border-border-subtle rounded-xl p-3 flex items-center justify-between">
        <button
          onClick={onPrevWeek}
          disabled={weekIndex >= weeks.length - 1}
          className="w-8 h-8 rounded bg-bg-elevated border border-border-subtle text-text-secondary flex items-center justify-center cursor-pointer disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold text-text-primary">
            {getWeekRangeShort(w.weekStart, w.weekEnd)}
          </p>
          <p className="text-[10px] text-text-muted font-bold tracking-wider mt-0.5 uppercase">
            {getWeekLabelLocal(w.status, weekIndex)}
          </p>
        </div>
        <button
          onClick={onNextWeek}
          disabled={weekIndex <= 0}
          className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Card */}
      <div className={`rounded-2xl p-5 border text-center ${getSummaryCardStyle(w)}`}>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1.5" data-i18n="hisaab.estimatedNet">
          Estimated Net
        </p>
        <div
          className="text-3xl font-black leading-none tracking-tight"
          style={{
            color:
              w.status === 'in_progress' ? 'var(--color-info-brand)' :
              w.toCollect > 0 ? 'var(--color-danger-brand)' : 'var(--color-success-brand)'
          }}
        >
          {formatCurrency(w.currentWeekOs)}
        </div>
        <p className="text-[11px] text-text-secondary mt-2.5 font-semibold">
          {w.status === 'in_progress' ? t('hisaab.finalSun', 'Final settlement on Sunday') :
           w.toCollect > 0 ? t('hisaab.collectNow', 'Collect from driver at earliest') : t('hisaab.paid', 'Payment completed')}
        </p>
      </div>

      {/* Platform Expandables */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Platform Activity</h3>
        
        {renderPlatformSectionLocal('uber', 'Uber', uberOpen, setUberOpen, 'text-success-brand')}
        {renderPlatformSectionLocal('ola', 'Ola', olaOpen, setOlaOpen, 'text-warning-brand')}
        {renderPlatformSectionLocal('rapido', 'Rapido', rapidoOpen, setRapidoOpen, 'text-danger-brand')}
      </div>

      {/* Rent Section */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="hisaab.rent">
          Vehicle Rental
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.dailyRate">Daily Rate</span>
            <span className="text-text-primary font-bold">{formatCurrency(w.rent.dailyRate)}</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.activeDays">Active Days</span>
            <span className="text-text-primary font-black">{w.activeDays} days</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-primary font-black uppercase tracking-wider text-[10px]" data-i18n="hisaab.totalWeeklyRent">Total Weekly Rent</span>
            <span className="text-sm font-black text-danger-brand">– {formatCurrency(w.rent.netWeeklyRent)}</span>
          </div>
        </div>
      </div>

      {/* Deductions Section */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="hisaab.deductionsFines">
          Fines & Adjustments
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.tds">TDS</span>
            <span className="text-text-primary font-bold">{w.tds > 0 ? `-${formatCurrency(w.tds)}` : '₹0.00'}</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.challan">Challans</span>
            <span className="text-danger-brand font-bold">{w.challan > 0 ? `-${formatCurrency(w.challan)}` : '₹0.00'}</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.accident">Accident Fines</span>
            <span className="text-danger-brand font-bold">{w.accident > 0 ? `-${formatCurrency(w.accident)}` : '₹0.00'}</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.adjustment">Adjustment</span>
            <span className={`text-xs font-bold ${w.adjustment < 0 ? 'text-success-brand' : w.adjustment > 0 ? 'text-danger-brand' : 'text-text-primary'}`}>
              {w.adjustment !== 0 ? (w.adjustment < 0 ? `+${formatCurrency(Math.abs(w.adjustment))}` : `-${formatCurrency(w.adjustment)}`) : '₹0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* GPS details */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="hisaab.gpsAndDeadKm">
          GPS Tracking & Dead KM
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold">Total GPS KM Logged</span>
            <span className="text-text-primary font-bold font-mono">{w.gps.totalGpsKm.toFixed(2)} km</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold">Allowed Base KM limit</span>
            <span className="text-text-primary font-bold font-mono">{w.gps.idealGpsKm.toFixed(2)} km</span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.deadMiles">Dead Miles Above Limit</span>
            <span className="text-text-primary font-bold font-mono text-warning-brand">{w.gps.deadMile.toFixed(2)} km</span>
          </div>
          <div className="h-[1.5px] border-t border-dashed border-border-bright mt-1 pt-3" />
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-text-primary uppercase tracking-wider text-[10px]" data-i18n="hisaab.deadKmPenalty">Dead KM Fine penalty</span>
            <span className="text-sm font-black text-danger-brand font-mono">+{formatCurrency(w.gps.deadKmPenalty)}</span>
          </div>
        </div>
      </div>

      {/* Settlement overview */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="hisaab.settlementSummary">
          Settlement Balance
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.currentWeekOs">Current Week Balance</span>
            <span className={`text-sm font-black ${w.currentWeekOs < 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
              {formatCurrency(w.currentWeekOs)}
            </span>
          </div>
          <div className="h-[1px] bg-border-subtle" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secondary font-semibold" data-i18n="hisaab.pendingDues">Prior Weeks Pending</span>
            <span className="text-text-primary font-bold">{formatCurrency(w.pendingDue)}</span>
          </div>
          <div className="h-[1.5px] border-t border-dashed border-border-bright" />
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-text-primary uppercase tracking-wider text-[10px]" data-i18n="hisaab.totalOs">Total Fleet O/S</span>
            <span className={`text-base font-black font-mono ${w.totalOs < 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
              {formatCurrency(w.totalOs)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {w.notes && (
        <div className="p-4 rounded-xl bg-info-dim/15 border border-info-brand/20 text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
          <Clock className="w-5 h-5 text-info-brand shrink-0 mt-0.5" />
          <div>{w.notes}</div>
        </div>
      )}
    </div>
  );
};
