import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateSettings } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: user?.settings?.theme || 'light',
    notifications: user?.settings?.notifications || 'all',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Theme"
            value={settings.theme}
            onChange={(e) =>
              setSettings({ ...settings, theme: e.target.value })
            }
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
          />
          <Select
            label="Notifications"
            value={settings.notifications}
            onChange={(e) =>
              setSettings({ ...settings, notifications: e.target.value })
            }
            options={[
              { value: 'all', label: 'All' },
              { value: 'important', label: 'Important Only' },
              { value: 'none', label: 'None' },
            ]}
          />

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 