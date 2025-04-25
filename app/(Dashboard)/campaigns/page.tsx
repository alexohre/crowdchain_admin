"use client"

import { useState, useMemo } from "react"
import { MetricCard } from "../../components/campaigns/metric-card"
import { CampaignTable } from "../../components/campaigns/campaign-table"
import { SearchBar } from "../../components/ui/search-bar"
import { Button } from "../../components/ui/Button"
import { ChevronDown } from 'lucide-react'
import { usePagination } from "../../hooks/use-pagination"
import { Pagination } from "../../components/pagination" 

export default function CampaignDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const metrics = [
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
  ]

  const campaigns = [
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
    // Let's add more mock data to demonstrate pagination
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
  ]

  // Filter campaigns based on search query
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    
    return campaigns.filter(campaign => 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);

  // Use the pagination hook
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
    data: filteredCampaigns,
    itemsPerPage: 5,
    initialPage: 1
  });

  return (
    <div className="bg-gray-50 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            data={metric.data}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Button variant="outline" className="flex items-center gap-2">
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="flex items-center gap-2 flex-1">
            Date Range
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <Button className="ml-auto sm:ml-0 bg-green-700 hover:bg-green-800">Export</Button>
      </div>

      <CampaignTable campaigns={paginatedCampaigns} numberOfTotalCampaigns={campaigns.length} currentPage={currentPage} >
      {/* Add the pagination component */}
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