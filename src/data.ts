/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Vehicle, RentalPlan, HisaabWeek, Fleet, Ticket, Notification } from './types';

export const USER_DATA: User = {
  id: "LR-DRV-0157",
  name: "Rajesh Kumar",
  operatorCode: "VND0157",
  phone: "9876543210",
  joined: "2024-10-15",
  initials: "RK",
  aadhar: "1234-5678-9012",
  dlNumber: "KA05-2024-1234567",
  dlExpiry: "2029-05-20",
  emergencyContact: "Priya Kumar (Wife) - 9876543211",
  address: "No. 42, 3rd Cross, Indiranagar, Bangalore - 560038",
  bloodGroup: "B+",
  dob: "1992-08-14",
  operatorType: "Individual Driver"
};

export const VEHICLE_DATA: Vehicle = {
  number: "KA05AQ7692",
  make: "Maruti Suzuki",
  model: "Dzire",
  variant: "ZXi CNG",
  year: 2021,
  color: "White Pearl",
  fuelType: "CNG",
  odometer: 124380,
  fitnessExpiry: "2026-10-12",
  insuranceExpiry: "2027-03-20",
  rcExpiry: "2036-05-01",
  permitType: "Tourist Permit",
  permitExpiry: "2026-12-31",
  pucExpiry: "2026-08-15",
  platforms: {
    uber: { status: "active", rating: 4.82, trips: 3210 },
    ola: { status: "active", rating: 4.65, trips: 890 },
    rapido: { status: "active", rating: 4.71, trips: 1540 }
  },
  allocationStart: "2024-10-15"
};

export const RENTAL_PLAN_DATA: RentalPlan = {
  name: "Standard",
  dailyRate: 1000,
  planStart: "2024-10-15",
  activeMonths: 20,
  note: "Plan Master module pending. Rate fixed at ₹1,000/active day."
};

export const HISAAB_WEEKS_DATA: HisaabWeek[] = [
  {
    weekStart: "2026-06-22",
    weekEnd: "2026-06-28",
    status: "in_progress",
    activeDays: 4,
    platforms: {
      uber: { trips: 120, revenue: 15800, cashCollection: -10500, toll: 420, incentive: 3200, subscription: -1500, km: 1540.20 },
      ola: { trips: 45, revenue: 5800, cashCollection: -3200, toll: 180, incentive: 900, subscription: -600, km: 520.40 },
      rapido: { trips: 68, revenue: 4200, cashCollection: -1800, toll: 0, incentive: 1100, subscription: -350, km: 380.60 }
    },
    rent: { dailyRate: 1000, netWeeklyRent: 4000 },
    tds: 154.20,
    challan: 0,
    accident: 0,
    adjustment: 0,
    gps: { totalGpsKm: 3200.80, idealGpsKm: 3820.60, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
    currentWeekOs: -3265.80,
    pendingDue: 0,
    totalOs: -3265.80,
    toCollect: 0,
    toPay: 3265.80,
    letzrydEarning: 4154.20,
    notes: "Week in progress. Fares and metrics synchronize every midnight from aggregate platform reports."
  },
  {
    weekStart: "2026-06-15",
    weekEnd: "2026-06-21",
    status: "to_collect",
    activeDays: 6,
    platforms: {
      uber: { trips: 198, revenue: 22300, cashCollection: -18900, toll: 680, incentive: 4500, subscription: -2200, km: 2380.50 },
      ola: { trips: 72, revenue: 8900, cashCollection: -5600, toll: 310, incentive: 1800, subscription: -900, km: 880.30 },
      rapido: { trips: 95, revenue: 6100, cashCollection: -2800, toll: 0, incentive: 1500, subscription: -500, km: 610.80 }
    },
    rent: { dailyRate: 1000, netWeeklyRent: 6000 },
    tds: 214.80,
    challan: 1200,
    accident: 0,
    adjustment: 0,
    gps: { totalGpsKm: 4800.60, idealGpsKm: 5950.40, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
    currentWeekOs: 1034.80,
    pendingDue: 0,
    totalOs: 1034.80,
    toCollect: 1034.80,
    toPay: 0,
    letzrydEarning: 7234.80,
    notes: "Traffic challan of ₹1,200 charged for high-speed violation on Jun 18 (MG Road, Bangalore)."
  },
  {
    weekStart: "2026-06-08",
    weekEnd: "2026-06-14",
    status: "settled_pay",
    activeDays: 7,
    platforms: {
      uber: { trips: 265, revenue: 31800, cashCollection: -24600, toll: 940, incentive: 8200, subscription: -3200, km: 3240.80 },
      ola: { trips: 110, revenue: 14200, cashCollection: -9800, toll: 420, incentive: 3100, subscription: -1300, km: 1420.50 },
      rapido: { trips: 150, revenue: 9800, cashCollection: -4200, toll: 0, incentive: 2400, subscription: -700, km: 960.20 }
    },
    rent: { dailyRate: 1000, netWeeklyRent: 7000 },
    tds: 396.40,
    challan: 0,
    accident: 0,
    adjustment: 0,
    gps: { totalGpsKm: 6800.80, idealGpsKm: 7335.80, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
    currentWeekOs: -5743.60,
    pendingDue: 0,
    totalOs: -5743.60,
    toCollect: 0,
    toPay: 5743.60,
    letzrydEarning: 7396.40,
    notes: "Hisaab fully settled. Payout of ₹5,743.60 successfully processed to your bank account on Jun 15, 2026."
  }
];

export const OPERATOR_FLEET_DATA: Fleet = {
  operatorCode: "VND0157",
  operatorName: "RK Transport",
  vehicles: [
    {
      number: "KA05AQ7692",
      make: "Maruti Suzuki",
      model: "Dzire",
      driverName: "Rajesh Kumar",
      plan: { name: "Standard", dailyRate: 1000 },
      currentWeekOs: -3265.80,
      status: "active",
      hisaabWeeks: HISAAB_WEEKS_DATA
    },
    {
      number: "KA03MH1234",
      make: "Toyota",
      model: "Innova Crysta",
      driverName: "Suresh Patil",
      plan: { name: "Premium", dailyRate: 1500 },
      currentWeekOs: 4200.00,
      status: "active",
      hisaabWeeks: [
        {
          weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "to_collect", activeDays: 5,
          platforms: {
            uber: { trips: 85, revenue: 11200, cashCollection: -7800, toll: 340, incentive: 2100, subscription: -1200, km: 1120.50 },
            ola: { trips: 32, revenue: 4100, cashCollection: -2500, toll: 120, incentive: 600, subscription: -400, km: 380.20 },
            rapido: { trips: 0, revenue: 0, cashCollection: 0, toll: 0, incentive: 0, subscription: 0, km: 0 }
          },
          rent: { dailyRate: 1500, netWeeklyRent: 7500 }, tds: 112.00, challan: 500, accident: 0, adjustment: 0,
          gps: { totalGpsKm: 2100.30, idealGpsKm: 2400.60, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: 4200.00, pendingDue: 1200, totalOs: 5400.00, toCollect: 4200.00, toPay: 0, letzrydEarning: 0, notes: ""
        },
        {
          weekStart: "2026-06-15", weekEnd: "2026-06-21", status: "to_collect", activeDays: 7,
          platforms: {
            uber: { trips: 145, revenue: 19200, cashCollection: -14500, toll: 600, incentive: 4100, subscription: -1800, km: 1950.50 },
            ola: { trips: 50, revenue: 6200, cashCollection: -4500, toll: 220, incentive: 900, subscription: -600, km: 580.20 },
            rapido: { trips: 0, revenue: 0, cashCollection: 0, toll: 0, incentive: 0, subscription: 0, km: 0 }
          },
          rent: { dailyRate: 1500, netWeeklyRent: 10500 }, tds: 192.00, challan: 0, accident: 0, adjustment: 0,
          gps: { totalGpsKm: 3100.30, idealGpsKm: 3400.60, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: 1200.00, pendingDue: 0, totalOs: 1200.00, toCollect: 1200.00, toPay: 0, letzrydEarning: 0, notes: ""
        },
        {
          weekStart: "2026-06-08", weekEnd: "2026-06-14", status: "settled_pay", activeDays: 6,
          platforms: {
            uber: { trips: 115, revenue: 15200, cashCollection: -9500, toll: 400, incentive: 3100, subscription: -1500, km: 1650.50 },
            ola: { trips: 40, revenue: 5200, cashCollection: -3500, toll: 180, incentive: 700, subscription: -500, km: 480.20 },
            rapido: { trips: 0, revenue: 0, cashCollection: 0, toll: 0, incentive: 0, subscription: 0, km: 0 }
          },
          rent: { dailyRate: 1500, netWeeklyRent: 9000 }, tds: 152.00, challan: 0, accident: 0, adjustment: 0,
          gps: { totalGpsKm: 2500.30, idealGpsKm: 2800.60, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: -2500.00, pendingDue: 0, totalOs: -2500.00, toCollect: 0, toPay: 2500.00, letzrydEarning: 0, notes: ""
        }
      ]
    },
    {
      number: "KA01XY5678",
      make: "Hyundai",
      model: "Verna",
      driverName: "Amit Singh",
      plan: { name: "Standard", dailyRate: 900 },
      currentWeekOs: -1800.50,
      status: "active",
      hisaabWeeks: [
        {
          weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "in_progress", activeDays: 4,
          platforms: {
            uber: { trips: 95, revenue: 13200, cashCollection: -8800, toll: 380, incentive: 2800, subscription: -1400, km: 1320.80 },
            ola: { trips: 28, revenue: 3600, cashCollection: -1800, toll: 100, incentive: 500, subscription: -300, km: 280.40 },
            rapido: { trips: 42, revenue: 2800, cashCollection: -1200, toll: 0, incentive: 800, subscription: -250, km: 240.60 }
          },
          rent: { dailyRate: 900, netWeeklyRent: 3600 }, tds: 132.00, challan: 0, accident: 0, adjustment: 0,
          gps: { totalGpsKm: 2400.50, idealGpsKm: 2900.40, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: -1800.50, pendingDue: 0, totalOs: -1800.50, toCollect: 0, toPay: 1800.50, letzrydEarning: 0, notes: ""
        },
        {
          weekStart: "2026-06-15", weekEnd: "2026-06-21", status: "to_collect", activeDays: 6,
          platforms: {
            uber: { trips: 145, revenue: 18200, cashCollection: -12800, toll: 480, incentive: 3800, subscription: -1900, km: 1820.80 },
            ola: { trips: 58, revenue: 6600, cashCollection: -3800, toll: 200, incentive: 800, subscription: -600, km: 580.40 },
            rapido: { trips: 62, revenue: 4800, cashCollection: -2200, toll: 0, incentive: 1200, subscription: -450, km: 440.60 }
          },
          rent: { dailyRate: 900, netWeeklyRent: 5400 }, tds: 182.00, challan: 0, accident: 0, adjustment: 0,
          gps: { totalGpsKm: 3400.50, idealGpsKm: 3900.40, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: -4200.00, pendingDue: 0, totalOs: -4200.00, toCollect: 0, toPay: 4200.00, letzrydEarning: 0, notes: ""
        }
      ]
    },
    {
      number: "KA05CD9012",
      make: "Honda",
      model: "City",
      driverName: "Vikram Rao",
      plan: { name: "Standard", dailyRate: 1100 },
      currentWeekOs: 890.00,
      status: "active",
      hisaabWeeks: [
        {
          weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "to_collect", activeDays: 6,
          platforms: {
            uber: { trips: 145, revenue: 18900, cashCollection: -14200, toll: 520, incentive: 3800, subscription: -1800, km: 1820.40 },
            ola: { trips: 55, revenue: 7200, cashCollection: -4800, toll: 220, incentive: 1400, subscription: -700, km: 620.80 },
            rapido: { trips: 0, revenue: 0, cashCollection: 0, toll: 0, incentive: 0, subscription: 0, km: 0 }
          },
          rent: { dailyRate: 1100, netWeeklyRent: 6600 }, tds: 189.00, challan: 0, accident: 0, adjustment: -500,
          gps: { totalGpsKm: 3100.60, idealGpsKm: 3800.40, deadMile: 0, deadMilePct: 0, deadKmPenalty: 0 },
          currentWeekOs: 890.00, pendingDue: 0, totalOs: 890.00, toCollect: 890.00, toPay: 0, letzrydEarning: 0, notes: ""
        }
      ]
    },
    {
      number: "KA02EF3456",
      make: "Tata",
      model: "Tiago",
      driverName: "Ravi Sharma",
      plan: { name: "Economy", dailyRate: 800 },
      currentWeekOs: 0,
      status: "idle",
      hisaabWeeks: []
    }
  ]
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-2026-0041",
    category: "Hisaab Dispute",
    subject: "Challan incorrectly charged",
    description: "A challan of ₹1,200 was charged for speed violation on MG Road on Jun 18. I was off-duty and the vehicle was parked in Indiranagar. Requesting verification and reversal.",
    status: "open",
    priority: "high",
    date: "2026-06-22",
    response: null
  },
  {
    id: "TKT-2026-0028",
    category: "Vehicle Maintenance",
    subject: "AC compressor not cooling",
    description: "AC in vehicle KA05AQ7692 is blowing warm air when parked. Servicing urgently required as it is extremely uncomfortable for passengers.",
    status: "resolved",
    priority: "medium",
    date: "2026-06-10",
    response: "Vehicle compressor serviced on Jun 12. Refrigerant leak was patched and gas refilled. Please let us know if cooling is satisfactory now."
  },
  {
    id: "TKT-2026-0019",
    category: "App / Platform Issue",
    subject: "Missing Uber Incentive Fares",
    description: "Weekly incentive bonus of ₹2,500 completed on Jun 3 is not updated in the respective week Hisaab ledger.",
    status: "closed",
    priority: "low",
    date: "2026-06-05",
    response: "Discrepancy verified with Uber operator panel. Fares synced and credit added via manual adjustment in the Jun 08 week report."
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "NOTIF-001",
    icon: "ReceiptIndianRupee",
    title: "New Weekly Hisaab Released",
    message: "Hisaab for week ending Jun 21 is now finalized. Tap to review your digital earnings vs rent deductions.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "NOTIF-002",
    icon: "FileWarning",
    title: "PUC Renewal Reminder",
    message: "Your Pollution Under Control (PUC) certificate expires in 50 days (Aug 15, 2026). Please renew promptly.",
    time: "1 day ago",
    read: false
  },
  {
    id: "NOTIF-003",
    icon: "Award",
    title: "Milestone Reached!",
    message: "Excellent job! You have surpassed 3,000 completed rides under LetzRyd partnership.",
    time: "3 days ago",
    read: true
  },
  {
    id: "NOTIF-004",
    icon: "CheckCircle",
    title: "Payout Disbursed Successfully",
    message: "Weekly payout of ₹5,743.60 has been credited to your bank account via IMPS transaction.",
    time: "5 days ago",
    read: true
  }
];

export const SUPPORT_HOTLINE = "08000538793";
export const SUPPORT_WHATSAPP = "918000538793";
export const LETZRYD_UPI_ID = "letzryd@ybl";

export const TICKET_CATEGORIES = [
  "Hisaab Dispute",
  "Challan / Fine Challenge",
  "Vehicle Maintenance",
  "Accident Reporting",
  "App / Platform Issue",
  "Rental Plan Query",
  "GPS / Dead KM Dispute",
  "Payment Issue",
  "Other"
];

export const TRANSLATIONS_HI: Record<string, string> = {
  "app.title": "लेट्ज़राइड",
  "login.driver": "ड्राइवर लॉगिन",
  "login.operator": "विक्रेता / ऑपरेटर लॉगिन",
  "login.subtitle": "ड्राइवर और विक्रेता संचालन पोर्टल",
  "login.demo": "डेमो मोड — जारी रखने के लिए कोई भी बटन क्लिक करें",
  "home.greeting": "नमस्ते",
  "home.weekAtGlance": "आपका सप्ताह एक नज़र में",
  "home.currentWeek": "चालू सप्ताह",
  "home.estPayout": "अनुमानित भुगतान",
  "home.activeDays": "सक्रिय दिन",
  "home.trips": "कुल ट्रिप्स",
  "home.platformKm": "प्लेटफ़ॉर्म KM",
  "home.deadMilePct": "डेड माइल%",
  "home.quickAccess": "त्वरित एक्सेस",
  "home.hisaab": "साप्ताहिक हिसाब",
  "home.vehicle": "वाहन विवरण",
  "home.support": "सहायता और टिकट",
  "home.sos": "आपातकालीन SOS",
  "home.planVehicle": "योजना और वाहन",
  "hisaab.title": "साप्ताहिक हिसाब",
  "hisaab.estimatedNet": "अनुमानित शुद्ध",
  "hisaab.inProgress": "प्रगति में",
  "hisaab.earnings": "कमाई",
  "hisaab.digitalEarnings": "डिजिटल कमाई (ऑनलाइन)",
  "hisaab.cashCollected": "नकद कलेक्ट किया (हाथ में)",
  "hisaab.tollPassThrough": "टोल टैक्स रिफंड",
  "hisaab.incentives": "प्रोत्साहन (Incentives)",
  "hisaab.subscription": "प्लेटफ़ॉर्म शुल्क",
  "hisaab.netPosition": "शुद्ध कमाई स्थिति",
  "hisaab.rent": "वाहन किराया",
  "hisaab.dailyRate": "दैनिक किराया दर",
  "hisaab.activeDays": "सक्रिय दिन",
  "hisaab.totalWeeklyRent": "कुल साप्ताहिक किराया",
  "hisaab.deductionsFines": "कटौती और जुर्माना",
  "hisaab.tds": "TDS कटौती (1%)",
  "hisaab.trafficChallan": "ट्रैफिक चालान जुर्माना",
  "hisaab.accidentPenalty": "दुर्घटना नुकसान शुल्क",
  "hisaab.manualAdjustment": "मैनुअल समायोजन (Adjustment)",
  "hisaab.gpsAndDeadKm": "GPS और डेड KM",
  "hisaab.platformKm": "सवारी प्लेटफ़ॉर्म KM",
  "hisaab.idealGpsKm": "आदर्श अनुमति GPS KM",
  "hisaab.actualGpsKm": "वास्तविक ट्रैकर GPS KM",
  "hisaab.gpsVsIdeal": "वास्तविक बनाम आदर्श किमी",
  "hisaab.deadMiles": "डेड माइल्स (अतिरिक्त किमी)",
  "hisaab.deadKmPenalty": "डेड किमी जुर्माना (₹5/किमी)",
  "hisaab.settlementSummary": "निपटान सारांश",
  "hisaab.currentWeekOs": "चालू सप्ताह कुल बकाया",
  "hisaab.pendingDues": "पुराना बकाया (Prior Dues)",
  "hisaab.totalOs": "कुल नेट बकाया (Total O/S)",
  "vehicle.title": "वाहन विवरण",
  "vehicle.subtitle": "अनुपालन, बीमा और फिटनेस",
  "vehicle.details": "वाहन विवरण",
  "vehicle.year": "मॉडल वर्ष",
  "vehicle.fuelType": "ईंधन प्रकार",
  "vehicle.color": "वाहन का रंग",
  "vehicle.odometer": "ओडोमीटर रीडिंग",
  "vehicle.permitType": "परमिट प्रकार",
  "vehicle.withLetzryd": "लेट्ज़राइड अवधि",
  "vehicle.docs": "दस्तावेज़ वैधता",
  "vehicle.fitnessCert": "फिटनेस प्रमाणपत्र (FC)",
  "vehicle.insurance": "वाहन बीमा वैधता",
  "vehicle.permitExpiry": "परमिट वैधता",
  "vehicle.puc": "प्रदूषण प्रमाणपत्र (PUC)",
  "vehicle.viewableDocs": "डिजिटल दस्तावेज़",
  "vehicle.driverDocs": "ड्राइवर दस्तावेज़",
  "rental.title": "किराया योजना",
  "rental.subtitle": "वर्तमान योजना दर एवं शर्तें",
  "rental.currentPlan": "वर्तमान सक्रिय योजना",
  "rental.planDetails": "योजना दर सूची",
  "rental.dailyRate": "दैनिक दर",
  "rental.weekly": "साप्ताहिक आधार दर",
  "rental.startDate": "योजना प्रारंभ तिथि",
  "rental.duration": "सक्रिय अवधि",
  "rental.howRentWorks": "किराया कैसे काम करता है",
  "support.title": "सहायता केंद्र",
  "support.contactLetzryd": "लेट्ज़राइड हब से संपर्क करें",
  "support.myTickets": "मेरे टिकट (Tickets)",
  "support.newTicket": "नया टिकट बनाएं",
  "sos.title": "आपातकालीन SOS",
  "sos.pressToAlert": "अलर्ट भेजने के लिए दबाएं",
  "sos.activated": "SOS अलर्ट सक्रिय किया गया!",
  "sos.willContact": "आपातकालीन अधिकारी आपसे 2 मिनट में संपर्क करेंगे।",
  "sos.cancel": "SOS निरस्त करें",
  "nav.home": "होम",
  "nav.hisaab": "हिसाब",
  "nav.support": "सहायता",
  "nav.sos": "SOS",
  "profile.title": "मेरी प्रोफ़ाइल",
  "profile.signOut": "लॉग आउट",
  "notif.title": "सूचनाएं",
  "notif.empty": "कोई सूचना नहीं है",
  "operator.dashboard": "विक्रेता डैशबोर्ड",
  "operator.dashboardTitle": "ऑपरेटर डैशबोर्ड",
  "operator.fleet": "बेड़े का विवरण",
  "operator.fleetVehicles": "सभी बेड़े वाहन",
  "operator.totalOs": "कुल बेड़ा बकाया",
  "operator.vehicles": "कुल वाहन संख्या",
  "operator.active": "सक्रिय वाहन",
  "operator.idle": "निष्क्रिय वाहन",
  "operator.surplus": "(लेट्ज़राइड आपको भुगतान करेगा)",
  "operator.due": "(ऑपरेटर लेट्ज़राइड को भुगतान करेगा)",
  "operator.homeSub": "आपके बेड़े का प्रदर्शन",
  "operator.fleetOverview": "बेड़ा प्रदर्शन विवरण",
  "operator.allVehicles": "वाहन सूची",
  "operator.fleetEarning": "कुल प्लेटफ़ॉर्म कमाई",
  "operator.netOs": "कुल नेट बकाया स्थिति",
  "settle.title": "हिसाब निपटाएं",
  "settle.payTo": "कुल देय भुगतान",
  "settle.payToLetzryd": "लेट्ज़राइड फ़्लीट को भुगतान करें",
  "settle.upiPayment": "UPI भुगतान विकल्प",
  "settle.upiId": "लेट्ज़राइड UPI पता",
  "settle.copy": "कॉपी करें",
  "settle.payWith": "भुगतान ऐप चुनें",
  "settle.open": "ऐप खोलने के लिए टैप करें",
  "settle.howToPay": "भुगतान करने के निर्देश",
  "settle.iHavePaid": "मैंने भुगतान कर दिया है",
  "settle.backToHisaab": "हिसाब पर वापस जाएं",
  "ticket.submitted": "टिकट सफलतापूर्वक सबमिट किया गया!",
  "sos.confirm": "क्या आप आपातकालीन SOS अलर्ट भेजना चाहते हैं?",
  "sos.alerted": "SOS हब को सतर्क कर दिया गया है!",
  "sos.reportSubmitted": "दुर्घटना रिपोर्ट दर्ज कर ली गई है!",
  "payment.noted": "भुगतान विवरण दर्ज किया गया! सत्यापन में 2-4 घंटे लगेंगे।",
  "profile.saved": "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
  "profile.edit": "संपादित करें",
  "profile.editing": "संपादन हो रहा है...",
  "profile.subtitle": "अपना विवरण प्रबंधित करें",
  "profile.personal": "व्यक्तिगत जानकारी",
  "profile.documents": "दस्तावेज़",
  "profile.contact": "आपातकालीन संपर्क विवरण",
  "profile.letzrydId": "लेट्ज़राइड ID",
  "profile.phone": "फ़ोन नंबर",
  "profile.dob": "जन्म तिथि",
  "profile.blood": "रक्त समूह",
  "profile.joined": "शामिल होने की तिथि",
  "profile.aadhar": "आधार संख्या",
  "profile.dlNumber": "लाइसेंस (DL) नंबर",
  "profile.dlExpiry": "लाइसेंस वैधता समाप्ति",
  "profile.emergency": "आपातकालीन संपर्क",
  "profile.address": "स्थायी पता",
  "profile.operatorType": "विक्रेता / ऑपरेटर",
  "profile.driverType": "व्यक्तिगत ड्राइवर",
  "profile.left": "शेष दिन",
  "hisaab.day": "दिन",
  "hisaab.finalSun": "अंतिम निपटान रविवार मध्यरात्रि को",
  "hisaab.due": "लेट्ज़राइड को देय",
  "hisaab.dueShort": "देय बकाया",
  "hisaab.collectFrom": "ड्राइवर से कलेक्ट करें",
  "hisaab.payDriver": "ड्राइवर को भुगतान करें",
  "hisaab.collectNow": "शीघ्र कलेक्ट करें",
  "hisaab.paid": "भुगतान संपन्न",
  "hisaab.pending": "भुगतान लंबित",
  "hisaab.settled": "पूर्णतः निपटाया",
  "hisaab.pendingShort": "लंबित",
  "hisaab.credit": "क्रेडिट राशि",
  "hisaab.debit": "डेबिट राशि",
  "hisaab.deadAbove": "डेड किमी अतिरिक्त",
  "hisaab.threshold": " > 20% सीमा से अधिक",
  "hisaab.chargeable": "शुल्क योग्य किमी",
  "hisaab.deadBelow": "डेड किमी सामान्य",
  "hisaab.belowThreshold": "20% सीमा के भीतर, कोई शुल्क नहीं",
  "hisaab.gpsOk": "आदर्श अनुमेय किमी के भीतर",
  "hisaab.noData": "कोई रिकॉर्ड उपलब्ध नहीं है",
  "hisaab.tripsCompleted": "पूरी की गई यात्राएं",
  "hisaab.digital": "डिजिटल भुगतान",
  "hisaab.cash": "नकद किराया (Cash)",
  "hisaab.toll": "टोल रिफंड",
  "hisaab.incentive": "इंसेंटिव (प्रोत्साहन)",
  "hisaab.net": "शुद्ध राइड कमाई",
  "hisaab.weeklyRent": "साप्ताहिक वाहन किराया",
  "hisaab.challan": "ट्रैफिक चालान",
  "hisaab.accident": "दुर्घटना नुकसान जुर्माना",
  "hisaab.adjustment": "समायोजन शुल्क"
};
