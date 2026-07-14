/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, LogOut, Edit2, Check, X, Shield, Phone, MapPin, Calendar, Heart } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileScreenProps {
  user: UserType;
  loginType: 'driver' | 'operator';
  onUpdateContact: (emergencyContact: string, address: string) => void;
  onLogout: () => void;
  t: (key: string, fallback: string) => string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  loginType,
  onUpdateContact,
  onLogout,
  t
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [emergency, setEmergency] = useState(user.emergencyContact);
  const [address, setAddress] = useState(user.address);

  const handleSave = () => {
    onUpdateContact(emergency, address);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEmergency(user.emergencyContact);
    setAddress(user.address);
    setIsEditing(false);
  };

  const isOperator = loginType === 'operator';

  return (
    <div className="space-y-6 text-left">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-text-primary" id="pf-page-title">
            {t('profile.title', 'My Profile')}
          </h2>
          <p className="text-xs text-text-secondary" id="pf-page-sub">
            {t('profile.subtitle', 'Manage your details')}
          </p>
        </div>

        {!isOperator && (
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 rounded-lg bg-accent-dim text-accent-brand border border-accent-brand/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:brightness-110"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {t('profile.edit', 'Edit')}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-lg bg-success-dim text-success-brand border border-success-brand/20 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:brightness-110"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-xs font-bold text-text-secondary flex items-center gap-1 cursor-pointer hover:border-border-bright"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Avatar Card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-bg-surface border border-border-subtle shadow-md shadow-black/10">
        <div className="w-16 h-16 rounded-full bg-accent-dim border-2 border-accent-brand flex items-center justify-center text-xl font-black text-accent-brand shrink-0 shadow-inner shadow-accent-brand/5">
          {isOperator ? user.name.substring(0, 2).toUpperCase() : user.initials}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black text-text-primary leading-tight truncate">
            {isOperator ? `${user.name} (Operator)` : user.name}
          </p>
          <p className="text-xs font-mono text-text-muted mt-1 font-semibold">{user.operatorCode}</p>
          <span className="inline-block mt-2.5 text-[10px] font-black uppercase tracking-wider bg-accent-dim text-accent-brand border border-accent-brand/10 px-2.5 py-0.5 rounded-full shadow-sm">
            {isOperator ? t('profile.operatorType', 'Operator / Operator') : t('profile.driverType', 'Individual Driver')}
          </span>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5">
          {t('profile.personal', 'Personal Details')}
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.letzrydId', 'LetzRyd ID')}</span>
            <span className="text-xs font-bold text-text-primary">{user.id}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.phone', 'Phone')}</span>
            <span className="text-xs font-bold text-text-primary">+91 {user.phone}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.dob', 'DOB')}</span>
            <span className="text-xs font-bold text-text-primary">{user.dob}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.blood', 'Blood Group')}</span>
            <span className="text-xs font-bold text-text-primary">{user.bloodGroup}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.joined', 'Joined')}</span>
            <span className="text-xs font-bold text-text-primary">{user.joined}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5">
          {t('profile.documents', 'Documents')}
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle">
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.aadhar', 'Aadhar')}</span>
            <span className="text-xs font-bold text-text-primary font-mono">{user.aadhar}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.dlNumber', 'DL Number')}</span>
            <span className="text-xs font-bold text-text-primary font-mono">{user.dlNumber}</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{t('profile.dlExpiry', 'DL Expiry')}</span>
            <span className="text-xs font-bold text-text-primary">{user.dlExpiry}</span>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2.5">
          {t('profile.contact', 'Contact Details')}
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden divide-y divide-border-subtle p-4 space-y-4">
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-danger-brand" />
              {t('profile.emergency', 'Emergency Contact')}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                placeholder={t('profile.emergencyPlaceholder', 'Name (Relation) - Phone')}
                className="w-full bg-bg-elevated border border-border-bright rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none"
              />
            ) : (
              <span className="text-xs font-bold text-text-primary leading-tight">
                {user.emergencyContact || '—'}
              </span>
            )}
          </div>

          <div className="h-[1px] bg-border-subtle" />

          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent-brand" />
              {t('profile.address', 'Address')}
            </span>
            {isEditing ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t('profile.addressPlaceholder', 'Your current residential address...')}
                rows={2}
                className="w-full bg-bg-elevated border border-border-bright rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none resize-none leading-relaxed"
              />
            ) : (
              <span className="text-xs font-semibold text-text-secondary leading-relaxed">
                {user.address || '—'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-xl bg-danger-brand/10 border border-danger-brand/20 text-danger-brand font-black hover:bg-danger-brand/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <LogOut className="w-4 h-4" />
        {t('profile.signOut', 'Sign Out')}
      </button>
    </div>
  );
};
