import { useState, useMemo } from 'react';
import { Campaign } from '../types/campaign';

// Re-export the Campaign type
export type { Campaign };

// Type definitions
// export interface Campaign {
//   name: string;
//   creatorAddress: string;
//   category: string;
//   raised: number;
//   goal: number;
//   status: string;
//   timeline: string;
//   [key: string]: any; // Allow for additional properties
// }

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface UseFiltersOptions {
  initialSearchQuery?: string;
  initialStatusFilters?: string[];
  initialDateRange?: DateRange;
}

export interface UseFiltersReturn {
  filteredData: Campaign[];
  searchQuery: string;
  statusFilters: string[];
  setStatusFilters: (filters: string[]) => void;
  dateRange: DateRange;
  statusOptions: StatusOption[];
  handleSearchChange: (value: string) => void;
  toggleStatusFilter: (status: string) => void;
  filterByStatus: (status: string) => void;
  handleDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  clearFilters: () => void;
  totalResults: number;
  hasActiveFilters: boolean;
}

/**
 * Custom hook to manage filtering functionality for campaigns
 * @param data - The original data array to be filtered
 * @param options - Configuration options for filtering
 * @returns Filtered data and filter management functions
 */
export const useFilters = (
  data: Campaign[],
  options: UseFiltersOptions = {}
): UseFiltersReturn => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>(options.initialSearchQuery || "");
  const [statusFilters, setStatusFilters] = useState<string[]>(options.initialStatusFilters || []);
  const [dateRange, setDateRange] = useState<DateRange>(
    options.initialDateRange || {
      startDate: null,
      endDate: null,
    }
  );

  // Available status options
  const statusOptions: StatusOption[] = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "flagged", label: "Flagged" },
    { value: "completed", label: "Completed" }
  ];

  // Apply search filter
  const applySearchFilter = (items: Campaign[], query: string): Campaign[] => {
    if (!query.trim()) return items;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return items.filter(item => 
      (item.name && item.name.toLowerCase().includes(normalizedQuery)) ||
      (item.category && item.category.toLowerCase().includes(normalizedQuery)) ||
      (item.status && item.status.toLowerCase().includes(normalizedQuery)) ||
      (item.creatorAddress && item.creatorAddress.toLowerCase().includes(normalizedQuery)) ||
      (item.timeline && item.timeline.toLowerCase().includes(normalizedQuery))
    );
  };

  // Apply status filters
  const applyStatusFilter = (items: Campaign[], statuses: string[]): Campaign[] => {
    if (!statuses.length) return items;
    return items.filter(item => 
      statuses.some(status => item.status.toLowerCase() === status.toLowerCase())
    );
  };

  // Apply date range filter
  const applyDateFilter = (items: Campaign[], range: DateRange): Campaign[] => {
    const { startDate, endDate } = range;
    if (!startDate && !endDate) return items;
    
    return items.filter(item => {
      // Parse the timeline string to get start and end dates
      // Format expected: "Mar 1 - Apr 1"
      const [itemStartStr, itemEndStr] = item.timeline.split(" - ");
      
      // Convert to Date objects (adding the current year for comparison)
      const currentYear = new Date().getFullYear();
      const itemStart = new Date(`${itemStartStr}, ${currentYear}`);
      const itemEnd = new Date(`${itemEndStr}, ${currentYear}`);
      
      // Filter logic
      if (startDate && endDate) {
        // Campaign overlaps with the selected date range
        return !(itemEnd < startDate || itemStart > endDate);
      } else if (startDate) {
        // Campaign ends after the start date
        return itemEnd >= startDate;
      } else if (endDate) {
        // Campaign starts before the end date
        return itemStart <= endDate;
      }
      
      return true;
    });
  };

  // Apply all filters in sequence
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply search filter
    result = applySearchFilter(result, searchQuery);
    
    // Apply status filters
    result = applyStatusFilter(result, statusFilters);
    
    // Apply date filter
    result = applyDateFilter(result, dateRange);
    
    return result;
  }, [data, searchQuery, statusFilters, dateRange]);

  // Handle search input change
  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string): void => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Clear all filters
  const clearFilters = (): void => {
    setSearchQuery("");
    setStatusFilters([]);
    setDateRange({ startDate: null, endDate: null });
  };

  // Set date range
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null): void => {
    setDateRange({ startDate, endDate });
  };

  // Filter specific campaigns by flag/status
  const filterByStatus = (status: string): void => {
    setStatusFilters([status]);
  };

  return {
    // Filtered data
    filteredData,
    
    // Filter states
    searchQuery,
    statusFilters,
    dateRange,
    
    // Status options
    statusOptions,
    
    // Filter actions
    handleSearchChange,
    toggleStatusFilter,
    filterByStatus,
    handleDateRangeChange,
    clearFilters,
    setStatusFilters, // Include setStatusFilters in the returned object
    
    // Filter statistics
    totalResults: filteredData.length,
    hasActiveFilters: searchQuery.trim() !== '' || statusFilters.length > 0 || !!dateRange.startDate || !!dateRange.endDate
  };
};