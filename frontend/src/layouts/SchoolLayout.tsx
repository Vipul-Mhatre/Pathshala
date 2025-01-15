import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SchoolLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 