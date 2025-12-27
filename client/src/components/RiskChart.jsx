import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RiskChart = () => {
  const transactions = useSelector((state) => state.fraud.transactions);
  
  const data = {
    labels: transactions.slice(0, 20).reverse().map(tx => new Date(tx.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Fraud Risk Score',
        data: transactions.slice(0, 20).reverse().map(tx => tx.fraudRiskScore),
        borderColor: '#4f46e5', // Indigo 600
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        tension: 0.4, // Smooth curves
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false, // Hide time labels for cleaner look (optional)
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#f3f4f6',
        },
        border: {
          display: false,
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="card p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
         <h5 className="card-title mb-0">Risk Trend Analysis</h5>
         <span className="badge bg-light text-primary border">Last 20 Transactions</span>
      </div>
      <div style={{ height: '300px' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default RiskChart;
