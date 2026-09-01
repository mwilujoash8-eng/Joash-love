# SchoolLink — Digital School Website & Educational Operating System

SchoolLink is a complete, modern institutional school website and digital educational operating system built with React 19, TypeScript, Tailwind CSS, and Express. It serves as both a public-facing school website (with admissions, academic curriculum, institutional leadership, and school announcements) and a digital management portal for Head Teachers, Deputy Head Teachers, Teachers, Pupils, and Parents.

---

## 🌟 Full Website & Portal Capabilities

1. **Public Institutional Website Homepage (`LandingPage.tsx`)**:
   - Institutional branding, Head Teacher welcome message, academic year metrics, and ECZ accreditation notices.
   - 4 Direct Gateway Portals for Staff, Students, Parents, and National Board / Administrators.
   - Interactive sections: *Home*, *About Institution*, *Curriculum & ECZ*, *Admissions & Fees*, and *Contact Administration*.

2. **Role-Based Portals & Dashboards**:
   - **Head Teacher**: School performance analytics, staff management, official circular drafting, audit trail, academic promotion.
   - **Deputy Head Teacher**: Timetable & duty roster scheduling, discipline records, academic records oversight.
   - **Teacher**: ECZ Continuous Assessment (CA-1 to CA-3) gradebook, attendance registers with automated parent SMS alerts, Excel & Word studios.
   - **Student**: Interactive homework portal, term report cards, embedded Zoom classrooms, notes maker, study groups.
   - **Parent**: Live report cards, attendance tracking, fee invoice & transaction history (Airtel Money, MTN MoMo, Zamtel Kwacha), direct teacher messaging.
   - **Platform Admin & Board**: Institution licensing, national people search, manual subscription verification desk (**0775777069**), cryptographic ledger audit.

3. **Embedded Academic & Collaboration Studios**:
   - **Zoom Live Virtual Classrooms**: Embedded virtual classrooms with whiteboard, student evaluation engine, and Dr. Mwape AI Co-Teacher.
   - **Excel & Word Studios**: Formula-enabled spreadsheet grading and official circular/document drafters.
   - **Gemini AI Studio**: Multi-turn educational assistant with Google Search and Google Maps grounding for real-time curriculum and location data.

---

## 🚀 How to Publish on GitHub Pages as a Website (Step-by-Step)

This project is built to run as a standalone website on **GitHub Pages** with automated zero-config deployment.

### Method 1: Automated GitHub Actions (Recommended)

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new) and create a repository (e.g. `schoollink` or `my-school-website`).

2. **Initialize Git & Push**:
   ```bash
   git init
   git add .
   git commit -m "Deploy SchoolLink institutional website"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Open your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - The workflow located at `.github/workflows/deploy.yml` will automatically build the site (`dist/`) and publish your live website at:
     ```
     https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/
     ```

### Method 2: Manual Static Build
```bash
# Install dependencies
npm install

# Build the production static website
npm run build

# The output in ./dist can be uploaded to any static web host (GitHub Pages, Netlify, Vercel, Cloudflare Pages)
```

---

## 💻 Local Development & Full-Stack Server Execution

### Prerequisites
- Node.js (v18 or v20+)
- npm

### Run Locally in Development Mode
```bash
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### Production Start (with Express Backend)
```bash
npm run build
npm start
```

---

## ⚙️ Environment Variables (Optional)

Configure via `.env`:
- `GEMINI_API_KEY`: API key for server-side Gemini AI features. (When deployed on GitHub Pages, the site includes built-in client fallbacks so all features continue to operate cleanly).
- `VITE_API_URL`: (Optional) Custom external backend URL if you deploy the Express server separately.

---

## 📄 License
MIT License. Developed for school administration and academic community empowerment.
