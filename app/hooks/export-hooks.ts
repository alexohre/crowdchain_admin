import { Campaign } from "../hooks/use-filters";
import { convertToCSV, downloadCSV } from "../lib/csv-utils";

export function useExport() {
  const exportCampaignsToCSV = (campaigns: Campaign[], fileName: string = 'campaigns-export.csv') => {
    // Define the headers for the CSV in the order you want them to appear
    const headers = [
      'name',
      'creatorAddress',
      'category',
      'raised',
      'goal',
      'status',
      'timeline'
    ];

    // Map headers to more readable names for the CSV
    const readableHeaders = [
      'Campaign Name',
      'Creator Address',
      'Category',
      'Amount Raised',
      'Goal Amount',
      'Status',
      'Timeline'
    ];

    // Generate CSV content
    const csvContent = convertToCSV(
      campaigns.map(campaign => ({
        'Campaign Name': campaign.name,
        'Creator Address': campaign.creatorAddress,
        'Category': campaign.category,
        'Amount Raised': campaign.raised,
        'Goal Amount': campaign.goal,
        'Status': campaign.status,
        'Timeline': campaign.timeline
      })),
      readableHeaders
    );

    // Download the CSV file
    downloadCSV(csvContent, fileName);
  };

  return { exportCampaignsToCSV };
}