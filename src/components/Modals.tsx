import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Copy, Send, ReceiptIndianRupee, FileWarning, Award, CheckCircle, Bell } from 'lucide-react';
import { Ticket, Notification } from '../types';

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
        className="bg-surface border border-border rounded-xl w-full max-w-sm p-5 shadow-lg relative text-left font-sans space-y-4 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
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
          <p className="font-sans text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('refer.yourCode', 'YOUR REFERRAL CODE')}</p>
          <div className="flex items-center justify-between bg-surface border border-border rounded-lg p-2.5">
            <span className="font-sans text-sm font-bold text-primary">{driverCode}</span>
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {t('refer.copyCode', 'Copy Code')}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-green-light/40 border border-green/30 font-sans text-xs text-green font-medium">
          🎁 {t('refer.rewardInfo', 'Receive ₹1,000 credit directly in your next weekly Hisaab when your referred driver completes 50 rides.')}
        </div>
      </motion.div>
    </div>
  );
};

interface NewTicketModalProps {
  onClose: () => void;
  categories: string[];
  onSubmit: (category: string, subject: string, description: string) => void;
  t: (key: string, fallback: string) => string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose, categories, onSubmit, t }) => {
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
        className="bg-surface border border-border rounded-xl w-full p-5 shadow-lg relative text-left font-sans my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-sans text-lg font-bold text-text mb-3">{t('support.newTicket', 'Raise Support Ticket')}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">Ticket Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-sans text-xs text-text outline-none focus:border-green"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">Issue Subject</label>
            <input
              type="text"
              required
              placeholder="Summary of the issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 font-sans text-xs text-text placeholder:text-text-dim outline-none focus:border-green"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans text-xs font-semibold text-text-muted">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what happened, relevant week dates, or vehicle issues..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 font-sans text-xs text-text placeholder:text-text-dim outline-none focus:border-green resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border bg-surface font-sans text-xs font-semibold text-text-muted hover:text-text cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover font-sans text-xs font-semibold text-white cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
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

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose, t }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border rounded-xl w-full max-w-lg p-5 shadow-lg relative text-left font-sans space-y-3 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pr-8">
          <span className="font-sans text-xs font-bold text-primary">{ticket.id}</span>
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
              <CheckCircle className="w-4 h-4" /> LetzRyd Support Resolution
            </p>
            <p className="font-sans text-xs text-green leading-relaxed">{ticket.response}</p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-sans text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface NotificationModalProps {
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  t: (key: string, fallback: string) => string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ onClose, notifications, onMarkAllRead, t }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ReceiptIndianRupee': return <ReceiptIndianRupee className="w-4 h-4 text-green" />;
      case 'FileWarning': return <FileWarning className="w-4 h-4 text-amber-600" />;
      case 'Award': return <Award className="w-4 h-4 text-primary" />;
      case 'CheckCircle': return <CheckCircle className="w-4 h-4 text-green" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border rounded-xl w-full max-w-lg p-5 shadow-lg relative text-left font-sans space-y-3 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between border-b border-border pb-2.5 pr-8">
          <h3 className="font-sans text-base font-bold text-text flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notifications & Updates
          </h3>
          {notifications.some(n => !n.read) && (
            <button onClick={onMarkAllRead} className="font-sans text-xs font-semibold text-primary hover:underline cursor-pointer">Mark All Read</button>
          )}
        </div>

        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-text-muted">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-3.5 rounded-lg border flex gap-3 ${n.read ? 'bg-surface border-border' : 'bg-green-light/40 border-green/30'}`}>
                <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center shrink-0 border border-border">{getIcon(n.icon)}</div>
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-sans text-xs font-semibold cursor-pointer shadow-sm transition-colors">Close Feed</button>
        </div>
      </motion.div>
    </div>
  );
};
