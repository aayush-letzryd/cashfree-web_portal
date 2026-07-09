/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, ReceiptIndianRupee, FileWarning, Award, CheckCircle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  t: (key: string, fallback: string) => string;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  t
}) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ReceiptIndianRupee':
        return <ReceiptIndianRupee className="w-4 h-4 text-accent-brand" />;
      case 'FileWarning':
        return <FileWarning className="w-4 h-4 text-warning-brand" />;
      case 'Award':
        return <Award className="w-4 h-4 text-accent-brand" />;
      case 'CheckCircle':
        return <CheckCircle className="w-4 h-4 text-success-brand" />;
      default:
        return <Bell className="w-4 h-4 text-info-brand" />;
    }
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

          <div className="flex justify-between items-center mb-5 text-left pr-8">
            <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent-brand" />
              {t('notif.title', 'Notifications')}
            </h3>
            {notifications.some(n => !n.read) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-extrabold uppercase tracking-wider text-accent-brand hover:brightness-110 cursor-pointer"
              >
                Mark All Read
              </button>
            )}
          </div>

          <div className="space-y-3.5 text-left mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center text-text-muted">
                <Bell className="w-12 h-12 stroke-[1] opacity-35 mb-3" />
                <p className="text-sm font-semibold">{t('notif.empty', 'No notifications yet')}</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
                    n.read
                      ? 'bg-bg-card border-border-subtle'
                      : 'bg-info-dim/20 border-info-brand/20 shadow-md shadow-info-brand/5'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0 border border-border-subtle shadow-inner">
                    {getIcon(n.icon)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-black text-text-primary leading-tight">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-info-brand shrink-0 mt-1" />}
                    </div>
                    <p className="text-[11px] font-medium text-text-secondary leading-relaxed">{n.message}</p>
                    <p className="text-[9px] font-bold text-text-muted tracking-wide uppercase pt-1">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary font-bold hover:text-text-primary hover:border-border-bright transition-all cursor-pointer text-sm"
          >
            Close Feed
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
