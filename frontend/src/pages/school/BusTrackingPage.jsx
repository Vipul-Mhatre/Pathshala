import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { schoolAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Map } from '../../components/common/Map';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { SearchInput } from '../../components/common/SearchInput';

export default function BusTrackingPage() {
  const [search, setSearch] = useState('');

  const { data: busLocations, isLoading } = useQuery(
    'busLocations',
    () => schoolAPI.getBusLocations(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const filteredBuses = busLocations?.buses.filter((bus) =>
    bus.busNumber.toLowerCase().includes(search.toLowerCase()) ||
    bus.driverName.toLowerCase().includes(search.toLowerCase())
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
        <Badge
          variant={value === 'active' ? 'green' : 'red'}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bus Tracking"
        description="Track all buses in real-time"
      />

      <Card
        title="Live Map"
        description="Real-time location of all active buses"
      >
        <div className="h-[600px]">
          <Map
            buses={filteredBuses || []}
            center={busLocations?.schoolLocation}
            zoom={12}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search buses..."
          className="w-72"
        />
      </div>

      <Card
        title="Bus List"
        description="List of all buses and their current status"
      >
        <Table
          columns={columns}
          data={filteredBuses || []}
          emptyMessage="No buses found"
        />
      </Card>
    </div>
  );
} 