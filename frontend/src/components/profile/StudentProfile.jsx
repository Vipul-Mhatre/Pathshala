import { useState, useEffect } from 'react';
import API from '../../api/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/students/profile');
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>No profile data found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <p className="mt-1">{profile.rollNo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Standard</label>
            <p className="mt-1">{profile.standard}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Division</label>
            <p className="mt-1">{profile.division}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 