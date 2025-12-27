import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const TransactionTable = () => {
  const transactions = useSelector((state) => state.fraud.transactions);

  const getRiskBadgeClass = (level) => {
    switch (level) {
      case 'High': return 'status-pill status-high';
      case 'Medium': return 'status-pill status-medium';
      case 'Low': return 'status-pill status-low';
      default: return 'status-pill bg-secondary text-white';
    }
  };

  return (
    <div className="card h-100">
      <div className="card-header bg-white border-0 py-3 px-4">
        <h5 className="card-title mb-0">Live Transactions</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th className="ps-4">Time</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Location</th>
              <th>Risk Score</th>
              <th className="pe-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td className="ps-4 text-muted font-monospace">{format(new Date(tx.timestamp), 'HH:mm:ss')}</td>
                <td className="fw-semibold">{tx.userId}</td>
                <td className="fw-bold text-dark">₹{tx.amount.toLocaleString('en-IN')}</td>
                <td><span className="badge bg-light text-dark border">{tx.category}</span></td>
                <td className="text-muted small">{tx.location}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className={`fw-bold ${tx.fraudRiskScore > 80 ? 'text-danger' : 'text-dark'}`}>
                      {tx.fraudRiskScore}
                    </span>
                    <div className="progress ms-2" style={{ width: '50px', height: '4px' }}>
                      <div 
                        className={`progress-bar ${tx.fraudRiskScore > 80 ? 'bg-danger' : tx.fraudRiskScore > 40 ? 'bg-warning' : 'bg-success'}`} 
                        style={{ width: `${tx.fraudRiskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="pe-4">
                  <span className={getRiskBadgeClass(tx.riskLevel)}>
                    <span className="rounded-circle me-1" style={{width: '6px', height: '6px', backgroundColor: 'currentColor'}}></span>
                    {tx.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
