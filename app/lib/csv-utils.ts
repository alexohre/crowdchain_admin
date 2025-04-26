// lib/csv-utils.ts
export function convertToCSV(data: any[], headers?: string[]): string {
    if (!data || data.length === 0) return '';
    
    // If headers are not provided, use the keys from the first object
    const columnHeaders = headers || Object.keys(data[0]);
    
    // Create CSV header row
    let csv = columnHeaders.map(header => `"${header}"`).join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = columnHeaders.map(header => {
        // Handle special types and ensure proper CSV formatting
        const value = item[header] !== undefined ? item[header] : '';
        // Escape quotes in strings and wrap in quotes
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : String(value);
      }).join(',');
      csv += row + '\n';
    });
    
    return csv;
  }
  
  export function downloadCSV(csvContent: string, fileName: string = 'export.csv'): void {
    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Set link attributes
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    // Append to document, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
 