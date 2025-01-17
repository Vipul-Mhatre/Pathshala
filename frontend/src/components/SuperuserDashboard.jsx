import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const SuperuserDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [editingSchool, setEditingSchool] = useState(null);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [newSchool, setNewSchool] = useState({
    schoolName: '',
    email: '',
    password: '',
    address: '',
    contactNumber: ''
  });

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to fetch schools');
      }
    };

    fetchSchools();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('schoolName');
    navigate('/login');
  };

  const handleEditSchool = (school) => {
    setEditingSchool({ ...school });
  };

  const handleUpdateSchool = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/schools/${editingSchool._id}`, editingSchool);
      
      setSchools(schools.map(school => 
        school._id === editingSchool._id ? response.data.school : school
      ));

      setEditingSchool(null);
    } catch (error) {
      console.error('Error updating school:', error);
      setError('Failed to update school');
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await axios.delete(`/schools/${schoolId}`);
        
        setSchools(schools.filter(school => school._id !== schoolId));
      } catch (error) {
        console.error('Error deleting school:', error);
        setError('Failed to delete school');
      }
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validate inputs
      if (!newSchool.email || !newSchool.password || !newSchool.schoolName || 
          !newSchool.address || !newSchool.contactNumber) {
        setError('All fields are required');
        return;
      }

      // Password validation
      if (newSchool.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const response = await axios.post('/schools', newSchool);
      setSchools([...schools, response.data.school]);
      setIsAddingSchool(false);
      setNewSchool({
        schoolName: '',
        email: '',
        password: '',
        address: '',
        contactNumber: ''
      });
    } catch (error) {
      console.error('Error adding school:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg || 
        'Failed to add school'
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registered Schools</h1>
      
      <button 
        onClick={handleLogout} 
        className="fixed top-4 right-4 mb-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Logout
      </button>

      <button 
        onClick={() => setIsAddingSchool(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New School
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border">School Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Contact Number</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school._id}>
              <td className="px-4 py-2 border">{school.schoolName}</td>
              <td className="px-4 py-2 border">{school.email}</td>
              <td className="px-4 py-2 border">{school.address}</td>
              <td className="px-4 py-2 border">{school.contactNumber}</td>
              <td className="px-4 py-2 border">
                <button 
                  onClick={() => handleEditSchool(school)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteSchool(school._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add School Modal */}
      {isAddingSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New School</h2>
            <form onSubmit={handleAddSchool}>
              <div className="mb-4">
                <label className="block mb-2">School Name</label>
                <input
                  type="text"
                  value={newSchool.schoolName}
                  onChange={(e) => setNewSchool({...newSchool, schoolName: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={newSchool.email}
                  onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Password</label>
                <input
                  type="password"
                  value={newSchool.password}
                  onChange={(e) => setNewSchool({...newSchool, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Contact Number</label>
                <input
                  type="text"
                  value={newSchool.contactNumber}
                  onChange={(e) => setNewSchool({...newSchool, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setIsAddingSchool(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit School Modal */}
      {editingSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit School</h2>
            <form onSubmit={handleUpdateSchool}>
              <div className="mb-4">
                <label className="block mb-2">School Name</label>
                <input
                  type="text"
                  value={editingSchool.schoolName}
                  onChange={(e) => setEditingSchool({...editingSchool, schoolName: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={editingSchool.email}
                  onChange={(e) => setEditingSchool({...editingSchool, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Address</label>
                <input
                  type="text"
                  value={editingSchool.address}
                  onChange={(e) => setEditingSchool({...editingSchool, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Contact Number</label>
                <input
                  type="text"
                  value={editingSchool.contactNumber}
                  onChange={(e) => setEditingSchool({...editingSchool, contactNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperuserDashboard; 