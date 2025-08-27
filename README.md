# Petmedix
Petmedix : A full-stack web application for pet owners and administrators.

# PETMEDIX 🐾
A full-stack **web application** for modern pet care and admin operations.

- **Core ML Feature:** Fine-tuned model for **pet skin disease prediction** (image upload → prediction API).
- **For Pet Owners:** Multi-pet profiles, growth & BMI tracking, vaccination records/reminders, doctor booking (physical/online), Jitsi links, community posts.
- **For Admins:** Doctor & hospital management, schedule management, platform monitoring.
- **Notifications:** Gmail email alerts for vaccinations, checkups, and updates.

---

## 🔗 Repository
**Git:** https://github.com/AnusaraKarunaratna/Petmedix

---

## 🚀 Quick Start (Cloning & Running)

```bash
# 1) Clone
git clone https://github.com/AnusaraKarunaratna/Petmedix
cd Petmedix

# 2) Install dependencies
# If the project is monorepo (server + client), run installs in both:
npm install
# and/or
cd client && npm install
cd ../server && npm install

# 3) Create environment files
# See the .env examples below for server/client and ML service

# 4) Start development
# Option A: From root with concurrently (if configured)
npm run dev

# Option B: Run each part separately
# Terminal 1 (server)
cd server && npm run dev
# Terminal 2 (client)
cd client && npm start
# Terminal 3 (ML service, if separate)
cd ml_service && python app.py

