import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const LogoutButton = ({ setUserType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUserType(null);
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

LogoutButton.propTypes = {
  setUserType: PropTypes.func.isRequired
};

export default LogoutButton; 