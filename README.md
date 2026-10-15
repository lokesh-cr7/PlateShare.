# PlateShare — Surplus Food Redistribution Platform

> **"Share a meal. Change a day."**  
> *Hackathon Problem ID: #6 — Leftover Food Sharing App*

PlateShare connects restaurants, hotels, event organizers, catering services, and households with local NGOs, food banks, and volunteer runners to rescue edible surplus food before it goes to waste.

---

## 🌟 Overview & Key Problem Solved

Every day, commercial kitchens and banquets produce large quantities of high-quality edible food that is discarded simply because safe, rapid redistribution channels do not exist. At the same time, community shelters and families face acute food insecurity.

**PlateShare bridges this gap through a community-driven, safety-first platform:**
1. **Donors** publish surplus portions with explicit preparation times, safe pickup windows, and temperature storage parameters.
2. **Receivers (NGOs & Volunteers)** discover nearby surplus food, reserve batches with 1 click, and obtain a secure digital **Pickup Verification Pass**.
3. **Freshness Engine** tracks remaining time dynamically, shifts color indicators (Fresh 🟢 → Expiring Soon 🟠 → Expired 🔴), and locks down expired food automatically to uphold hygiene standards.
4. **Logistics & Impact Engine** validates handovers via pickup codes and instantly tallies rescued meals, kilograms of food diverted from landfills, and CO₂ emissions saved.

---

## 🚀 Live Demo & Key Pages

| Page | URL Route | Description |
|---|---|---|
| **Landing Page** | `/` | Hero section, live impact metrics, how it works, and featured surplus food. |
| **Find Food Directory** | `/find` | Filter by category, area/district, availability (Available, Expiring Soon, Claimed, Expired), and search by keyword. |
| **Donate Surplus Food** | `/donate` | Validated intake form with allergen tags, storage method cards, safe pickup deadlines, and quick autofill presets. |
| **Logistics & Pickups** | `/pickups` | Schedule tracking, verification passes, one-click collection confirmations, and claim cancellations. |
| **Operations Dashboard** | `/dashboard` | Real-time KPI cards, category breakdown charts, upcoming pickups, and live activity stream. |
| **Community Impact** | `/impact` | Servings rescued, food waste weight (kg), virtual water conserved, weekly trends, and donor spotlight. |

---

## 🔬 Core Features & Innovation Highlights

### 1. Dynamic Freshness Tracker (Hackathon Highlight)
- Evaluates elapsed time from cooking against donor-specified safe consumption deadlines.
- **Green Status (Active / Fresh):** > 50% safe window or > 3 hours remaining.
- **Orange Status (Expiring Soon):** ≤ 45 minutes or ≤ 25% window remaining.
- **Red Status (Expired):** Deadline passed. **Claim button is automatically disabled**, and listing is flagged with *"Expired — no longer available for collection"*.
- *Food Safety Notice:* Timers provide operational guidance; mutual temperature verification and sensory inspection remain required at handover.

### 2. Digital Pickup Verification Pass
- Generating unique claim numbers (e.g., `CLM-7842`) and alphanumeric verification codes (e.g., `PS-4821`).
- Eliminates confusion at commercial kitchen loading docks; donors verify the pass before handing over food.

### 3. Dual-Sided Role Simulation (For Hackathon Judges)
- The persistent **Judge Demo Bar** allows instant switching between:
  - **NGO Director:** Dr. Sarah Jenkins (*Hope Community Food Pantry*)
  - **Volunteer Runner:** Alex Rivera (*City Food Rescue Squad*)
  - **Food Donor:** Chef Marcus Vance (*Royal Feast Banquets & Catering*)
- Instant **Reset Demo Data** button to return the platform to a clean state at any time.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, JavaScript (ES Modules)
- **Styling:** Tailwind CSS (Custom palette: Primary `#166534`, Dark Green `#14532D`, Light Green `#DCFCE7`, Warm Cream `#FFFBEB`)
- **Icons:** Lucide React
- **Routing:** React Router DOM (v6)
- **Delight Effects:** Canvas Confetti for pickup confirmations and donations
- **Storage:** Reactive `localStorage` abstraction designed for drop-in REST/GraphQL backend replacement

---

## 💻 Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on Node v24)
- npm (v9 or higher)

### Installation Steps

```bash
# 1. Clone or navigate into the project directory
git clone YOUR_GITHUB_REPOSITORY_URL
cd plateshare

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Or build and test the production bundle
npm run build
npm run preview
```

Open your browser at `http://localhost:5173/` (for dev) or `http://localhost:4173/` (for preview).

---

## 📦 Production Build

```bash
# Run production build
npm run build

# Output will be generated in the /dist folder
```

---

## 🌐 Deployment Instructions

### Deploy to Netlify
1. Push your repository to GitHub.
2. Log in to [Netlify](https://www.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select your GitHub repository.
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. The included `netlify.toml` and `public/_redirects` files ensure Single-Page Application (SPA) routes work without 404 errors.
6. Click **Deploy Site** to obtain your public URL (e.g., `https://plateshare-demo.netlify.app`).

### Deploy to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**.
5. The included `vercel.json` rewrite file handles client-side routing.

---

## 🐙 Push to GitHub Instructions

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create initial commit
git commit -m "Build PlateShare food sharing app"

# Set default branch to main
git branch -M main

# Add your remote repository (replace with your actual GitHub URL)
git remote add origin YOUR_GITHUB_REPOSITORY_URL

# Push code to GitHub
git push -u origin main
```

> **Note:** Remember to replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL (e.g. `https://github.com/your-username/plateshare.git`).

---

## 🔒 Limitations & Future Roadmap

This version stores data in browser `localStorage` for self-contained hackathon evaluation:
- **Demo Scope:** Data changes in one browser window do not automatically sync to other devices in real-time.
- **Production Backend Roadmap:**
  - Node.js / Express or Firebase Cloud Functions REST API
  - PostgreSQL / Supabase or MongoDB database
  - WebSockets (Socket.io) for live claim locking across multiple devices
  - OAuth2 / JWT authentication (Role-based access control for verified 501(c)(3) charities)
  - SMS & WhatsApp alerts for drivers when surplus becomes available nearby
  - Geolocation routing & distance optimization

---

## 📜 Food Safety Advisory

PlateShare operates solely as a community coordination network. Visual freshness countdowns are operational estimates based on donor declarations. Food donors and receiver organizations must strictly adhere to local food health codes, maintain temperature control during transit, and inspect items before consumption.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
