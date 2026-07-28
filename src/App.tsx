/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
// @ts-ignore
import logoIcon from './assets/logo-icon.png';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  ReceiptIndianRupee,
  Building,
  Headset,
  User as UserIcon,
  ChevronRight,
  LogOut,
  TriangleAlert,
  Car,
  CreditCard,
  Home,
  FileText,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Target,
  Gift,
  PhoneCall,
  Check
} from 'lucide-react';

import {
  USER_DATA,
  VEHICLE_DATA,
  RENTAL_PLAN_DATA,
  HISAAB_WEEKS_DATA,
  OPERATOR_FLEET_DATA,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  ANNOUNCEMENTS_DATA,
  SUPPORT_HOTLINE,
  LETZRYD_UPI_ID,
  TICKET_CATEGORIES,
  TRANSLATIONS_EN,
  TRANSLATIONS_HI,
  TRANSLATIONS_MR,
  TRANSLATIONS_TE,
  TRANSLATIONS_KN,
  DEMO_PROFILES
} from './data';

import { User, Vehicle, HisaabWeek, Fleet, Ticket, Notification, Language } from './types';


import {
  Toast,
  NewTicketModal,
  TicketDetailModal,
  NotificationModal,
  ProfileScreen,
  SettleScreen,
  SupportScreen,
  RentalScreen,
  VehicleScreen,
  HisaabScreen,
  OperatorScreen,
  OperatorVehicleScreen,
  ReferralModal
} from './components';

export default function App() {
  // Multi-Language State (Default EN, switchable to HI, MR, TE, KN)
  const [language, setLanguage] = useState<Language>('en');

  // Authentication & Session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState<'driver' | 'operator'>('driver');
  const [phoneInput, setPhoneInput] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  // Global Navigation
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [prevScreen, setPrevScreen] = useState<string>('home');

  // Ledger Week Indices
  const [driverWeekIndex, setDriverWeekIndex] = useState(0);
  const [operatorVehicleWeekIndex, setOperatorVehicleWeekIndex] = useState(0);

  // Data Collections
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hisaabWeeks, setHisaabWeeks] = useState<HisaabWeek[]>(HISAAB_WEEKS_DATA);
  const [operatorFleet, setOperatorFleet] = useState<Fleet>(OPERATOR_FLEET_DATA);
  const [driverUser, setDriverUser] = useState<User>(USER_DATA);

  // Active Vehicle Selection for Operator View
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<string | null>(null);

  // Active Emergency SOS Alarm
  const [sosActivated, setSosActivated] = useState(false);
  const [sosTime, setSosTime] = useState<string | null>(null);

  // Modal Control States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Reactive Toast System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Universal Translation Lookup for all 5 languages
  const t = (key: string, fallback: string): string => {
    let dict = TRANSLATIONS_EN;
    if (language === 'hi') dict = TRANSLATIONS_HI;
    if (language === 'mr') dict = TRANSLATIONS_MR;
    if (language === 'te') dict = TRANSLATIONS_TE;
    if (language === 'kn') dict = TRANSLATIONS_KN;

    return dict[key] || TRANSLATIONS_EN[key] || fallback;
  };

  // Format Vehicle Number with clean spacing (e.g. KA05AQ7692 -> KA 05 AQ 7692)
  const formatVehicleNumber = (num: string): string => {
    if (!num) return num;
    const match = num.match(/^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{4})$/i);
    if (match) {
      return `${match[1].toUpperCase()} ${match[2]} ${match[3].toUpperCase()} ${match[4]}`;
    }
    return num;
  };

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message: msg, type });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    const langNames: Record<Language, string> = {
      en: 'English',
      hi: 'हिंदी (Hindi)',
      mr: 'मराठी (Marathi)',
      te: 'తెలుగు (Telugu)',
      kn: 'ಕನ್ನಡ (Kannada)'
    };
    triggerToast(`Language changed to ${langNames[lang]}`, 'success');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 10) {
      triggerToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setOtpSent(true);
    triggerToast('OTP code sent successfully', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length < 4) {
      triggerToast('Please enter a 4-digit OTP code', 'error');
      return;
    }

    const matchedProfile = DEMO_PROFILES.find(p => p.phone === phoneInput);
    if (matchedProfile) {
      setLoginType(matchedProfile.role);
      setDriverUser(matchedProfile.user);
      setHisaabWeeks(matchedProfile.weeks);
      triggerToast(`Logged in as ${matchedProfile.name}`, 'success');
    } else {
      triggerToast(loginType === 'driver' ? 'Logged in as Driver' : 'Logged in as Fleet Operator', 'success');
    }

    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOtpSent(false);
    setCurrentScreen('home');
    setSosActivated(false);
    setDriverWeekIndex(0);
    setSelectedVehicleNumber(null);
    triggerToast('Signed out successfully', 'info');
  };

  const navigateTo = (screen: string) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    navigateTo(prevScreen);
  };

  const handleNewTicketSubmit = (category: string, subject: string, description: string) => {
    const newId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTkt: Ticket = {
      id: newId,
      category,
      subject,
      description,
      status: 'open',
      priority: 'medium',
      date: new Date().toISOString().split('T')[0],
      response: null
    };

    setTickets(prev => [newTkt, ...prev]);
    setIsNewTicketOpen(false);
    triggerToast(t('ticket.submitted', 'Support ticket filed successfully!'), 'success');

    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'ReceiptIndianRupee',
      title: 'Ticket Lodged Successfully',
      message: `Support ticket ${newId} queued for review.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSosTrigger = (timeStr: string) => {
    setSosActivated(true);
    setSosTime(timeStr);
    triggerToast('Emergency SOS Sent to LetzRyd Hub!', 'error');

    const emergencyNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'FileWarning',
      title: 'SOS Emergency Registered',
      message: 'LetzRyd dispatcher team is matching coordinates.',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [emergencyNotif, ...prev]);
  };

  const handleCancelSos = () => {
    setSosActivated(false);
    setSosTime(null);
    triggerToast('SOS alert cancelled', 'info');
  };

  const handleReportIncident = (type: string, loc: string, drivable: boolean) => {
    triggerToast('Incident report logged with central dispatcher!', 'success');
  };

  const handleSelectVehicleForHisaab = (number: string) => {
    setSelectedVehicleNumber(number);
    setOperatorVehicleWeekIndex(0);
    navigateTo('operatorVehicle');
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(LETZRYD_UPI_ID)
      .then(() => triggerToast('UPI ID copied to clipboard!', 'success'))
      .catch(() => triggerToast(`UPI ID: ${LETZRYD_UPI_ID}`, 'info'));
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(driverUser.operatorCode)
      .then(() => triggerToast('Referral code copied!', 'success'))
      .catch(() => triggerToast(`Referral Code: ${driverUser.operatorCode}`, 'info'));
  };

  const handleConfirmPayment = () => {
    setHisaabWeeks(prev => {
      const updated = [...prev];
      if (updated[driverWeekIndex]) {
        updated[driverWeekIndex] = {
          ...updated[driverWeekIndex],
          status: 'settled_pay',
          toCollect: 0,
          toPay: 0,
          currentWeekOs: 0,
          notes: 'Settled via driver self-declaration checkout.'
        };
      }
      return updated;
    });

    triggerToast(t('payment.noted', 'Payment logged! Verification will complete shortly.'), 'success');
    navigateTo('hisaab');
  };

  const handleUpdateContact = (emergency: string, addr: string) => {
    setDriverUser(prev => ({
      ...prev,
      emergencyContact: emergency,
      address: addr
    }));
    triggerToast(t('profile.saved', 'Profile updated successfully!'), 'success');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast('All notifications marked as read', 'success');
  };

  const selectedVehicleObj = selectedVehicleNumber
    ? operatorFleet.vehicles.find(v => v.number === selectedVehicleNumber)
    : null;

  const initials = loginType === 'operator' ? 'RK' : driverUser.initials;
  const userName = loginType === 'operator' ? 'RK Transport' : driverUser.name;
  const activeWeek = hisaabWeeks[0];
  const prevWeek = hisaabWeeks[1];

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
    <div className="min-h-screen bg-bg flex items-center justify-center py-0 md:py-6 px-0 md:px-4 font-sans select-none">

      {/* MOBILE PHONE APP CONTAINER */}
      <div className="w-full max-w-[375px] h-screen md:h-[780px] bg-bg border-0 md:border md:border-border rounded-none md:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden text-text">

        {/* Toast Container — anchored inside the phone frame so it never escapes it */}
        <div className="absolute top-4 inset-x-4 z-50 pointer-events-none flex flex-col gap-2 items-center">
          <AnimatePresence>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            /* =========================================================================
               MOBILE OTP LOGIN SCREEN (BRANDING + 5-LANGUAGE SELECTOR)
               ========================================================================= */
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col bg-primary overflow-hidden"
            >
              {/* Top branding area — fills upper navy portion with balanced spacing */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-4 text-center bg-gradient-to-b from-[#0A1650] to-[#081242]">
                <img
                  src="https://letzryd.com/replica-assets/letzryd-long-png-logo-Aq2o3DNOw1i2kBMB-7ab04eaa76.png"
                  alt="LetzRyd logo"
                  className="h-16 max-w-[210px] w-auto object-contain filter brightness-0 invert drop-shadow-sm transition-transform duration-200 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5">
                  <h1 className="font-sans text-lg font-extrabold text-white tracking-tight leading-snug">
                    {t('app.title', 'LetzRyd Portal')}
                  </h1>
                  <p className="font-sans text-xs font-medium text-white/80">
                    {t('app.subtitle', 'Drive in the Future of Urban Mobility.')}
                  </p>
                </div>

                {/* 5-Language selector pills */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {(['en', 'hi', 'mr', 'te', 'kn'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                        language === lang
                          ? 'bg-white text-primary font-bold shadow-md'
                          : 'bg-white/15 text-white/85 hover:bg-white/25 backdrop-blur-xs'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : lang === 'mr' ? 'मराठी' : lang === 'te' ? 'తెలుగు' : 'ಕನ್ನಡ'}
                    </button>
                  ))}
                </div>
              </div>

              {/* White form card — anchored seamlessly to bottom */}
              <div className="bg-bg rounded-t-[28px] px-6 pt-6 pb-8 space-y-4 shadow-2xl shrink-0 border-t border-white/20">
                {/* Role switcher */}
                <div className="grid grid-cols-2 gap-1.5 bg-border p-1 rounded-xl">
                  <button
                    onClick={() => setLoginType('driver')}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      loginType === 'driver' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
                    }`}
                  >
                    {t('login.driver', 'Driver Login')}
                  </button>
                  <button
                    onClick={() => setLoginType('operator')}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      loginType === 'operator' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
                    }`}
                  >
                    {t('login.operator', 'Operator Login')}
                  </button>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs font-semibold text-text-muted">
                        {t('login.enterPhone', 'Enter 10-Digit Mobile Number')}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="h-11 px-3 rounded-lg border border-border bg-border font-sans text-sm font-bold text-text flex items-center shrink-0">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 font-sans text-sm font-medium text-text outline-none"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover font-sans text-sm font-semibold text-white cursor-pointer transition-colors shadow-sm"
                    >
                      {t('login.sendOtp', 'Get OTP')}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs font-semibold text-text-muted">
                        {t('login.enterOtp', 'Enter 4-Digit OTP')}
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="h-14 w-full rounded-xl border border-border bg-surface text-center font-mono text-2xl font-bold tracking-[0.5em] text-primary outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover font-sans text-sm font-semibold text-white cursor-pointer transition-colors shadow-sm"
                    >
                      {t('login.verifyOtp', 'Verify & Enter Portal')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs font-medium text-text-muted hover:text-primary cursor-pointer"
                    >
                      ← {t('login.changeNumber', 'Change Mobile Number')}
                    </button>
                  </form>
                )}

                {/* Demo Quick Login Profiles Picker */}
                <div className="pt-3 border-t border-border space-y-2 text-left">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Quick Switch Demo Profiles (OTP: 1234):
                  </span>
                  <div className="space-y-1.5">
                    {DEMO_PROFILES.map((p) => (
                      <button
                        key={p.phone}
                        type="button"
                        onClick={() => {
                          setLoginType(p.role);
                          setPhoneInput(p.phone);
                          setOtpInput(p.otp);
                          setDriverUser(p.user);
                          setHisaabWeeks(p.weeks);
                          setIsLoggedIn(true);
                          setCurrentScreen('home');
                          triggerToast(`Logged in as ${p.name}`, 'success');
                        }}
                        className="w-full text-left p-2.5 rounded-lg bg-surface border border-border hover:border-primary flex items-center justify-between text-xs cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div>
                          <div className="font-bold text-text">{p.name}</div>
                          <div className="text-[10px] text-text-muted">{p.phone} • OTP: 1234</div>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-green-light text-green px-2 py-0.5 rounded-md">
                          {p.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               MOBILE APP SHELL (TOP NAV BAR + SCROLLABLE VIEWPORT + BOTTOM NAV BAR)
               ========================================================================= */
            <motion.div
              key="shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4.5 sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
                  <img 
                    src={logoIcon} 
                    alt="LetzRyd icon logo" 
                    className="h-7 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* 5-Language Selector Dropdown Pill */}
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value as Language)}
                    className="h-7 px-1.5 rounded border border-border bg-bg text-[10px] font-bold text-primary cursor-pointer outline-none"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="mr">मराठी</option>
                    <option value="te">తెలుగు</option>
                    <option value="kn">ಕನ್ನಡ</option>
                  </select>

                  {/* Notification Bell */}
                  <button
                    onClick={() => setIsNotifOpen(true)}
                    className="relative p-1.5 rounded-lg border border-border bg-surface text-text-muted cursor-pointer hover:border-primary transition-all"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600" />
                    )}
                  </button>

                  {/* Profile Initials */}
                  <div 
                    onClick={() => navigateTo('profile')}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white cursor-pointer hover:opacity-90 transition-all"
                  >
                    {initials}
                  </div>

                  {/* Sign Out */}
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg border border-border bg-surface text-text-muted hover:text-red-600 cursor-pointer hover:border-red-200 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </header>

              {/* Viewport Content */}
              <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                <AnimatePresence mode="wait">
                  {currentScreen === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Driver Greeting Card */}
                      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm text-left space-y-1 font-sans text-xs">
                        <h2 className="font-bold text-text text-xs">
                          {t('home.greeting', 'Hi')}, {userName.split(' ')[0]} 👋
                        </h2>
                        <p className="text-text-muted text-xs">
                          {t('home.summary', "Here's your weekly settlement summary")}
                        </p>
                      </div>

                      {/* Dedicated Allocated Vehicle Information Card */}
                      <div className="bg-surface border border-border rounded-xl p-3.5 shadow-sm text-left space-y-2 font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-text-muted font-medium">{t('home.vehicleNumber', 'Vehicle Number')}:</span>
                          <span className="font-sans text-xs font-bold text-text">
                            {formatVehicleNumber(VEHICLE_DATA.number)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                          <span className="text-text-muted font-medium shrink-0">{t('home.vehicleModel', 'Vehicle Model')}:</span>
                          <span className="font-bold text-text truncate max-w-[210px] text-right">
                            {VEHICLE_DATA.model} {VEHICLE_DATA.variant} ({VEHICLE_DATA.year})
                          </span>
                        </div>
                      </div>

                      {/* Financial Hero Card with Week & Hisaab Pill */}
                      {loginType === 'driver' ? (
                        <>
                          {/* BOX 1: Current Week Hisaab Card */}
                          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-left space-y-3">
                            <div className="flex justify-between items-start border-b border-border pb-2.5">
                              <div className="font-sans text-xs font-bold text-text uppercase tracking-wider leading-tight">
                                <div>{t('home.estimatedPayout', 'ESTIMATED PAYOUT')}</div>
                                <div className="text-[10px] text-text-muted font-semibold mt-0.5">{t('home.thisWeek', 'THIS WEEK')}</div>
                              </div>
                              <div className="text-right font-sans text-xs leading-tight shrink-0">
                                <div className="font-bold text-text">{t('home.week', 'Week')} #{activeWeek.weekNumber}</div>
                                <div className="text-[10px] font-medium text-text-muted mt-0.5">{activeWeek.hisaabNumber}</div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center gap-2 pt-1">
                              <div className={`font-sans text-xl font-bold ${activeWeek.currentWeekOs < 0 ? 'text-green' : 'text-red-600'}`}>
                                {activeWeek.currentWeekOs < 0 ? '+₹' : '-₹'}{Math.abs(activeWeek.currentWeekOs).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </div>
                              {/* Growth Trend Badge */}
                              <span className="flex items-center gap-1 font-sans text-[10px] font-bold text-green bg-green-light px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                                <TrendingUp className="w-3 h-3 text-green" />
                                {activeWeek.growthPct}% {t('home.vsLastWeek', 'vs last week')}
                              </span>
                            </div>
                          </div>

                          {/* BOX 2: Security Deposit Card */}
                          <div className="bg-surface border border-border rounded-xl p-3 shadow-sm text-left font-sans text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-sans text-xs font-bold text-text uppercase tracking-wider">
                                {t('home.deposit', 'SECURITY DEPOSIT')}
                              </span>
                              <div className="flex items-center gap-3 text-xs font-sans">
                                <span>
                                  <span className="text-text-muted font-medium">Paid: </span>
                                  <span className="font-bold text-green">₹{(driverUser.depositPaidSoFar || driverUser.depositAmount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </span>
                                <span>
                                  <span className="text-text-muted font-medium">Pending: </span>
                                  <span className={`font-bold ${(driverUser.depositPending || 0) > 0 ? 'text-amber-700' : 'text-green'}`}>
                                    ₹{(driverUser.depositPending || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* BOX 3: Last Week Settlement Summary Card */}
                          {prevWeek && (
                            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-left space-y-3">
                              <div className="flex justify-between items-start border-b border-border pb-2.5">
                                <div className="font-sans text-xs font-bold text-text uppercase tracking-wider leading-tight">
                                  <div>{t('home.lastWeekHisaab', 'LAST WEEK HISAAB')}</div>
                                  <div className="text-[10px] text-text-muted font-semibold mt-0.5">{t('home.previousWeek', 'SETTLEMENT')}</div>
                                </div>
                                <div className="text-right font-sans text-xs leading-tight shrink-0">
                                  <div className="font-bold text-text">{t('home.week', 'Week')} #{prevWeek.weekNumber}</div>
                                  <div className="text-[10px] font-medium text-text-muted mt-0.5">{prevWeek.hisaabNumber}</div>
                                </div>
                              </div>

                              {prevWeek.isLocked || prevWeek.status === 'settled_pay' ? (
                                // IF PAID / SETTLED: Balance Due is 0
                                <div className="flex justify-between items-center gap-2 pt-1">
                                  <div>
                                    <div className="text-[10px] font-medium text-text-muted">Balance Due</div>
                                    <div className="font-sans text-xl font-bold text-green">₹0</div>
                                  </div>
                                  <span className="flex items-center gap-1 font-sans text-[10px] font-bold text-green bg-green-light px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                                    {prevWeek.currentWeekOs < 0
                                      ? t('home.paidToBank', 'Paid to Bank')
                                      : t('home.paidToLetzryd', 'Paid to LetzRyd')}
                                  </span>
                                </div>
                              ) : (
                                // IF NOT PAID: Single Clean Summed Total Amount (Hisaab + Pending Deposit) & Pay Button
                                <div className="flex justify-between items-center gap-2 pt-1">
                                  <div>
                                    <div className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Total Outstanding Due</div>
                                    <div className="font-sans text-xl font-extrabold text-red-600">
                                      -₹{(prevWeek.currentWeekOs + (prevWeek.pendingDeposit || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-sans text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                                      Due
                                    </span>
                                    <button
                                      onClick={() => navigateTo('settle')}
                                      className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover font-sans text-xs font-semibold text-white shadow-xs cursor-pointer transition-all hover:scale-105"
                                    >
                                      Pay
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-surface border border-border rounded-xl p-4 shadow-sm text-left space-y-3 font-sans">
                          <div className="flex justify-between items-start border-b border-border pb-2.5">
                            <div className="text-xs font-bold text-text uppercase tracking-wider leading-tight">
                              <div>TOTAL FLEET OUTSTANDING</div>
                              <div className="text-[10px] text-text-muted font-semibold mt-0.5">DUE TO LETZRYD (ALL 5 CARS & DRIVERS)</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <div className="text-2xl font-extrabold text-red-600 font-sans">
                              -₹{operatorFleet.vehicles.reduce((sum, v) => (v.currentWeekOs > 0 ? sum + v.currentWeekOs : sum), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </div>
                            <button
                              onClick={() => navigateTo('settle')}
                              className="px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs cursor-pointer transition-all hover:scale-105"
                            >
                              Settle Fleet Dues
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 4-Stat Indicator Grid */}
                      <div className="grid grid-cols-4 gap-2 font-sans text-center">
                        <div className="bg-surface border border-border rounded-xl p-2.5 shadow-sm">
                          <p className="font-sans text-base font-bold text-text">{activeWeek.activeDays}</p>
                          <p className="font-sans text-[9px] font-semibold text-text-muted uppercase">{t('home.daysActive', 'Days Active')}</p>
                        </div>
                        <div className="bg-surface border border-border rounded-xl p-2.5 shadow-sm">
                          <p className="font-sans text-base font-bold text-text">{driverUser.completedTripsThisWeek}</p>
                          <p className="font-sans text-[9px] font-semibold text-text-muted uppercase">{t('home.trips', 'Trips')}</p>
                        </div>
                        <div className="bg-surface border border-border rounded-xl p-2.5 shadow-sm">
                          <p className="font-sans text-base font-bold text-text">2,441</p>
                          <p className="font-sans text-[9px] font-semibold text-text-muted uppercase">{t('home.totalKm', 'Total KMs')}</p>
                        </div>
                        <div className="bg-surface border border-border rounded-xl p-2.5 shadow-sm">
                          <p className="font-sans text-base font-bold text-green">{activeWeek.gps.deadMilePct}%</p>
                          <p className="font-sans text-[9px] font-semibold text-text-muted uppercase">{t('home.deadMilesPct', 'Dead Miles %')}</p>
                        </div>
                      </div>

                      {/* Incentive Goal Tracker Progress Bar */}
                      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-2 text-left">
                        <div className="flex justify-between items-center font-sans text-xs">
                          <span className="font-bold text-text flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-primary" />
                            {t('home.incentiveTracker', 'Weekly Incentive Goal')}
                          </span>
                          <span className="font-bold text-primary font-sans">
                            ₹{driverUser.weeklyIncentiveReward} {t('home.bonus', 'Bonus')}
                          </span>
                        </div>

                        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${(driverUser.completedTripsThisWeek / driverUser.weeklyIncentiveTargetTrips) * 100}%` }}
                          />
                        </div>

                        <p className="font-sans text-[11px] text-text-muted text-right">
                          <strong>{driverUser.weeklyIncentiveTargetTrips - driverUser.completedTripsThisWeek} {t('home.tripsRemaining', 'trips remaining')}</strong> {t('home.toUnlockBonus', 'to unlock ₹1,500 bonus')}
                        </p>
                      </div>

                      {/* Quick Access Shortcuts Grid (2 Rows x 2-3 Columns) */}
                      <div className="space-y-2 text-left font-sans">
                        <p className="font-sans text-xs font-bold text-text uppercase tracking-wider">
                          {t('home.quickAccess', 'Quick Access Shortcuts')}
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => { setDriverWeekIndex(0); navigateTo('hisaab'); }}
                            className="p-3 rounded-xl border border-border bg-surface hover:border-green transition-all text-left cursor-pointer group shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-green-light text-green flex items-center justify-center mb-1.5 group-hover:bg-green group-hover:text-white transition-all">
                              <ReceiptIndianRupee className="h-4 w-4" />
                            </div>
                            <h4 className="font-sans text-xs font-bold text-text group-hover:text-green">
                              {t('home.currentHisaab', 'Current Hisaab')}
                            </h4>
                            <p className="font-sans text-[10px] text-text-muted mt-0.5">Week #{hisaabWeeks[0].weekNumber}</p>
                          </button>

                          <button
                            onClick={() => { setDriverWeekIndex(1); navigateTo('hisaab'); }}
                            className="p-3 rounded-xl border border-border bg-surface hover:border-green transition-all text-left cursor-pointer group shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-yellow-light text-amber-700 flex items-center justify-center mb-1.5 group-hover:bg-amber-700 group-hover:text-white transition-all">
                              <ReceiptIndianRupee className="h-4 w-4" />
                            </div>
                            <h4 className="font-sans text-xs font-bold text-text group-hover:text-amber-700">
                              {t('home.lastWeekHisaab', "Last Week Hisaab")}
                            </h4>
                            <p className="font-sans text-[10px] text-text-muted mt-0.5">Week #{hisaabWeeks[1].weekNumber} (Locked)</p>
                          </button>

                          <button
                            onClick={() => setIsNewTicketOpen(true)}
                            className="p-3 rounded-xl border border-border bg-surface hover:border-green transition-all text-left cursor-pointer group shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Headset className="h-4 w-4" />
                            </div>
                            <h4 className="font-sans text-xs font-bold text-text group-hover:text-indigo-600">
                              {t('home.raiseTicket', 'Raise Ticket')}
                            </h4>
                            <p className="font-sans text-[10px] text-text-muted mt-0.5">Support desk</p>
                          </button>

                          <button
                            onClick={() => setIsReferralOpen(true)}
                            className="p-3 rounded-xl border border-border bg-surface hover:border-green transition-all text-left cursor-pointer group shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:bg-purple-600 group-hover:text-white transition-all">
                              <Gift className="h-4 w-4" />
                            </div>
                            <h4 className="font-sans text-xs font-bold text-text group-hover:text-purple-600">
                              {t('home.referDriver', 'Refer & Earn ₹1,000')}
                            </h4>
                            <p className="font-sans text-[10px] text-text-muted mt-0.5">Earn bonus</p>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentScreen === 'hisaab' && (
                    <HisaabScreen
                      weeks={hisaabWeeks}
                      weekIndex={driverWeekIndex}
                      onPrevWeek={() => setDriverWeekIndex(prev => Math.min(prev + 1, hisaabWeeks.length - 1))}
                      onNextWeek={() => setDriverWeekIndex(prev => Math.max(prev - 1, 0))}
                      loginType={loginType}
                      onPayClick={() => navigateTo('settle')}
                      t={t}
                    />
                  )}

                  {currentScreen === 'settle' && (
                    <SettleScreen
                      amount={
                        loginType === 'operator'
                          ? operatorFleet.vehicles.reduce((sum, v) => (v.currentWeekOs > 0 ? sum + v.currentWeekOs : sum), 0)
                          : Math.abs(hisaabWeeks[driverWeekIndex]?.currentWeekOs || 0) + (driverUser.depositPending || 0)
                      }
                      hisaabAmount={
                        loginType === 'operator'
                          ? operatorFleet.vehicles.reduce((sum, v) => (v.currentWeekOs > 0 ? sum + v.currentWeekOs : sum), 0)
                          : Math.abs(hisaabWeeks[driverWeekIndex]?.currentWeekOs || 0)
                      }
                      pendingDeposit={loginType === 'operator' ? 0 : (driverUser.depositPending || 0)}
                      weekRange={`${hisaabWeeks[driverWeekIndex]?.weekStart} to ${hisaabWeeks[driverWeekIndex]?.weekEnd}`}
                      upiId={LETZRYD_UPI_ID}
                      driverName={driverUser.name}
                      driverPhone={driverUser.phone}
                      driverId={driverUser.id}
                      onCopyUpi={handleCopyUpiId}
                      onConfirmPayment={handleConfirmPayment}
                      onBack={() => navigateTo(loginType === 'operator' ? 'operator' : 'hisaab')}
                      t={t}
                    />
                  )}

                  {currentScreen === 'vehicle' && (
                    <VehicleScreen
                      vehicle={VEHICLE_DATA}
                      t={t}
                    />
                  )}

                  {currentScreen === 'rental' && (
                    <RentalScreen
                      plan={RENTAL_PLAN_DATA}
                      t={t}
                    />
                  )}

                  {currentScreen === 'operator' && (
                    <OperatorScreen
                      fleet={operatorFleet}
                      onSelectVehicle={handleSelectVehicleForHisaab}
                      t={t}
                    />
                  )}

                  {currentScreen === 'operatorVehicle' && selectedVehicleObj && (
                    <OperatorVehicleScreen
                      vehicle={selectedVehicleObj}
                      weekIndex={operatorVehicleWeekIndex}
                      onPrevWeek={() => setOperatorVehicleWeekIndex(prev => Math.min(prev + 1, selectedVehicleObj.hisaabWeeks.length - 1))}
                      onNextWeek={() => setOperatorVehicleWeekIndex(prev => Math.max(prev - 1, 0))}
                      onBack={() => navigateTo('operator')}
                      t={t}
                    />
                  )}

                  {currentScreen === 'support' && (
                    <SupportScreen
                      user={driverUser}
                      tickets={tickets}
                      hotline={SUPPORT_HOTLINE}
                      onNewTicket={() => setIsNewTicketOpen(true)}
                      onSelectTicket={(ticket) => setSelectedTicket(ticket)}
                      t={t}
                    />
                  )}

                  {currentScreen === 'profile' && (
                    <ProfileScreen
                      user={driverUser}
                      loginType={loginType}
                      onUpdateContact={handleUpdateContact}
                      t={t}
                    />
                  )}
                </AnimatePresence>
              </main>

              {/* Bottom Navigation */}
              <nav className="border-t border-border bg-surface px-2 py-1.5 flex items-center justify-around shrink-0 z-40">
                <button
                  onClick={() => navigateTo('home')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                    currentScreen === 'home' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  {t('nav.home', 'Home')}
                </button>

                <button
                  onClick={() => navigateTo('hisaab')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                    currentScreen === 'hisaab' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <ReceiptIndianRupee className="h-4 w-4" />
                  {t('nav.hisaab', 'Hisaab')}
                </button>

                <button
                  onClick={() => navigateTo('settle')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                    currentScreen === 'settle' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  {t('nav.settle', 'Settle')}
                </button>

                {loginType === 'driver' ? (
                  <button
                    onClick={() => navigateTo('vehicle')}
                    className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                      currentScreen === 'vehicle' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <Car className="h-4 w-4" />
                    {t('nav.vehicle', 'Vehicle')}
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('operator')}
                    className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                      currentScreen === 'operator' || currentScreen === 'operatorVehicle' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    {t('nav.fleet', 'Fleet')}
                  </button>
                )}

                <button
                  onClick={() => navigateTo('support')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                    currentScreen === 'support' ? 'text-primary font-bold' : 'text-text-muted hover:text-text'
                  }`}
                >
                  <Headset className="h-4 w-4" />
                  {t('nav.support', 'Support')}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals Layer — inside the phone container so they're clipped to the phone frame */}
        {isNotifOpen && (
          <NotificationModal
            notifications={notifications}
            onClose={() => setIsNotifOpen(false)}
            onMarkAllRead={handleMarkAllNotificationsRead}
            t={t}
          />
        )}

        {isNewTicketOpen && (
          <NewTicketModal
            categories={TICKET_CATEGORIES}
            onClose={() => setIsNewTicketOpen(false)}
            onSubmit={handleNewTicketSubmit}
            t={t}
          />
        )}

        {isReferralOpen && (
          <ReferralModal
            onClose={() => setIsReferralOpen(false)}
            driverCode={driverUser.operatorCode}
            onCopy={handleCopyReferralCode}
            t={t}
          />
        )}

        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
