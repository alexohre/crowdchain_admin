import { useState, useMemo } from 'react';

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




/**
 * Custom hook to manage filtering functionality for campaigns
 * @param {Array} data - The original data array to be filtered
 * @param {Object} options - Configuration options for filtering
 * @returns {Object} Filtered data and filter management functions
 */
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface StatusOption {
  value: string;
  label: string;
}

interface UseFiltersOptions {
  searchQuery?: string;
  statusFilters?: string[];
  dateRange?: DateRange;
}

interface UseFiltersReturn<T> {
  filteredData: T[];
  searchQuery: string;
  statusFilters: string[];
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

export const useFilters = <T extends Record<string, any>>(
  data: T[],
  options: UseFiltersOptions = {}
): UseFiltersReturn<T> => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // Available status options
  const statusOptions: StatusOption[] = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "flagged", label: "Flagged" },
    { value: "completed", label: "Completed" }
  ];

  // Apply search filter
  const applySearchFilter = (items: T[], query: string): T[] => {
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
  const applyStatusFilter = (items: T[], statuses: string[]): T[] => {
    if (!statuses.length) return items;
    return items.filter(item => 
      statuses.some(status => item.status.toLowerCase() === status.toLowerCase())
    );
  };

  // Apply date range filter
  const applyDateFilter = (items: T[], { startDate, endDate }: DateRange): T[] => {
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
    
    // Filter statistics
    totalResults: filteredData.length,
    hasActiveFilters: !!searchQuery || statusFilters.length > 0 || !!dateRange.startDate || !!dateRange.endDate
  };
};

// utils/dateUtils.js
/**
 * Parses a date string into a Date object
 * @param {string} dateStr - Date string in format "Month DD" (e.g., "Mar 1")
 * @returns {Date} Date object
 */
export const parseDisplayDate = (dateStr: string): Date => {
  const currentYear: number = new Date().getFullYear();
  return new Date(`${dateStr}, ${currentYear}`);
};

/**
 * Formats a Date object into a display string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (e.g., "Mar 1")
 */
export const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '';
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

/**
 * Checks if a campaign timeline overlaps with a date range
 * @param {string} timeline - Campaign timeline string (e.g., "Mar 1 - Apr 1")
 * @param {Date} startDate - Start date of range
 * @param {Date} endDate - End date of range
 * @returns {boolean} True if the timeline overlaps with the date range
 */
interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Checks if a campaign timeline overlaps with a date range
 * @param {string} timeline - Campaign timeline string (e.g., "Mar 1 - Apr 1")
 * @param {Date | null} startDate - Start date of range
 * @param {Date | null} endDate - End date of range
 * @returns {boolean} True if the timeline overlaps with the date range
 */
export const timelineOverlapsRange = (
  timeline: string,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!timeline || (!startDate && !endDate)) return true;

  const [timelineStart, timelineEnd] = timeline.split(' - ').map(parseDisplayDate);
  
  if (startDate && endDate) {
    // Check if the timeline overlaps with the date range
    return !(timelineEnd < startDate || timelineStart > endDate);
  } else if (startDate) {
    // Check if the timeline ends after or on the start date
    return timelineEnd >= startDate;
  } else if (endDate) {
    // Check if the timeline starts before or on the end date
    return timelineStart <= endDate;
  }
  
  return true;
};

/**
 * Gets the date range presets for filtering
 * @returns {Array} Array of date range preset objects
 */
export const getDateRangePresets = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  return [
    { 
      label: 'This Month', 
      range: { startDate: startOfMonth, endDate: endOfMonth }
    },
    { 
      label: 'Last Month', 
      range: { startDate: startOfLastMonth, endDate: endOfLastMonth }
    },
    { 
      label: 'Year to Date', 
      range: { startDate: startOfYear, endDate: today }
    },
    { 
      label: 'Next 30 Days', 
      range: { startDate: today, endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) }
    }
  ];
};