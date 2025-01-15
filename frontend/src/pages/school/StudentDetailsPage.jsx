import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);

  const { data: student, isLoading, refetch } = useQuery(
    ['student', id],
    () => studentAPI.getStudentDetails(id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Student not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.name}
        description="View and manage student details"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="white"
              onClick={() => setIsUpdateStatusModalOpen(true)}
            >
              Update Status
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>
              Edit Student
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {student.name}
              </dd>
            </div>
            {/* Add more student details here */}
          </dl>
        </Card>

        <Card title="Attendance History">
          <Table
            columns={[
              { header: 'Date', accessorKey: 'date' },
              {
                header: 'Status',
                accessorKey: 'status',
                cell: (value) => (
                  <Badge
                    variant={value === 'Present' ? 'green' : 'red'}
                  >
                    {value}
                  </Badge>
                ),
              },
            ]}
            data={student.attendance || []}
            emptyMessage="No attendance records found"
          />
        </Card>
      </div>

      {/* Student details cards and modals */}
      {/* ... Rest of the component implementation ... */}
    </div>
  );
} 