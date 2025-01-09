import React, { useState, useEffect } from "react";
import API from "../api/api";
import LogoutButton from './LogoutButton';

const Dashboard = ({ userRole, setUserRole }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        
        // Set endpoint based on user role
        if (userRole === 'school') {
          endpoint = '/schools/profile';
        } else if (userRole === 'superuser') {
          endpoint = '/superuser/profile';
        }

        if (endpoint) {
          const { data } = await API.get(endpoint);
          setData(data);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
        // Don't logout on 404, only on auth errors (401)
        if (err.response?.status === 401) {
          setUserRole(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, setUserRole]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl">
            Dashboard ({userRole})
          </h1>
          <LogoutButton setUserRole={setUserRole} />
        </div>
      </nav>
      
      <div className="p-4">
        {data && (
          <div>
            <h2 className="text-xl font-bold mb-4">Profile Information</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;