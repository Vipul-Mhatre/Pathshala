import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { busAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Map } from '../../components/common/Map';

export default function BusDetailsPage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);

  const { data: bus, isLoading, refetch } = useQuery(
    ['bus', id],
    () => busAPI.getBusDetails(id)
  );

  const { data: location } = useQuery(
    ['busLocation', id],
    () => busAPI.getBusLocation(id),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Bus not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bus ${bus.busNumber}`}
        description="View and manage bus details"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="white"
              onClick={() => setIsUpdateStatusModalOpen(true)}
            >
              Update Status
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>Edit Bus</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Bus Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {bus.busNumber}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Driver Name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {bus.driverName}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Contact Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {bus.contactNumber}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Status
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Badge variant={bus.status === 'active' ? 'green' : 'red'}>
                  {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Live Location">
          <div className="h-[400px]">
            <Map
              buses={[{ ...bus, currentLocation: location?.location }]}
              center={location?.location}
              zoom={15}
            />
          </div>
        </Card>
      </div>

      {isEditModalOpen && (
        <EditBusModal
          bus={bus}
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={refetch}
        />
      )}

      {isUpdateStatusModalOpen && (
        <UpdateStatusModal
          busId={bus.id}
          open={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

function EditBusModal({ bus, open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: bus.busNumber,
    driverName: bus.driverName,
    contactNumber: bus.contactNumber,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await busAPI.updateBus(bus.id, formData);
      toast.success('Bus updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update bus');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Bus">
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

        <div className="flex justify-end space-x-3">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Bus
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function UpdateStatusModal({ busId, open, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'active',
    deviceID: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await busAPI.updateBusStatus(busId, formData);
      toast.success('Bus status updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Bus Status" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
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
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
} 