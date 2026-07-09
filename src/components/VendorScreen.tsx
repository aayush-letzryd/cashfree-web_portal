/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, Car, Search, Play, Pause, AlertTriangle, ArrowRight } from 'lucide-react';
import { Fleet } from '../types';

interface VendorScreenProps {
  fleet: Fleet;
  onSelectVehicle: (number: string) => void;
  t: (key: string, fallback: string) => string;
}

export const VendorScreen: React.FC<VendorScreenProps> = ({
  fleet,
  onSelectVehicle,
  t
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate cumulative fleet statistics
  const totalVehicles = fleet.vehicles.length;
  const activeVehicles = fleet.vehicles.filter((v) => v.status === 'active').length;
  const idleVehicles = fleet.vehicles.filter((v) => v.status === 'idle').length;

  // Cumulative Fleet O/S across all vehicles (current week)
  const totalFleetOs = fleet.vehicles.reduce((sum, v) => sum + v.currentWeekOs, 0);

  // Filtered vehicles list based on search query
  const filteredVehicles = fleet.vehicles.filter(
    (v) =>
      v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return '₹' + Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Operator Title Header */}
      <div>
        <h2 className="text-xl font-black text-text-primary" data-i18n="vendor.dashboardTitle">
          {t('vendor.dashboardTitle', 'Vendor Fleet Dashboard')}
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          {t('vendor.homeSub', 'Real-time financial positions & vehicle utilization')}
        </p>
      </div>

      {/* Operator Cumulative Balances */}
      <div className="bg-gradient-to-br from-card-blue-from to-card-blue-to border border-card-blue-border rounded-2xl p-5 text-center shadow-lg relative overflow-hidden">
        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-80" data-i18n="vendor.totalOs">
          Cumulative Fleet Position
        </p>
        <div className={`text-4xl font-black mt-4 leading-none tracking-tight ${totalFleetOs < 0 ? 'text-success-brand' : 'text-danger-brand'}`}>
          {formatCurrency(totalFleetOs)}
        </div>
        <p className="text-xs text-text-secondary mt-2 font-semibold">
          {totalFleetOs < 0 ? t('vendor.surplus', 'Fleet Net Surplus — LetzRyd Pays Operator') : t('vendor.due', 'Fleet Net Debt — Operator Pays LetzRyd')}
        </p>
      </div>

      {/* Fleet Stats Indicators */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-bg-surface border border-border-subtle rounded-xl text-center">
          <p className="text-base font-black text-text-primary">{totalVehicles}</p>
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-1" data-i18n="vendor.vehicles">Total Vehicles</p>
        </div>
        <div className="p-3 bg-bg-surface border border-border-subtle rounded-xl text-center border-success-brand/10">
          <p className="text-base font-black text-success-brand">{activeVehicles}</p>
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-1" data-i18n="vendor.active">Active</p>
        </div>
        <div className="p-3 bg-bg-surface border border-border-subtle rounded-xl text-center">
          <p className="text-base font-black text-text-muted">{idleVehicles}</p>
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-1" data-i18n="vendor.idle">Idle</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by driver, plate number, or vehicle model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-surface border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none"
        />
      </div>

      {/* Vehicle Fleet Cards list */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="vendor.fleetVehicles">
          Vehicles in Fleet ({filteredVehicles.length})
        </h3>

        <div className="space-y-2.5">
          {filteredVehicles.length === 0 ? (
            <div className="py-12 text-center text-text-muted flex flex-col items-center justify-center">
              <Car className="w-12 h-12 stroke-[1.1] opacity-30 mb-2" />
              <p className="text-xs font-semibold">No matching vehicles found</p>
            </div>
          ) : (
            filteredVehicles.map((v) => (
              <div
                key={v.number}
                onClick={() => onSelectVehicle(v.number)}
                className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:translate-y-[-1px] transition-all duration-150 shadow-sm"
              >
                {/* Left icon */}
                <div className="w-10 h-10 rounded-xl bg-info-dim text-info-brand flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>

                {/* Middle info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-text-primary leading-tight font-mono">
                    {v.number}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">
                    {v.make} {v.model}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 font-bold">
                    Driver: {v.driverName}
                  </p>
                </div>

                {/* Right financial + status */}
                <div className="text-right shrink-0 space-y-1">
                  <p className={`text-sm font-black font-mono ${v.currentWeekOs < 0 ? 'text-success-brand' : v.currentWeekOs > 0 ? 'text-danger-brand' : 'text-text-muted'}`}>
                    {v.currentWeekOs === 0 ? 'Settled' : formatCurrency(v.currentWeekOs)}
                  </p>
                  <p className="text-[9px] text-text-muted font-semibold leading-none">
                    {v.currentWeekOs < 0 ? t('vendor.letzrydPays', 'Pays you') : v.currentWeekOs > 0 ? t('vendor.youCollect', 'You collect') : 'Balanced'}
                  </p>

                  <span className={`inline-flex items-center gap-1 mt-1.5 text-[9px] font-black uppercase tracking-wider ${
                    v.status === 'active' ? 'text-success-brand' : 'text-text-muted'
                  }`}>
                    {v.status === 'active' ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-success-brand shrink-0" />
                        Active
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-text-muted shrink-0" />
                        Idle
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
