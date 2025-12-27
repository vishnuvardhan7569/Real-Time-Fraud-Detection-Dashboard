import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key'
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeTransaction = async (transaction) => {
  const prompt = `
    Analyze this e-commerce transaction for potential fraud in the Indian context.
    Transaction Details:
    - Amount: ₹${transaction.amount}
    - Location: ${transaction.location}
    - Category: ${transaction.category}
    - Device: ${transaction.device}
    - IP: ${transaction.ipAddress}

    Response must be ONLY a valid JSON object with:
    {
      "fraudRiskScore": (0-100),
      "riskLevel": ("Low", "Medium", or "High"),
      "reason": "short explanation"
    }
  `;

  // Helper to parse JSON from markdown
  const extractJSON = (text) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  };

  // 1. Try Groq (Llama 3.1)
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are a fraud detection AI. Respond ONLY with valid JSON.' },
            { role: 'user', content: prompt }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1,
        response_format: { type: 'json_object' }
    });

    const content = chatCompletion.choices[0]?.message?.content;
    const data = JSON.parse(content);

    if (data) {
      // console.log(`✅ [GROQ AI] Analyzed Tx: ₹${transaction.amount} -> Risk: ${data.fraudRiskScore}`);
      return { ...data, reason: `[Groq] ${data.reason}` };
    }

  } catch (errGroq) {
      // console.warn(`⚠️ Groq AI Failed: ${errGroq.message}. Using Fallback.`);
      // Proceed to fallback
  }

  // 2. Fallback Logic (Rule-Based)
  let score = 5;
  let risk = 'Low';
  let reason = 'Normal transaction pattern.';

  if (transaction.amount > 40000) {
      score = 85;
      risk = 'High';
      reason = 'High value transaction detected (Rule-based).';
  } else if (transaction.amount > 15000 && transaction.device === 'Unknown Device') {
      score = 60;
      risk = 'Medium';
      reason = 'Moderate value on unknown device.';
  }

  return {
    fraudRiskScore: score,
    riskLevel: risk,
    reason: `[Fallback] ${reason}`
  };
};