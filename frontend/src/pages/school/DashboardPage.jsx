import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  TruckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { schoolAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Stats } from '../../components/common/Stats';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Map } from '../../components/common/Map';

export default function DashboardPage() {
  const { data, isLoading } = useQuery('dashboard', () =>
    schoolAPI.getDashboardStats()
  );

  const { data: busLocations } = useQuery(
    'busLocations',
    () => schoolAPI.getBusLocations(),
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

  const stats = [
    {
      name: 'Total Students',
      value: data?.stats.studentCount || 0,
      icon: UserGroupIcon,
    },
    {
      name: 'Total Buses',
      value: data?.stats.busCount || 0,
      icon: TruckIcon,
    },
    {
      name: 'Today\'s Attendance',
      value: data?.stats.todayAttendance || 0,
      unit: '%',
      icon: CalendarIcon,
      change: {
        value: data?.stats.attendanceChange || 0,
        type: data?.stats.attendanceChange >= 0 ? 'increase' : 'decrease',
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your school statistics"
      />

      <Stats stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          title="Recent Students"
          description="List of recently added students"
          footer={
            <div className="text-center">
              <Link
                to="/school/students"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all students
              </Link>
            </div>
          }
        >
          <Table
            columns={studentColumns}
            data={data?.recentStudents || []}
            emptyMessage="No students found"
          />
        </Card>

        <Card
          title="Recent Buses"
          description="List of recently added buses"
          footer={
            <div className="text-center">
              <Link
                to="/school/buses"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all buses
              </Link>
            </div>
          }
        >
          <Table
            columns={busColumns}
            data={data?.recentBuses || []}
            emptyMessage="No buses found"
          />
        </Card>
      </div>

      <Card
        title="Live Bus Tracking"
        description="Real-time location of all active buses"
        footer={
          <div className="text-center">
            <Link
              to="/school/bus-tracking"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View full map
            </Link>
          </div>
        }
      >
        <Map
          buses={busLocations?.buses || []}
          center={busLocations?.schoolLocation}
          zoom={12}
        />
      </Card>
    </div>
  );
}

const studentColumns = [
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
];

const busColumns = [
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