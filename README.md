# Real-Time Fraud Detection Dashboard 🛡️

A full-stack, real-time surveillance system designed to detect fraudulent e-commerce transactions in the Indian market. It leverages **Groq AI (Llama 3.1)** for ultra-fast risk scoring and provides a modern, responsive dashboard for security analysts.

## 🚀 How It Works

1.  **Simulation Engine**: The server generates realistic e-commerce transactions (using Indian names, cities like Bengaluru/Chennai, and INR currency) to mimic high-traffic activity.
2.  **AI Analysis**: Each transaction is instantly sent to the **Groq API**. Using the **Llama 3.1** model, it analyzes patterns (velocity, location mismatch, device anomalies) and assigns a **Risk Score (0-100)**.
3.  **Real-Time Broadcasting**: Analyzed data is saved to **MongoDB** and simultaneously pushed to the frontend via **Socket.io**—no page refreshes required.
4.  **Live Visualization**: The React dashboard consumes these events to update charts, tables, and alert panels instantly.

---

## 📂 Folder Structure

```text
D:\Fraud Detection\
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertsPanel.jsx     # Displays critical "High Risk" warnings
│   │   │   ├── RiskChart.jsx       # Visualizes fraud trends over time
│   │   │   └── TransactionTable.jsx # Detailed live ledger of all events
│   │   ├── pages/
│   │   │   └── LoginPage.jsx       # Secure entry point for analysts
│   │   ├── services/           # API and WebSocket connection handlers
│   │   └── store/              # Redux state management for live data
│   └── ...
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/             # Mongoose schemas (User, Transaction)
│   │   ├── services/
│   │   │   ├── aiService.js           # Groq AI integration logic
│   │   │   └── transactionGenerator.js # Simulates localized Indian traffic
│   │   └── index.js            # Server entry point & Socket.io setup
│   └── ...
└── docker-compose.yml          # Container orchestration config
```

---

## 🧭 Page & Component Guide

### Why each part exists:

*   **`LoginPage.jsx`**
    *   *Purpose:* Secures the dashboard. Since this tool displays sensitive financial patterns, JWT authentication ensures only authorized personnel can view the feed.
*   **`TransactionTable.jsx`**
    *   *Purpose:* The "Source of Truth." It provides a granular, line-by-line view of every incoming order, allowing analysts to inspect specific transaction IDs and details.
*   **`RiskChart.jsx`**
    *   *Purpose:* Trend Analysis. By visualizing the average risk score over the last few minutes, it helps spot coordinated attacks (spikes) vs. normal isolated fraud attempts.
*   **`AlertsPanel.jsx`**
    *   *Purpose:* Immediate Action. This component filters out the noise and only shows critical threats (Risk Score > 90), ensuring the analyst's attention is drawn to the most urgent issues.

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Atlas or Local)
*   Groq API Key

### 1. Clone & Configure
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secure_secret
```

### 2. Install Dependencies
**Root (optional, if using monorepo scripts):**
```bash
npm install
```
**Server:**
```bash
cd server
npm install
```
**Client:**
```bash
cd client
npm install
```

### 3. Run the Application
**Development Mode (Run separately):**
*   Terminal 1 (Server): `cd server && npm run dev`
*   Terminal 2 (Client): `cd client && npm run dev`

**Production Mode:**
The server is configured to serve the client static files.
1.  Build Client: `cd client && npm run build`
2.  Start Server: `cd server && npm start`

---

## 🌍 Localization Features
*   **Currency**: formatted in **₹ (INR)**.
*   **Geography**: Transaction locations focus on major South Indian tech hubs (Bengaluru, Hyderabad, Chennai) to match the target user base.
*   **Timezone**: Timestamps are adjusted for readability in local contexts.