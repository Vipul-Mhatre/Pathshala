import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">School Dashboard</h1>
      </div>
      
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`
          }
          end
        >
          Overview
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`
          }
        >
          Students
        </NavLink>

        <NavLink
          to="/buses"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`
          }
        >
          Buses
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`
          }
        >
          Attendance
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md ${
              isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`
          }
        >
          School Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar; 