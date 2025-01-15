import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../components/common/Layout';

export default function SuperuserLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
} 