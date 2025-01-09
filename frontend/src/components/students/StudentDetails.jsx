import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/students/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStudent(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching student details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudentDetails();
  }, [fetchStudentDetails]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{student.name}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Academic Information</h3>
            <p>Class: {student.standard} - {student.division}</p>
            <p>Roll No: {student.rollNo}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p>Gender: {student.gender}</p>
            <p>Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
            <p>Blood Group: {student.bloodGroup}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p>Father: {student.fathersName} ({student.fathersContactNumber})</p>
            <p>Mother: {student.mothersName} ({student.mothersContactNumber})</p>
            <p>Address: {student.address}</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Current Status</h3>
            <p className="mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                student.studentStatus.status === 'In School' 
                  ? 'bg-green-100 text-green-800'
                  : student.studentStatus.status === 'Boarded Bus'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {student.studentStatus.status}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(student.tstampStatusUpdated).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Attendance History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {student.attendance.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`px-2 py-1 rounded ${
                        record.status === 'Present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails; 