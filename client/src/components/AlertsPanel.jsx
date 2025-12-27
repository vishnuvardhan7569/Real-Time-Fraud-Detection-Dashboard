import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, Clock } from 'lucide-react';

const AlertsPanel = () => {
  const alerts = useSelector((state) => state.fraud.alerts);

  return (
    <div className="card border-0 h-100" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fef2f2 100%)' }}>
      <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
        <h5 className="card-title text-danger d-flex align-items-center mb-0">
          <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
             <AlertTriangle size={20} />
          </div>
          High Risk Alerts
        </h5>
      </div>
      <div className="card-body px-3">
        <div className="d-flex flex-column gap-3">
          {alerts.length === 0 ? (
            <div className="text-center text-muted py-5">
              <p className="mb-0">No active threats detected.</p>
              <small>System is monitoring...</small>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className="alert-card p-3 rounded shadow-sm">
                <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                  <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20">
                    {alert.userId}
                  </span>
                  <span className="fw-bold text-dark">₹{alert.amount.toLocaleString('en-IN')}</span>
                </div>
                <p className="mb-2 small text-secondary lh-sm">{alert.reason}</p>
                <div className="d-flex align-items-center text-muted small">
                  <Clock size={12} className="me-1" />
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
