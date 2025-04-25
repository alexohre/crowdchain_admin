"use client"

import { useState } from "react"
import { MetricCard } from "../../components/campaigns/metric-card"
import  {CampaignTable}  from "../../components/campaigns/campaign-table"
import { SearchBar } from "../../components/ui/search-bar"
import {Button}  from "../../components/ui/Button"
import { ChevronDown } from 'lucide-react'

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
  ]

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

      <CampaignTable campaigns={campaigns} />
    </div>
  )
}
