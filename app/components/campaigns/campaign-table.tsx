import { Eye, Pencil, Trash2 } from "lucide-react"
import { StatusBadge } from "../ui/status-badge"
import  {Button}  from "../../components/ui/Button"
import { useMediaQuery } from "../../hooks/use-mobile"

interface Campaign {
  name: string
  creatorAddress: string
  category: string
  raised: number
  goal: number
  status: string
  timeline: string
}

interface CampaignTableProps {
  campaigns: Campaign[]
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
        <div className="text-sm text-gray-500 order-2 sm:order-1">Showing 1 to 5 of 1,847 results</div>
        <div className="flex space-x-1 order-1 sm:order-2">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-green-700 text-white hover:bg-green-800">
            1
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            3
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
