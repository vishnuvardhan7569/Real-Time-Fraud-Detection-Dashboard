import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/fraudSlice';
import axios from 'axios';
import { ShieldCheck, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(endpoint, {
        username,
        password
      });

      if (isRegistering) {
        // Auto login after register or ask to login
        setIsRegistering(false);
        setError('Registration successful! Please login.');
      } else {
        dispatch(loginSuccess({ token: response.data.token, username }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 className="h4">{isRegistering ? 'Create Account' : 'Welcome Back'}</h3>
          <p className="text-muted small">FraudGuard AI Dashboard</p>
        </div>

        {error && <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-danger'} py-2 small`}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><User size={18} /></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><Lock size={18} /></span>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-3">
          <button 
            className="btn btn-link text-decoration-none small"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
