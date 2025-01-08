import React from 'react';
import { Route, Router } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ManageStudents from './components/ManageStudents';
import ManageBuses from './components/ManageBuses';
import AttendanceTracking from './components/AttendanceTracking';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/manage-students" component={ManageStudents} />
      <Route path="/manage-buses" component={ManageBuses} />
      <Route path="/attendance-tracking" component={AttendanceTracking} />
    </Router>
  );
};

export default App;