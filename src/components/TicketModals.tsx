/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, PenTool, CheckCircle, Clock, AlertOctagon } from 'lucide-react';
import { Ticket } from '../types';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSubmit: (category: string, subject: string, description: string) => void;
  t: (key: string, fallback: string) => string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
  t
}) => {
  const [category, setCategory] = useState(categories[0] || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setDescription('');
      if (categories.length > 0) setCategory(categories[0]);
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    onSubmit(category, subject, description);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 pointer-events-auto cursor-pointer"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="bg-bg-surface border border-border-subtle rounded-t-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-6 pointer-events-auto relative z-50"
        >
          <div className="w-12 h-1 bg-border-bright rounded-full mx-auto mb-4" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-lg font-black text-text-primary mb-5" data-i18n="support.newTicket">
            {t('support.newTicket', 'Raise a Ticket')}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-brand focus:ring-1 focus:ring-accent-brand outline-none appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%235C636E' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center'
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Subject
              </label>
              <div className="relative">
                <PenTool className="absolute left-4 top-3.5 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Summary of your issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Detailed Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your query or dispute in detail so our hub team can verify..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none resize-none min-h-[110px] leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-accent-brand text-black font-black hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-lg shadow-accent-brand/10"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  t: (key: string, fallback: string) => string;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  onClose,
  ticket,
  t
}) => {
  if (!ticket) return null;

  const statusConfig = {
    open: {
      cls: 'bg-danger-dim text-danger-brand border-danger-brand/20',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: t('ticket.open', 'Open')
    },
    resolved: {
      cls: 'bg-success-dim text-success-brand border-success-brand/20',
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      label: t('ticket.resolved', 'Resolved')
    },
    closed: {
      cls: 'bg-bg-elevated text-text-secondary border-border-subtle',
      icon: <AlertOctagon className="w-3.5 h-3.5" />,
      label: t('ticket.closed', 'Closed')
    }
  };

  const currentStatus = statusConfig[ticket.status] || statusConfig.open;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 pointer-events-auto cursor-pointer"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="bg-bg-surface border border-border-subtle rounded-t-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-6 pointer-events-auto relative z-50"
        >
          <div className="w-12 h-1 bg-border-bright rounded-full mx-auto mb-4" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-left mb-5">
            <p className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-widest mb-1">
              Ticket ID: {ticket.id}
            </p>
            <h4 className="text-base font-black text-text-primary leading-tight pr-8">
              {ticket.subject}
            </h4>
          </div>

          <div className="bg-bg-elevated border border-border-subtle rounded-2xl p-4 space-y-3.5 text-left mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Category
              </span>
              <span className="text-text-primary font-bold">{ticket.category}</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Raised Date
              </span>
              <span className="text-text-primary font-bold">{ticket.date}</span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Priority
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                ticket.priority === 'high' ? 'bg-danger-dim text-danger-brand' :
                ticket.priority === 'medium' ? 'bg-warning-dim text-warning-brand' : 'bg-info-dim text-info-brand'
              }`}>
                {ticket.priority}
              </span>
            </div>
            <div className="h-[1px] bg-border-subtle" />
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Status Flag
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${currentStatus.cls}`}>
                {currentStatus.icon}
                {currentStatus.label}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                {t('ticket.yourMessage', 'Your Message')}
              </p>
              <div className="bg-bg-elevated border border-border-subtle rounded-xl p-4 text-xs font-medium text-text-secondary leading-relaxed">
                {ticket.description}
              </div>
            </div>

            {ticket.response ? (
              <div>
                <p className="text-[10px] font-bold text-success-brand uppercase tracking-widest mb-1.5">
                  {t('ticket.letzrydResponse', 'LetzRyd Response')}
                </p>
                <div className="bg-success-dim/30 border border-success-brand/20 rounded-xl p-4 text-xs font-semibold text-text-primary leading-relaxed">
                  {ticket.response}
                </div>
              </div>
            ) : (
              <div className="bg-warning-dim/25 border border-warning-brand/10 rounded-xl p-4 text-xs font-semibold text-warning-brand leading-relaxed flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Under review by LetzRyd admin panel. Expected response time: 2–4 hours.</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 py-3 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary font-bold hover:text-text-primary hover:border-border-bright transition-all cursor-pointer text-sm"
          >
            Close Details
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
