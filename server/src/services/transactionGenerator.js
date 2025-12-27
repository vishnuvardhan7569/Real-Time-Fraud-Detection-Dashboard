import { analyzeTransaction } from './aiService.js';
import Transaction from '../models/Transaction.js';

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
  setInterval(async () => {
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
      
      // console.log(`Generated: ${savedTransaction.location} - ₹${savedTransaction.amount}`);
      
      // Emit to all connected clients
      io.emit('newTransaction', savedTransaction);
      
      if (savedTransaction.riskLevel === 'High') {
        io.emit('fraudAlert', savedTransaction);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }, 10000); // Generate every 10 seconds
};
