# 🏍️ Royal Ride — Premium Bike Rental & Mobility Platform

A high-performance, full-stack bike rental and subscription platform offering a seamless mobility experience. Royal Ride bridges the gap between on-demand short-term rentals and long-term vehicle subscriptions.


## 📱 What is Royal Ride?
Royal Ride is a complete mobility solution that lets users instantly book two-wheelers or subscribe to them for a longer term. 

- **Users** can seamlessly log in, complete their KYC (Driver's License/ID), browse the fleet, and book a ride. They can pay instantly via the integrated Stripe gateway or use the in-app Digital Wallet.
- **Admins** get a powerful React-based web dashboard to manage the vehicle fleet, approve user KYCs, track bookings, handle damage reports, and monitor transactions.

---

## 🏗️ Architecture
```text
┌─────────────────────────────────────────────────────┐
│              React Native Mobile App                │
│  OTP Login → KYC → Browse Bikes → Booking Checkout  │
│  Wallet → Stripe Payment → Damage Report            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / JSON
┌──────────────────────▼──────────────────────────────┐
│         Node.js + Express Backend                   │
│                                                     │
│  /auth     → OTP & JWT Auth                         │
│  /vehicles → Fleet & Availability Status            │
│  /bookings → Real-time Booking & Extensions         │
│  /payment  → Stripe & Digital Wallet Ledger         │
│  /kyc      → Document Uploads & Verification        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│             MongoDB Database                        │
│  users · vehicles · bookings · wallets              │
│  kyc_docs · damage_reports · notifications          │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Core Features

🔐 **Secure Authentication & KYC**
- OTP-based authentication with secure JWT tokens.
- Dedicated KYC workflow for uploading Driver's License and ID proofs.

💳 **Fintech Integration & Digital Wallet**
- Integrated **Stripe API** for secure, native PaymentSheet checkouts.
- Built-in **Digital Wallet** allowing users to add funds, view transaction history, and pay for ride extensions instantly.

🛵 **Smart Booking & Subscription Engine**
- **On-Demand Rentals:** Flexible daily/weekly bookings.
- **Subscriptions:** Monthly recurring memberships for premium vehicle access.

📸 **Damage Reporting System**
- Users can report pre-ride or post-ride vehicle damage by uploading photos and descriptions directly through the app.

👨‍💻 **Admin Web Dashboard**
- Fleet Management: Add, update, or remove bikes.
- Approval Workflows: Verify and approve/reject user KYC submissions.
- Live Analytics: Monitor active bookings, revenue, and fleet health.

---

## 🖥️ App & Platform Structure

### Mobile Screens (React Native)
| Screen | Description |
|--------|-------------|
| **AuthScreens** | OTP login and user registration |
| **KYCScreen** | Document upload and verification status |
| **HomeScreen** | Browse available vehicles with filters |
| **VehicleDetail** | Pricing, specifications, and booking CTA |
| **BookingScreen** | Date selection, pricing calculator, and checkout |
| **WalletScreen** | Add funds, view balance, and transaction ledger |
| **DamageReport** | Upload photos to report vehicle damage |

### Database Collections (MongoDB)
- `users` — id, phone, name, role, kyc_status
- `vehicles` — id, model, type, hourly_rate, availability_status, location
- `bookings` — id, user_id, vehicle_id, start_time, end_time, total_amount, status
- `wallet` — id, user_id, balance, transaction_history
- `kyc` — id, user_id, document_urls, verification_status
- `damage` — id, booking_id, photo_urls, description, resolution_status
- `notifications` — id, user_id, message, is_read

---

## 🔌 API Reference (Highlight)

**Authentication & KYC**
- `POST /auth/login` → Authenticates user via OTP
- `POST /kyc/upload` → Uploads license & ID documents

**Vehicles & Bookings**
- `GET  /vehicles` → Lists available fleet
- `POST /bookings/create` → Initializes a new booking
- `POST /bookings/extend` → Extends an active booking

**Wallet & Payments**
- `GET  /wallet/balance` → Fetches user wallet balance
- `POST /payment/intent` → Generates Stripe payment intent

---

## 🚀 Future Improvements & Premium Upgrades
*To take the platform to the next level (similar to advanced AI apps like MittiCard), consider implementing:*

1. 🧠 **AI-Powered OCR for KYC:** 
   Integrate **Groq Llama 3.2 Vision** or Tesseract to automatically scan uploaded Driver's Licenses and extract names, DOB, and license numbers instantly without manual typing.
   
2. 📸 **AI Damage Detection:** 
   Allow users to scan the bike with their camera before a ride. Use Vision AI to automatically detect and log existing scratches/dents, protecting both the user and the company.

3. 🌧️ **Dynamic Weather Alerts:** 
   Integrate Open-Meteo API. If a user tries to book a bike during heavy rain forecasts, show a dynamic alert: *"Heavy rain expected in 2 hours. Consider a helmet with a visor or delay your ride."*

4. 📊 **Surge Pricing & Dynamic Rates:** 
   Implement an algorithm that automatically increases prices by 15-20% during peak weekend hours or when fleet availability drops below 20%.

5. 🔔 **Smart Push Reminders (FCM):**
   Send Firebase notifications 15 minutes before a booking expires: *"Your ride ends soon! Tap here to extend via Wallet."*

---

## 🛠️ Local Development

### 1. Backend (Node.js)
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, Stripe Key, and JWT Secret
npm run dev
# Runs on http://localhost:5000
```

### 2. Admin Web (React + Vite)
```bash
cd admin-web
npm install
npm run dev
# Access the dashboard at http://localhost:5173
```

### 3. Mobile App (React Native)
```bash
cd bike
npm install
# Ensure Metro bundler is running
npm start

# For Android
npm run android

# For iOS
npm run ios
```

---
## 🔑 Tech Stack
| Layer | Technology |
|-------|------------|
| **Mobile App** | React Native (v0.82), NativeWind (Tailwind), Reanimated |
| **Web Admin** | React 19, Vite, TailwindCSS v4 |
| **Backend API** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Payments** | Stripe API |
| **Authentication** | JWT + OTP |

---

## 👨‍💻 Author

**Raj kamal**

GitHub: https://github.com/Rajkamal08
