import { Link } from 'react-router-dom';
import { Target, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import './header.css';

export default function Header({ showSignUp = false, showLogout = false, onLogout }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <div className="header-logo-icon">
            <Target className="icon" />
          </div>
          <span className="header-logo-text">ProjectFlow</span>
        </Link>

        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
          </button>

          {showSignUp && (
            <Link to="/signin" className="header-signup-button">
              Sign Up
            </Link>
          )}

          {showLogout && (
  <button
    onClick={onLogout}
    className="header-signup-button"
    type="button"
  >
    Log out
  </button>
)}
        </div>
      </div>
    </header>
  );
}
