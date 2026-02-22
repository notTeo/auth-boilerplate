import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="hero">
        <h1>Welcome to the<br /><span>Auth Boilerplate</span></h1>
        <p>A production-ready authentication starter with JWT, refresh tokens, email verification, OAuth and password reset.</p>
        <div className="hero-actions">
          <Link to="/register">
            <button className="btn btn-primary">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-ghost">Login</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
