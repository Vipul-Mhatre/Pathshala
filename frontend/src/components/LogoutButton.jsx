import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    navigate('/');
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

export default LogoutButton; 