import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SuperuserLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
} 