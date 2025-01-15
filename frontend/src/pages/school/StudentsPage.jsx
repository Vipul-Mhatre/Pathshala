import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/20/solid';
import { schoolAPI, studentAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { toast } from 'react-hot-toast';

const standardOptions = [
  { value: '', label: 'All Standards' },
  { value: '1', label: 'Standard 1' },
  { value: '2', label: 'Standard 2' },
  { value: '3', label: 'Standard 3' },
  { value: '4', label: 'Standard 4' },
  { value: '5', label: 'Standard 5' },
  { value: '6', label: 'Standard 6' },
  { value: '7', label: 'Standard 7' },
  { value: '8', label: 'Standard 8' },
  { value: '9', label: 'Standard 9' },
  { value: '10', label: 'Standard 10' },
];

const divisionOptions = [
  { value: '', label: 'All Divisions' },
  { value: 'A', label: 'Division A' },
  { value: 'B', label: 'Division B' },
  { value: 'C', label: 'Division C' },
  { value: 'D', label: 'Division D' },
];

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [standard, setStandard] = useState('');
  const [division, setDivision] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['students', page, search, standard, division],
    () => schoolAPI.getStudents({ page, search, standard, division })
  );

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (value, student) => (
        <Link
          to={`/school/students/${student.id}`}
          className="text-primary-600 hover:text-primary-900"
        >
          {value}
        </Link>
      ),
    },
    { header: 'Roll Number', accessorKey: 'rollNumber' },
    { header: 'Standard', accessorKey: 'standard' },
    { header: 'Division', accessorKey: 'division' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => (
        <Badge
          variant={
            value === 'active'
              ? 'green'
              : value === 'inactive'
              ? 'red'
              : 'yellow'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="View and manage all students"
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="-ml-1.5 mr-1 h-5 w-5" aria-hidden="true" />
            Add Student
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Select
          label="Standard"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
          options={standardOptions}
        />
        <Select
          label="Division"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          options={divisionOptions}
        />
        <div className="sm:col-span-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search students..."
            className="w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={data?.students || []}
            emptyMessage="No students found"
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
        <CreateStudentModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

function CreateStudentModal({ open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    standard: '',
    division: '',
    deviceID: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await studentAPI.createStudent(formData);
      toast.success('Student created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Student">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Roll Number"
          value={formData.rollNumber}
          onChange={(e) =>
            setFormData({ ...formData, rollNumber: e.target.value })
          }
          required
        />
        <Select
          label="Standard"
          value={formData.standard}
          onChange={(e) =>
            setFormData({ ...formData, standard: e.target.value })
          }
          options={[
            { value: '', label: 'Select Standard' },
            { value: '1', label: 'Standard 1' },
            { value: '2', label: 'Standard 2' },
            { value: '3', label: 'Standard 3' },
            { value: '4', label: 'Standard 4' },
            { value: '5', label: 'Standard 5' },
            { value: '6', label: 'Standard 6' },
            { value: '7', label: 'Standard 7' },
            { value: '8', label: 'Standard 8' },
            { value: '9', label: 'Standard 9' },
            { value: '10', label: 'Standard 10' },
          ]}
          required
        />
        <Select
          label="Division"
          value={formData.division}
          onChange={(e) =>
            setFormData({ ...formData, division: e.target.value })
          }
          options={[
            { value: '', label: 'Select Division' },
            { value: 'A', label: 'Division A' },
            { value: 'B', label: 'Division B' },
            { value: 'C', label: 'Division C' },
            { value: 'D', label: 'Division D' },
          ]}
          required
        />
        <Input
          label="Device ID"
          value={formData.deviceID}
          onChange={(e) =>
            setFormData({ ...formData, deviceID: e.target.value })
          }
          helperText="Optional: Enter the RFID device ID if available"
        />

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Student
          </Button>
        </div>
      </form>
    </Modal>
  );
} 