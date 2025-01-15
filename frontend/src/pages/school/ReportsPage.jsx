import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { schoolAPI } from '../../services/api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Select } from '../../components/common/Select';
import { DatePicker } from '../../components/common/DatePicker';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';

const reportTypes = [
  { value: 'attendance', label: 'Attendance Report' },
  { value: 'bus', label: 'Bus Report' },
];

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

export default function ReportsPage() {
  const [reportType, setReportType] = useState('attendance');
  const [standard, setStandard] = useState('');
  const [division, setDivision] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(1))
  );
  const [endDate, setEndDate] = useState(new Date());

  const { data, isLoading } = useQuery(
    ['report', reportType, standard, division, startDate, endDate],
    () =>
      schoolAPI.getReport({
        type: reportType,
        standard,
        division,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      }),
    {
      enabled: !!(reportType && startDate && endDate),
    }
  );

  const handleExport = async () => {
    try {
      const response = await schoolAPI.exportReport({
        type: reportType,
        standard,
        division,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${reportType}-report-${new Date().toISOString()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to export report');
    }
  };

  const attendanceColumns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Student Name', accessorKey: 'studentName' },
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

  const busColumns = [
    { header: 'Date', accessorKey: 'date' },
    { header: 'Bus Number', accessorKey: 'busNumber' },
    { header: 'Driver Name', accessorKey: 'driverName' },
    { header: 'Start Time', accessorKey: 'startTime' },
    { header: 'End Time', accessorKey: 'endTime' },
    { header: 'Distance (km)', accessorKey: 'distance' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => (
        <Badge variant={value === 'completed' ? 'green' : 'yellow'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export reports"
        actions={
          <Button onClick={handleExport}>Export Report</Button>
        }
      />

      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportTypes}
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
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              maxDate={endDate || new Date()}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate || undefined}
              maxDate={new Date()}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <Table
              columns={
                reportType === 'attendance' ? attendanceColumns : busColumns
              }
              data={data?.records || []}
              emptyMessage="No records found"
            />
          )}
        </div>
      </Card>
    </div>
  );
} 