import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { schoolAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { DatePicker } from '../../components/common/DatePicker';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';

const standardOptions = [
  { value: '', label: 'All Standards' },
  { value: '1', label: 'Standard 1' },
  { value: '2', label: 'Standard 2' },
  // ... add more standards
];

const divisionOptions = [
  { value: '', label: 'All Divisions' },
  { value: 'A', label: 'Division A' },
  { value: 'B', label: 'Division B' },
  // ... add more divisions
];

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [standard, setStandard] = useState('');
  const [division, setDivision] = useState('');
  const [date, setDate] = useState(new Date());

  const { data, isLoading } = useQuery(
    ['attendance', page, search, standard, division, date],
    () =>
      schoolAPI.getAttendance({
        page,
        search,
        standard,
        division,
        date: date?.toISOString(),
      })
  );

  const columns = [
    {
      header: 'Student Name',
      accessorKey: 'studentName',
      cell: (value, record) => (
        <Link
          to={`/school/students/${record.studentId}`}
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
            value === 'present'
              ? 'green'
              : value === 'absent'
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
        title="Attendance"
        description="View and manage student attendance"
      />

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <DatePicker
              label="Date"
              value={date}
              onChange={setDate}
              maxDate={new Date()}
            />
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
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search students..."
              className="w-full"
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
                data={data?.attendance || []}
                emptyMessage="No attendance records found"
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
        </div>
      </Card>
    </div>
  );
} 