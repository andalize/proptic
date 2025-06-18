"use client";
import { useState, useMemo, Fragment, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T | 'expander' | 'actions';
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  width?: string;
}

export interface ListTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title: string;
  onNewItem?: () => void;
  newItemLabel?: string;
  expandableRowRender?: (item: T) => ReactNode;
  initialPageSize?: number;
  searchable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  getItemId: (item: T) => string | number;
}

export function ListTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  onNewItem,
  newItemLabel = 'New Item',
  expandableRowRender,
  initialPageSize = 10,
  searchable = false,
  loading = false,
  emptyMessage = 'No data available',
  getItemId,
}: ListTableProps<T>) {
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' | null }>(
    {
      key: null,
      direction: null,
    },
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (id: string | number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSort = (key: keyof T) => {
    setSorting((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sorting.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sorting.key!];
      const bVal = b[sorting.key!];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sorting.direction === 'asc' ? -1 : 1;
      if (bVal == null) return sorting.direction === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sorting.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sorting.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // For other types, convert to string and compare
      const comparison = String(aVal).localeCompare(String(bVal));
      return sorting.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sorting]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const renderCellContent = (column: TableColumn<T>, item: T) => {
    if (column.key === 'expander' && expandableRowRender) {
      const itemId = getItemId(item);
      return (
        <Button variant="ghost" size="sm" onClick={() => toggleRow(itemId)} className="p-1 h-8 w-8">
          {openRows[itemId] ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      );
    }

    if (column.render) {
      return column.render(item);
    }

    if (column.key === 'actions') {
      return null; // Actions should be handled by custom render function
    }

    return item[column.key as keyof T] || '';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            {onNewItem && (
              <Button onClick={onNewItem} disabled>
                {newItemLabel}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          {onNewItem && <Button onClick={onNewItem} className='cursor-pointer'>{newItemLabel}</Button>}
        </CardTitle>

        {searchable && (
          <div className="max-w-sm">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      style={{ width: column.width }}
                      onClick={
                        column.sortable && column.key !== 'expander' && column.key !== 'actions'
                          ? () => handleSort(column.key as keyof T)
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable &&
                          column.key !== 'expander' &&
                          column.key !== 'actions' &&
                          sorting.key === column.key &&
                          (sorting.direction === 'asc' ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => {
                    const itemId = getItemId(item);
                    return (
                      <Fragment key={itemId}>
                        <tr className="hover:bg-gray-50">
                          {columns.map((column) => (
                            <td
                              key={String(column.key)}
                              className="px-4 py-3 text-sm text-gray-900"
                            >
                              {renderCellContent(column, item)}
                            </td>
                          ))}
                        </tr>

                        {expandableRowRender && openRows[itemId] && (
                          <tr className="bg-gray-50">
                            <td colSpan={columns.length} className="px-4 py-4">
                              {expandableRowRender(item)}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {sortedData.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-700">Rows per page</p>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="h-8 w-16 rounded border border-gray-300 px-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[5, 10, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="hidden lg:flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(1)}
                    disabled={!canPreviousPage}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={!canPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={!canNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    className="hidden lg:flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(totalPages)}
                    disabled={!canNextPage}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Row count info */}
          <div className="text-xs text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
            {sortedData.length} entries
            {searchTerm && ` (filtered from ${data.length} total entries)`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
