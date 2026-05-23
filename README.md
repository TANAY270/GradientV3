# Gradient V3 — AI Cloud Cost Optimizer

Gradient is a multi-cloud infrastructure cost optimization dashboard for DevOps and SRE teams. It simulates continuous scanning across AWS, GCP, and Azure, surfaces waste and savings opportunities, forecasts spend, and runs mock autopilot remediations with a live agent terminal and chat.

---

## Key features

- **Dashboard** — KPI cards for runrate, detected waste, available savings, and remediation progress; spend trend chart; top optimizations; health and waste breakdown widgets.
- **Multi-cloud spend trends** — SVG grouped bar chart for AWS, Azure, and GCP month-over-month runrate.
- **Cost forecaster** — Interactive baseline vs. optimized projection with growth, autopilot strictness, and spot migration sliders.
- **Resource map** — Per-provider zones with hover diagnostics, utilization bars, and one-click remediation.
- **Optimization queue** — Pending recommendations with CLI previews, execute/ignore actions, and resolved history.
- **Agent terminal** — Live telemetry log stream with scan pause/clear controls.
- **Agent chat** — Preset prompts and inline remediation cards tied to mock inventory.
- **Autopilot** — Optional background loop that applies pending recommendations automatically.
- **Settings** — Mock credential bindings, scan frequency, autopilot scope, and **light/dark theme**.
- **Dark & light mode** — Full UI theming with persisted preference, system default on first visit, and no flash on load.

---

## Technology stack

| Layer | Choice |
|--------|--------|
| Framework | [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) |
| Styling | CSS custom properties (`data-theme`), component utility classes |
| Icons | [Lucide React](https://lucide.dev/) |
| Typography | [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) |
| Data | Local mock data (`src/data/mockCloudData.js`) — no backend required |

---

## Project structure

```text
GradientV3/
├── src/
│   ├── components/
│   │   ├── AgentChat.jsx
│   │   ├── AgentTerminal.jsx
│   │   ├── CostForecaster.jsx
│   │   ├── MetricsOverview.jsx
│   │   ├── RecommendationsList.jsx
│   │   ├── ResourceMap.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SpendTrendChart.jsx
│   │   └── ThemeToggle.jsx
│   ├── context/
│   │   ├── themeContext.js
│   │   └── ThemeProvider.jsx
│   ├── hooks/
│   │   └── useTheme.js
│   ├── lib/
│   │   └── theme.js              # Theme storage & apply helpers
│   ├── data/
│   │   └── mockCloudData.js
│   ├── App.jsx
│   ├── index.css                 # Design tokens (dark/light) + layout
│   └── main.jsx
├── index.html                    # Theme bootstrap script (anti-flash)
├── vite.config.js
└── package.json
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/)

### Production build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

### Lint

```bash
npm run lint
```

---

## Theme (appearance)

- Toggle **Light** / **Dark** from the header or under **Settings → Appearance**.
- Preference is saved in `localStorage` under the key `gradient-theme`.
- If no saved preference exists, the app follows `prefers-color-scheme`.
- `index.html` includes an inline script so the correct theme applies before React hydrates.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Git attribution

GitHub’s **Contributors** list is built from commit history. If **cursoragent** still appears after a force-push, GitHub may be caching an older commit that included `Co-authored-by: Cursor` — it should drop off after the cache refreshes (often within 24 hours).

To stop Cursor from adding co-author lines on future commits:

1. **Cursor Settings → Agents → Attribution** — turn off commit attribution.
2. Optional hook (this repo): `git config core.hooksPath .githooks` — strips any Cursor co-author line before each commit.

---

## License

This project is provided as-is for demonstration and local development.
