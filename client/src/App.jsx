import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import { addTransaction, logout, setTransactions } from './store/fraudSlice';
import TransactionTable from './components/TransactionTable';
import RiskChart from './components/RiskChart';
import AlertsPanel from './components/AlertsPanel';
import LoginPage from './pages/LoginPage';
import { ShieldAlert, BarChart3, List, LogOut } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auto-detects URL: Uses proxy in Dev, relative path in Prod
const socket = io();

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.fraud);

  useEffect(() => {
    // Only connect socket if authenticated
    if (isAuthenticated) {
      // Pass token in handshake
      socket.auth = { token };
      socket.connect();
      
      axios.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        dispatch(setTransactions(res.data));
      })
      .catch(err => console.error("Error fetching transactions:", err));

      socket.on('newTransaction', (transaction) => {
        dispatch(addTransaction(transaction));
      });

      socket.on('fraudAlert', (transaction) => {
        toast.error(`High Risk Alert! ₹${transaction.amount} in ${transaction.location}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      // Handle Authentication Errors
      socket.on('connect_error', (err) => {
        if (err.message.includes("Authentication error")) {
          dispatch(logout());
          toast.warn("Session expired or invalid. Please login again.");
        }
      });
    }

    return () => {
      socket.off('newTransaction');
      socket.off('fraudAlert');
      socket.off('connect_error');
      if (!isAuthenticated) socket.disconnect();
    };
  }, [dispatch, isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex flex-column bg-light">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <ToastContainer toastClassName="shadow-lg rounded-3 border-0" />
      
      <header className="dashboard-header d-flex justify-content-between align-items-center sticky-top">
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white p-2 rounded-3 me-3 shadow-sm">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="h5 fw-bold mb-0 text-dark">FraudGuard AI</h1>
            <p className="text-muted small mb-0">Live Transaction Monitoring</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-flex align-items-center text-muted small bg-light px-3 py-1 rounded-pill">
                <span className="w-2 h-2 rounded-circle bg-success me-2" style={{width:8, height:8}}></span>
                System Operational
            </div>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={() => dispatch(logout())}>
            <LogOut size={16} className="me-2" /> Logout
            </button>
        </div>
      </header>

      <main className="container-fluid px-4 pb-4 flex-grow-1">
        <div className="row g-4 h-100">
          {/* Main Stats Column */}
          <div className="col-lg-8 d-flex flex-column gap-4">
             {/* Charts Section */}
             <div className="flex-grow-0">
                <RiskChart />
             </div>
            
             {/* Table Section */}
             <div className="flex-grow-1">
                <TransactionTable />
             </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="col-lg-4">
            <div className="h-100 d-flex flex-column gap-4">
                <div className="flex-grow-1">
                    <AlertsPanel />
                </div>
                
                <div className="card border-0 p-4">
                    <h6 className="fw-bold mb-3 text-secondary text-uppercase small ls-wider">System Status</h6>
                    <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded bg-light">
                    <span className="small fw-medium">Socket Stream</span>
                    <span className="status-pill status-low">Connected</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                    <span className="small fw-medium">AI Analysis Engine</span>
                    <span className="status-pill status-low">Active</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
