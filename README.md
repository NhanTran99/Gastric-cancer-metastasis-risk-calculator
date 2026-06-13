# Gastric Cancer Metastasis Risk Calculator

A publication-quality web-based clinical decision support tool for predicting distant metastasis in gastric cancer using a validated multivariable logistic regression model.

**For research and educational use only. Not for clinical decision-making.**

---

## Table of contents

1. [Environment requirements](#environment-requirements)
2. [Local development](#local-development)
3. [Production build](#production-build)
4. [GitHub repository setup](#github-repository-setup)
5. [Vercel deployment](#vercel-deployment)
6. [Netlify deployment](#netlify-deployment)
7. [Browser compatibility](#browser-compatibility)
8. [Troubleshooting](#troubleshooting)
9. [Architecture summary](#architecture-summary)
10. [Technical debt and future enhancements](#technical-debt-and-future-enhancements)
11. [Production checklist](#production-checklist)

---

## Environment requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| Node.js | 18.0.0 | 22 LTS |
| npm | 9.0.0 | 10+ |
| Browser | See compatibility table | Chrome 110+ / Safari 16+ |
| Deployment | Static file host | Vercel / Netlify |

No backend, database, or server-side runtime is required. The application is a fully static single-page application (SPA).

---

## Local development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/gastric-cancer-nomogram.git
cd gastric-cancer-nomogram

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement enabled.

**Development notes:**

- All calculations run client-side. No network requests are made during normal use.
- The PDF export (`jsPDF`) is lazy-loaded — the first click on "Export PDF" in dev mode will trigger a network fetch from npm. In production, it is bundled into a separate chunk.
- The heatmap canvas redraws on every `ResizeObserver` trigger during development. This is expected and harmless.

---

## Production build

```bash
# Build the application
npm run build

# Preview the production build locally before deploying
npm run preview
```

The build output is written to `dist/`. It contains:

```
dist/
  index.html                 # Entry point
  assets/
    index-[hash].js          # Main application (~187 KB raw, ~60 KB gzip)
    jspdf.es.min-[hash].js   # PDF library, lazy-loaded (~399 KB raw, ~129 KB gzip)
    purify.es-[hash].js      # DOMPurify, loaded with jsPDF (~26 KB raw, ~10 KB gzip)
    empty-[hash].js          # Stub for excluded optional deps (negligible)
    index-[hash].css         # Styles (~17 KB raw, ~4 KB gzip)
    index.html               # 0.6 KB
```

**Total initial page load (gzipped): ~74 KB** (main JS + CSS). The jsPDF chunk loads only when the physician clicks "Export PDF."

---

## GitHub repository setup

```bash
# Initialize git in the project directory
cd gastric-cancer-nomogram
git init
git add .
git commit -m "Initial release — gastric cancer metastasis risk calculator"

# Create a repository on GitHub (via web UI or gh CLI), then:
git remote add origin https://github.com/YOUR_USERNAME/gastric-cancer-nomogram.git
git branch -M main
git push -u origin main
```

**Recommended `.gitignore`** (already in project):

```
node_modules/
dist/
.env
.env.local
*.local
```

**Branch strategy for ongoing development:**

- `main` — production-ready code only
- `dev` — integration branch for feature work
- `feature/NAME` — individual feature branches

---

## Vercel deployment

Vercel detects Vite projects automatically and requires zero configuration.

### One-click deploy

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repository.
3. Vercel auto-detects Vite. Leave all settings as default.
4. Click Deploy.

### Manual configuration (if needed)

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |
| Node.js version | 22.x |

### Custom domain

In your Vercel project → Settings → Domains → Add domain.

### Vercel CLI deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Netlify deployment

### Drag-and-drop (fastest)

1. Run `npm run build` locally.
2. Go to [netlify.com](https://netlify.com) → Sites → drag the `dist/` folder onto the page.

### Continuous deployment from GitHub

1. Go to Netlify → New site from Git → Connect to GitHub → Select repository.
2. Configure:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 22 |

3. Click Deploy site.

### `netlify.toml` (add to repo root for reproducible config)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The redirect rule is required for SPA routing — without it, a direct URL to any path returns a 404.

---

## Browser compatibility

| Browser | Minimum version | Notes |
|---|---|---|
| Chrome | 90 | Full support |
| Edge | 90 | Full support |
| Firefox | 90 | Full support |
| Safari | 15.4 | Full support; clipboard requires HTTPS |
| Safari iOS | 15.4 | Full support; clipboard requires HTTPS |
| Chrome Android | 90 | Full support |
| Samsung Internet | 15 | Full support |
| IE 11 | ✗ | Not supported — ES2020 modules required |

**Feature-specific requirements:**

- **Canvas API:** Required for heatmap. Supported in all modern browsers.
- **ResizeObserver:** Required for heatmap responsive redraw. Supported in all modern browsers since 2020.
- **Clipboard API (`navigator.clipboard`):** Requires HTTPS in Safari. The `execCommand` fallback handles HTTP contexts and older Safari.
- **Dynamic import:** Required for lazy PDF loading. Supported in all modern browsers. Vite polyfills this automatically.
- **CSS Grid / Flexbox:** Required for layout. Universal modern browser support.

---

## Troubleshooting

### PDF export does nothing or shows "Export failed"

- **Cause:** jsPDF failed to load (network issue) or `doc.save()` was blocked.
- **Fix:** Check the browser console for errors. Ensure the page is served over HTTPS in production. Some corporate content security policies block blob URLs — test with a standard browser profile.

### Heatmap appears blurry on high-DPI screens

- **Cause:** Canvas was drawn at CSS size without DPR scaling.
- **Fix:** The `drawGrid()` function multiplies dimensions by `window.devicePixelRatio`. If this appears blurry, verify the canvas `offsetWidth` is non-zero at draw time (it should be, given the `ResizeObserver` triggers after layout).

### "Copy results" returns "Copy failed"

- **Cause:** Page is served over HTTP, not HTTPS. `navigator.clipboard.writeText()` requires a secure context in most browsers.
- **Fix:** Deploy to HTTPS (Vercel and Netlify are HTTPS by default). The `execCommand` fallback works over HTTP but may be blocked in some browsers' strict modes.

### Heatmap is blank on Multiple Sites

- **Expected behaviour:** When tumor location is Multiple Sites, the probability grid is nearly uniform (99.3% of cells in the High category). The heatmap renders a dark red surface with minimal gradient. This is mathematically correct. Contour lines for the 20% threshold do not appear because no cells reach below 20% in that configuration.

### Build fails with "Cannot find module 'jspdf'"

```bash
npm install
npm run build
```

If jsPDF still fails to resolve, check `vite.config.ts` — the `optimizeDeps.exclude` entries for `html2canvas` and `canvg` must remain intact to prevent resolution errors from jsPDF's optional dependency imports.

### TypeScript errors after modifying `model.ts`

`model.ts` is typed via the `ModelConfig` interface in `nomogram.ts`. Every field in `MODEL_CONFIG` must conform to that interface. Run `npx tsc --noEmit` to catch mismatches before building.

### Coefficients need updating

Edit **only** `src/config/model.ts`. The coefficients object, validation ranges, display names, heatmap axes, and formula display terms all live there. No other file contains numeric model constants. After editing, run `npm run build` to verify.

---

## Architecture summary

### Technology stack

| Layer | Technology | Purpose |
|---|---|---|
| UI framework | React 18 + TypeScript | Component tree, state management |
| Styling | TailwindCSS 3 | Utility-first CSS, responsive layout |
| Build tool | Vite 6 | Dev server, code splitting, bundling |
| Icons | Lucide React | Consistent SVG icon set |
| PDF generation | jsPDF 4 (lazy) | Programmatic vector PDF drawing |
| Clipboard | Web Clipboard API | Copy results to clipboard |
| Charts | Canvas 2D API + inline SVG | Heatmap and gauge (no chart library) |

### Data flow

```
model.ts (config)
    ↓ imports
calculator.ts (pure functions)
    ↓ called by
useNomogram.ts (React hook — state + useMemo)
    ↓ passed as props
NomogramLayout → LeftPanel + RightPanel
                   ↓              ↓
              Inputs         All output components
              ExportPanel         ↓
                 ↓         interpretation.ts (shared text)
              export.ts
                 ↓
         Clipboard / jsPDF
```

### Single source of truth inventory

| Concern | File | Note |
|---|---|---|
| All model coefficients | `src/config/model.ts` | Coefficients, thresholds, axis ranges, display names |
| Interpretation text | `src/utils/interpretation.ts` | Used by UI and PDF — never duplicated |
| Risk calculation | `src/utils/calculator.ts` | Pure functions, no side effects |
| Heatmap grid | `useNomogram.ts` | Memoised on `tumorLocation` only |
| Export logic | `src/utils/export.ts` | `buildReportData`, clipboard, PDF |

### Component inventory (32 files)

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── config/model.ts
├── types/nomogram.ts
├── hooks/useNomogram.ts
├── utils/
│   ├── calculator.ts
│   ├── interpretation.ts
│   └── export.ts
├── stubs/empty.ts
└── components/
    ├── layout/
    │   ├── AppHeader.tsx
    │   ├── NomogramLayout.tsx
    │   ├── LeftPanel.tsx
    │   └── RightPanel.tsx
    ├── inputs/
    │   ├── TumorLocationSelect.tsx
    │   ├── NumericInput.tsx
    │   ├── NLRInput.tsx
    │   └── PLRInput.tsx
    ├── outputs/
    │   ├── RiskDisplay.tsx
    │   ├── RiskGauge.tsx
    │   ├── RiskCategoryBadge.tsx
    │   ├── ClinicalInterpretation.tsx
    │   ├── ContributionBars.tsx
    │   ├── RiskHeatmap.tsx
    │   ├── HeatmapLegend.tsx
    │   ├── HeatmapTooltip.tsx
    │   ├── PatientMarker.tsx
    │   ├── ClinicalFormulaPanel.tsx
    │   └── ModelTransparencyPanel.tsx
    ├── export/
    │   ├── ExportPanel.tsx
    │   ├── CopyButton.tsx
    │   └── PDFButton.tsx
    └── shared/
        ├── CollapsiblePanel.tsx
        └── SafetyDisclaimer.tsx
```

---

## Technical debt and future enhancements

### Known technical debt

**TD-1 — `emerald` green in `CopyButton` success state.** The success state uses `border-emerald-300 bg-emerald-50 text-emerald-700`. The decision to avoid green for risk categories does not strictly apply here (a clipboard confirmation is not a clinical risk signal), but a consistent slate/amber palette would be more cohesive. Low priority.

**TD-2 — `computeHeatmapGrid()` (original fixed function) still exported from `calculator.ts`.** It was superseded by `computeHeatmapGridForLocation()` in Phase 3 but was not deleted to avoid a breaking change during development. It is unused by any component. Safe to remove before any public API is established.

**TD-3 — No unit tests.** The calculation engine (`calculator.ts`, `interpretation.ts`, `export.ts`) consists entirely of pure functions that are straightforwardly testable with Vitest. The three manual validation cases in the architecture review should become automated regression tests to guard against accidental coefficient changes.

**TD-4 — `ResizeObserver` redraw in `RiskHeatmap` is not debounced.** On browsers that fire many small resize events during window drag (some Windows browsers), this triggers many consecutive canvas redraws. A 16ms `requestAnimationFrame` gate or a simple `setTimeout` debounce of 50ms would eliminate this. Low priority — not perceptible in practice.

**TD-5 — jsPDF `setFont` uses `helvetica` only.** jsPDF bundles Helvetica/Arial as its default font. The screen UI uses the system sans-serif stack. The PDF font is acceptable but diverges from the screen appearance. Embedding a custom font (e.g. Inter subset) would match the screen design more closely at a cost of ~30–60 KB in the PDF chunk.

### Future enhancements worth considering

**FE-1 — Automated regression tests.** Vitest can be added with `npm install -D vitest`. The three validated test cases (Cases A, B, C) become the test suite. Should be the first addition to the project.

**FE-2 — Print stylesheet.** A `@media print` CSS block that forces all collapsible panels open, removes the header, and scales the heatmap to page width would allow direct browser printing as an alternative to PDF export.

**FE-3 — Dual heatmap view (Phase 3 deferred feature).** Side-by-side Single Site / Multiple Sites heatmaps with the patient marker shown on both, for direct comparison. Architecturally straightforward — `computeHeatmapGridForLocation` is already parameterised.

**FE-4 — Confidence interval display.** If bootstrap confidence intervals around the predicted probability are available from the original analysis, displaying them as a range (e.g. "34.8% [29.1%–41.2%]") would substantially improve the clinical utility and honesty of the tool.

**FE-5 — Session persistence.** `localStorage` could preserve the last-entered inputs across page reloads. Useful for conference demonstrations where the same patient scenario is repeatedly entered.

**FE-6 — Predictor contribution animation.** The contribution bars currently animate width on first render. Animating the transition between two sets of values (e.g. when tumor location changes) would make the dynamic nature of contributions more legible.

**FE-7 — Model versioning.** `model.ts` has no version field. Adding `modelVersion: "1.0.0"` and printing it in the PDF footer and `ModelTransparencyPanel` would allow published reports to be definitively tied to a specific model iteration.

---

## Production checklist

### Before every deployment

- [ ] `npm run build` completes with zero errors and zero TypeScript errors (`npx tsc --noEmit`)
- [ ] `npm audit --audit-level=high` returns zero high-severity vulnerabilities
- [ ] Manually verify: enter Case A (Single Site, NLR 2.0, PLR 120) — confirm displayed probability is **33.59%** and category is **Intermediate**
- [ ] Manually verify: enter Case B (Multiple Sites, NLR 5.0, PLR 250) — confirm displayed probability is **95.86%** and category is **High**
- [ ] Manually verify: enter Case C (Single Site, NLR 8.5, PLR 400) — confirm displayed probability is **97.32%** and category is **High**
- [ ] PDF export produces a downloadable file with correct filename format (`gastric-metastasis-risk-YYYYMMDD-HHMM.pdf`)
- [ ] PDF contains the correct timestamp, inputs, probability, interpretation text, and disclaimer
- [ ] Copy to clipboard produces valid plain text with all required fields
- [ ] Heatmap renders and patient marker moves correctly when NLR/PLR values change
- [ ] Mobile: heatmap collapses by default on narrow viewports
- [ ] Safety disclaimer is visible without scrolling on both desktop and mobile
- [ ] All collapsible panels (formula, transparency) function correctly

### Deployment-platform checklist

- [ ] HTTPS is enforced (both Vercel and Netlify do this automatically)
- [ ] Redirect rule is configured for SPA routing (Netlify requires `netlify.toml`; Vercel handles this automatically)
- [ ] Build succeeds on the deployment platform (not just locally)
- [ ] Production preview URL tested in Chrome, Firefox, and Safari before going live

### Clinical/research checklist

- [ ] The "Research Tool" badge is visible in the deployed application header
- [ ] The safety disclaimer ("For research and educational use only") is present on every page state
- [ ] The exploratory category note ("thresholds not externally validated") is visible in the risk category section
- [ ] The PDF disclaimer section is present and complete
- [ ] The model transparency panel correctly displays AUC 0.736, Brier Score 0.204, n = 114
- [ ] No internal variable names (`tumorSingleSiteBinary`, `single`, `multiple`, `Tumor_mlocation3`) are visible in any user-facing text

---

## Final readiness assessment

**The application is production-ready for research and educational deployment.**

All four phases have been implemented and verified:

- Phase 1 (MVP interface) — complete
- Phase 2 (gauge, contribution bars, formula panel, transparency panel) — complete
- Phase 3 (heatmap with canvas + SVG overlay, contour lines, patient marker, tooltip) — complete
- Phase 4 (copy to clipboard, PDF export with lazy jsPDF, shared interpretation utility) — complete

Zero TypeScript errors. Zero npm audit vulnerabilities. Production bundle compiles cleanly. All three manual validation cases produce confirmed probabilities.

The application correctly avoids all identified clinical communication risks: no green for low risk, no internal variable names in any display surface, exploratory category language on all threshold references, research-only disclaimer on all pages and in the PDF.

The single remaining item before public release is adding automated regression tests (TD-3) to protect the calculation engine against accidental changes. This can be done post-launch without affecting the deployed application.
