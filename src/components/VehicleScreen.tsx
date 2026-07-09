/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Car, FileText, BadgeCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleScreenProps {
  vehicle: Vehicle;
  onBack: () => void;
  onViewDoc: (doc: 'rc' | 'insurance' | 'permit') => void;
  onViewDriverDoc: (doc: 'aadhar' | 'dl') => void;
  t: (key: string, fallback: string) => string;
}

export const VehicleScreen: React.FC<VehicleScreenProps> = ({
  vehicle,
  onBack,
  onViewDoc,
  onViewDriverDoc,
  t
}) => {
  const getDaysUntil = (dateStr: string) => {
    const now = new Date('2026-06-25T00:00:00');
    const target = new Date(dateStr + 'T00:00:00');
    return Math.ceil((target.getTime() - now.getTime()) / 86400000);
  };

  const getExpiryClass = (days: number) => {
    if (days < 0) return 'text-danger-brand';
    if (days <= 90) return 'text-warning-brand';
    return 'text-success-brand';
  };

  const formatExpiryText = (dateStr: string, warnThreshold: number) => {
    const days = getDaysUntil(dateStr);
    const dateFormatted = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (days < 0) return `${dateFormatted} (EXPIRED)`;
    if (days <= warnThreshold) return `${dateFormatted} (${days}d left)`;
    return dateFormatted;
  };

  const formatMonthsAllocated = (startStr: string) => {
    const now = new Date('2026-06-25');
    const start = new Date(startStr);
    const months = Math.floor((now.getTime() - start.getTime()) / (86400000 * 30));
    return `${months} months (since ${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})`;
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
          <h2 className="text-xl font-black text-text-primary" data-i18n="vehicle.title">
            {t('vehicle.title', 'Vehicle Details')}
          </h2>
          <p className="text-xs text-text-secondary" data-i18n="vehicle.subtitle">
            {t('vehicle.subtitle', 'Compliance, documentation & platform status')}
          </p>
        </div>
      </div>

      {/* Vehicle Hero Card */}
      <div className="bg-gradient-to-br from-card-blue-from to-card-blue-to border border-card-blue-border rounded-2xl p-6 text-center space-y-4 shadow-lg">
        <div className="flex justify-center text-info-brand">
          <Car className="w-12 h-12" />
        </div>

        <div>
          <h3 className="text-lg font-black text-text-primary">{vehicle.make} {vehicle.model}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{vehicle.variant}</p>
        </div>

        {/* License Plate */}
        <div className="inline-block bg-[#FFFDE7] text-[#111] border-2 border-[#C9A218] rounded-lg px-4 py-1.5 font-bold tracking-widest text-sm shadow-md font-mono">
          {vehicle.number}
        </div>

        {/* Platform Status list */}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {Object.entries(vehicle.platforms).map(([platform, item]) => {
            const info = item as { status: 'active' | 'inactive'; rating: number; trips: number };
            return (
              <span
                key={platform}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  info.status === 'active'
                    ? 'bg-success-dim text-success-brand border border-success-brand/15'
                    : 'bg-bg-elevated text-text-muted border border-border-subtle'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${info.status === 'active' ? 'bg-success-brand' : 'bg-text-muted'}`} />
                {platform} {info.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            );
          })}
        </div>


      </div>

      {/* Details grid */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="vehicle.details">
          Specifications
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.year">Model Year</span>
            <span className="text-xs font-bold text-text-primary">{vehicle.year}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.fuelType">Fuel Type</span>
            <span className="text-xs font-bold text-text-primary">{vehicle.fuelType}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.color">Color</span>
            <span className="text-xs font-bold text-text-primary">{vehicle.color}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.odometer">Odometer</span>
            <span className="text-xs font-bold text-text-primary font-mono">{vehicle.odometer.toLocaleString('en-IN')} km</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.permitType">Permit Type</span>
            <span className="text-xs font-bold text-text-primary">{vehicle.permitType}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.withLetzryd">With LetzRyd</span>
            <span className="text-xs font-bold text-text-primary">{formatMonthsAllocated(vehicle.allocationStart)}</span>
          </div>
        </div>
      </div>

      {/* Documents validity */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="vehicle.docs">
          Compliance Expiry
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.fitnessCert">Fitness Cert (FC)</span>
            <span className={`text-xs font-bold ${getExpiryClass(getDaysUntil(vehicle.fitnessExpiry))}`}>
              {formatExpiryText(vehicle.fitnessExpiry, 90)}
            </span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.insurance">Insurance Policy</span>
            <span className={`text-xs font-bold ${getExpiryClass(getDaysUntil(vehicle.insuranceExpiry))}`}>
              {formatExpiryText(vehicle.insuranceExpiry, 60)}
            </span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.permitExpiry">Permit Validity</span>
            <span className={`text-xs font-bold ${getExpiryClass(getDaysUntil(vehicle.permitExpiry))}`}>
              {formatExpiryText(vehicle.permitExpiry, 90)}
            </span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider" data-i18n="vehicle.puc">PUC Certificate</span>
            <span className={`text-xs font-bold ${getExpiryClass(getDaysUntil(vehicle.pucExpiry))}`}>
              {formatExpiryText(vehicle.pucExpiry, 30)}
            </span>
          </div>
        </div>
      </div>

      {/* Document viewers grid */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="vehicle.viewableDocs">
          View Vehicle Documents
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onViewDoc('rc')}
            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center space-y-2 cursor-pointer transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-info-dim text-info-brand flex items-center justify-center mx-auto">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-text-primary">RC</p>
            <p className="text-[9px] text-text-muted">Registration</p>
          </button>

          <button
            onClick={() => onViewDoc('insurance')}
            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center space-y-2 cursor-pointer transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-success-dim text-success-brand flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-text-primary">Insurance</p>
            <p className="text-[9px] text-text-muted">Policy Doc</p>
          </button>

          <button
            onClick={() => onViewDoc('permit')}
            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center space-y-2 cursor-pointer transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-text-primary">Permit</p>
            <p className="text-[9px] text-text-muted">Tourist (AITP)</p>
          </button>
        </div>
      </div>

      {/* Driver Doc viewers */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5" data-i18n="vehicle.driverDocs">
          View Driver Documents
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onViewDriverDoc('aadhar')}
            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center space-y-2 cursor-pointer transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-text-primary">Aadhar</p>
            <p className="text-[9px] text-text-muted">National ID Proof</p>
          </button>

          <button
            onClick={() => onViewDriverDoc('dl')}
            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center space-y-2 cursor-pointer transition-all shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-black text-text-primary">Driving License</p>
            <p className="text-[9px] text-text-muted">Driver Permit DL</p>
          </button>
        </div>
      </div>

      {/* Compliance Warning strip */}
      <div className="p-4 rounded-xl bg-warning-dim/15 border border-warning-brand/20 text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-warning-brand shrink-0 mt-0.5" />
        <div data-i18n="vehicle.notice">
          Documents displayed with dates in <span className="text-warning-brand font-black">amber</span> expire within 90 days. Please verify updates or renewals with the central office to prevent platform registration locks.
        </div>
      </div>
    </div>
  );
};
