/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, MessageSquare, Ticket as TicketIcon, Plus, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Ticket } from '../types';

interface SupportScreenProps {
  tickets: Ticket[];
  onOpenNewTicket: () => void;
  onOpenTicketDetails: (ticket: Ticket) => void;
  t: (key: string, fallback: string) => string;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({
  tickets,
  onOpenNewTicket,
  onOpenTicketDetails,
  t
}) => {
  const getStatusBadge = (status: 'open' | 'resolved' | 'closed') => {
    switch (status) {
      case 'open':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-danger-dim border-danger-brand/20 text-danger-brand text-[10px] font-black uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {t('ticket.open', 'Open')}
          </span>
        );
      case 'resolved':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-success-dim border-success-brand/20 text-success-brand text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            {t('ticket.resolved', 'Resolved')}
          </span>
        );
      case 'closed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border bg-bg-elevated border-border-subtle text-text-secondary text-[10px] font-black uppercase tracking-wider">
            <XCircle className="w-3 h-3" />
            {t('ticket.closed', 'Closed')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-black text-text-primary">
          {t('support.title', 'Support Desk')}
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          {t('support.subtitle', 'Need assistance? Tap our channels or file a support ticket below')}
        </p>
      </div>

      {/* Speed Help Options */}
      <div className="space-y-2.5">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="support.contactLetzryd">
          Direct Channels
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:08000538793"
            className="flex flex-col items-center gap-2 p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center cursor-pointer transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-success-dim text-success-brand flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-text-primary leading-tight" data-i18n="support.callHub">Call Support Hub</p>
              <p className="text-[10px] text-text-muted mt-0.5" data-i18n="support.callHubSub">24×7 Hotline</p>
            </div>
          </a>

          <a
            href="https://wa.me/918000538793"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2 p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl text-center cursor-pointer transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-success-dim text-[#25D366] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-text-primary leading-tight">WhatsApp Desk</p>
              <p className="text-[10px] text-text-muted mt-0.5" data-i18n="support.whatsappSub">Instant Chat</p>
            </div>
          </a>
        </div>
      </div>

      {/* Ticket Logs and Form Trigger */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="support.myTickets">
            My Tickets
          </h3>
          <button
            onClick={onOpenNewTicket}
            className="px-3 py-1.5 rounded-lg bg-accent-brand text-black text-xs font-extrabold flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md shadow-accent-brand/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('support.newTicket', 'New Ticket')}
          </button>
        </div>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="py-12 bg-bg-surface border border-border-subtle rounded-2xl text-center text-text-muted flex flex-col items-center justify-center">
              <TicketIcon className="w-12 h-12 stroke-[1.2] opacity-35 mb-3 text-text-muted" />
              <p className="text-sm font-semibold">{t('ticket.noTickets', 'No tickets raised yet')}</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onOpenTicketDetails(ticket)}
                className="p-4 bg-bg-surface border border-border-subtle rounded-2xl text-left space-y-3 hover:border-border-bright cursor-pointer shadow-sm hover:translate-y-[-1px] transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-black font-mono text-text-muted uppercase tracking-wider">
                      {ticket.id}
                    </span>
                    <h4 className="text-xs font-black text-text-primary leading-tight mt-0.5 line-clamp-1">
                      {ticket.subject}
                    </h4>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                <p className="text-[11px] font-medium text-text-secondary leading-relaxed line-clamp-2">
                  {ticket.description}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold tracking-wide uppercase pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ticket.date}</span>
                  <span className="mx-1">•</span>
                  <span>{ticket.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
