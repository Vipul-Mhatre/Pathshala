import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/20/solid';
import { schoolAPI, busAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { SearchInput } from '../../components/common/SearchInput';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { toast } from 'react-hot-toast';

export default function BusesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery(
    ['buses', page, search],
    () => schoolAPI.getBuses({ page, search })
  );

  const columns = [
    {
      header: 'Bus Number',
      accessorKey: 'busNumber',
      cell: (value, bus) => (
        <Link
          to={`/school/buses/${bus.id}`}
          className="text-primary-600 hover:text-primary-900"
        >
          {value}
        </Link>
      ),
    },
    { header: 'Driver Name', accessorKey: 'driverName' },
    { header: 'Contact Number', accessorKey: 'contactNumber' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => (
        <Badge variant={value === 'active' ? 'green' : 'red'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buses"
        description="View and manage all buses"
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="-ml-1.5 mr-1 h-5 w-5" aria-hidden="true" />
            Add Bus
          </Button>
        }
      />

      <div className="flex justify-end">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search buses..."
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
            data={data?.buses || []}
            emptyMessage="No buses found"
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
        <CreateBusModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

function CreateBusModal({ open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: '',
    driverName: '',
    contactNumber: '',
    deviceID: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await busAPI.createBus(formData);
      toast.success('Bus created successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create bus');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Bus">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Bus Number"
          value={formData.busNumber}
          onChange={(e) =>
            setFormData({ ...formData, busNumber: e.target.value })
          }
          required
        />
        <Input
          label="Driver Name"
          value={formData.driverName}
          onChange={(e) =>
            setFormData({ ...formData, driverName: e.target.value })
          }
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
          label="Device ID"
          value={formData.deviceID}
          onChange={(e) =>
            setFormData({ ...formData, deviceID: e.target.value })
          }
          helperText="Optional: Enter the GPS device ID if available"
        />

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Bus
          </Button>
        </div>
      </form>
    </Modal>
  );
} 