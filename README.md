# 🔮 Gradient V3: AI Cloud Cost Optimizer

Gradient is a premium, high-fidelity multi-cloud infrastructure cost optimization agent. Designed for modern DevOps and site reliability engineers, it continuous scans AWS, GCP, and Azure telemetry feeds, identifies overprovisioned nodes, compiles real-time waste analytics, and offers autonomous AI autopilot remediation scripts.

---

## 🚀 Key Features

*   **📊 Multi-Cloud Spend Trends**: Elegant SVG-based grouped bar chart displaying month-over-month historical runrates for AWS, GCP, and Azure.
*   **📈 Future AI Cost Simulator**: Interactive predictive line graphs modeling future compute spend relative to growth variables, spot instance rates, and autopilot policies.
*   **🤖 Autopilot Remediation Core**: Active background simulation loops capable of executing targeted CLI commands gracefully (e.g. EC2 resizing, EBS deletions, storage archiving).
*   **🗺️ Infrastructure Topology Map**: Dynamic visual topology mapping of active regions and zone clusters, complete with hover diagnostic overlays and micro-utilization gauges.
*   **💬 Interactive Agent Chat**: Real-time diagnostic terminal advice and inline prompt action approvals to downscale idle resources immediately.
*   **⚙️ Scan Policies & Credentials**: Global credential handshake bindings and continuous scanning intervals (1m, 5m, hourly, daily).

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: Vanilla HSL CSS variables, glassmorphic filters, and high-performance keyframe animations (`float`, `pulse-glow`, `border-glow-flow`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts Outfit & JetBrains Mono

---

## 📂 Codebase Directory Structure

```text
GradientV3/
├── src/
│   ├── components/
│   │   ├── AgentChat.jsx            # Live interactive advisory console
│   │   ├── AgentTerminal.jsx        # Live shell telemetry logs terminal
│   │   ├── CostForecaster.jsx       # Predictive simulator and variables console
│   │   ├── MetricsOverview.jsx      # Dashboard key performance indicator counters
│   │   ├── RecommendationsList.jsx  # Active optimizations checklist & actions
│   │   ├── ResourceMap.jsx          # Cloud visual region topology zones map
│   │   ├── Sidebar.jsx              # Navigation dashboard side panel
│   │   └── SpendTrendChart.jsx      # Grouped multi-cloud SVG historical charts
│   ├── data/
│   │   └── mockCloudData.js         # Multi-cloud inventory, recommendations & preset chats
│   ├── App.jsx                      # Main viewport layout router and orchestration
│   ├── index.css                    # Core design system and glassmorphism styling
│   └── main.jsx                     # Vite index mount entrypoint
├── index.html                       # HTML head entrypoint and Google Web Fonts
├── vite.config.js                   # Vite configuration
└── package.json                     # System dependencies & build scripts
```

---

## ⚡ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your local machine.

### Installation
1. Clone this repository to your workspace.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
The application will be served live at: **[http://localhost:5173/](http://localhost:5173/)**

### Production Build
To compile the highly optimized bundle:
```bash
npm run build
```
Production assets will be built in the `/dist` folder, ready for direct deployment.
