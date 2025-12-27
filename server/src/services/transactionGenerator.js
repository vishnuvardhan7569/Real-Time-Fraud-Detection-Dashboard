import { analyzeTransaction } from './aiService.js';
import Transaction from '../models/Transaction.js';

let intervalId = null;
let isRunning = false;

const generateMockTransaction = () => {
  const amount = Math.floor(Math.random() * 50000) + 500; // ₹500 to ₹50,000
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Luxury', 'Services', 'Groceries'];
  const locations = [
    'Bengaluru, Karnataka', 
    'Chennai, Tamil Nadu', 
    'Hyderabad, Telangana', 
    'Kochi, Kerala', 
    'Mysore, Karnataka', 
    'Coimbatore, Tamil Nadu', 
    'Trivandrum, Kerala', 
    'Visakhapatnam, Andhra Pradesh',
    'Madurai, Tamil Nadu',
    'Vijayawada, Andhra Pradesh'
  ];
  
  return {
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    amount,
    category: categories[Math.floor(Math.random() * categories.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(),
    device: Math.random() > 0.8 ? 'Unknown Device' : 'Mobile App',
    ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  };
};

export const startMockTransactions = (io) => {
  if (isRunning) return; // Prevent duplicate intervals

  console.log('Starting transaction simulation...');
  isRunning = true;
  
  // Create the interval function
  const runSimulation = async () => {
    const rawTransaction = generateMockTransaction();
    
    // Analyze with AI
    const analysis = await analyzeTransaction(rawTransaction);
    
    const fullTransaction = {
      ...rawTransaction,
      ...analysis
    };

    // Save to MongoDB
    try {
      const savedTransaction = await new Transaction(fullTransaction).save();
      
      // Emit to all connected clients
      if (io) {
        io.emit('newTransaction', savedTransaction);
        
        if (savedTransaction.riskLevel === 'High') {
          io.emit('fraudAlert', savedTransaction);
        }
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  // Run immediately then set interval
  // runSimulation(); // Optional: run one immediately
  intervalId = setInterval(runSimulation, 10000); // Generate every 10 seconds
};

export const stopMockTransactions = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  console.log('Transaction simulation stopped.');
};

export const triggerFraudTransaction = async (io) => {
    console.log("Triggering manual fraud attack...");
    const rawTransaction = {
        userId: `hacker_${Math.floor(Math.random() * 99)}`,
        amount: Math.floor(Math.random() * 50000) + 95000, // ₹95,000 - ₹1,45,000
        category: 'Electronics', // High value target
        location: 'Unknown Location (VPN)',
        timestamp: new Date(),
        device: 'Rooted Device / Emulator',
        ipAddress: '192.168.0.1 (Tor Exit Node)'
    };

    // Analyze with AI
    const analysis = await analyzeTransaction(rawTransaction);
    
    // Force High Risk if AI misses it (for demo reliability)
    if (analysis.riskLevel !== 'High') {
        analysis.fraudRiskScore = 95;
        analysis.riskLevel = 'High';
        analysis.reason = '[Demo Override] High value transaction from suspicious IP.';
    }

    const fullTransaction = { ...rawTransaction, ...analysis };

    try {
        const savedTransaction = await new Transaction(fullTransaction).save();
        if (io) {
            io.emit('newTransaction', savedTransaction);
            io.emit('fraudAlert', savedTransaction);
        }
        return savedTransaction;
    } catch (error) {
        console.error('Error generating fraud:', error);
        return null;
    }
};

export const getSimulationStatus = () => isRunning;
