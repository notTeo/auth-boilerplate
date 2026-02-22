import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="page" style={{ flex: 1, justifyContent: 'flex-start', paddingTop: '3rem' }}>
        <div className="card">
          <h1>Dashboard</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email</p>
              <p style={{ fontWeight: 600 }}>{user?.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>User ID</p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-all', color: 'var(--text-muted)' }}>{user?.id}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email Verified</p>
              <p style={{ fontWeight: 600, color: user?.isVerified ? 'var(--success)' : 'var(--error)' }}>
                {user?.isVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Member Since</p>
              <p style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
