import { useState, useEffect } from 'react';
import API from '../../api/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userType = localStorage.getItem('userType');
        const response = await API.get(`/${userType}/profile`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow p-4">
        {profile && (
          <div className="space-y-4">
            <p><span className="font-medium">Name:</span> {profile.name}</p>
            <p><span className="font-medium">Email:</span> {profile.email}</p>
            {/* Add more profile fields based on user type */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 