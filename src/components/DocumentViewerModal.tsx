/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Landmark, User, FileCheck } from 'lucide-react';
import { User as UserType, Vehicle } from '../types';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: 'rc' | 'insurance' | 'permit' | 'aadhar' | 'dl' | null;
  user: UserType;
  vehicle: Vehicle;
  t: (key: string, fallback: string) => string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  docType,
  user,
  vehicle,
  t
}) => {
  if (!docType) return null;

  const renderDocumentContent = () => {
    switch (docType) {
      case 'rc':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/20 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <Landmark className="w-40 h-40" />
            </div>
            <div className="border-b border-indigo-500/20 pb-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Union of India</p>
                <p className="text-sm font-black text-text-primary">Certificate of Registration</p>
              </div>
              <Landmark className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Registration Number</p>
                <p className="text-lg font-mono font-bold text-accent-brand">{vehicle.number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Owner Name</p>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Vehicle Model</p>
                  <p className="text-sm font-bold text-text-primary">{vehicle.make} {vehicle.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Fuel & Variant</p>
                  <p className="text-xs font-bold text-text-secondary">{vehicle.fuelType} · {vehicle.variant}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">RC Expiry Date</p>
                  <p className="text-xs font-bold text-success-brand">{vehicle.rcExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-500/20 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <Shield className="w-40 h-40" />
            </div>
            <div className="border-b border-emerald-500/20 pb-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Bajaj Allianz General Insurance</p>
                <p className="text-sm font-black text-text-primary">Comprehensive Motor Policy</p>
              </div>
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Policy Schedule Number</p>
                <p className="text-base font-mono font-bold text-emerald-300">POL/2025/12345678</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Insured Party</p>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Vehicle Insured</p>
                  <p className="text-sm font-bold text-text-primary">{vehicle.number}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Coverage Status</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Valid Until Date</p>
                  <p className="text-xs font-bold text-emerald-400">{vehicle.insuranceExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'permit':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 border border-purple-500/20 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <FileText className="w-40 h-40" />
            </div>
            <div className="border-b border-purple-500/20 pb-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400">State Transport Department</p>
                <p className="text-sm font-black text-text-primary">All India Tourist Permit (AITP)</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Permit Certificate Number</p>
                <p className="text-base font-mono font-bold text-purple-300">PT/KA05/2024/98765</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Permit Type</p>
                  <p className="text-sm font-bold text-text-primary">{vehicle.permitType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Authorized Vehicle</p>
                  <p className="text-sm font-bold text-text-primary">{vehicle.number}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Status Code</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">All India Authorized</span>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Permit Expiry Date</p>
                  <p className="text-xs font-bold text-purple-400">{vehicle.permitExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'aadhar':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-amber-950 border border-amber-500/20 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <User className="w-40 h-40" />
            </div>
            <div className="border-b border-amber-500/20 pb-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Government of India</p>
                <p className="text-sm font-black text-text-primary">Aadhar Card</p>
              </div>
              <User className="w-8 h-8 text-amber-400" />
            </div>
            <div className="flex gap-4">
              <div className="w-20 h-24 bg-bg-elevated border border-border-bright rounded flex flex-col items-center justify-center text-text-muted text-[10px] font-bold">
                <User className="w-8 h-8 mb-1" />
                <span>RK PHOTO</span>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[9px] text-text-muted uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9px] text-text-muted uppercase tracking-wider">DOB</p>
                    <p className="text-xs font-bold text-text-secondary">{user.dob}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-muted uppercase tracking-wider">Gender</p>
                    <p className="text-xs font-bold text-text-secondary">Male</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-text-muted uppercase tracking-wider">Address Reference</p>
                  <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">{user.address}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-amber-500/10 mt-4 pt-3 text-center">
              <p className="text-sm font-bold tracking-wider font-mono text-amber-300">{user.aadhar}</p>
              <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-1">Aadhaar — Mera Aadhaat, Meri Pehchan</p>
            </div>
          </div>
        );

      case 'dl':
        return (
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/20 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <FileCheck className="w-40 h-40" />
            </div>
            <div className="border-b border-blue-500/20 pb-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Karnataka State Transport Dept</p>
                <p className="text-sm font-black text-text-primary">Driving License (DL)</p>
              </div>
              <FileCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Driving License Number</p>
                <p className="text-base font-mono font-bold text-blue-300">{user.dlNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">License Holder</p>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Blood Group</p>
                  <p className="text-sm font-bold text-text-primary">{user.bloodGroup}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Authorized Class</p>
                  <p className="text-xs font-bold text-text-secondary">LMV-NT · TRANS</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">DL Expiry Date</p>
                  <p className="text-xs font-bold text-blue-400">{user.dlExpiry}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getDocTitle = () => {
    switch (docType) {
      case 'rc': return 'RC (Registration Certificate)';
      case 'insurance': return 'Insurance Policy Document';
      case 'permit': return 'AITP Tourist Permit';
      case 'aadhar': return 'Aadhar Identification Card';
      case 'dl': return 'Driving License Certificate';
      default: return 'Document';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        {/* Overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 pointer-events-auto cursor-pointer"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="bg-bg-surface border border-border-subtle rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 pointer-events-auto relative z-50"
        >
          {/* Top handle bar */}
          <div className="w-12 h-1 bg-border-bright rounded-full mx-auto mb-4" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-lg font-black text-text-primary mb-4 pr-10">{getDocTitle()}</h3>

          <div className="mb-6">{renderDocumentContent()}</div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary font-bold hover:text-text-primary hover:border-border-bright transition-all cursor-pointer text-sm"
          >
            Close Document
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
