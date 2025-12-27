import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  alerts: [],
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
};

export const fraudSlice = createSlice({
  name: 'fraud',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions = [action.payload, ...state.transactions].slice(0, 50);
      if (action.payload.riskLevel === 'High') {
        state.alerts = [action.payload, ...state.alerts].slice(0, 10);
      }
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.alerts = [];
    }
  },
});

export const { addTransaction, setTransactions, loginSuccess, logout, clearTransactions } = fraudSlice.actions;
export default fraudSlice.reducer;
