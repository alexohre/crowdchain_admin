// utils/dateUtils.ts

export interface DateRangePreset {
    label: string;
    range: {
      startDate: Date;
      endDate: Date;
    };
  }
  
  /**
   * Parses a date string into a Date object
   * @param dateStr - Date string in format "Month DD" (e.g., "Mar 1")
   * @returns Date object
   */
  export const parseDisplayDate = (dateStr: string): Date => {
    const currentYear = new Date().getFullYear();
    return new Date(`${dateStr}, ${currentYear}`);
  };
  
  /**
   * Formats a Date object into a display string
   * @param date - Date object
   * @returns Formatted date string (e.g., "Mar 1")
   */
  export const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };
  
  /**
   * Checks if a campaign timeline overlaps with a date range
   * @param timeline - Campaign timeline string (e.g., "Mar 1 - Apr 1")
   * @param startDate - Start date of range
   * @param endDate - End date of range
   * @returns True if the timeline overlaps with the date range
   */
  export const timelineOverlapsRange = (
    timeline: string, 
    startDate: Date | null, 
    endDate: Date | null
  ): boolean => {
    if (!timeline || (!startDate && !endDate)) return true;
  
    const [timelineStartStr, timelineEndStr] = timeline.split(' - ');
    const timelineStart = parseDisplayDate(timelineStartStr);
    const timelineEnd = parseDisplayDate(timelineEndStr);
    
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
   * @returns Array of date range preset objects
   */
  export const getDateRangePresets = (): DateRangePreset[] => {
    const today = new Date();
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);
    
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
        range: { startDate: today, endDate: next30Days }
      }
    ];
  };