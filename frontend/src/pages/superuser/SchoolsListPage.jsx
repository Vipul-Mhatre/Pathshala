import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/20/solid';
import { superuserAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { SearchInput } from '../../components/common/SearchInput';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { toast } from 'react-hot-toast';

export default function SchoolsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['schools', page, search],
    () => superuserAPI.getAllSchools({ page, search })
  );

  const columns = [
    {
      header: 'School Name',
      accessorKey: 'schoolName',
      cell: (value, school) => (
        <Link
          to={`/superuser/schools/${school.id}`}
          className="text-primary-600 hover:text-primary-900"
        >
          {value}
        </Link>
      ),
    },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Contact Number', accessorKey: 'contactNumber' },
    { header: 'Address', accessorKey: 'address' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description="View and manage all schools"
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="-ml-1.5 mr-1 h-5 w-5" aria-hidden="true" />
            Add School
          </Button>
        }
      />

      <div className="flex justify-end">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search schools..."
          className="w-72"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.schools || []}
            emptyMessage="No schools found"
          />

          {data?.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {isCreateModalOpen && (
        <CreateSchoolModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

function CreateSchoolModal({ open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await superuserAPI.createSchool(formData);
      toast.success('School created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create school');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create New School">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="School Name"
          value={formData.schoolName}
          onChange={(e) =>
            setFormData({ ...formData, schoolName: e.target.value })
          }
          error={errors.schoolName}
          required
        />
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          type="password"
          label="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
          helperText="Password must be at least 8 characters long"
          required
        />
        <Input
          label="Contact Number"
          value={formData.contactNumber}
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
          error={errors.contactNumber}
          helperText="Enter a 10-digit phone number"
          required
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
          required
        />

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create School
          </Button>
        </div>
      </form>
    </Modal>
  );
} 