import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuperuserDashboard = () => {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/api/schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div>
      <h2>Superuser Dashboard</h2>
      <h3>Schools</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school._id}>
              <td>{school.schoolName}</td>
              <td>{school.email}</td>
              <td>
                <button onClick={() => {/* Navigate to school details */}}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperuserDashboard; 