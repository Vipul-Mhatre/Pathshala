import React, { useEffect, useState } from "react";
import API from "../api/api";
import LogoutButton from './LogoutButton';

const Dashboard = ({ setUserRole }) => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/superuser/schools", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSchools(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch schools");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl">Dashboard</h1>
          <LogoutButton setUserRole={setUserRole} />
        </div>
      </nav>
      
      <h1>Superuser Dashboard</h1>
      <h2>Schools</h2>
      <ul>
        {schools.map((school) => (
          <li key={school._id}>{school.schoolName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;