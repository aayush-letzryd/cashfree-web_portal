/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Bell,
  ReceiptIndianRupee,
  FileWarning,
  Award,
  Shield,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Car,
  FileText,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Coins,
  Activity,
  Calculator,
  Compass,
  MapPin,
  CreditCard,
  PhoneCall,
  MessageSquare,
  Ticket as TicketIcon,
  Plus,
  Calendar,
  CheckSquare,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Edit2,
  Check,
  Heart,
  Building,
  Search,
  AlertOctagon,
  Navigation,
  Copy,
  Smartphone,
  Wallet,
  QrCode,
  Loader2,
  Lock,
  Share2,
  Target,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

import { User as UserType, Vehicle, HisaabWeek, Fleet, Ticket, Notification, RentalPlan, FleetVehicle, Announcement, Language } from './types';
import { USER_DATA, VEHICLE_DATA, LETZRYD_UPI_ID, ANNOUNCEMENTS_DATA } from './data';

declare const Cashfree: (config: { mode: string }) => {
  checkout: (options: { paymentSessionId: string; redirectTarget: string }) => Promise<{
    error?: unknown;
    redirect?: boolean;
    paymentDetails?: unknown;
  }>;
};

/* =========================================================================
   1. TOAST NOTIFICATION COMPONENT
   ========================================================================= */
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-white border-green/30 text-green',
      icon: <CheckCircle className="w-5 h-5 text-green" />
    },
    error: {
      bg: 'bg-white border-red-300 text-red-600',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />
    },
    info: {
      bg: 'bg-white border-blue-300 text-blue-600',
      icon: <Info className="w-5 h-5 text-blue-600" />
    },
    warning: {
      bg: 'bg-white border-amber-300 text-amber-600',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
    }
  };

  const current = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-md pointer-events-auto max-w-sm font-sans ${current.bg}`}
    >
      <div className="shrink-0">{current.icon}</div>
      <p className="font-sans text-xs font-semibold text-text leading-tight">{message}</p>
    </motion.div>
  );
};

/* =========================================================================
   2. REFERRAL MODAL
   ========================================================================= */
interface ReferralModalProps {
  onClose: () => void;
  driverCode: string;
  onCopy: () => void;
  t: (key: string, fallback: string) => string;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ onClose, driverCode, onCopy, t }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-border rounded-xl w-full max-w-sm p-5 shadow-lg relative text-left font-sans space-y-4 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-light text-green flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-text">{t('refer.title', 'Refer Driver & Earn ₹1,000')}</h3>
            <p className="font-sans text-xs text-text-muted mt-0.5">{t('refer.subtitle', 'Share your referral link with EV drivers joining LetzRyd.')}</p>
          </div>
        </div>

        <div className="bg-bg border border-border rounded-xl p-4 space-y-2">
          <p className="font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider">Your Referral Code</p>
          <div className="flex items-center justify-between bg-white border border-border rounded-lg p-2.5">
            <span className="font-mono text-sm font-bold text-primary">{driverCode}</span>
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Code
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-green-light/40 border border-green/30 font-sans text-xs text-green font-medium">
          🎁 Receive ₹1,000 credit directly in your next weekly Hisaab when your referred driver completes 50 rides.
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   3. TICKET MODALS (NEW TICKET & TICKET DETAIL)
   ========================================================================= */
interface NewTicketModalProps {
  onClose: () => void;
  categories: string[];
  onSubmit: (category: string, subject: string, description: string) => void;
  t: (key: string, fallback: string) => string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  onClose,
  categories,
  onSubmit,
  t
}) => {
  const [category, setCategory] = useState(categories[0] || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    onSubmit(category, subject, description);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-border rounded-xl w-full p-5 shadow-lg relative text-left font-sans my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-sans text-lg font-bold text-text mb-3" data-i18n="support.newTicket">
          {t('support.newTicket', 'Raise Support Ticket')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">
              Ticket Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 font-sans text-xs text-text outline-none focus:border-2 focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">
              Issue Subject
            </label>
            <input
              type="text"
              required
              placeholder="Summary of the issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-white px-3 font-sans text-xs text-text placeholder:text-text-dim outline-none focus:border-2 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">
              Detailed Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what happened, relevant week dates, or vehicle issues..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-white p-3 font-sans text-xs text-text placeholder:text-text-dim outline-none focus:border-2 focus:border-primary resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-white font-sans text-xs font-semibold text-text-muted hover:text-text cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover font-sans text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Ticket
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  t: (key: string, fallback: string) => string;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  t
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-border rounded-xl w-full max-w-lg p-5 shadow-lg relative text-left font-sans space-y-3 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pr-8">
          <span className="font-mono text-xs font-bold text-primary">{ticket.id}</span>
          <span className="font-sans text-xs font-semibold text-text-muted">• {ticket.category}</span>
        </div>

        <h3 className="font-sans text-lg font-bold text-text">{ticket.subject}</h3>

        <div className="p-3.5 rounded-lg bg-bg border border-border">
          <p className="font-sans text-xs font-semibold text-text-muted mb-1">Issue Details</p>
          <p className="font-sans text-xs text-text leading-relaxed">{ticket.description}</p>
        </div>

        {ticket.response && (
          <div className="p-3.5 rounded-lg bg-green-light border border-green/30">
            <p className="font-sans text-xs font-bold text-green flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-4 h-4" />
              LetzRyd Support Resolution
            </p>
            <p className="font-sans text-xs text-green leading-relaxed">{ticket.response}</p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-sans text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   4. NOTIFICATION MODAL
   ========================================================================= */
interface NotificationModalProps {
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  t: (key: string, fallback: string) => string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  onClose,
  notifications,
  onMarkAllRead,
  t
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ReceiptIndianRupee':
        return <ReceiptIndianRupee className="w-4 h-4 text-green" />;
      case 'FileWarning':
        return <FileWarning className="w-4 h-4 text-amber-600" />;
      case 'Award':
        return <Award className="w-4 h-4 text-primary" />;
      case 'CheckCircle':
        return <CheckCircle className="w-4 h-4 text-green" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-border rounded-xl w-full max-w-lg p-5 shadow-lg relative text-left font-sans space-y-3 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between border-b border-border pb-2.5 pr-8">
          <h3 className="font-sans text-base font-bold text-text flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications & Updates
          </h3>
          {notifications.some(n => !n.read) && (
            <button
              onClick={onMarkAllRead}
              className="font-sans text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Mark All Read
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-text-muted flex flex-col items-center justify-center">
              <Bell className="w-10 h-10 opacity-30 mb-2" />
              <p className="font-sans text-xs font-semibold">No new notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-lg border flex gap-3 transition-all ${
                  n.read ? 'bg-white border-border' : 'bg-green-light/40 border-green/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center shrink-0 border border-border">
                  {getIcon(n.icon)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="font-sans text-xs font-bold text-text">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                  <p className="font-sans text-xs text-text-muted leading-relaxed">{n.message}</p>
                  <p className="font-sans text-[10px] text-text-dim pt-0.5">{n.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-sans text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            Close Feed
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
   5. VEHICLE COMPLIANCE SCREEN (MASKED DOCUMENT NUMBERS)
   ========================================================================= */
interface VehicleScreenProps {
  vehicle: Vehicle;
  onOpenDoc?: (doc: 'rc' | 'insurance' | 'permit' | 'aadhar' | 'dl') => void;
  t: (key: string, fallback: string) => string;
}

export const VehicleScreen: React.FC<VehicleScreenProps> = ({ vehicle, t }) => {
  const formatIndianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-IN', { month: 'short' });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const maskLastFour = (str: string) => {
    if (!str) return '•••• ----';
    const clean = str.replace(/\s+/g, '');
    const lastFour = clean.slice(-4);
    return `•••• ${lastFour}`;
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <div>
        <h2 className="font-sans text-base font-bold text-text">
          {t('vehicle.title', 'Vehicle Details')}
        </h2>
      </div>

      {/* VEHICLE SPECIFICATIONS CARD — SLEEK UNIFIED LIST FORMAT */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm text-left font-sans text-xs space-y-2.5">
        <div className="border-b border-border/60 pb-2">
          <h3 className="font-sans text-xs font-bold text-text uppercase tracking-wider">
            {t('vehicle.specifications', 'SPECIFICATIONS')}
          </h3>
        </div>

        <div className="divide-y divide-border/60">
          {/* Vehicle Number Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold text-text">{t('home.vehicleNumber', 'Vehicle Number')}</span>
            </div>
            <span className="font-sans text-xs font-bold text-text">
              {vehicle.number}
            </span>
          </div>

          {/* Brand Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold text-text">{t('vehicle.brand', 'Brand')}</span>
            </div>
            <span className="font-sans text-xs font-bold text-text">{vehicle.make}</span>
          </div>

          {/* Model Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <Car className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold text-text">{t('vehicle.model', 'Model')}</span>
            </div>
            <span className="font-sans text-xs font-bold text-text">{vehicle.model}</span>
          </div>

          {/* Variant Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold text-text">{t('vehicle.variant', 'Variant')}</span>
            </div>
            <span className="font-sans text-xs font-bold text-text">{vehicle.variant}</span>
          </div>

          {/* Registration Year Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold text-text">{t('vehicle.regYear', 'Registration Year')}</span>
            </div>
            <span className="font-sans text-xs font-bold text-text">{vehicle.year}</span>
          </div>
        </div>
      </div>

      {/* DOCUMENTS SECTION — SLEEK UNIFIED LIST FORMAT */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm text-left font-sans text-xs space-y-2.5">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h3 className="font-sans text-xs font-bold text-text uppercase tracking-wider">
            {t('vehicle.documents', 'DOCUMENTS')}
          </h3>
          <span className="font-sans text-[10px] font-medium text-text-muted">
            Updated {formatIndianDate(vehicle.lastUpdatedOn)}
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {/* RC Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-text">Registration Certificate (RC)</p>
                <p className="font-mono text-[11px] font-bold text-primary mt-0.5">{maskLastFour(vehicle.number || '7692')}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-sans text-[10px] text-text-muted">Expires</span>
              <p className="font-sans text-xs font-bold text-text mt-0.5">{formatIndianDate(vehicle.rcExpiry)}</p>
            </div>
          </div>

          {/* Insurance Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-text">Insurance</p>
                <p className="font-mono text-[11px] font-bold text-primary mt-0.5">{maskLastFour('INS2140')}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-sans text-[10px] text-text-muted">Expires</span>
              <p className="font-sans text-xs font-bold text-text mt-0.5">{formatIndianDate(vehicle.insuranceExpiry)}</p>
            </div>
          </div>

          {/* Permit Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <BadgeCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-text">Permit</p>
                <p className="font-mono text-[11px] font-bold text-primary mt-0.5">{maskLastFour('PRM8912')}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-sans text-[10px] text-text-muted">Expires</span>
              <p className="font-sans text-xs font-bold text-text mt-0.5">{formatIndianDate(vehicle.permitExpiry)}</p>
            </div>
          </div>

          {/* Fitness Certificate Row */}
          <div className="py-2 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-green" />
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-text">Fitness Certificate (FC)</p>
                <p className="font-mono text-[11px] font-bold text-primary mt-0.5">{maskLastFour('FIT4401')}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-sans text-[10px] text-text-muted">Expires</span>
              <p className="font-sans text-xs font-bold text-text mt-0.5">{formatIndianDate(vehicle.fitnessExpiry)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   6. HISAAB SCREEN (LOCKED PAST WEEKS, COMPUTATION BREAKDOWN & PART PAYMENT)
   ========================================================================= */
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
  const [uberOpen, setUberOpen] = useState(false);
  const [olaOpen, setOlaOpen] = useState(false);
  const [rapidoOpen, setRapidoOpen] = useState(false);
  const [computationOpen, setComputationOpen] = useState(false);
  const [gpsOpen, setGpsOpen] = useState(false);

  if (weeks.length === 0) {
    return (
      <div className="py-12 text-center text-text-muted flex flex-col items-center justify-center font-sans">
        <Activity className="w-12 h-12 opacity-35 mb-3" />
        <p className="text-sm font-semibold">{t('hisaab.noData', 'No records found')}</p>
      </div>
    );
  }

  const w = weeks[weekIndex];

  const formatCurrency = (val: number, decimals: number = 0) => {
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

  const renderPlatformSection = (
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
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-xs transition-all">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-bg flex items-center justify-between cursor-pointer text-left focus:outline-none"
        >
          <div className="flex items-center gap-3">
            {platformKey === 'uber' && (
              <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0 font-extrabold text-[10px] font-sans tracking-tighter shadow-xs">
                Uber
              </div>
            )}
            {platformKey === 'ola' && (
              <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#00E676] border border-[#222222] flex items-center justify-center shrink-0 font-black text-[11px] font-sans tracking-tighter shadow-xs">
                OLA
              </div>
            )}
            {platformKey === 'rapido' && (
              <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#FFC107] border border-[#222222] flex items-center justify-center shrink-0 font-black text-[7.5px] font-sans uppercase tracking-tighter shadow-xs leading-none">
                RAPIDO
              </div>
            )}
            <span className="font-sans text-xs font-bold text-text">{title} {t('hisaab.earnings', 'Earnings')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`font-sans text-xs font-bold ${netAmt >= 0 ? 'text-green' : 'text-red-600'}`}>
              {formatCurrency(netAmt)}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="p-4 space-y-2.5 border-t border-border text-left font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">{t('hisaab.tripsCompleted', 'Trips Completed')}</span>
              <span className="text-text font-bold font-mono">{plat.trips} rides</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">{t('hisaab.digitalEarnings', 'Digital Earnings')}</span>
              <span className="text-green font-bold font-mono">+{formatCurrency(plat.revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-text-muted font-medium">{t('hisaab.cashCollected', 'Cash Collected')}</span>
                <p className="text-[10px] text-text-dim">Driver holds fares</p>
              </div>
              <span className="text-red-600 font-bold font-mono">-{formatCurrency(Math.abs(plat.cashCollection))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">{t('hisaab.tollPassThrough', 'Toll Refund')}</span>
              <span className="text-green font-bold font-mono">+{formatCurrency(plat.toll)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">{t('hisaab.incentives', 'Platform Incentives')}</span>
              <span className="text-green font-bold font-mono">+{formatCurrency(plat.incentive)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted font-medium">{t('hisaab.subscriptionDeduction', 'Platform Subscription')}</span>
              <span className="text-red-600 font-bold font-mono">-{formatCurrency(Math.abs(plat.subscription))}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const formatIndianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-IN', { month: 'short' });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex justify-between items-start border-b border-border pb-2.5">
          {/* LEFT SIDE: Week Number & Hisaab Number */}
          <div className="font-sans text-xs text-left">
            <div className="font-bold text-text text-sm">Week #{w.weekNumber}</div>
            <div className="text-[10px] font-medium text-text-muted mt-0.5">{w.hisaabNumber}</div>
          </div>

          {/* RIGHT SIDE: Status Badge */}
          <div className="text-right flex items-center">
            {w.weekNumber < 30 || w.isLocked || w.status !== 'in_progress' ? (
              <span className="flex items-center gap-1 font-sans text-[10px] font-bold text-green bg-green-light border border-green/30 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-green" />
                {t('hisaab.completed', 'Completed')}
              </span>
            ) : (
              <span className="flex items-center gap-1 font-sans text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                <Clock className="w-3 h-3 text-blue-600" />
                {t('hisaab.inProgress', 'In Progress')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            disabled={weekIndex >= weeks.length - 1}
            className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text hover:bg-bg disabled:opacity-40 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 py-1.5 px-2 rounded-lg border border-border bg-bg flex items-center justify-center gap-2.5 font-sans text-[11px] font-bold text-text">
            <span>{formatIndianDate(w.weekStart)}</span>
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-0.5">to</span>
            <span>{formatIndianDate(w.weekEnd)}</span>
          </div>

          <button
            onClick={onNextWeek}
            disabled={weekIndex === 0}
            className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text hover:bg-bg disabled:opacity-40 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <span className="font-sans text-xs font-semibold text-text-muted uppercase tracking-wider">
          {w.currentWeekOs < 0 ? 'Net Driver Payout' : 'Outstanding Debt Due'}
        </span>

        <div className={`font-sans text-2xl font-extrabold mt-1 ${w.currentWeekOs < 0 ? 'text-green' : 'text-red-600'}`}>
          {w.currentWeekOs < 0 ? '+₹' : '-₹'}{Math.abs(w.currentWeekOs).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>

        <p className="font-sans text-xs text-text-muted mt-1">
          {w.currentWeekOs < 0 ? t('home.payoutToDriver', 'LetzRyd payout to driver') : t('home.dueToLetzryd', 'Due to be paid to LetzRyd')} • {w.activeDays} {t('home.daysActive', 'Days Active')}
        </p>
      </div>

      <div className="space-y-2">
        <p className="font-sans text-xs font-bold text-text uppercase tracking-wider">
          {t('hisaab.breakdownTitle', 'HISAAB BREAKDOWN')}
        </p>

        {renderPlatformSection('uber', 'Uber', uberOpen, setUberOpen, 'bg-slate-900 text-white')}
        {renderPlatformSection('ola', 'Ola', olaOpen, setOlaOpen, 'bg-emerald-700 text-white')}
        {renderPlatformSection('rapido', 'Rapido', rapidoOpen, setRapidoOpen, 'bg-amber-600 text-white')}
      </div>

      {/* OTHERS CARD */}
      {(() => {
        const othersNet = - (w.rent.netWeeklyRent + w.dailyMaintenance + w.tds + (w.pendingDeposit || 0) + (w.pendingJoiningFee || 0)) + w.previousAdjustments;
        return (
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setComputationOpen(!computationOpen)}
              className="w-full px-4 py-3 bg-bg flex items-center justify-between cursor-pointer text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#111111] text-indigo-400 border border-[#222222] flex items-center justify-center shrink-0 shadow-xs">
                  <ReceiptIndianRupee className="w-4 h-4" />
                </div>
                <span className="font-sans text-xs font-bold text-text">{t('hisaab.othersTitle', 'Others')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-sans text-xs font-bold ${othersNet >= 0 ? 'text-green' : 'text-red-600'}`}>
                  {formatCurrency(othersNet)}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${computationOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {computationOpen && (
              <div className="p-4 space-y-2.5 border-t border-border font-sans text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">{t('hisaab.vehicleRent', 'Vehicle Rent')} ({w.activeDays} days @ ₹{w.rent.dailyRate})</span>
                  <span className="text-red-600 font-bold font-mono">-{formatCurrency(w.rent.netWeeklyRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">{t('hisaab.dailyMaintenance', 'Daily Maintenance Charge')}</span>
                  <span className="text-red-600 font-bold font-mono">-{formatCurrency(w.dailyMaintenance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">{t('hisaab.tds', 'TDS Deduction (1%)')}</span>
                  <span className="text-red-600 font-bold font-mono">-{formatCurrency(w.tds)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-medium">{t('hisaab.prevAdjustments', 'Previous Adjustments')}</span>
                  <span className="text-text font-bold font-mono">{formatCurrency(w.previousAdjustments)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center text-text-muted">
                  <span>{t('hisaab.paidDeposit', 'Paid Deposit')}</span>
                  <span className="font-bold text-green font-mono">+{formatCurrency(w.paidDeposit)}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>{t('hisaab.pendingDeposit', 'Pending Deposit')}</span>
                  <span className="font-bold text-amber-700 font-mono">{formatCurrency(w.pendingDeposit)}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>{t('hisaab.joiningFeePaid', 'Joining Fee Paid')}</span>
                  <span className="font-bold text-green font-mono">+{formatCurrency(w.joiningFeePaid)}</span>
                </div>
                <div className="flex justify-between items-center text-text-muted">
                  <span>{t('hisaab.pendingJoiningFee', 'Pending Joining Fee')}</span>
                  <span className="font-bold text-amber-700 font-mono">{formatCurrency(w.pendingJoiningFee)}</span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* GPS DEAD-MILES CARD */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-xs">
        <button
          onClick={() => setGpsOpen(!gpsOpen)}
          className="w-full px-4 py-3 bg-bg flex items-center justify-between cursor-pointer text-left focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#111111] text-[#00E676] border border-[#222222] flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-sans text-xs font-bold text-text">GPS Dead Miles</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-bold text-green">
              {formatCurrency(w.gps.deadKmPenalty)}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${gpsOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {gpsOpen && (
          <div className="p-4 space-y-2 border-t border-border font-sans text-xs">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Total GPS Tracked KM</span>
              <span className="font-bold text-text font-mono">{w.gps.totalGpsKm} KM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Ideal Trip KM</span>
              <span className="font-bold text-text font-mono">{w.gps.idealGpsKm} KM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Excess Dead Miles</span>
              <span className="font-bold text-text font-mono">{w.gps.deadMile} KM ({w.gps.deadMilePct}%)</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-border">
              <span className="text-text-muted">Dead Mile Penalty Due</span>
              <span className="font-bold text-green font-mono">₹0.00</span>
            </div>
            <p className="font-sans text-[10px] text-text-dim pt-1 border-t border-border">
              {t('hisaab.gpsRefreshedAt', 'Last Refreshed At')}: {w.lastRefreshedTime}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-border text-left font-sans text-[10px] text-text-muted">
        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
        <p className="leading-tight">
          {t('hisaab.disputeNotice', 'Hisaab disputes can be raised Mon–Thu. Changes after Thursday apply to next week.')}
        </p>
      </div>
    </div>
  );
};

/* =========================================================================
   7. SETTLE SCREEN (FLEXIBLE PART / FULL / ADVANCE PAYMENT)
   ========================================================================= */
interface SettleScreenProps {
  amount: number;
  hisaabAmount?: number;
  pendingDeposit?: number;
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
  hisaabAmount,
  pendingDeposit = 0,
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
  const pastWeekAmount = hisaabAmount !== undefined ? hisaabAmount : amount;
  const totalDueAmount = pastWeekAmount + pendingDeposit;

  const [paymentOption, setPaymentOption] = useState<'full' | 'part' | 'advance'>('full');
  const [customAmount, setCustomAmount] = useState<string>(totalDueAmount.toFixed(2));
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [showCashfreeFrame, setShowCashfreeFrame] = useState(false);

  useEffect(() => {
    if (paymentOption === 'full') {
      setCustomAmount(totalDueAmount.toFixed(2));
    } else if (paymentOption === 'part') {
      const half = Math.max(100, Math.floor(totalDueAmount / 2));
      setCustomAmount(half.toFixed(2));
    } else if (paymentOption === 'advance') {
      const adv = Math.max(3000, Math.ceil((totalDueAmount + 500) / 500) * 500);
      setCustomAmount(adv.toFixed(2));
    }
  }, [paymentOption, totalDueAmount]);

  const activePayAmount = parseFloat(customAmount) || 0;
  const isAdvanceInvalid = paymentOption === 'advance' && activePayAmount <= totalDueAmount;
  const isPartInvalid = paymentOption === 'part' && (activePayAmount <= 0 || activePayAmount >= totalDueAmount);

  const formatCurrency = (val: number) => {
    return '₹' + Math.abs(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('LetzRyd')}&am=${activePayAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('LetzRyd Settle ' + weekRange)}`;

  const FRAME_NAME = 'cashfree-phone-frame';

  const handleCashfreePayment = async () => {
    setPayLoading(true);
    setPayError(null);

    try {
      const res = await fetch('https://cashfree-web.onrender.com/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activePayAmount.toFixed(2),
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

      setShowCashfreeFrame(true);

      const cashfree = Cashfree({ mode: 'sandbox' });

      const result = await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: FRAME_NAME
      });

      if (result?.paymentDetails) {
        setShowCashfreeFrame(false);
        onConfirmPayment();
      }
    } catch (err) {
      setPayError('Could not connect to payment server. Is the API server running?');
      setShowCashfreeFrame(false);
    }

    setPayLoading(false);
  };

  return (
    <div className="space-y-4 text-left font-sans">
      {showCashfreeFrame && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white shrink-0">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="font-sans text-sm font-bold text-text">Cashfree Secure Pay</span>
            </div>
            <button
              onClick={() => setShowCashfreeFrame(false)}
              className="w-8 h-8 rounded-lg border border-border bg-bg flex items-center justify-center text-text-muted hover:text-red-600 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <iframe
            name={FRAME_NAME}
            title="Cashfree Payment"
            className="flex-1 w-full border-0"
            allow="payment"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text hover:bg-bg cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-sans text-base font-bold text-text">
            {t('settle.title', 'Settle Dues')}
          </h2>
          <p className="font-sans text-xs text-text-muted">
            {t('settle.forWeek', 'Period:')} {weekRange}
          </p>
        </div>
      </div>

      {/* UNIFIED DUES & PAYMENT CARD */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm space-y-3.5 text-left font-sans text-xs">
        {/* Total Outstanding Dues Header */}
        <div className="bg-bg/60 p-3 rounded-lg border border-border/60 flex items-center justify-between">
          <span className="font-sans text-xs font-bold text-text-muted uppercase tracking-wider">
            Total Outstanding Due
          </span>
          <span className="font-sans text-lg font-bold text-red-600">
            ₹{totalDueAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Itemized Split List */}
        <div className="space-y-1.5 px-1 font-sans text-xs border-b border-border/60 pb-3">
          <div className="flex justify-between items-center text-text">
            <span className="text-text-muted font-medium">Last Week Hisaab:</span>
            <span className="font-bold text-text">₹{pastWeekAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          {pendingDeposit > 0 && (
            <div className="flex justify-between items-center text-text">
              <span className="text-text-muted font-medium">Pending Deposit:</span>
              <span className="font-bold text-amber-700">₹{pendingDeposit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          )}
        </div>

        {/* Payment Selection */}
        <div className="space-y-2.5">
          <label className="font-sans text-[11px] font-bold text-text-muted uppercase tracking-wider block">
            Select Payment Option
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentOption('full')}
              className={`py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                paymentOption === 'full' ? 'bg-green-light border-primary text-green' : 'bg-bg border-border text-text-muted hover:text-text'
              }`}
            >
              Full
            </button>
            <button
              onClick={() => setPaymentOption('part')}
              className={`py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                paymentOption === 'part' ? 'bg-green-light border-primary text-green' : 'bg-bg border-border text-text-muted hover:text-text'
              }`}
            >
              Part Pay
            </button>
            <button
              onClick={() => setPaymentOption('advance')}
              className={`py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                paymentOption === 'advance' ? 'bg-green-light border-primary text-green' : 'bg-bg border-border text-text-muted hover:text-text'
              }`}
            >
              Advance
            </button>
          </div>

          <div className="pt-1">
            <label className="font-sans text-xs font-semibold text-text-muted block">
              Amount to Pay (₹)
            </label>
            <input
              type="number"
              value={customAmount}
              readOnly={paymentOption === 'full'}
              onChange={(e) => setCustomAmount(e.target.value)}
              className={`h-10 w-full mt-1 rounded-lg border px-3 font-mono text-base font-bold text-primary outline-none transition-colors ${
                paymentOption === 'full'
                  ? 'bg-bg/40 border-border/80 cursor-not-allowed text-primary'
                  : isAdvanceInvalid || isPartInvalid
                  ? 'bg-red-50/50 border-red-300 focus:border-red-500'
                  : 'bg-bg border-border focus:border-2 focus:border-primary'
              }`}
            />
          </div>

          {paymentOption === 'advance' && isAdvanceInvalid && (
            <p className="text-[11px] text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 mt-1">
              ⚠️ Advance payment must be greater than total due (₹{totalDueAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}).
            </p>
          )}

          {paymentOption === 'part' && activePayAmount >= totalDueAmount && (
            <p className="text-[11px] text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 mt-1">
              ⚠️ Part payment must be less than total due (₹{totalDueAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}). Use Full Pay for full settlement.
            </p>
          )}

          {payError && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>
          )}

          <button
            onClick={handleCashfreePayment}
            disabled={payLoading || activePayAmount <= 0 || isAdvanceInvalid || isPartInvalid}
            className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-60 mt-2"
          >
            {payLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Connecting Gateway...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay {formatCurrency(activePayAmount)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. SUPPORT SCREEN (ASSIGNED DRIVER MANAGER CARD & CLEAN TICKET LIST)
   ========================================================================= */
interface SupportScreenProps {
  user: UserType;
  tickets: Ticket[];
  hotline?: string;
  onNewTicket: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  t: (key: string, fallback: string) => string;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({
  user,
  tickets,
  hotline,
  onNewTicket,
  onSelectTicket,
  t
}) => {
  const formatIndianDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-IN', { month: 'short' });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusBadge = (status: 'open' | 'resolved' | 'closed') => {
    switch (status) {
      case 'open':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            Open
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-green-light text-green text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="bg-bg text-text-muted border border-border text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
            <XCircle className="w-3 h-3" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-sans text-base font-bold text-text">
            {t('support.title', 'Support Desk')}
          </h2>
          <p className="font-sans text-xs text-text-muted mt-0.5">
            {t('support.subtitle', 'Contact manager or raise tickets')}
          </p>
        </div>
        <button
          onClick={onNewTicket}
          className="shrink-0 flex h-9 items-center justify-center gap-1 rounded-lg bg-primary hover:bg-primary-hover px-3 font-sans text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          New Ticket
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">
            RN
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[10px] font-semibold text-text-muted uppercase">{t('support.manager', 'MANAGER')}</p>
            <h4 className="font-sans text-sm font-bold text-text truncate">{user.assignedManagerName || 'Ramesh Naik'}</h4>
            <p className="font-sans text-xs text-text-muted">+91 {user.assignedManagerPhone || '9876543299'}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href={`tel:${user.assignedManagerPhone}`}
              className="p-2 rounded-lg bg-green-light text-green border border-green/30 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/91${user.assignedManagerPhone}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-green-light text-green border border-green/30 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* SUPPORT TICKETS SECTION — UNIFIED LIST CARD FORMAT */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm text-left font-sans text-xs space-y-2.5">
        <div className="border-b border-border/60 pb-2">
          <h3 className="font-sans text-xs font-bold text-text uppercase tracking-wider">
            {t('support.ticketsTitle', 'SUPPORT TICKETS')} ({tickets.length})
          </h3>
        </div>

        <div>
          {tickets.length === 0 ? (
            <div className="py-6 text-center text-text-muted flex flex-col items-center justify-center">
              <TicketIcon className="w-8 h-8 opacity-30 mb-2" />
              <p className="font-sans text-xs font-semibold">No support tickets logged</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="py-2 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-bg/60 cursor-pointer rounded-md px-1 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <div className="w-7 h-7 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                      <TicketIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans text-xs font-semibold text-text truncate">{ticket.subject}</h4>
                      <p className="font-mono text-[11px] text-text-muted mt-0.5">{ticket.id} • {ticket.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    {getStatusBadge(ticket.status)}
                    <span className="font-sans text-[10px] font-medium text-text-muted mt-1">{formatIndianDate(ticket.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. PROFILE SCREEN
   ========================================================================= */
interface ProfileScreenProps {
  user: UserType;
  loginType: 'driver' | 'operator';
  onUpdateContact: (emergencyContact: string, address: string) => void;
  t: (key: string, fallback: string) => string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  loginType,
  onUpdateContact,
  t
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [emergency, setEmergency] = useState(user.emergencyContact);
  const [address, setAddress] = useState(user.address);

  const handleSave = () => {
    onUpdateContact(emergency, address);
    setIsEditing(false);
  };

  const isOperator = loginType === 'operator';

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-sans text-base font-bold text-text">
            {t('profile.title', 'User Profile & Identity')}
          </h2>
          <p className="font-sans text-xs text-text-muted mt-0.5 truncate">
            {t('profile.subtitle', 'Personal information and registered credentials')}
          </p>
        </div>

        {!isOperator && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="shrink-0 flex h-9 items-center justify-center gap-1 rounded-lg bg-primary hover:bg-primary-hover px-3 font-sans text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors"
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
            {isEditing ? 'Save' : t('profile.edit', 'Edit Profile')}
          </button>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl p-4 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center shrink-0">
          {isOperator ? 'RK' : user.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-base font-bold text-text truncate">
            {isOperator ? `${user.name} (Fleet Operator)` : user.name}
          </h3>
          <p className="font-mono text-xs font-semibold text-text-muted mt-0.5">{user.operatorCode} • ID: {user.id}</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 shadow-xs space-y-3">
        <h3 className="font-sans text-xs font-bold text-text uppercase tracking-wider">
          Identity Credentials
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-lg bg-bg border border-border">
            <p className="font-sans text-[10px] font-semibold text-text-muted">Registered Phone</p>
            <p className="font-sans text-xs font-bold text-text mt-0.5">+91 {user.phone}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-bg border border-border">
            <p className="font-sans text-[10px] font-semibold text-text-muted">Aadhar Number</p>
            <p className="font-mono text-xs font-bold text-text mt-0.5">•••• {user.aadhar.slice(-4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   10. RENTAL PLAN SCREEN
   ========================================================================= */
interface RentalScreenProps {
  plan: RentalPlan;
  t: (key: string, fallback: string) => string;
}

export const RentalScreen: React.FC<RentalScreenProps> = ({ plan, t }) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <div>
        <h2 className="font-sans text-base font-bold text-text">
          {t('rental.title', 'Driver Rental Agreement')}
        </h2>
        <p className="font-sans text-xs text-text-muted mt-0.5">
          Configured daily rate metrics and settlement terms
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <h3 className="font-sans text-lg font-extrabold text-text">{plan.name} Plan</h3>
        <p className="font-sans text-xs text-text-muted mt-0.5">Active since {plan.planStart}</p>
        <div className="mt-3 pt-3 border-t border-border">
          <div className="font-sans text-2xl font-extrabold text-primary">
            ₹{plan.dailyRate.toLocaleString('en-IN')}<span className="text-xs font-medium text-text-muted">/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. OPERATOR SCREEN
   ========================================================================= */
interface OperatorScreenProps {
  fleet: Fleet;
  onSelectVehicle: (number: string) => void;
  t: (key: string, fallback: string) => string;
}

export const OperatorScreen: React.FC<OperatorScreenProps> = ({ fleet, onSelectVehicle, t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const totalVehicles = fleet.vehicles.length;
  const activeVehicles = fleet.vehicles.filter((v) => v.status === 'active').length;
  const idleVehicles = fleet.vehicles.filter((v) => v.status === 'idle').length;
  const totalFleetOs = fleet.vehicles.reduce((sum, v) => sum + v.currentWeekOs, 0);

  const filteredVehicles = fleet.vehicles.filter(
    (v) =>
      v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return '₹' + Math.abs(val).toLocaleString('en-IN', {
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-4 text-left font-sans">
      <div>
        <h2 className="font-sans text-base font-bold text-text">
          {t('operator.dashboardTitle', 'Fleet Registry')}
        </h2>
        <p className="font-sans text-xs text-text-muted mt-0.5">
          Real-time allocations & financial settlement status ({totalVehicles} Vehicles)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 font-sans text-xs">
        <div className="p-3 bg-surface border border-border rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {totalFleetOs < 0 ? 'To Pay Drivers' : 'Fleet Owed'}
          </p>
          <p className={`font-sans text-sm font-bold mt-0.5 ${totalFleetOs < 0 ? 'text-green' : 'text-red-600'}`}>
            {totalFleetOs < 0 ? '+' : '-'}{formatCurrency(totalFleetOs)}
          </p>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Cars</p>
          <p className="font-sans text-sm font-bold text-green mt-0.5">{activeVehicles}</p>
        </div>
        <div className="p-3 bg-surface border border-border rounded-xl text-center shadow-sm">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Idle / Maint.</p>
          <p className="font-sans text-sm font-bold text-amber-600 mt-0.5">{idleVehicles}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vehicle number, driver or model..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-bg text-xs font-medium outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* UNIFIED FLEET LIST CARD */}
      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm space-y-2.5">
        <div className="border-b border-border/60 pb-2 flex items-center justify-between">
          <h3 className="font-sans text-xs font-bold text-text uppercase tracking-wider">
            ALLOCATED VEHICLES ({filteredVehicles.length})
          </h3>
          <span className="text-[10px] font-semibold text-text-muted">Tap vehicle to view Hisaab</span>
        </div>

        <div className="divide-y divide-border/60">
          {filteredVehicles.map((v) => (
            <div
              key={v.number}
              onClick={() => onSelectVehicle(v.number)}
              className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-bg/60 cursor-pointer rounded-md px-1 transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                <div className="w-8 h-8 rounded-lg bg-bg border border-border text-primary flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text">{v.number}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${v.status === 'active' ? 'bg-green-light text-green border border-green/20' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      {v.status === 'active' ? 'Active' : 'Idle'}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-text-muted mt-0.5 truncate">
                    {v.driverName} • {v.model}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end">
                {v.currentWeekOs < 0 ? (
                  <span className="font-sans text-xs font-bold text-green">
                    To Pay Driver: +{formatCurrency(v.currentWeekOs)}
                  </span>
                ) : v.currentWeekOs > 0 ? (
                  <span className="font-sans text-xs font-bold text-red-600">
                    Driver Owes: -{formatCurrency(v.currentWeekOs)}
                  </span>
                ) : (
                  <span className="font-sans text-xs font-bold text-text-muted">
                    Settled: ₹0
                  </span>
                )}
                <span className="font-sans text-[11px] font-semibold text-primary group-hover:underline mt-0.5">
                  View Hisaab →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   12. OPERATOR VEHICLE SCREEN (FULL MODULAR VEHICLE LEDGER & COMPLIANCE)
   ========================================================================= */
interface OperatorVehicleScreenProps {
  vehicle: FleetVehicle;
  weekIndex: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onBack: () => void;
  t: (key: string, fallback: string) => string;
}

export const OperatorVehicleScreen: React.FC<OperatorVehicleScreenProps> = ({
  vehicle,
  weekIndex,
  onPrevWeek,
  onNextWeek,
  onBack,
  t
}) => {
  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-sans text-base font-bold text-text truncate">{vehicle.number} — Hisaab Statement</h2>
          <p className="font-sans text-xs text-text-muted truncate">Driver: {vehicle.driverName} ({vehicle.model})</p>
        </div>
      </div>

      <HisaabScreen
        weeks={vehicle.hisaabWeeks}
        weekIndex={weekIndex}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
        loginType="operator"
        onPayClick={() => {}}
        t={t}
      />
    </div>
  );
};
