/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, PhoneCall, ShieldAlert, Navigation, FileWarning, CheckCircle } from 'lucide-react';
import { Vehicle } from '../types';

interface SosScreenProps {
  activated: boolean;
  alertTime: string | null;
  vehicle: Vehicle;
  onTrigger: (time: string) => void;
  onCancel: () => void;
  onReportIncident: (type: string, location: string, drivable: boolean) => void;
  t: (key: string, fallback: string) => string;
}

export const SosScreen: React.FC<SosScreenProps> = ({
  activated,
  alertTime,
  vehicle,
  onTrigger,
  onCancel,
  onReportIncident,
  t
}) => {
  const [incidentType, setIncidentType] = useState('Minor Accident');
  const [location, setLocation] = useState('');
  const [isDrivable, setIsDrivable] = useState(true);

  const handleSosTrigger = () => {
    const confirmAlert = window.confirm(t('sos.confirm', 'Trigger SOS emergency alert? This will immediately alert the LetzRyd Hub team.'));
    if (!confirmAlert) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    onTrigger(timeStr);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    onReportIncident(incidentType, location, isDrivable);
    setLocation('');
  };

  return (
    <div className="space-y-6 text-left">
      <AnimatePresence mode="wait">
        {!activated ? (
          <motion.div
            key="default"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <h2 className="text-xl font-black text-danger-brand flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
                {t('sos.title', 'Emergency SOS')}
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                {t('sos.subtitle', 'Press the button below to instantly alert the LetzRyd Hub team. Use only in genuine emergencies.')}
              </p>
            </div>

            {/* Giant SOS Button */}
            <div className="flex justify-center py-6">
              <button
                onClick={handleSosTrigger}
                className="w-56 h-56 rounded-full bg-danger-brand text-white flex flex-col items-center justify-center gap-2 font-black tracking-widest cursor-pointer shadow-lg shadow-danger-brand/30 border-4 border-white/10 hover:scale-105 active:scale-95 transition-all animate-pulse-ring"
              >
                <span className="text-4xl font-extrabold tracking-widest">SOS</span>
                <span className="text-[10px] font-extrabold uppercase opacity-80" data-i18n="sos.pressToAlert">
                  {t('sos.pressToAlert', 'Press to Alert')}
                </span>
              </button>
            </div>

            {/* Accident Report Form */}
            <div className="bg-danger-dim/30 border border-danger-brand/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-danger-brand font-black text-sm">
                <FileWarning className="w-5 h-5 shrink-0" />
                <span data-i18n="sos.reportAccident">{t('sos.reportAccident', 'Report Accident / Breakdown')}</span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider" data-i18n="sos.incidentType">
                    Incident Type
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-danger-brand"
                  >
                    <option value="Minor Accident">Minor Accident</option>
                    <option value="Major Accident">Major Accident</option>
                    <option value="Vehicle Breakdown">Breakdown</option>
                    <option value="Tyre Puncture">Tyre Puncture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider" data-i18n="sos.location">
                    Location / Landmark
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      placeholder={t('sos.locationPlaceholder', 'e.g. Near KSRTC Bus Stand, MG Road')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrivable(true)}
                    className={`py-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      isDrivable
                        ? 'bg-success-dim border-success-brand/35 text-success-brand'
                        : 'bg-bg-elevated border-border-subtle text-text-muted'
                    }`}
                  >
                    ✓ Drivable
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDrivable(false)}
                    className={`py-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      !isDrivable
                        ? 'bg-danger-dim border-danger-brand/35 text-danger-brand'
                        : 'bg-bg-elevated border-border-subtle text-text-muted'
                    }`}
                  >
                    ✗ Not Drivable
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-danger-brand text-white font-extrabold hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  Submit Incident Report
                </button>
              </form>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="sos.emergencyContacts">
                Emergency Contacts
              </h3>
              <div className="space-y-2">
                <a
                  href="tel:08000538793"
                  className="flex items-center justify-between p-3.5 bg-bg-surface border border-border-subtle rounded-xl hover:border-border-bright"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-danger-dim text-danger-brand flex items-center justify-center shrink-0">
                      <AlertOctagon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary" data-i18n="sos.letzrydHub">LetzRyd Hub</p>
                      <p className="text-[10px] text-text-muted mt-0.5" data-i18n="sos.hubRole">24×7 Emergency Line</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-danger-dim text-danger-brand border border-danger-brand/10 text-xs font-black uppercase tracking-wider">
                    <PhoneCall className="w-3 h-3" />
                    Call
                  </span>
                </a>

                <a
                  href="tel:100"
                  className="flex items-center justify-between p-3.5 bg-bg-surface border border-border-subtle rounded-xl hover:border-border-bright"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-info-dim text-info-brand flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary" data-i18n="sos.police">Police Dispatch</p>
                      <p className="text-[10px] text-text-muted mt-0.5" data-i18n="sos.policeRole">Emergency: 100</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-info-dim text-info-brand border border-info-brand/10 text-xs font-black uppercase tracking-wider">
                    <PhoneCall className="w-3 h-3" />
                    Call
                  </span>
                </a>

                <a
                  href="tel:108"
                  className="flex items-center justify-between p-3.5 bg-bg-surface border border-border-subtle rounded-xl hover:border-border-bright"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success-dim text-success-brand flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary" data-i18n="sos.ambulance">Ambulance Service</p>
                      <p className="text-[10px] text-text-muted mt-0.5" data-i18n="sos.ambulanceRole">Emergency: 108</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-success-dim text-success-brand border border-success-brand/10 text-xs font-black uppercase tracking-wider">
                    <PhoneCall className="w-3 h-3" />
                    Call
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="activated"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-6 py-6 text-center w-full"
          >
            {/* Glowing active circle */}
            <div className="w-32 h-32 rounded-full bg-danger-brand text-white flex items-center justify-center text-4xl shadow-2xl animate-pulse-ring border-4 border-white/20">
              <AlertOctagon className="w-16 h-16 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-danger-brand uppercase tracking-widest" data-i18n="sos.activated">
                SOS Activated!
              </h2>
              <p className="text-sm font-semibold text-text-primary leading-relaxed px-4">
                LetzRyd Control Hub has received your coordinates and alert ping.<br />
                <strong className="text-accent-brand" data-i18n="sos.willContact">An emergency operator will contact you via phone call within 2 minutes.</strong>
              </p>
            </div>

            <div className="bg-bg-surface border border-border-bright rounded-2xl p-5 w-full text-left space-y-4">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border-subtle pb-2" data-i18n="sos.detailsShared">
                Incident Details Shared
              </h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Assigned Vehicle</span>
                  <span className="text-text-primary font-black font-mono bg-bg-elevated px-2.5 py-1 rounded border border-border-subtle">{vehicle.number}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Driver in Command</span>
                  <span className="text-text-primary font-black">Rajesh Kumar</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-semibold">Alert Timestamp</span>
                  <span className="text-danger-brand font-black font-mono">{alertTime}</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3.5">
              <a
                href="tel:08000538793"
                className="w-full py-4 rounded-xl bg-danger-brand text-white font-black hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xl shadow-danger-brand/35 border border-white/10"
              >
                <PhoneCall className="w-4.5 h-4.5 animate-bounce" />
                Call Hub Now
              </a>

              <button
                onClick={onCancel}
                className="w-full py-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary font-bold hover:text-text-primary hover:border-border-bright transition-all cursor-pointer text-xs"
              >
                Cancel Active SOS Alert
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
