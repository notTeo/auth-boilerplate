import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/pages/dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <div className="card">
          <h1>Dashboard</h1>
          <div className="dashboard-field">
            <div>
              <p className="dashboard-field-label">Email</p>
              <p className="dashboard-field-value">{user?.email}</p>
            </div>
            <div>
              <p className="dashboard-field-label">User ID</p>
              <p className="dashboard-field-value--muted">{user?.id}</p>
            </div>
            <div>
              <p className="dashboard-field-label">Email Verified</p>
              <p className="dashboard-field-value" style={{ color: user?.isVerified ? 'var(--success)' : 'var(--error)' }}>
                {user?.isVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div>
              <p className="dashboard-field-label">Member Since</p>
              <p className="dashboard-field-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
