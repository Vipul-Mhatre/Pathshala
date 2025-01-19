import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import SchoolNavbar from './SchoolNavbar';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    standard: '',
    division: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      setStudents(response.data);
    } catch (error) {
      setError('Failed to fetch students');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const response = await axios.post('/students', newStudent);
      setStudents([...students, response.data.student]);
      resetForm();
      setSuccess('Student added successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add student');
      console.error('Error adding student:', error.response?.data);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/students/${editingStudent._id}`, newStudent);
      setStudents(students.map(student => (student._id === editingStudent._id ? response.data.student : student)));
      resetForm();
      setSuccess('Student updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update student');
    }
  };

  const resetForm = () => {
    setNewStudent({
      name: '',
      rollNo: '',
      standard: '',
      division: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      address: ''
    });
    setIsAddingStudent(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`/students/${studentId}`);
      setStudents(students.filter(student => student._id !== studentId));
      setSuccess('Student deleted successfully');
    } catch (error) {
      setError('Failed to delete student');
    }
  };

  const handleJsonUpload = async () => {
    try {
      setError('');
      setSuccess('');
      let studentsData;
      
      try {
        studentsData = JSON.parse(jsonInput);
      } catch (error) {
        setError('Invalid JSON format');
        return;
      }

      // If the input is an array, wrap it in an object
      if (Array.isArray(studentsData)) {
        studentsData = { students: studentsData };
      }
      // If it's neither an array nor has a students property
      else if (!studentsData.students || !Array.isArray(studentsData.students)) {
        setError('Invalid JSON format. Expected an array of students or { students: [...] }');
        return;
      }

      // Validate required fields
      const missingFields = studentsData.students.some(student => {
        return !student.name || !student.email || !student.rollNo || 
               !student.standard || !student.division || !student.gender;
      });

      if (missingFields) {
        setError('All students must have name, email, rollNo, standard, division, and gender');
        return;
      }

      const response = await axios.post('/students/bulk', studentsData);
      await fetchStudents(); // Refresh the list
      setJsonInput('');
      setSuccess(`Successfully imported ${response.data.count} students`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to import students');
      console.error('Error importing students:', error.response?.data);
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setNewStudent(student);
    } else {
      resetForm();
    }
    setIsAddingStudent(true);
  };

  return (
    <div>
      <SchoolNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
        
        {/* Success and Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Student Button and JSON Import */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => openModal()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add New Student
          </button>
          <div className="flex-1">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full p-2 border rounded"
              rows="3"
            />
            <button
              onClick={handleJsonUpload}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Import JSON
            </button>
          </div>
        </div>

        {/* Students Table */}
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Standard</th>
              <th className="border p-2">Division</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.rollNo}</td>
                <td className="border p-2">{student.standard}</td>
                <td className="border p-2">{student.division}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openModal(student)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit Student Modal */}
        {isAddingStudent && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
              <form onSubmit={editingStudent ? handleEditStudent : handleAddStudent}>
                <div className="mb-4">
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Roll No</label>
                  <input
                    type="number"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Standard</label>
                  <input
                    type="text"
                    value={newStudent.standard}
                    onChange={(e) => setNewStudent({ ...newStudent, standard: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Division</label>
                  <input
                    type="text"
                    value={newStudent.division}
                    onChange={(e) => setNewStudent({ ...newStudent, division: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newStudent.dateOfBirth}
                    onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={newStudent.contactNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, contactNumber: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">Address</label>
                  <input
                    type="text"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                    className="border rounded w-full p-2"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;