import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/navbar.css';

export default function Navbar() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">AuthBoilerplate</Link>
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
    </nav>
  );
}
