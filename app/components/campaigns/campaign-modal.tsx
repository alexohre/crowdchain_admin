"use client"
import { View, Pause, Flag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/Dialog"
import { Button } from "@/app/components/ui/Button"
import { Badge } from "@/app/components/ui/Badge"
import { Separator } from "@/app/components/ui/Seperator"
import type { Campaign } from "@/app/types/campaign"

 // Define the campaign type
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

export function CampaignModal({
  campaign,
  isOpen,
  onClose,
}: {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!campaign) return null

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 hover:bg-green-700"
      case "Pending":
        return "bg-orange-500 hover:bg-orange-600"
      case "Flagged":
        return "bg-red-500 hover:bg-red-600"
      case "Completed":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{campaign.name}</DialogTitle>
            <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
          </div>
          <DialogDescription className="text-sm text-gray-500">Campaign details and information</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Creator Address</h3>
              <p className="mt-1 text-sm font-mono">{campaign.creatorAddress}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 text-sm">{campaign.category}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Funding Progress</h3>
              <span className="text-sm font-medium">
                {progressPercentage}% ({campaign.raised} ETH / {campaign.goal} ETH)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
            <p className="mt-1 text-sm">{campaign.timeline}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
            <p className="mt-1 text-sm text-gray-600">
              This campaign was created to support the development and growth of the project. Additional details about
              the campaign goals, milestones, and team can be found in the campaign documentation.
            </p>
          </div>
        </div>

        {/* <Separator /> */}
      </DialogContent>
    </Dialog>
  )
}
