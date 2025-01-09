import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("school");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = role === "superuser" ? "/superuser/login" : "/schools/login";
      const { data } = await API.post(endpoint, { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);
      setUserRole(role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex gap-4 justify-center mb-4">
            <button
              type="button"
              onClick={() => setRole("school")}
              className={`px-4 py-2 rounded ${
                role === "school" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              School Login
            </button>
            <button
              type="button"
              onClick={() => setRole("superuser")}
              className={`px-4 py-2 rounded ${
                role === "superuser" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Super Admin Login
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;