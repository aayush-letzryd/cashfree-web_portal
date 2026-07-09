/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Scale,
  Building,
  Headset,
  AlertTriangle,
  User as UserIcon,
  ChevronRight,
  LogOut,
  TriangleAlert,
  Menu,
  Sparkles,
  Smartphone,
  PhoneCall,
  Flame,
  Award,
  BookOpen,
  MapPin,
  HelpCircle,
  Clock,
  ArrowRightLeft,
  CheckCircle,
  BadgeAlert,
  Car,
  Sun,
  Moon
} from 'lucide-react';

import {
  USER_DATA,
  VEHICLE_DATA,
  RENTAL_PLAN_DATA,
  HISAAB_WEEKS_DATA,
  VENDOR_FLEET_DATA,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  SUPPORT_HOTLINE,
  LETZRYD_UPI_ID,
  TICKET_CATEGORIES,
  TRANSLATIONS_HI
} from './data';

import { User, Vehicle, HisaabWeek, Fleet, Ticket, Notification } from './types';
import { Toast } from './components/Toast';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { NewTicketModal, TicketDetailModal } from './components/TicketModals';
import { NotificationModal } from './components/NotificationModal';
import { ProfileScreen } from './components/ProfileScreen';
import { SettleScreen } from './components/SettleScreen';
import { SosScreen } from './components/SosScreen';
import { SupportScreen } from './components/SupportScreen';
import { RentalScreen } from './components/RentalScreen';
import { VehicleScreen } from './components/VehicleScreen';
import { HisaabScreen } from './components/HisaabScreen';
import { VendorScreen } from './components/VendorScreen';
import { VendorVehicleScreen } from './components/VendorVehicleScreen';

export default function App() {
  // Theme State (Default to 'dark')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Authentication & Session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginType, setLoginType] = useState<'driver' | 'vendor' | null>(null);

  // Global Navigation
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [prevScreen, setPrevScreen] = useState<string>('home');

  // Multi-Language State
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Ledger Week Indices
  const [driverWeekIndex, setDriverWeekIndex] = useState(0);
  const [vendorVehicleWeekIndex, setVendorVehicleWeekIndex] = useState(0);

  // Data Collections (Local state for reactivity)
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [hisaabWeeks, setHisaabWeeks] = useState<HisaabWeek[]>(HISAAB_WEEKS_DATA);
  const [vendorFleet, setVendorFleet] = useState<Fleet>(VENDOR_FLEET_DATA);
  const [driverUser, setDriverUser] = useState<User>(USER_DATA);

  // Active Vehicle Selection for Vendor View
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState<string | null>(null);

  // Active Emergency SOS Alarm
  const [sosActivated, setSosActivated] = useState(false);
  const [sosTime, setSosTime] = useState<string | null>(null);

  // Modal Control States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeDocType, setActiveDocType] = useState<'rc' | 'insurance' | 'permit' | 'aadhar' | 'dl' | null>(null);

  // Reactive Toast System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Translation lookup helper
  const t = (key: string, fallback: string) => {
    if (language === 'hi' && TRANSLATIONS_HI[key]) {
      return TRANSLATIONS_HI[key];
    }
    return fallback;
  };

  const getWeekRangeShort = (start: string, end: string) => {
    const fDate = (s: string) => {
      const d = new Date(s + 'T00:00:00');
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };
    return `${fDate(start)} – ${fDate(end)}`;
  };

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message: msg, type });
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      triggerToast(next === 'hi' ? 'भाषा बदलकर हिंदी की गई' : 'Language switched to English', 'success');
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      triggerToast(next === 'light' ? 'Light mode enabled' : 'Dark mode enabled', 'success');
      return next;
    });
  };

  const handleLogin = (type: 'driver' | 'vendor') => {
    setLoginType(type);
    setIsLoggedIn(true);
    setCurrentScreen('home');
    triggerToast(type === 'driver' ? 'Logged in as Rajesh Kumar' : 'Logged in as RK Transport Vendor', 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginType(null);
    setCurrentScreen('home');
    setSosActivated(false);
    setDriverWeekIndex(0);
    setSelectedVehicleNumber(null);
    triggerToast('Logged out successfully', 'info');
  };

  const navigateTo = (screen: string) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    navigateTo(prevScreen);
  };

  // Raised support ticket submission handler
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

    // Automatically trigger a reactive notification
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'ReceiptIndianRupee',
      title: 'Ticket Lodged Successfully',
      message: `Support ticket ${newId} has been queued for verification.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // SOS trigger controller
  const handleSosTrigger = (timeStr: string) => {
    setSosActivated(true);
    setSosTime(timeStr);
    triggerToast('Emergency SOS Sent to LetzRyd Hub!', 'error');

    // Create a high-priority alert notification
    const emergencyNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'FileWarning',
      title: 'SOS Emergency Registered',
      message: 'LetzRyd operator dispatcher team is matching coordinates.',
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

  // Incident reporting handler
  const handleReportIncident = (type: string, loc: string, drivable: boolean) => {
    triggerToast('Incident report logged with central dispatcher!', 'success');
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'FileWarning',
      title: 'Incident Report Received',
      message: `${type} recorded at ${loc}. Asset drivability status: ${drivable ? 'Safe' : 'Towing scheduled'}.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Document viewer launcher
  const handleOpenDoc = (type: 'rc' | 'insurance' | 'permit' | 'aadhar' | 'dl') => {
    setActiveDocType(type);
  };

  // Vendor vehicle select
  const handleSelectVehicleForHisaab = (number: string) => {
    setSelectedVehicleNumber(number);
    setVendorVehicleWeekIndex(0);
    navigateTo('vendorVehicle');
  };

  // Copy UPI Id
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(LETZRYD_UPI_ID)
      .then(() => triggerToast('UPI ID copied to clipboard!', 'success'))
      .catch(() => triggerToast(`UPI ID: ${LETZRYD_UPI_ID}`, 'info'));
  };

  // Confirm payment flow
  const handleConfirmPayment = () => {
    // Modify local week state dynamically to represent completed checkout
    setHisaabWeeks(prev => {
      const updated = [...prev];
      if (updated[driverWeekIndex]) {
        updated[driverWeekIndex] = {
          ...updated[driverWeekIndex],
          status: 'settled_pay',
          toCollect: 0,
          toPay: 0,
          currentWeekOs: 0,
          notes: 'Settled. Payment confirmed via driver self-declaration checkout.'
        };
      }
      return updated;
    });

    triggerToast(t('payment.noted', 'Payment logged! Verification will complete in 2 hours.'), 'success');
    navigateTo('hisaab');

    // Add confirmed alert
    const payNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      icon: 'CheckCircle',
      title: 'Payment Acknowledged',
      message: 'Checkout reference queued for central clearance.',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [payNotif, ...prev]);
  };

  // Profile emergency contact updates
  const handleUpdateContact = (emergency: string, addr: string) => {
    setDriverUser(prev => ({
      ...prev,
      emergencyContact: emergency,
      address: addr
    }));
    triggerToast(t('profile.saved', 'Profile updated successfully!'), 'success');
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast('All notifications marked as read', 'success');
  };

  // Get active vehicle object for vendor detail view
  const selectedVehicleObj = selectedVehicleNumber
    ? vendorFleet.vehicles.find(v => v.number === selectedVehicleNumber)
    : null;

  // Custom greeting helper
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('home.greeting', 'Good morning');
    if (hours < 17) return t('home.greeting', 'Good afternoon');
    return t('home.greeting', 'Good evening');
  };

  return (
    <div className="min-h-screen bg-[var(--body-bg)] flex justify-center items-center py-0 md:py-8 overflow-x-hidden transition-colors duration-300">
      <div className="w-full max-w-md min-h-screen md:min-h-[840px] md:max-h-[880px] bg-bg-base border border-border-subtle rounded-none md:rounded-[40px] shadow-2xl relative flex flex-col overflow-hidden text-text-primary transition-colors duration-300">
        
        {/* Render Toast Layer */}
        <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
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
            /* =============================================
               LOGIN PORTAL
               ============================================= */
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-center px-6 py-12 relative overflow-hidden animate-fade-in"
              style={{
                background: 'radial-gradient(circle at 50% 10%, var(--color-accent-dim) 0%, transparent 65%)'
              }}
            >
              {/* Floating Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-bg-surface border border-border-bright text-text-secondary hover:text-text-primary transition-all cursor-pointer shadow-md"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-accent-brand" /> : <Moon className="w-4.5 h-4.5 text-accent-brand" />}
              </button>
              {/* Logo block */}
              <div className="text-center mb-10 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-accent-brand flex items-center justify-center text-3xl font-black text-black mx-auto shadow-lg shadow-accent-glow">
                  LR
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-text-primary">LetzRyd</h1>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1" data-i18n="login.subtitle">
                    {t('login.subtitle', 'Driver & Vendor Portal')}
                  </p>
                </div>
              </div>

              {/* Selection cards */}
              <div className="space-y-3.5 w-full">
                <button
                  onClick={() => handleLogin('driver')}
                  className="w-full p-4 rounded-xl bg-bg-surface border border-border-bright hover:border-accent-brand hover:scale-[1.01] transition-all flex items-center gap-4 text-left cursor-pointer group shadow-md shadow-black/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-dim text-accent-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary group-hover:text-accent-brand transition-colors">
                      {t('login.driver', 'Login as Driver')}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">Rajesh Kumar · Dzire ZXi CNG</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                </button>

                <button
                  onClick={() => handleLogin('vendor')}
                  className="w-full p-4 rounded-xl bg-bg-surface border border-border-bright hover:border-accent-brand hover:scale-[1.01] transition-all flex items-center gap-4 text-left cursor-pointer group shadow-md shadow-black/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-info-dim text-info-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary group-hover:text-info-brand transition-colors">
                      {t('login.vendor', 'Login as Vendor')}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-0.5">RK Transport · 5 Fleet Vehicles</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted ml-auto" />
                </button>
              </div>

              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="login.demo">
                  {t('login.demo', 'Demo mode — Tap any portal to enter')}
                </p>
              </div>
            </motion.div>
          ) : (
            /* =============================================
               AUTHENTICATED OPERATIONAL SHELL
               ============================================= */
            <motion.div
              key="shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden h-full"
            >
              {/* Central Global Header */}
              <header className="h-[60px] bg-bg-surface border-b border-border-subtle flex items-center justify-between px-4 z-40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent-brand flex items-center justify-center text-sm font-black text-black">
                    LR
                  </div>
                  <div className="text-left leading-none">
                    <p className="text-xs font-black text-text-primary">
                      {loginType === 'vendor' ? 'RK Fleet' : driverUser.name}
                    </p>
                    <p className="text-[9px] text-text-muted font-bold tracking-wider mt-0.5">
                      {loginType === 'vendor' ? 'VND0157' : driverUser.vendorCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Language switcher */}
                  <button
                    onClick={toggleLanguage}
                    className="px-2.5 py-1 text-[10px] font-black uppercase border border-border-bright rounded bg-bg-elevated hover:border-accent-brand transition-all cursor-pointer text-accent-brand"
                  >
                    {language === 'en' ? 'हिंदी' : 'EN'}
                  </button>

                  {/* Theme Switcher */}
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary relative cursor-pointer hover:border-accent-brand transition-all"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-accent-brand" /> : <Moon className="w-4 h-4 text-accent-brand" />}
                  </button>

                  {/* High priority SOS toggle */}
                  <button
                    onClick={() => navigateTo('sos')}
                    className="w-8 h-8 rounded-lg bg-danger-dim text-danger-brand border border-danger-brand/10 flex items-center justify-center cursor-pointer hover:bg-danger-brand hover:text-white transition-all"
                  >
                    <TriangleAlert className="w-4 h-4" />
                  </button>

                  {/* Notification badge */}
                  <button
                    onClick={() => setIsNotifOpen(true)}
                    className="w-8 h-8 rounded-lg bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary relative cursor-pointer hover:text-text-primary"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-danger-brand border-2 border-bg-surface" />
                    )}
                  </button>

                  {/* Profile navigation avatar */}
                  <div
                    onClick={() => navigateTo('profile')}
                    className="w-8 h-8 rounded-full bg-accent-dim border border-accent-brand flex items-center justify-center text-[11px] font-black text-accent-brand cursor-pointer shadow-sm hover:brightness-110"
                  >
                    {loginType === 'vendor' ? 'RK' : driverUser.initials}
                  </div>
                </div>
              </header>

              {/* Screens content viewport */}
              <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
                <AnimatePresence mode="wait">
                  {currentScreen === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Greeting */}
                      <div className="flex justify-between items-start text-left">
                        <div>
                          <h2 className="text-xl font-black text-text-primary">
                            {getGreeting()}, {loginType === 'vendor' ? 'RK Transport' : driverUser.name.split(' ')[0]}
                          </h2>
                          <p className="text-xs text-text-secondary mt-1" data-i18n="home.weekGlance">
                            {loginType === 'vendor' ? t('vendor.homeSub', 'Fleet snapshot') : t('home.weekGlance', "Here's your week at a glance")}
                          </p>
                        </div>
                        <div className="bg-bg-surface border border-border-subtle rounded-lg px-2.5 py-1.5 text-right font-mono">
                          <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider leading-none" data-i18n="home.currentWeek">
                            {t('home.currentWeek', 'Current Week')}
                          </p>
                          <p className="text-[11px] font-bold text-text-primary mt-1 leading-none">Jun 22 – 28</p>
                        </div>
                      </div>

                      {/* Render Role Hero */}
                      {loginType === 'driver' ? (
                        /* DRIVER HERO VIEW */
                        <div className="bg-gradient-to-br from-card-blue-from to-card-blue-to border border-card-blue-border rounded-2xl p-5 text-left relative overflow-hidden shadow-lg">
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-80" data-i18n="home.estPayout">
                            {t('home.estPayout', 'Estimated Payout This Week')}
                          </p>
                          <div className="text-3xl font-black text-accent-brand mt-4 leading-none tracking-tight">
                            ₹{Math.abs(hisaabWeeks[0].currentWeekOs).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <p className="text-[10px] text-text-secondary mt-2 font-bold" data-i18n="home.updatingDaily">
                            Updated today • platform incentives synchronized
                          </p>
                          <div className="grid grid-cols-4 gap-2 mt-5">
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-text-primary">{hisaabWeeks[0].activeDays}</p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1">Days</p>
                            </div>
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-text-primary">
                                {hisaabWeeks[0].platforms.uber.trips + hisaabWeeks[0].platforms.ola.trips + hisaabWeeks[0].platforms.rapido.trips}
                              </p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1">Trips</p>
                            </div>
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-text-primary">
                                {Math.round(hisaabWeeks[0].platforms.uber.km + hisaabWeeks[0].platforms.ola.km + hisaabWeeks[0].platforms.rapido.km).toLocaleString('en-IN')}
                              </p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1">KMs</p>
                            </div>
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-success-brand">0%</p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1">Dead%</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* VENDOR HERO VIEW */
                        <div className="bg-gradient-to-br from-card-blue-from to-card-blue-to border border-card-blue-border rounded-2xl p-5 text-left relative overflow-hidden shadow-lg">
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-80" data-i18n="vendor.fleetEarning">
                            {t('vendor.fleetEarning', 'Platform Net (All Vehicles)')}
                          </p>
                          <div className="text-3xl font-black text-accent-brand mt-4 leading-none tracking-tight">
                            ₹{Math.abs(vendorFleet.vehicles.reduce((sum, v) => sum + v.currentWeekOs, 0)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <p className="text-[10px] text-text-secondary mt-2 font-bold">
                            Rent: ₹32,200 total accrued • 5 units operating
                          </p>
                          <div className="grid grid-cols-3 gap-2 mt-5">
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-text-primary">{vendorFleet.vehicles.length}</p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1" data-i18n="vendor.vehicles">Vehicles</p>
                            </div>
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-success-brand">
                                {vendorFleet.vehicles.filter(v => v.status === 'active').length}
                              </p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1" data-i18n="vendor.active">Active</p>
                            </div>
                            <div className="bg-bg-elevated/40 border border-border-subtle/30 rounded-lg p-2.5 text-center">
                              <p className="text-sm font-black text-text-muted">
                                {vendorFleet.vehicles.filter(v => v.status === 'idle').length}
                              </p>
                              <p className="text-[8px] text-text-secondary font-bold uppercase mt-1" data-i18n="vendor.idle">Idle</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick access shortcuts */}
                      <div className="space-y-2.5 text-left">
                        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="home.quickAccess">
                          {t('home.quickAccess', 'Quick Access')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => navigateTo('hisaab')}
                            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex flex-col items-start gap-4 text-left cursor-pointer transition-all shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-xl bg-accent-dim text-accent-brand flex items-center justify-center shrink-0">
                              <Scale className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-text-primary" data-i18n="home.hisaab">{t('home.hisaab', 'Hisaab')}</p>
                              <p className="text-[10px] text-text-secondary mt-0.5" data-i18n="home.weeklySettlement">Weekly settlement</p>
                            </div>
                          </button>

                          {loginType === 'driver' ? (
                            <button
                              onClick={() => navigateTo('vehicle')}
                              className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex flex-col items-start gap-4 text-left cursor-pointer transition-all shadow-sm"
                            >
                              <div className="w-10 h-10 rounded-xl bg-info-dim text-info-brand flex items-center justify-center shrink-0">
                                <Car className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-text-primary" data-i18n="home.vehicle">{t('home.vehicle', 'Vehicle')}</p>
                                <p className="text-[10px] text-text-secondary mt-0.5" data-i18n="home.docsDetails">Docs & validity</p>
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={() => navigateTo('vendor')}
                              className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex flex-col items-start gap-4 text-left cursor-pointer transition-all shadow-sm"
                            >
                              <div className="w-10 h-10 rounded-xl bg-info-dim text-info-brand flex items-center justify-center shrink-0">
                                <Building className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-text-primary" data-i18n="vendor.fleet">{t('vendor.fleet', 'Fleet')}</p>
                                <p className="text-[10px] text-text-secondary mt-0.5" data-i18n="vendor.allVehicles">All fleet units</p>
                              </div>
                            </button>
                          )}

                          <button
                            onClick={() => navigateTo('support')}
                            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex flex-col items-start gap-4 text-left cursor-pointer transition-all shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-xl bg-success-dim text-success-brand flex items-center justify-center shrink-0">
                              <Headset className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-text-primary" data-i18n="home.support">{t('home.support', 'Support')}</p>
                              <p className="text-[10px] text-text-secondary mt-0.5" data-i18n="home.raiseTicket">Raise a ticket</p>
                            </div>
                          </button>

                          <button
                            onClick={() => navigateTo('sos')}
                            className="p-4 bg-danger-dim/20 border border-danger-brand/15 hover:border-danger-brand hover:bg-danger-dim/35 rounded-2xl flex flex-col items-start gap-4 text-left cursor-pointer transition-all shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-xl bg-danger-dim text-danger-brand flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-danger-brand" data-i18n="home.sos">{t('home.sos', 'SOS Emergency')}</p>
                              <p className="text-[10px] text-danger-brand/70 mt-0.5" data-i18n="home.emergencyAlert">Emergency alert</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Plan cards */}
                      {loginType === 'driver' && (
                        <div className="space-y-2.5 text-left">
                          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest" data-i18n="home.planVehicle">
                            {t('home.planVehicle', 'Plan & Vehicle')}
                          </h3>

                          <div
                            onClick={() => navigateTo('rental')}
                            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex items-center gap-4 cursor-pointer shadow-sm text-left transition-all"
                          >
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-text-primary" data-i18n="home.rentalPlan">{t('home.rentalPlan', 'Rental Plan')}</p>
                              <p className="text-[11px] text-text-secondary mt-0.5 truncate">Standard Plan · ₹1,000 / active day</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                          </div>

                          <div
                            onClick={() => navigateTo('vehicle')}
                            className="p-4 bg-bg-surface border border-border-subtle hover:border-border-bright rounded-2xl flex items-center gap-4 cursor-pointer shadow-sm text-left transition-all"
                          >
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                              <Car className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-text-primary font-mono">{VEHICLE_DATA.number}</p>
                              <p className="text-[11px] text-text-secondary mt-0.5 truncate">Maruti Suzuki Dzire · CNG</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentScreen === 'hisaab' && (
                    <motion.div
                      key="hisaab"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <HisaabScreen
                        weeks={hisaabWeeks}
                        weekIndex={driverWeekIndex}
                        onPrevWeek={() => setDriverWeekIndex(prev => Math.min(prev + 1, hisaabWeeks.length - 1))}
                        onNextWeek={() => setDriverWeekIndex(prev => Math.max(prev - 1, 0))}
                        loginType={loginType || 'driver'}
                        onPayClick={(amt) => navigateTo('settle')}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'vehicle' && loginType === 'driver' && (
                    <motion.div
                      key="vehicle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <VehicleScreen
                        vehicle={VEHICLE_DATA}
                        onBack={() => navigateTo('home')}
                        onViewDoc={handleOpenDoc}
                        onViewDriverDoc={handleOpenDoc}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'rental' && loginType === 'driver' && (
                    <motion.div
                      key="rental"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <RentalScreen
                        plan={RENTAL_PLAN_DATA}
                        onBack={() => navigateTo('home')}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'support' && (
                    <motion.div
                      key="support"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <SupportScreen
                        tickets={tickets}
                        onOpenNewTicket={() => setIsNewTicketOpen(true)}
                        onOpenTicketDetails={setSelectedTicket}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'sos' && (
                    <motion.div
                      key="sos"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <SosScreen
                        activated={sosActivated}
                        alertTime={sosTime}
                        vehicle={VEHICLE_DATA}
                        onTrigger={handleSosTrigger}
                        onCancel={handleCancelSos}
                        onReportIncident={handleReportIncident}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'settle' && (
                    <motion.div
                      key="settle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <SettleScreen
                        amount={hisaabWeeks[driverWeekIndex].toCollect}
                        weekRange={getWeekRangeShort(hisaabWeeks[driverWeekIndex].weekStart, hisaabWeeks[driverWeekIndex].weekEnd)}
                        upiId={LETZRYD_UPI_ID}
                        driverName={driverUser.name}
                        driverPhone={driverUser.phone}
                        driverId={driverUser.id}
                        onCopyUpi={handleCopyUpiId}
                        onConfirmPayment={handleConfirmPayment}
                        onBack={() => navigateTo('hisaab')}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'vendor' && loginType === 'vendor' && (
                    <motion.div
                      key="vendor"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <VendorScreen
                        fleet={vendorFleet}
                        onSelectVehicle={handleSelectVehicleForHisaab}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'vendorVehicle' && selectedVehicleObj && (
                    <motion.div
                      key="vendorVehicle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <VendorVehicleScreen
                        vehicle={selectedVehicleObj}
                        weekIndex={vendorVehicleWeekIndex}
                        onPrevWeek={() => setVendorVehicleWeekIndex(prev => Math.min(prev + 1, selectedVehicleObj.hisaabWeeks.length - 1))}
                        onNextWeek={() => setVendorVehicleWeekIndex(prev => Math.max(prev - 1, 0))}
                        onBack={() => navigateTo('vendor')}
                        t={t}
                      />
                    </motion.div>
                  )}

                  {currentScreen === 'profile' && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <ProfileScreen
                        user={driverUser}
                        loginType={loginType || 'driver'}
                        onUpdateContact={handleUpdateContact}
                        onLogout={handleLogout}
                        t={t}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Central Navigation Footer */}
              <nav className="absolute bottom-0 left-0 right-0 w-full h-[68px] bg-bg-surface border-t border-border-subtle flex items-center justify-around z-40 pb-env shrink-0 shadow-lg">
                <button
                  onClick={() => navigateTo('home')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer hover:text-text-primary text-[10px] font-extrabold uppercase tracking-wide leading-none transition-all ${
                    currentScreen === 'home' ? 'text-accent-brand' : 'text-text-muted'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <span className="nav-label">{t('nav.home', 'Home')}</span>
                </button>

                <button
                  onClick={() => navigateTo('hisaab')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer hover:text-text-primary text-[10px] font-extrabold uppercase tracking-wide leading-none transition-all ${
                    currentScreen === 'hisaab' || currentScreen === 'settle' ? 'text-accent-brand' : 'text-text-muted'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M9 14l2-2 4 4m5-7a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <span className="nav-label">{t('nav.hisaab', 'Hisaab')}</span>
                </button>

                {loginType === 'vendor' && (
                  <button
                    onClick={() => navigateTo('vendor')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer hover:text-text-primary text-[10px] font-extrabold uppercase tracking-wide leading-none transition-all ${
                      currentScreen === 'vendor' || currentScreen === 'vendorVehicle' ? 'text-accent-brand' : 'text-text-muted'
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                    <span className="nav-label">{t('nav.fleet', 'Fleet')}</span>
                  </button>
                )}

                <button
                  onClick={() => navigateTo('support')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer hover:text-text-primary text-[10px] font-extrabold uppercase tracking-wide leading-none transition-all ${
                    currentScreen === 'support' ? 'text-accent-brand' : 'text-text-muted'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <span className="nav-label">{t('nav.support', 'Support')}</span>
                </button>

                <button
                  onClick={() => navigateTo('profile')}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-full cursor-pointer hover:text-text-primary text-[10px] font-extrabold uppercase tracking-wide leading-none transition-all ${
                    currentScreen === 'profile' ? 'text-accent-brand' : 'text-text-muted'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <span className="nav-label">{t('nav.profile', 'Profile')}</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modals overlay containers */}
        <DocumentViewerModal
          isOpen={activeDocType !== null}
          onClose={() => setActiveDocType(null)}
          docType={activeDocType}
          user={driverUser}
          vehicle={VEHICLE_DATA}
          t={t}
        />

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllNotificationsRead}
          t={t}
        />

        <NewTicketModal
          isOpen={isNewTicketOpen}
          onClose={() => setIsNewTicketOpen(false)}
          categories={TICKET_CATEGORIES}
          onSubmit={handleNewTicketSubmit}
          t={t}
        />

        <TicketDetailModal
          isOpen={selectedTicket !== null}
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
          t={t}
        />

      </div>
    </div>
  );
}
