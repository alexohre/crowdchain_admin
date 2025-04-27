"use client";
import React from "react";
import { IoRefreshOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (value: any) => React.ReactNode;
  }[];
  actions?: {
    refresh?: (item: T) => void;
    delete?: (item: T) => void;
  };
  headerActions?: React.ReactNode;
}

export function Table<T>({ data, columns, actions, headerActions }: TableProps<T>) {
  return (
    <div>
      {headerActions && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Access Control Management</h2>
          {headerActions}
        </div>
      )}
      <div className="overflow-x-auto rounded-[8px] border border-[#E5E7EB] overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#F9FAFB]">
            <tr className="bg-[#F9FAFB]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left py-3 px-4 text-sm font-medium text-gray-500"
                >
                  {column.header}
                </th>
              ))}
              {(actions?.refresh || actions?.delete) && (
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-3 px-4 text-sm text-gray-900"
                  >
                    {column.cell
                      ? column.cell(item[column.accessor])
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(actions?.refresh || actions?.delete) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {actions.refresh && (
                        <button
                          onClick={() => actions.refresh?.(item)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <IoRefreshOutline className="w-4 h-4" />
                        </button>
                      )}
                      {actions.delete && (
                        <button
                          onClick={() => actions.delete?.(item)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 