import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const userType = localStorage.getItem('userType');

  const getSidebarItems = () => {
    switch (userType) {
      case 'superuser':
        return (
          <>
            <NavLink to="/dashboard">Overview</NavLink>
            <NavLink to="/schools">Manage Schools</NavLink>
            <NavLink to="/reports">System Reports</NavLink>
            <NavLink to="/settings">System Settings</NavLink>
          </>
        );
      
      case 'school':
        return (
          <>
            <NavLink to="/dashboard">Overview</NavLink>
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/buses">Buses</NavLink>
            <NavLink to="/attendance">Attendance</NavLink>
            <NavLink to="/profile">School Profile</NavLink>
          </>
        );
      
      case 'student':
        return (
          <>
            <NavLink to="/dashboard">Overview</NavLink>
            <NavLink to="/attendance">My Attendance</NavLink>
            <NavLink to="/bus-tracking">Bus Tracking</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          {userType === 'superuser' ? 'Admin Dashboard' :
           userType === 'school' ? 'School Dashboard' :
           'Student Portal'}
        </h1>
      </div>
      <nav className="space-y-2">
        {getSidebarItems()}
      </nav>
    </div>
  );
};

export default Sidebar; 