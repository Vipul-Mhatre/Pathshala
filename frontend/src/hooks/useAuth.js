import { create } from 'zustand';
import { schoolAPI, superuserAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();

  const login = async (credentials) => {
    try {
      // Try superuser login first
      try {
        const { data } = await superuserAPI.login(credentials);
        const userData = {
          ...data.user,
          role: 'superuser',
          token: data.token,
        };
        setUser(userData);
        localStorage.setItem('token', data.token);
        return userData;
      } catch (error) {
        // If superuser login fails, try school login
        const { data } = await schoolAPI.login(credentials);
        const userData = {
          ...data.school,
          role: 'school',
          token: data.token,
        };
        setUser(userData);
        localStorage.setItem('token', data.token);
        return userData;
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      if (user.role === 'superuser') {
        const response = await superuserAPI.updateProfile(data);
        setUser({ ...user, ...response.data.user });
      } else {
        const response = await schoolAPI.updateProfile(data);
        setUser({ ...user, ...response.data.school });
      }
    } catch (error) {
      throw error;
    }
  };

  const updateSettings = async (settings) => {
    try {
      if (user.role === 'superuser') {
        const response = await superuserAPI.updateSettings(settings);
        setUser({ ...user, settings: response.data.settings });
      } else {
        const response = await schoolAPI.updateSettings(settings);
        setUser({ ...user, settings: response.data.settings });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
  };

  return {
    user,
    login,
    logout: handleLogout,
    updateProfile,
    updateSettings,
  };
} 