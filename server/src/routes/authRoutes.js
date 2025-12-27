import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Basic mock auth for demo purposes
  // In a real app, use bcrypt to hash and compare
  const user = await User.findOne({ username });
  
  if (user && user.password === password) {
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'User already exists' });
  }
});

export default router;
