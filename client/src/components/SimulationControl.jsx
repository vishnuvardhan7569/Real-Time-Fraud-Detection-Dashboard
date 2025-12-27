import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, Activity } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SimulationControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.fraud);

  useEffect(() => {
    fetchStatus();
    // Poll status every 5 seconds to keep UI in sync
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/simulation/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsRunning(res.data.status);
    } catch (err) {
      console.error("Failed to fetch simulation status", err);
    }
  };

  const toggleSimulation = async () => {
    setLoading(true);
    try {
      const endpoint = isRunning ? '/api/simulation/stop' : '/api/simulation/start';
      const res = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsRunning(res.data.status);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to change simulation state");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 p-4 mb-4">
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small ls-wider">Simulation Control</h6>
      
      <div className="d-flex align-items-center justify-content-between mb-3 p-3 rounded bg-light border">
        <div className="d-flex align-items-center">
            <Activity className={`me-2 ${isRunning ? 'text-success' : 'text-muted'}`} size={20} />
            <div>
                <div className="fw-bold text-dark">{isRunning ? 'Running' : 'Paused'}</div>
                <div className="small text-muted">{isRunning ? 'Generating transactions...' : 'System idle'}</div>
            </div>
        </div>
        
        <button 
            onClick={toggleSimulation} 
            disabled={loading}
            className={`btn btn-sm ${isRunning ? 'btn-outline-warning' : 'btn-success'} d-flex align-items-center gap-2`}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : isRunning ? (
                <><Pause size={16} /> Pause</>
            ) : (
                <><Play size={16} /> Start</>
            )}
        </button>
      </div>
    </div>
  );
};

export default SimulationControl;
