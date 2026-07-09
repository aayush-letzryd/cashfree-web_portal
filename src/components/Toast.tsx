/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

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
      bg: 'bg-bg-elevated border-success-brand/30',
      text: 'text-success-brand',
      icon: <CheckCircle className="w-5 h-5 text-success-brand" />
    },
    error: {
      bg: 'bg-bg-elevated border-danger-brand/30',
      text: 'text-danger-brand',
      icon: <AlertCircle className="w-5 h-5 text-danger-brand" />
    },
    info: {
      bg: 'bg-bg-elevated border-info-brand/30',
      text: 'text-info-brand',
      icon: <Info className="w-5 h-5 text-info-brand" />
    },
    warning: {
      bg: 'bg-bg-elevated border-warning-brand/30',
      text: 'text-warning-brand',
      icon: <AlertTriangle className="w-5 h-5 text-warning-brand" />
    }
  };

  const current = config[type] || config.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl pointer-events-auto max-w-sm ${current.bg}`}
    >
      <div className="flex-shrink-0">{current.icon}</div>
      <p className="text-sm font-semibold text-text-primary leading-tight">{message}</p>
    </motion.div>
  );
};
