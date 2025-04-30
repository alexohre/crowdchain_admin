'use client'
import { useState } from "react"
import { Eye, Pause, Flag } from "lucide-react"
import { Badge } from '@/app/components/ui/Badge'
import { StatusBadge } from "../ui/status-badge"
import { Button } from "../../components/ui/Button"
import { useMediaQuery } from "../../hooks/use-mobile"
import { PaginationInfo } from "../../components/PaginationInfo"
import { CampaignModal } from "@/app/components/campaigns/campaign-modal"
import { Campaign } from "@/app/types/campaign"

// interface Campaign {
//   id: string
//   name: string
//   creatorAddress: string
//   category: string
//   raised: number
//   goal: number
//   status: "Active" | "Pending" | "Flagged" | "Completed"
//   timeline: string
// }

interface CampaignTableProps {
  campaigns: Campaign[]
  children?: React.ReactNode
  numberOfTotalCampaigns: number
  currentPage: number
}

export function CampaignTable({ campaigns, children, numberOfTotalCampaigns, currentPage }: CampaignTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Function to get the badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "Pending":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>
      case "Flagged":
        return <Badge className="bg-red-500 hover:bg-red-600">Flagged</Badge>
      case "Completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }


  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {!isMobile ? (
        // Desktop table view
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Campaign Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Creator Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Raised (ETH)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Goal (ETH)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timeline
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.creatorAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.raised}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.goal}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.timeline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewCampaign(campaign)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile card view
        <div className="divide-y divide-gray-200">
          {campaigns.map((campaign, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                <StatusBadge status={campaign.status} />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm">{campaign.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Creator</p>
                  <p className="text-sm">{campaign.creatorAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Raised (ETH)</p>
                  <p className="text-sm">{campaign.raised}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Goal (ETH)</p>
                  <p className="text-sm">{campaign.goal}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Timeline</p>
                  <p className="text-sm">{campaign.timeline}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleViewCampaign(campaign)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
        <PaginationInfo currentPage={currentPage} itemsPerPage={campaigns.length} totalItems={numberOfTotalCampaigns}/>
        <div className="flex space-x-1 order-1 sm:order-2">
          {children}
        </div>
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          isOpen={isModalOpen}
          onClose={closeModal}
          campaign={selectedCampaign}
        />
      )}
    </div>
  )
}
