import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { superuserAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';

export default function SchoolDetailsPage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const { data: school, isLoading, refetch } = useQuery(
    ['school', id],
    () => superuserAPI.getSchoolDetails(id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">School not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={school.schoolName}
        description="View and manage school details"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="white"
              onClick={() => setIsResetPasswordModalOpen(true)}
            >
              Reset Password
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>
              Edit School
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                School Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.schoolName}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Contact Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.contactNumber}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.address}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Total Students
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.stats.studentCount}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Total Buses
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.stats.busCount}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Average Attendance
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {school.stats.averageAttendance}%
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {isEditModalOpen && (
        <EditSchoolModal
          school={school}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={refetch}
        />
      )}

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          schoolId={school.id}
          open={isResetPasswordModalOpen}
          onClose={() => setIsResetPasswordModalOpen(false)}
        />
      )}
    </div>
  );
}

function EditSchoolModal({ school, open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: school.schoolName,
    email: school.email,
    contactNumber: school.contactNumber,
    address: school.address,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await superuserAPI.updateSchool(school.id, formData);
      toast.success('School updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update school');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit School">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="School Name"
          value={formData.schoolName}
          onChange={(e) =>
            setFormData({ ...formData, schoolName: e.target.value })
          }
          required
        />
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          required
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update School
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ schoolId, open, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await superuserAPI.resetSchoolPassword(schoolId, { newPassword });
      toast.success('Password reset successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Reset School Password" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Reset Password
          </Button>
        </div>
      </form>
    </Modal>
  );
} 