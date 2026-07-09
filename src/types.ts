/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  vendorCode: string;
  phone: string;
  joined: string;
  initials: string;
  aadhar: string;
  dlNumber: string;
  dlExpiry: string;
  emergencyContact: string;
  address: string;
  bloodGroup: string;
  dob: string;
  vendorType?: string;
}

export interface PlatformStatus {
  status: 'active' | 'inactive';
  rating: number;
  trips: number;
}

export interface Vehicle {
  number: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  fuelType: string;
  odometer: number;
  fitnessExpiry: string;
  insuranceExpiry: string;
  rcExpiry: string;
  permitType: string;
  permitExpiry: string;
  pucExpiry: string;
  platforms: {
    uber: PlatformStatus;
    ola: PlatformStatus;
    rapido: PlatformStatus;
  };
  allocationStart: string;
}

export interface RentalPlan {
  name: string;
  dailyRate: number;
  planStart: string;
  activeMonths: number;
  note: string;
}

export interface PlatformEarnings {
  trips: number;
  revenue: number;
  cashCollection: number; // positive or negative (cash held by driver is negative since it reduces payout)
  toll: number;
  incentive: number;
  subscription: number;
  km: number;
}

export interface GpsData {
  totalGpsKm: number;
  idealGpsKm: number;
  deadMile: number;
  deadMilePct: number;
  deadKmPenalty: number;
}

export interface HisaabWeek {
  weekStart: string;
  weekEnd: string;
  status: 'in_progress' | 'to_collect' | 'settled_pay';
  activeDays: number;
  platforms: {
    uber: PlatformEarnings;
    ola: PlatformEarnings;
    rapido: PlatformEarnings;
  };
  rent: {
    dailyRate: number;
    netWeeklyRent: number;
  };
  tds: number;
  challan: number;
  accident: number;
  adjustment: number;
  gps: GpsData;
  currentWeekOs: number; // Negative means LetzRyd pays driver, Positive means driver owes LetzRyd
  pendingDue: number;
  totalOs: number;
  toCollect: number;
  toPay: number;
  letzrydEarning: number;
  notes: string;
}

export interface FleetVehicle {
  number: string;
  make: string;
  model: string;
  driverName: string;
  plan: {
    name: string;
    dailyRate: number;
  };
  currentWeekOs: number;
  status: 'active' | 'idle';
  hisaabWeeks: HisaabWeek[];
}

export interface Fleet {
  vendorCode: string;
  vendorName: string;
  vehicles: FleetVehicle[];
}

export interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  date: string;
  response: string | null;
}

export interface Notification {
  id: string;
  icon: string; // lucide icon name
  title: string;
  message: string;
  time: string;
  read: boolean;
}
