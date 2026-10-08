# Road to Prague – CEO's World of Winners (WoW) Contest Game

A mobile-first contest game built with **React 18** and **Vite** for the **Bajaj Life Bancassurance Q3 FY'27 International Sales Training Program**.

## 🚀 Quick Start

### 1. Development Server
Run the local Vite dev server with hot module replacement:
```bash
npm run dev
```
Then open the displayed local URL (typically `http://localhost:5173`) in your browser.

### 2. Production Build
Build the optimized standalone production bundle:
```bash
npm run build
```
The output will be generated inside the `dist/` directory.

### 3. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
newgame/
├── package.json               # Dependencies and scripts (React 18, Vite)
├── vite.config.js             # Vite configuration with React plugin
├── index.html                 # Main HTML entry point
├── public/                    # Static assets served as-is
│   └── assets/
│       ├── cover_prague_hero.jpg   # Prague Charles Bridge sunset backdrop from PDF
│       ├── crest_wow.png           # CEO's World of Winners crown crest
│       └── prague_3d_title.png     # 3D golden embossed PRAGUE title
├── src/
│   ├── main.jsx               # React 18 createRoot bootstrap
│   ├── App.jsx                # Main container & phone frame layout
│   ├── index.css              # Global styles, animations & mobile responsive rules
│   ├── data/
│   │   └── contestData.js     # Lanes targets, Tiers metadata, Quest cards, Passport criteria
│   ├── utils/
│   │   └── sound.js           # Web Audio API sound synthesizer (no external audio files)
│   └── components/
│       ├── HomeScreen.jsx     # Intro screen matching PDF Page 1
│       ├── LaneScreen.jsx     # Role & lane selection (10 roles) + target ladder
│       ├── JourneyScreen.jsx  # Interactive SVG route map & WAP slider (0-75L)
│       ├── RuleQuestScreen.jsx# 8 True/False rule cards with wax stamp animations
│       ├── ForgeScreen.jsx    # Premium forge calculator with 3D liquid gold coin
│       ├── PassportScreen.jsx # 6 criteria checklist & PNQ ➔ PRG boarding pass
│       └── BottomDock.jsx     # 6-tab mobile navigation dock
├── dist/                      # Compiled production distribution
└── Road to Prague – WoW Contest Game.html # Pre-built standalone single-file version
```

---

## 🎮 Game Features

- **Intro Screen (PDF Page 1)**: Authentic Prague sunset panorama, golden crown emblem, 3D golden PRAGUE word, Czech tricolor silk ribbon, real-time countdown timer, and 5 glowing tier medallions (Bronze, Silver, Gold, Titanium, Platinum).
- **Choose Your Lane**: 10 distinct role categories with proportional target progress ladders and eligibility windows.
- **Journey Map**: Interactive 354px × 400px SVG route with 5 checkpoints and animated pin mover that travels as WAP changes.
- **Rule Quest**: Interactive mini-game with 8 rule cards, animated `APPROVED` / `RECHECK` wax stamps, and rationale explanations.
- **Premium Forge**: Case calculator with 3D coin visualization that fills with liquid gold based on forged WAP.
- **Passport Control**: 6 interactive checklist items and a flight boarding pass (`PNQ ➔ PRG`) stamped `CLEARED`.
- **Sound Effects**: In-browser synthesized audio using the Web Audio API for clicks, coin clinks, stamp hits, and victory fanfare.
