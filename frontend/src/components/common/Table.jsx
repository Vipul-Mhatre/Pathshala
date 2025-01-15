import React from 'react';
import { classNames } from '../../utils/classNames';

export function Table({
  className,
  columns,
  data,
  isLoading,
  emptyMessage = 'No data available',
  ...props
}) {
  return (
    <div
      className={classNames(
        'overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg',
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-sm text-gray-500 text-center sm:px-6"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-sm text-gray-500 text-center sm:px-6"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-6"
                    >
                      {column.cell
                        ? column.cell(item[column.accessorKey], item)
                        : item[column.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 