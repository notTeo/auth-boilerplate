import Navbar from '../components/Navbar'
import '../styles/pages/plans.css'

export default function PlansPage() {
  return (
    <div className="dashboard-layout">
    <Navbar />
    <div className="plans-page">
      <h1 className="plans-title">Plans</h1>

      <div className="plans-grid">
        {/* Free Plan */}
        <div className="card plan-card">
          <h2 className="plan-name">Free</h2>
          <p className="plan-price">€0 / month</p>

          <ul className="plan-features">
            <li>Basic authentication (login / register)</li>
            <li>JWT access tokens</li>
            <li>Refresh token support</li>
            <li>Email verification (dummy)</li>
            <li>Single environment setup</li>
          </ul>

          <button className="btn btn-ghost" disabled>
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card plan-card plan-card--pro">
          <h2 className="plan-name">Pro</h2>
          <p className="plan-price">€19 / month</p>

          <ul className="plan-features">
            <li>Everything in Free</li>
            <li>Role-based access control</li>
            <li>OAuth providers (Google, GitHub)</li>
            <li>Advanced session management</li>
            <li>Audit logs & security events</li>
            <li>Production-ready auth setup</li>
          </ul>

          <button className="btn btn-primary">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}