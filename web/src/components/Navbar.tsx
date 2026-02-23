import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/navbar.css';

export default function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    closeMenu();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>AuthBoilerplate</Link>

      {/* Desktop nav links */}
      <div className="navbar-links">
        <Link to="/plans" className="navbar-link">Plans</Link>
        <Link to="/about" className="navbar-link">About</Link>
      </div>

      {/* Desktop auth actions */}
      <div className="navbar-actions">
        {!isLoading && (
          isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <button className="btn btn-ghost">Dashboard</button>
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Register</button>
              </Link>
            </>
          )
        )}
      </div>

      {/* Hamburger button - mobile only */}
      <button
        className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/plans" className="navbar-link" onClick={closeMenu}>Plans</Link>
          <Link to="/about" className="navbar-link" onClick={closeMenu}>About</Link>
          <div className="navbar-mobile-divider" />
          {!isLoading && (
            isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}>
                  <button className="btn btn-ghost">Dashboard</button>
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <button className="btn btn-ghost">Login</button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <button className="btn btn-primary">Register</button>
                </Link>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}
