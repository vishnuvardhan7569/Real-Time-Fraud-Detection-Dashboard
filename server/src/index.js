import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import Transaction from './models/Transaction.js';
import { authenticateToken } from './middleware/auth.js';
import { startMockTransactions } from './services/transactionGenerator.js';

dotenv.config();

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fraud-detection';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);

app.get('/api/transactions', authenticateToken, async (req, res) => {
  const transactions = await Transaction.find().sort({ timestamp: -1 }).limit(50);
  res.json(transactions);
});

// Serve Static Frontend (Production Mode)
// Checks if the 'dist' folder exists in the client directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all route to serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist', 'index.html'));
});

// Secure WebSocket with JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return next(new Error("Authentication error: Invalid token"));
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  // console.log('Secure client connected:', socket.id);
  
  socket.on('disconnect', () => {
    // console.log('Client disconnected:', socket.id);
  });
});

// Start generating mock transactions
startMockTransactions(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
