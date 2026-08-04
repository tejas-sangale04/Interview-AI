import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Features/auth/hooks/useauth';
import '../style/navbar.scss';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    // If on dashboard or interview page, stay on dashboard
    if (location.pathname.includes('/dashboard') || location.pathname.includes('/interview')) {
      return;
    }
    // Otherwise go to home page
    navigate('/');
  };

  return (
    <div className="top-bar">
      {/* Logo on left */}
      <div className="logo-section" onClick={handleLogoClick} style={{ cursor: location.pathname.includes('/dashboard') || location.pathname.includes('/interview') ? 'default' : 'pointer' }}>
        <img src="/logoo.png" alt="Interview AI Logo" className="logo-icon" />
        <span className="logo-text">Interview AI</span>
      </div>

      {/* Profile on right */}
      <div className="profile-section">
        {user ? (
          <div className="profile-info">
            <span className="user-name">{user.username}</span>
            <button className="logout-btn" onClick={handleLogoutClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 8 20 12 16 16"></polyline>
                <line x1="12" y1="12" x2="20" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
