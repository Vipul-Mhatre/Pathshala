import { Link } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

const Navbar = ({ userType, setUserType }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">School Bus Tracker</Link>
        
        <div className="flex items-center space-x-4">
          {userType === 'superuser' && (
            <>
              <Link to="/schools" className="hover:text-gray-300">Schools</Link>
            </>
          )}
          
          {userType === 'school' && (
            <>
              <Link to="/students" className="hover:text-gray-300">Students</Link>
              <Link to="/buses" className="hover:text-gray-300">Buses</Link>
              <Link to="/attendance" className="hover:text-gray-300">Attendance</Link>
            </>
          )}
          
          {userType === 'student' && (
            <>
              <Link to="/attendance" className="hover:text-gray-300">My Attendance</Link>
              <Link to="/bus-tracking" className="hover:text-gray-300">Bus Location</Link>
            </>
          )}
          
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
          <LogoutButton setUserType={setUserType} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 