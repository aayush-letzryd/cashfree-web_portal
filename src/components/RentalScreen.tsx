/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, FileText, Calendar, CheckSquare, RefreshCw, BadgePercent } from 'lucide-react';
import { RentalPlan } from '../types';

interface RentalScreenProps {
  plan: RentalPlan;
  onBack: () => void;
  t: (key: string, fallback: string) => string;
}

export const RentalScreen: React.FC<RentalScreenProps> = ({ plan, onBack, t }) => {
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
          <h2 className="text-xl font-black text-text-primary">
            {t('rental.title', 'Rental Plan')}
          </h2>
          <p className="text-xs text-text-secondary">
            {t('rental.subtitle', 'Current rate metrics & conditions')}
          </p>
        </div>
      </div>

      {/* Contract Premium Hero Box */}
      <div className="bg-gradient-to-br from-purple-950/80 to-indigo-950 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-purple-950/10">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase text-[10px] tracking-widest mb-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span data-i18n="rental.currentPlan">{t('rental.currentPlan', 'Current Plan')}</span>
        </div>
        <h3 className="text-2xl font-black text-text-primary leading-tight">{plan.name} Plan</h3>
        <div className="text-4xl font-black text-text-primary mt-4 leading-none tracking-tight">
          ₹{plan.dailyRate.toLocaleString('en-IN')}
          <span className="text-sm font-medium text-text-secondary">/day</span>
        </div>
        <p className="text-xs text-text-muted mt-3 font-semibold flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          {t('rental.activeSince', 'Active since')} {plan.planStart} • {plan.activeMonths} {t('rental.months', 'months')}
        </p>
      </div>

      {/* Detail list */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="rental.planDetails">
          Rates Breakdown
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="rental.dailyRate">Daily Rate</span>
            <span className="text-xs font-bold text-text-primary">₹{plan.dailyRate.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="rental.weekly">Weekly Rent</span>
            <span className="text-xs font-bold text-text-primary">
              ₹{(plan.dailyRate * 7).toLocaleString('en-IN')} / {t('rental.week', 'week')}
            </span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="rental.startDate">Plan Start Date</span>
            <span className="text-xs font-bold text-text-primary">{plan.planStart}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="rental.duration">Active Duration</span>
            <span className="text-xs font-bold text-text-primary">
              {plan.activeMonths} {t('rental.months', 'months')}
            </span>
          </div>
        </div>
      </div>

      {/* How Rent Works Explanation */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="rental.howRentWorks">
          How Rent Works
        </h3>
        <div className="p-5 rounded-2xl bg-bg-surface border border-border-subtle space-y-4">
          <div className="flex gap-3 text-xs leading-relaxed">
            <div className="w-6 h-6 rounded-full bg-accent-dim text-accent-brand flex items-center justify-center shrink-0 font-black text-[10px]">
              1
            </div>
            <div className="text-text-secondary font-medium">
              Rent is accrued exclusively for each <strong className="text-text-primary">Active Day</strong>. An active day constitutes any day of the calendar week with at least 1 completed ride logged across ride-hailing networks.
            </div>
          </div>

          <div className="h-[1px] bg-border-subtle" />

          <div className="flex gap-3 text-xs leading-relaxed">
            <div className="w-6 h-6 rounded-full bg-accent-dim text-accent-brand flex items-center justify-center shrink-0 font-black text-[10px]">
              2
            </div>
            <div className="text-text-secondary font-medium">
              Weekly rent totals are compared against your <strong className="text-text-primary">net platform earnings</strong>. Net digital payout minus cash collections represents your baseline position.
            </div>
          </div>

          <div className="h-[1px] bg-border-subtle" />

          <div className="flex gap-3 text-xs leading-relaxed">
            <div className="w-6 h-6 rounded-full bg-accent-dim text-accent-brand flex items-center justify-center shrink-0 font-black text-[10px]">
              3
            </div>
            <div className="text-text-secondary font-medium">
              If platform earnings <strong className="text-success-brand">exceed</strong> rent, LetzRyd pays you the surplus. If earnings fall <strong className="text-danger-brand">below</strong>, the driver settles the remaining balance to the operator.
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-accent-dim/10 border border-accent-brand/20 text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
        <CheckSquare className="w-5 h-5 text-accent-brand shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold text-text-primary leading-tight">Plan Master Rules</p>
          <p className="mt-1">{plan.note}</p>
        </div>
      </div>
    </div>
  );
};
