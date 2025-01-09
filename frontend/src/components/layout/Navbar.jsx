import { useNavigate } from 'react-router-dom';
import LogoutButton from '../LogoutButton';

const Navbar = () => {
  const navigate = useNavigate();
  const schoolName = localStorage.getItem('schoolName');

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{schoolName}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-800"
          >
            Settings
          </button>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 