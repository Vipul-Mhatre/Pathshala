import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const LogoutButton = ({ setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.clear();
      
      if (typeof setUserRole === 'function') {
        setUserRole(null);
      }
      
      // Force redirect to login page with full URL
      window.location.href = 'http://localhost:3000/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      type="button"
    >
      Logout
    </button>
  );
};

LogoutButton.propTypes = {
  setUserRole: PropTypes.func.isRequired
};

export default LogoutButton; 