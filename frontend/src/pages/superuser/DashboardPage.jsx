import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { superuserAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Stats } from '../../components/common/Stats';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { data, isLoading } = useQuery('dashboard', () =>
    superuserAPI.getDashboardStats()
  );

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
        title="Dashboard"
        description="View overall system statistics"
      />

      <Stats stats={data.stats} />

      <Card title="Recent Schools">
        <Table
          columns={[
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
            {
              header: 'Status',
              accessorKey: 'status',
              cell: (value) => (
                <Badge variant={value === 'active' ? 'green' : 'red'}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
              ),
            },
          ]}
          data={data.recentSchools}
        />
      </Card>
    </div>
  );
} 