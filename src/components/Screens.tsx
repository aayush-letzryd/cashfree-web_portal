import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Car, CarFront, PhoneCall, MessageSquare, ArrowLeft, CheckCircle, CheckCircle2, XCircle, Clock, Search, Ticket as TicketIcon, Edit2, Check, CreditCard, Loader2, Smartphone, ArrowUpRight, Compass, Calculator, ChevronDown, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { User, Vehicle, HisaabWeek, Fleet, Ticket, RentalPlan, FleetVehicle } from '../types';

export const VehicleScreen: React.FC<{ vehicle: Vehicle; t: (key: string, fallback: string) => string }> = ({ vehicle, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <div>
        <h2 className="font-sans text-base font-bold text-text">{t('vehicle.title', 'Vehicle & Compliance Registry')}</h2>
        <p className="font-sans text-xs text-text-muted mt-0.5">{t('vehicle.subtitle', 'Specifications, validity status, and platform authorizations')}</p>
      </div>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-light text-green flex items-center justify-center shrink-0"><Car className="w-6 h-6" /></div>
          <div className="min-w-0 flex-1">
            <h3 className="font-sans text-base font-bold text-text leading-tight">{vehicle.make} {vehicle.model}</h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">{vehicle.variant} • {vehicle.color} • {vehicle.year}</p>
            <div className="inline-block mt-1.5 font-sans text-xs font-bold bg-yellow-light text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md">{vehicle.number}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HisaabScreen: React.FC<{ weeks: HisaabWeek[]; weekIndex: number; onPrevWeek: () => void; onNextWeek: () => void; onPayClick: (amount: number) => void; t: (key: string, fallback: string) => string }> = ({ weeks, weekIndex, onPrevWeek, onNextWeek, onPayClick, t }) => {
  const w = weeks[weekIndex];
  const formatCurrency = (val: number) => '₹' + Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  return (
    <div className="space-y-4 text-left font-sans">
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-extrabold text-primary bg-green-light px-2 py-0.5 rounded-md">Week #{w.weekNumber}</span>
          {w.isLocked ? <span className="flex items-center gap-1 font-sans text-xs font-bold text-amber-900 bg-yellow-light border border-amber-300 px-2.5 py-1 rounded-md"><Lock className="w-3.5 h-3.5" />{t('hisaab.locked', 'Locked Past Hisaab')}</span> : <span className="font-sans text-xs font-bold text-green bg-green-light px-2.5 py-1 rounded-md">{t('hisaab.inProgress', 'In Progress')}</span>}
        </div>
        <div className="font-sans text-2xl font-extrabold text-primary mt-1">{formatCurrency(w.currentWeekOs)}</div>
        {w.currentWeekOs > 0 && <button onClick={() => onPayClick(w.currentWeekOs)} className="w-full mt-3 h-11 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer">Settle {formatCurrency(w.currentWeekOs)}</button>}
      </div>
    </div>
  );
};

export const SettleScreen: React.FC<{ amount: number; weekRange: string; upiId: string; onCopyUpi: () => void; onConfirmPayment: () => void; onBack: () => void; t: (key: string, fallback: string) => string }> = ({ amount, weekRange, upiId, onCopyUpi, onConfirmPayment, onBack, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-sans text-base font-bold text-text">{t('settle.title', 'Settle Weekly Hisaab')}</h2>
      <div className="bg-surface border border-border rounded-xl p-4">
        <p className="font-sans text-xs font-semibold text-text-muted uppercase">Amount to Pay</p>
        <p className="font-sans text-2xl font-bold text-primary mt-1">₹{amount.toFixed(2)}</p>
        <button onClick={onConfirmPayment} className="w-full mt-4 py-3 rounded-lg bg-green text-white font-semibold text-xs cursor-pointer">I Have Paid (Manual)</button>
      </div>
    </div>
  );
};

export const SupportScreen: React.FC<{ user: User; tickets: Ticket[]; onNewTicket: () => void; onSelectTicket: (ticket: Ticket) => void; t: (key: string, fallback: string) => string }> = ({ user, tickets, onNewTicket, onSelectTicket, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <h2 className="font-sans text-base font-bold text-text">{t('support.title', 'Support Desk & Query Registry')}</h2>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">RN</div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-text">{user.assignedManagerName || 'Ramesh Naik'}</h4>
          <p className="text-xs text-text-muted">+91 {user.assignedManagerPhone || '9876543299'}</p>
        </div>
      </div>
      <button onClick={onNewTicket} className="w-full py-2 rounded-lg bg-primary text-white font-semibold text-xs">New Ticket</button>
    </div>
  );
};

export const ProfileScreen: React.FC<{ user: User; loginType: 'driver' | 'operator'; t: (key: string, fallback: string) => string }> = ({ user, loginType, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <h2 className="font-sans text-base font-bold text-text">{t('profile.title', 'User Profile & Identity')}</h2>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center shrink-0">{user.initials}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-bold text-text truncate">{user.name}</h3>
          <p className="font-sans text-xs font-semibold text-text-muted mt-0.5">{user.operatorCode} • ID: {user.id}</p>
        </div>
      </div>
    </div>
  );
};

export const RentalScreen: React.FC<{ plan: RentalPlan; t: (key: string, fallback: string) => string }> = ({ plan, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <h2 className="font-sans text-base font-bold text-text">{t('rental.title', 'Driver Rental Agreement')}</h2>
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        <h3 className="font-sans text-lg font-extrabold text-text">{plan.name} Plan</h3>
        <p className="font-sans text-xs text-text-muted mt-0.5">₹{plan.dailyRate.toLocaleString('en-IN')}/day</p>
      </div>
    </div>
  );
};

export const OperatorScreen: React.FC<{ fleet: Fleet; onSelectVehicle: (number: string) => void; t: (key: string, fallback: string) => string }> = ({ fleet, onSelectVehicle, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <h2 className="font-sans text-base font-bold text-text">{t('operator.dashboardTitle', 'Fleet Operator Registry')}</h2>
      <div className="space-y-2">
        {fleet.vehicles.map((v) => (
          <div key={v.number} onClick={() => onSelectVehicle(v.number)} className="p-3.5 bg-surface border border-border rounded-xl flex items-center justify-between cursor-pointer">
            <span className="font-sans text-xs font-bold text-text">{v.number}</span>
            <span className="text-xs text-text-muted">{v.driverName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OperatorVehicleScreen: React.FC<{ vehicle: FleetVehicle; onBack: () => void; t: (key: string, fallback: string) => string }> = ({ vehicle, onBack, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted"><ArrowLeft className="w-4 h-4" /> Back</button>
      <h2 className="font-sans text-base font-bold text-text">{vehicle.number} — Dashboard</h2>
    </div>
  );
};
