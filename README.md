# FUNVERSE 360 — Play • Eat • Explore • Connect • Win 🎢🍔🎮🎤🏆

> **A colorful, production-style full-stack entertainment & amusement platform designed for students and young users.**  
> *“Your Fun. Your Squad. Your Universe.”*

---

## 🚀 Quick Launch in VS Code Terminal

You can run FUNVERSE 360 immediately from the VS Code terminal.

### Option 1: 1-Click Startup (Recommended for Windows)

In the VS Code terminal (or by double-clicking in file explorer):

```cmd
.\start.bat
```

This launches both the **Backend API & AI Engine** (on port `5000`) and the **Vite React Frontend** (on port `5173`).

---

### Option 2: Step-by-Step Terminal Commands

#### 1. Setup & Install Dependencies
Open two split terminals in VS Code:

**Terminal 1 (Backend):**
```bash
cd backend
npm.cmd install
npm.cmd run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

Now open: **`http://localhost:5173`** in your browser.

> [!NOTE]
> On server launch, the backend will **automatically seed** the database with 20 users, 10 thrill rides, 20 food court items, 10 arcade games, 10 live stage events, 20 challenges, and 20 rewards if the database is fresh!

---

## 🔑 Demo Credentials (1-Click Login Built-in)

The top navigation bar and login screen feature **1-Click Instant Demo Login**:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Student Demo** | `demo@funverse.com` | `password123` | Full student dashboard, XP bar, Smart Wallet, AI planner, interactive games, ride booking passes |
| **Admin Demo** | `admin@funverse.com` | `password123` | Real-time crowd saturation gauges, Recharts attendance curves, AI operational insights & predictions |

---

## 🎮 Core Features & Architecture

### 1. 🤖 AI Fun Planner: “What should I do next?”
A personalized multi-step journey planner:
- **Step 1:** Time available (30m, 1h, 2h, 3h, 4h, Custom)
- **Step 2:** Spending budget (₹100, ₹250, ₹500, Custom)
- **Step 3:** Vibe/Mood (🔥 Adventure, 🍔 Foodie, 🎮 Gaming, 😎 Chill, 🎵 Music, 📸 Photography)
- **Step 4:** Companion (Alone, Friends, Family, Squad)

**Modular Heuristic & Scoring Engine (`recommendationService.js`):**
$$\text{Score} = (w_1 \cdot \text{InterestMatch}) + (w_2 \cdot \text{BudgetMatch}) + (w_3 \cdot \text{TimeMatch}) + (w_4 \cdot \text{Popularity}) - (w_5 \cdot \text{CrowdPenalty}) - (w_6 \cdot \text{QueuePenalty})$$

Outputs a progressive timeline (Ride $\rightarrow$ Food Refuel $\rightarrow$ Arcade $\rightarrow$ Live Stage) with real queue times, prep durations, and route tracking.

---

### 2. 🕹️ Interactive Playable Mini-Games with Real MongoDB Persistence
- In-browser **Cyber Reflex Challenge** on a 3x3 interactive neon matrix.
- Real countdown timer, streak multipliers, and combo accuracy.
- Scores and sessions are posted via `POST /api/games/:id/play`, saved into the `GamePlays` collection, updates all-time high scores, awards XP, triggers confetti, and updates global and campus leaderboards!

---

### 3. 🗺️ Smart Interactive Map (Leaflet + OpenStreetMap)
- Custom neon glowing HTML markers for Rides (🎢), Food Stalls (🍔), Arcades (🎮), Live Events (🎤), Restrooms (🚻), and First Aid (🚑).
- Crowd density indicator rings (🟢 Low, 🟡 Moderate, 🔴 High).
- Dynamic route polyline connecting selected AI itinerary stops!

---

### 4. 👥 Squad Voting & Social Democracy
- Real-time squad poll: *"What should we do next?"* (Rides 45%, Food 20%, Games 30%, Events 5%).
- AI group compatibility engine recommends the consensus activity.

---

### 5. 🎟️ Digital QR Ticket Passes
- Confirmed ride bookings and event RSVPs dynamically generate a scannable digital QR pass (`qrcode.react` & backend `qrcode` generator).
- Includes Pass ID, validity, turnstile scanner instructions, and cancellation/refund capability.

---

### 6. 💰 Smart Wallet & Budget Tracker
- Live balance, total budget, spent metrics, and audit log.
- 1-click Demo reload top-up.

---

### 7. 📊 Administrator Command Center & AI Predictive Insights
- **Key Metrics:** 4,820 Users, 1,240 Bookings, 2,850 Orders, 920 Game Plays, ₹4,82,500 Revenue.
- **Charts:** Recharts attendance curves and revenue velocity.
- **Live Crowd Gauges:** Thrill Rides (🔴 92%), Food Court (🔴 87%), Games (🟢 34%), Arena (🟡 60%).
- **AI Operational Predictions:**
  - *“⚠️ Food Court congestion expected to increase by 25% in next 30m.”*
  - *“📈 Pizza demand is projected to be HIGH between 6:00 PM – 8:30 PM.”*
  - *“🎢 Roller Coaster queue expected to reach 45+ minutes.”*
  - *“💡 Consider opening Counter 4 at Flavor Hub.”*

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Leaflet, React-Leaflet, Recharts, Canvas-Confetti, QRCode.react, Axios, Socket.IO Client.
- **Backend:** Node.js, Express.js, Socket.IO, Mongoose, MongoDB (with automatic local / embedded in-memory fallback), JWT, Bcrypt.js, QRCode.

---

## 📁 Project Structure

```
FUNVERSE360/
├── package.json               # Root orchestrator
├── start.bat                  # 1-click Windows / VS Code launch
├── setup.bat                  # 1-click dependency installer & seeder
├── README.md                  # Complete documentation
│
├── backend/
│   ├── server.js              # Express app, Socket.IO server & crowd pulse
│   ├── seed.js                # Database seeder (20 users, 10 rides, 20 foods, etc.)
│   ├── config/
│   │   └── db.js              # Resilient MongoDB connector (Local + In-Memory fallback)
│   ├── models/                # User, Ride, Food, Game, Event, Booking, Order, etc.
│   ├── routes/                # Auth, Rides, Food, Games, Planner, Squad, Admin, etc.
│   ├── services/
│   │   ├── recommendationService.js  # Heuristic scoring engine
│   │   ├── crowdPredictionService.js # Zone saturation simulator
│   │   ├── queuePredictionService.js # 30m throughput forecast
│   │   ├── foodDemandService.js      # Kitchen velocity forecast
│   │   └── notificationService.js    # Socket.IO dispatcher
│   └── middleware/
│       └── auth.js            # JWT verification & Admin guards
│
└── frontend/
    ├── vite.config.js         # Vite configuration with API proxies
    ├── tailwind.config.js     # Custom neon palette & glassmorphism
    ├── index.html             # Google fonts & Leaflet assets
    └── src/
        ├── App.jsx            # Routing and global layout
        ├── index.css          # Neon glow utility classes
        ├── context/           # Auth, Socket, and Cart contexts
        ├── services/api.js    # Axios client
        ├── components/        # Navbar, BottomNav, MiniGameModal, Cards, QR Pass
        └── pages/             # Landing, Dashboard, FunPlanner, Rides, Food,
                               # Games, Events, Map, Challenges, Squad, Admin, etc.
```

---

## 🧪 5-Minute Hackathon Demo Script

1. **Open `http://localhost:5173`** $\rightarrow$ Observe futuristic landing page.
2. Click **“🚀 Demo Student”** $\rightarrow$ Instantly lands on Student Dashboard with XP bar, streak, and wallet.
3. Click **“🤖 PLAN MY FUN”** $\rightarrow$ Choose ₹500, 3 Hours, Adventure + Food $\rightarrow$ AI generates personalized itinerary.
4. Click **“START MY JOURNEY ON MAP”** $\rightarrow$ Observe Leaflet map with crowd indicators and the pink itinerary route line.
5. Click **“Rides”** $\rightarrow$ Book HyperCoaster $\rightarrow$ Inspect confirmed digital QR ticket pass.
6. Click **“Food”** $\rightarrow$ Add Truffle Fries & Slush to cart $\rightarrow$ Checkout with smart wallet.
7. Click **“Games”** $\rightarrow$ Click **“PLAY NOW”** on Cyber Reflex $\rightarrow$ Play the 15-second reflex test $\rightarrow$ Observe score saved into MongoDB and XP increased!
8. Click **“Quests”** $\rightarrow$ Click **“COMPLETE & CLAIM”** $\rightarrow$ Watch confetti pop and level up.
9. Click **“Rankings”** $\rightarrow$ Check your highlighted name on the podium leaderboard.
10. Click **“🛡️ Demo Admin”** $\rightarrow$ Inspect live crowd gauges, Recharts attendance curves, and AI predictive insights panel.
