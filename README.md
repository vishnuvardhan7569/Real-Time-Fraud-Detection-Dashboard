# Real-Time Fraud Detection Dashboard

This project is a real-time e-commerce transaction monitoring system that uses Google Gemini AI to detect potential fraud.

## Features
- **Live Data Stream:** Real-time transaction simulation using WebSockets (Socket.io).
- **AI-Powered Analysis:** Every transaction is analyzed by Grok AI API to assign a fraud risk score and level.
- **Dynamic Dashboard:** React-based UI with live-updating tables and risk charts.
- **Historical Storage:** Transactions and analysis results are stored in MongoDB.
- **Dockerized:** Easy deployment using Docker Compose.

## Tech Stack
- **Frontend:** React, Redux Toolkit, Chart.js, Bootstrap 5.
- **Backend:** Node.js, Express, Socket.io, Mongoose.
- **AI:** Grok AI API.
- **Database:** MongoDB Atlas (or local MongoDB).

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API Key

### 2. Environment Configuration
Create a `.env` file in the `server` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret
```

### 3. Running with Docker (Recommended)
```bash
docker-compose up --build
```
The dashboard will be available at `http://localhost:3000`.

### 4. Running Manually
**Server:**
```bash
cd server
npm install
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## How it Works
1. The backend generates a mock transaction every 10 seconds.
2. The transaction data is sent to the Gemini API with a prompt to evaluate fraud risk.
3. Gemini returns a JSON response with a risk score (0-100), level (Low, Medium, High), and a reason.
4. The enriched transaction is saved to MongoDB and broadcast to all connected clients via Socket.io.
5. The React dashboard updates the transaction table and the risk trend chart in real-time.
6. High-risk transactions trigger a specific alert in the UI.
