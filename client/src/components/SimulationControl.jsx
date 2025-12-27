import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Pause, Activity, RotateCcw, Zap, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SimulationControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, transactions } = useSelector((state) => state.fraud);

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

  const triggerFraud = async () => {
    try {
        await axios.post('/api/simulation/trigger-fraud', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.warning("Simulating Fraud Attack!");
    } catch (err) {
        toast.error("Failed to trigger attack");
    }
  };

  const resetDatabase = async () => {
    if (!window.confirm("Are you sure? This will delete ALL transaction history.")) return;
    
    try {
        const res = await axios.post('/api/simulation/reset', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(res.data.message);
    } catch (err) {
        toast.error("Failed to reset database");
        console.error(err);
    }
  };

  const exportCSV = () => {
    if (!transactions || transactions.length === 0) {
        toast.info("No data to export.");
        return;
    }

    const headers = ["ID", "Timestamp", "Location", "Category", "Amount (INR)", "Risk Score", "Risk Level", "Device", "IP"];
    
    const csvRows = [
        headers.join(','), // Header row
        ...transactions.map(t => {
            const date = new Date(t.timestamp).toLocaleString().replace(/,/g, '');
            // Escape values to prevent CSV breakages
            const clean = (val) => `"${String(val).replace(/"/g, '""')}"`;
            
            return [
                clean(t._id),
                clean(date),
                clean(t.location),
                clean(t.category),
                clean(t.amount),
                clean(t.fraudRiskScore),
                clean(t.riskLevel),
                clean(t.device),
                clean(t.ipAddress)
            ].join(',');
        })
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fraud_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report downloaded successfully!");
  };

  return (
    <div className="card border-0 p-4 mb-4">
      <h6 className="fw-bold mb-3 text-secondary text-uppercase small ls-wider">Simulation Control</h6>
      
      <div className="d-flex flex-column gap-3">
        {/* Status & Toggle */}
        <div className="d-flex align-items-center justify-content-between p-3 rounded bg-light border">
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

        {/* Action Buttons Row */}
        <div className="d-flex gap-2">
            <button 
                onClick={triggerFraud}
                className="btn btn-sm btn-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-bold"
                title="Force a High Risk Transaction"
            >
                <Zap size={16} /> Simulate Attack
            </button>

            <button 
                onClick={resetDatabase}
                className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                title="Clear all history"
            >
                <RotateCcw size={16} /> Reset DB
            </button>
        </div>

        {/* Export Button */}
        <button 
            onClick={exportCSV}
            className="btn btn-sm btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
        >
            <Download size={16} /> Download Report (CSV)
        </button>
      </div>
    </div>
  );
};

export default SimulationControl;
