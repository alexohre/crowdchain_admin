"use client"

import { useState, useEffect } from "react"
import { MetricCard } from "../../components/campaigns/metric-card"
import { CampaignTable } from "../../components/campaigns/campaign-table"
import { SearchBar } from "../../components/ui/search-bar"
import { Button } from "../../components/ui/Button"
import { ChevronDown, X, Calendar, Filter, Download } from 'lucide-react'
import { usePagination } from "../../hooks/use-pagination"
import { Pagination } from "../../components/pagination"
import { useFilters, Campaign } from "../../hooks/use-filters"
import { formatDateForDisplay, getDateRangePresets } from "../../lib/date-utils"
import { useExport } from "../../hooks/export-hooks"

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  data: number[];
}

export default function CampaignDashboard() {
  const campaigns: Campaign[] = [
    {
      name: "DeFi Lending Pool",
      creatorAddress: "0x7b3b...F42d",
      category: "DeFi",
      raised: 234.5,
      goal: 500,
      status: "Active",
      timeline: "Mar 1 - Apr 1",
    },
    {
      name: "Education Fund",
      creatorAddress: "0x9a2c...E31b",
      category: "Education",
      raised: 45.2,
      goal: 100,
      status: "Pending",
      timeline: "Mar 5 - Apr 5",
    },
    {
      name: "Health Tech",
      creatorAddress: "0x3f4d...A92e",
      category: "Health",
      raised: 532.8,
      goal: 1000,
      status: "Flagged",
      timeline: "Feb 15 - Mar 15",
    },
    {
      name: "NFT Marketplace",
      creatorAddress: "0x6b5a...C73f",
      category: "NFT",
      raised: 89.3,
      goal: 200,
      status: "Completed",
      timeline: "Feb 1 - Mar 1",
    },
    {
      name: "Gaming Platform",
      creatorAddress: "0x2d8e...B45c",
      category: "Gaming",
      raised: 12.7,
      goal: 50,
      status: "Active",
      timeline: "Mar 10 - Apr 10",
    },
    {
      name: "Climate Initiative",
      creatorAddress: "0x8c4f...D23a",
      category: "Environment",
      raised: 310.5,
      goal: 600,
      status: "Active",
      timeline: "Mar 12 - Apr 12",
    },
    {
      name: "Music Platform",
      creatorAddress: "0x1e9d...G87b",
      category: "Entertainment",
      raised: 78.4,
      goal: 150,
      status: "Pending",
      timeline: "Mar 8 - Apr 8",
    },
    {
      name: "Community Garden",
      creatorAddress: "0x5t2p...H45r",
      category: "Community",
      raised: 23.6,
      goal: 40,
      status: "Active",
      timeline: "Mar 15 - Apr 15",
    },
  ];

  const metrics: Metric[] = [
    {
      title: "Total Campaigns",
      value: "1,847",
      change: "+13.3%",
      trend: "up",
      data: [25, 27, 28, 32, 33, 35, 41],
    },
    {
      title: "Pending Reviews",
      value: "126",
      change: "+8.7%",
      trend: "up",
      data: [10, 12, 14, 12, 13, 15, 17],
    },
    {
      title: "Active Campaigns",
      value: "892",
      change: "+5.7%",
      trend: "up",
      data: [45, 47, 48, 50, 52, 53, 55],
    },
    {
      title: "Flagged Campaigns",
      value: "47",
      change: "-1.1%",
      trend: "down",
      data: [8, 7, 9, 8, 6, 5, 6],
    },
  ];

  // Use our custom filter hook
  const {
    filteredData,
    searchQuery,
    statusFilters,
    setStatusFilters,
    dateRange,
    statusOptions,
    handleSearchChange,
    toggleStatusFilter,
    filterByStatus,
    handleDateRangeChange,
    clearFilters,
    totalResults,
    hasActiveFilters
  } = useFilters(campaigns);

  // Use export hook
  const { exportCampaignsToCSV } = useExport();

  // UI states for dropdowns
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  
  // Get date range presets
  const dateRangePresets = getDateRangePresets();

  // Pagination based on filtered data
  const {
    currentItems: paginatedCampaigns,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination({
    data: filteredData,
    itemsPerPage: 5,
    initialPage: 1
  });

  // Reset pagination when filters change
  useEffect(() => {
    goToPage(1);
  }, [searchQuery, statusFilters, dateRange]);

  // Handle clicking on metric cards to filter by status
  const handleMetricClick = (metricTitle: string): void => {
    // Map metric titles to status filters
    if (metricTitle === "Pending Reviews") {
      filterByStatus("Pending");
    } else if (metricTitle === "Active Campaigns") {
      filterByStatus("Active");
    } else if (metricTitle === "Flagged Campaigns") {
      filterByStatus("Flagged");
    } else {
      // "Total Campaigns" should clear all status filters
      setStatusFilters([]);
    }
  };

  // Handle export button click
  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const fileName = `campaigns-export-${date}.csv`;
      
      // Export all filtered data, not just current page
      exportCampaignsToCSV(filteredData, fileName);
      
    } catch (error) {
      console.error("Error exporting data:", error);
      // You could add error handling UI here
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.title} onClick={() => handleMetricClick(metric.title)}>
            <MetricCard
              title={metric.title}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              data={metric.data}
              isActive={
                (metric.title === "Pending Reviews" && statusFilters.includes("Pending")) ||
                (metric.title === "Active Campaigns" && statusFilters.includes("Active")) ||
                (metric.title === "Flagged Campaigns" && statusFilters.includes("Flagged")) ||
                (metric.title === "Total Campaigns" && statusFilters.length === 0)
              }
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1">
            <SearchBar 
              value={searchQuery} 
              onChange={(value: string) => {
                handleSearchChange(value);
                goToPage(1);
              }} 
              placeholder="Search campaigns..."
            />
            {searchQuery && (
              <button 
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  handleSearchChange("");
                  goToPage(1);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowDateDropdown(false);
              }}
            >
              <Filter className="h-4 w-4" />
              Status
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showFilterDropdown && (
              <div className="absolute top-12 right-0 z-10 bg-white rounded-md shadow-lg p-4 w-64 border border-gray-200">
                <div className="font-medium mb-2">Filter by Status</div>
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`status-${option.value}`}
                      checked={statusFilters.includes(option.label)}
                      onChange={() => toggleStatusFilter(option.label)}
                      className="mr-2"
                    />
                    <label htmlFor={`status-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setStatusFilters([])}
                  >
                    Clear
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setShowFilterDropdown(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowFilterDropdown(false);
              }}
            >
              <Calendar className="h-4 w-4" />
              {dateRange.startDate || dateRange.endDate ? 
                `${formatDateForDisplay(dateRange.startDate)} - ${formatDateForDisplay(dateRange.endDate)}` : 
                "Date Range"
              }
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showDateDropdown && (
              <div className="absolute top-12 right-0 z-10 bg-white rounded-md shadow-lg p-4 w-64 border border-gray-200">
                <div className="font-medium mb-3">Date Range Presets</div>
                {dateRangePresets.map((preset, index) => (
                  <div key={index} className="mb-2">
                    <button
                      className="text-left w-full hover:bg-gray-100 p-2 rounded"
                      onClick={() => {
                        handleDateRangeChange(preset.range.startDate, preset.range.endDate);
                        setShowDateDropdown(false);
                      }}
                    >
                      {preset.label}
                    </button>
                  </div>
                ))}
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="font-medium mb-2">Custom Range</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input 
                        type="date" 
                        className="w-full border rounded p-1 text-sm"
                        value={dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                          const newStartDate = e.target.value ? new Date(e.target.value) : null;
                          handleDateRangeChange(newStartDate, dateRange.endDate);
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <input 
                        type="date" 
                        className="w-full border rounded p-1 text-sm"
                        value={dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : ""}
                        onChange={(e) => {
                          const newEndDate = e.target.value ? new Date(e.target.value) : null;
                          handleDateRangeChange(dateRange.startDate, newEndDate);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDateRangeChange(null, null)}
                    >
                      Clear
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setShowDateDropdown(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="text-gray-600"
            >
              Clear All Filters
            </Button>
          )}
          <Button 
            className="bg-green-700 hover:bg-green-800 flex items-center gap-2"
            onClick={handleExport}
            disabled={exportLoading || filteredData.length === 0}
          >
            <Download className="h-4 w-4" />
            {exportLoading ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <div className="bg-blue-50 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center">
              Search: {searchQuery}
              <button 
                className="ml-2 text-blue-600"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {statusFilters.map(status => (
            <div key={status} className="bg-purple-50 text-purple-800 rounded-full px-3 py-1 text-sm flex items-center">
              Status: {status}
              <button 
                className="ml-2 text-purple-600"
                onClick={() => toggleStatusFilter(status)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {(dateRange.startDate || dateRange.endDate) && (
            <div className="bg-green-50 text-green-800 rounded-full px-3 py-1 text-sm flex items-center">
              Date: {formatDateForDisplay(dateRange.startDate) || "Any"} - {formatDateForDisplay(dateRange.endDate) || "Any"}
              <button 
                className="ml-2 text-green-600"
                onClick={() => handleDateRangeChange(null, null)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search results info */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {totalResults} {totalResults === 1 ? 'campaign' : 'campaigns'}
        {hasActiveFilters ? ' with applied filters' : ''}
      </div>

      {/* Campaign Table with Pagination */}
      <CampaignTable 
        campaigns={paginatedCampaigns} 
        numberOfTotalCampaigns={totalResults}
        currentPage={currentPage}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </CampaignTable>
    </div>
  )
}