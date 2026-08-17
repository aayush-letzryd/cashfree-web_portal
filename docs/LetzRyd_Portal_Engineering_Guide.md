# LetzRyd Partner Settlement Portal — Master Engineering Reference

> Complete technical architecture, live URLs, team profiles, Firebase Phone Auth, Cloud SQL, Cloud Run & Vercel deployment reference.

---

## 1. Master URLs, Ports, Domains & Endpoints

| Component | URL / Path / Port | Protocol & Notes |
| :--- | :--- | :--- |
| **Vercel Frontend** | `https://cashfree-web-portal.vercel.app` | HTTPS | React 19 Frontend |
| **Cloud Run Full App** | `https://cashfree-web-portal-925756819101.asia-south1.run.app` | HTTPS | React Frontend + FastAPI on Port 8080 |
| **Local Frontend** | `http://127.0.0.1:3002` (or `http://localhost:3002`) | HTTP | Vite Dev Server (`vite --port=3002 --host=0.0.0.0`) |
| **Local Backend API** | `http://127.0.0.1:8000` (or `http://localhost:8000`) | HTTP | FastAPI Uvicorn Server |
| **PostgreSQL Cloud SQL** | `35.200.196.113:5432` | TCP PostgreSQL | Database: `postgres`, User: `postgres` |
| **GitHub Repository** | `https://github.com/aayush-letzryd/cashfree-web_portal` | Git Remote | Branch: `main` |
| **Google Cloud Project** | `letzryd-dev-test` (Project Number: `925756819101`) | GCP Console | Region: `asia-south1` (Mumbai) |
| **Firebase Auth Domain** | `letzryd-dev-test.firebaseapp.com` | Google Identity | Phone Auth Provider |
| **Google Cloud Shell** | `https://shell.cloud.google.com/?project=letzryd-dev-test` | GCP Shell | Browser Terminal |

---

## 2. Team Accounts, Profiles & Vehicle Details

All 4 team members are configured in both PostgreSQL (`app_drivers` / `app_operators`) and the frontend data engine (`src/data.ts`):

```
1. ANURAG (Operator Account)
   • Phone: 9691938866
   • Role: Fleet Operator
   • Code: OPR-HYD-001
   • Company: Anurag & RK Fleet Logistics
   • Fleet Size: 4 Vehicles (KA05AQ7692, TS09EV8812, TS07EV4401, TG07V0580)
   • Fleet Net Payout: +₹17,656.40

2. ANURAG (Driver Account)
   • Phone: 9691938866
   • Role: Commercial Driver
   • Code: LR-DRV-ANR
   • Assigned Vehicle: TG07V0580 — Maruti Tour H3 CNG
   • Daily Rent: ₹950/day
   • Net Hisaab: +₹4,520.00

3. VIVEK (Driver Account)
   • Phone: 9901484683
   • Role: Commercial Driver
   • Code: LR-DRV-VVK
   • Assigned Vehicle: KA05AQ7692 — Maruti Dzire CNG (White, 2021)
   • Daily Rent: ₹1,000/day
   • Week 30 Payout: +₹7,995.80 (Uber ₹14,200 + Ola ₹4,500 + Rapido ₹3,100 - Rent ₹7,000 - Cash ₹6,804.20)

4. SUSHANT (Driver Account)
   • Phone: 9140631755
   • Role: Commercial Driver
   • Code: LR-DRV-SSK
   • Assigned Vehicle: TS09EV8812 — Tata Tigor EV (White, 2022)
   • Daily Rent: ₹1,200/day
   • Week 30 Balance Due: -₹1,850.00 (Driver settles to LetzRyd via Cashfree UPI)

5. AAYUSH (Driver Account)
   • Phone: 9930420065
   • Role: Commercial Driver
   • Code: LR-DRV-AYS
   • Assigned Vehicle: TS07EV4401 — Mahindra eVerito EV (Silver, 2020)
   • Daily Rent: ₹1,100/day
   • Week 30 Payout: +₹6,180.00
```

> **Note on Anurag's Dual Role:** When logging in with `9691938866`, pick **Operator Login** to view the 4-car Fleet Ledger, or **Driver Login** to view the individual Tour H3 Driver Hisaab.

---

## 3. End-to-End System Architecture

```
+---------------------------------------------------------------------------------------------------------+
|                                        CLIENT DEVICES (Drivers & Operators)                             |
|                                                                                                         |
|   Driver Interface (Mobile / PWA)                       Operator Interface (Desktop / Tablet)           |
|   - Weekly Hisaab Breakdown & Settlements               - 4-Vehicle Fleet Live Overview                 |
|   - Rent Deductions, Challans, TDS, Fuel                - Driver Allocation & Weekly Ledger             |
|   - Emergency SOS Alarm & Support Desk                  - Cashfree Payout Processing                    |
+---------------------------------------------------+-----------------------------------------------------+
                                                    |
                         +--------------------------+--------------------------+
                         |                                                     |
                         v                                                     v
+------------------------------------------------+    +--------------------------------------------------+
|           VERCEL EDGE DEPLOYMENT               |    |          GOOGLE CLOUD RUN DEPLOYMENT             |
|          cashfree-web-portal.vercel.app        |    |   cashfree-web-portal-925756819101.run.app       |
|                                                |    |                                                  |
|   * Static React 19 Frontend Bundle            |    |   * Multi-Stage Docker Container (Port 8080)     |
|   * Auto-deploys on push to GitHub 'main'      |    |   * Serves React Frontend from /dist             |
|   * Calls Cloud Run via VITE_BACKEND_URL       |    |   * Serves FastAPI Backend from /api/*           |
|   * Built-in Client Data Engine Fallback       |    |   * Internal Database Connection Pool            |
+-----------------------+------------------------+    +------------------------+-------------------------+
                        |                                                      |
                        +--------------------------+---------------------------+
                                                   |
                         +-------------------------+-------------------------+
                         |                                                   |
                         v                                                   v
+------------------------------------------------+    +--------------------------------------------------+
|           FIREBASE PHONE AUTHENTICATION        |    |           FASTAPI APPLICATION BACKEND            |
|                                                |    |                                                  |
|   * Project: letzryd-dev-test (925756819101)   |    |   * Auth Router (/api/auth/otp/verify)           |
|   * Telecom Cellular SMS (+91 India)           |    |   * Drivers Router (/api/drivers/*)              |
|   * Invisible reCAPTCHA on #recaptcha-container|    |   * Operators Router (/api/operators/*)          |
|   * Master Bypass Auth Code: 1234              |    |   * Hisaabs Router (/api/hisaabs/*)              |
+------------------------------------------------+    +------------------------+-------------------------+
                                                                               |
                                                                               v
                                                      +--------------------------------------------------+
                                                      |           POSTGRESQL CLOUD SQL DATABASE          |
                                                      |           Host: 35.200.196.113:5432              |
                                                      |           Database: postgres                     |
                                                      |                                                  |
                                                      |   * app_drivers (Driver profiles & balances)     |
                                                      |   * app_operators (Fleet operator accounts)      |
                                                      |   * app_operator_vehicles (4-vehicle mappings)   |
                                                      |   * weekly_driver_hisaab (Weekly settlement logs)|
                                                      +--------------------------------------------------+
```

---

## 4. Firebase Phone OTP Setup & Whitelisting

### Firebase Config
```env
VITE_FIREBASE_API_KEY=AIzaSyBHLTzWd6XHJTd2xp3kWOHszCvb4GWlWfU
VITE_FIREBASE_AUTH_DOMAIN=letzryd-dev-test.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=letzryd-dev-test
VITE_FIREBASE_STORAGE_BUCKET=letzryd-dev-test.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=925756819101
VITE_FIREBASE_APP_ID=1:925756819101:web:83388ce68b39a49b587674
```

### Essential Settings in Firebase Console
1. **SMS Region Policy:** Firebase Console → Authentication → Settings → Phone Auth → SMS region policy → Select **India (+91)** or **Allow all regions**.
2. **Authorized Domains:** Firebase Console → Authentication → Settings → Authorized domains:
   - `localhost`
   - `127.0.0.1`
   - `cashfree-web-portal.vercel.app`
   - `cashfree-web-portal-925756819101.asia-south1.run.app`
   - `letzryd-dev-test.firebaseapp.com`
3. **The "Test Number Suppression" Rule:**
   - If a number is listed in Firebase Console → Authentication → Sign-in method → Phone → **"Phone numbers for testing"**, Google **suppresses the cellular SMS**.
   - To receive a real SMS on your SIM card, remove the number from that list!

---

## 5. Root Cause Analysis: Past Issues Fixed

| Issue / Error | Root Cause | Technical Fix |
| :--- | :--- | :--- |
| `auth/operation-not-allowed` | Firebase blocked SMS to India by default | Enabled India (+91) in Firebase SMS Region Policy |
| `auth/invalid-app-credential` | `#recaptcha-container` unmounted on screen transition | Added persistent `<div id="recaptcha-container"></div>` into `index.html` |
| `SMS Not Arriving` | Number was in "Phone numbers for testing" | Removed number from test list; Google immediately sent cellular SMS |
| `SQLAlchemy Connection Error` | Password had special characters `@`, `]`, `^` | URL-encoded password with `urllib.parse.quote_plus(DB_PASS)` in `app/config.py` |
| `Missing Firebase Env in Docker` | `.env` was ignored in Docker build | Added embedded fallback project credentials in `src/firebase.ts` |
| `auth/too-many-requests` | 3+ SMS requested within 2 mins (anti-spam cooldown) | Added Master OTP `1234` bypass in `auth.py` and `App.tsx` |

---

## 6. How to Deploy

### A. Deploy to Google Cloud Run (Full Container)
Run in [Google Cloud Shell](https://shell.cloud.google.com/?project=letzryd-dev-test):

```bash
cd ~/cashfree-web_portal
git pull origin main
gcloud run deploy cashfree-web-portal \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://postgres:8S5%5DU3%40L%5EXz%29%5CFH%7D@35.200.196.113:5432/postgres"
```

### B. Deploy to Vercel (Frontend)
1. In [Vercel Dashboard](https://vercel.com/letzryd/cashfree-web-portal/settings/environment-variables), set:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyBHLTzWd6XHJTd2xp3kWOHszCvb4GWlWfU
   VITE_FIREBASE_AUTH_DOMAIN=letzryd-dev-test.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=letzryd-dev-test
   VITE_FIREBASE_STORAGE_BUCKET=letzryd-dev-test.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=925756819101
   VITE_FIREBASE_APP_ID=1:925756819101:web:83388ce68b39a49b587674
   VITE_BACKEND_URL=https://cashfree-web-portal-925756819101.asia-south1.run.app
   ```
2. Go to **Deployments** → Click `...` → **Redeploy**.

---

## 7. Login Methods Reference

| Login Method | Code | Behavior |
| :--- | :--- | :--- |
| **Real Telecom SMS OTP** | 6-digit code received on phone | Works on all numbers when removed from Firebase test list |
| **Master Bypass OTP** | `1234` | Works 100% of the time on all accounts without waiting for SMS |
| **Firebase Test OTP** | `123456` | Works only if the number is explicitly listed in Firebase test list |
