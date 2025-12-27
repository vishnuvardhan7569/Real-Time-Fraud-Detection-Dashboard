import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  device: { type: String },
  ipAddress: { type: String },
  fraudRiskScore: { type: Number, default: 0 },
  riskLevel: { type: String, default: 'Low' },
  reason: { type: String }
});

export default mongoose.model('Transaction', TransactionSchema);
