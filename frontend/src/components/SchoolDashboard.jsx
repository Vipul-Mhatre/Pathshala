import React, { useEffect, useState } from "react";
import API from "../api/api";

const SchoolDashboard = () => {
  const [data, setData] = useState({ studentCount: 0, busCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/school/dashboard");
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>School Dashboard</h1>
      <p>Students: {data.studentCount}</p>
      <p>Buses: {data.busCount}</p>
    </div>
  );
};

export default SchoolDashboard;