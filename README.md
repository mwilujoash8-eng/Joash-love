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

SchoolLink is fully optimized to run either as a standalone static web application on **GitHub Pages**, **Vercel**, **Netlify**, or **Cloudflare Pages**, or as a full-stack container on **Cloud Run** or **Render**.

### Method 1: Automated GitHub Actions Deployment (Recommended — 100% Automated)

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new) and create a repository (e.g. `schoollink`).

2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy SchoolLink institutional website"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages via Actions**:
   - On GitHub, go to your repository **Settings** tab.
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment** > **Source**, change the dropdown to **GitHub Actions**.
   - That's it! GitHub will run the included workflow (`.github/workflows/deploy.yml`) automatically, build your application, and publish your website at:
     ```
     https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/
     ```

---

### Method 2: One-Command Publish with `npm run deploy`

If you prefer deploying directly from your terminal to GitHub Pages without setting up Actions:
```bash
# 1. Ensure git remote origin is set to your GitHub repo
# 2. Run the automated deploy script:
npm run deploy
```
This automatically compiles the production assets into `dist/` and pushes them cleanly to the `gh-pages` branch on your GitHub repository. Then simply set **Settings > Pages > Source** to `Deploy from a branch` (`gh-pages` / `/root`).

---

### Method 3: Static Hosting (Vercel, Netlify, Cloudflare Pages)
```bash
npm run build:pages
# Deploy the generated ./dist folder directly to Vercel, Netlify, or Cloudflare Pages with zero configuration needed.
```

---

### 🛡️ Why SchoolLink Never Fails on GitHub Pages
- **Relative Asset Resolution**: Assets are compiled with `./assets/...` relative linking, ensuring the site functions at any subpath (`/<repo-name>/`) without 404 asset errors.
- **Jekyll Bypassed (`.nojekyll`)**: Contains `.nojekyll` so GitHub Pages never drops asset files.
- **Client Educational Intelligence Fallback**: If an Express server is absent, all AI features (ECZ lesson drafting, circular generation, student remark synthesis) seamlessly switch to the embedded client-side intelligence engine.
- **Defensive Storage Isolation**: Browser storage is guarded against sandbox and iframe restrictions, guaranteeing no crash on load.

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
