"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { X } from "lucide-react"

interface SecurityEntry {
  walletAddress: string
  userType: "Creator" | "Contributor" | "Admin"
  ethContributed: number
  projectsBacked: number
  lastActive: string
  status: "Active" | "Flagged" | "Suspended"
}

interface ViewModalProps {
  isOpen: boolean
  onClose: () => void
  entry: SecurityEntry | null
}

export function ViewModal({ isOpen, onClose, entry }: ViewModalProps) {
  if (!entry) return null

  // Mock additional data for the view modal
  const activityHistory = [
    { date: "2025-04-28", action: "Logged in", details: "IP: 192.168.1.1" },
    { date: "2025-04-27", action: "Contributed to project", details: "Project: EcoChain, Amount: 5.2 ETH" },
    { date: "2025-04-25", action: "Created project", details: "Project: GreenEnergy" },
    { date: "2025-04-20", action: "Account created", details: "Email verification completed" },
  ]

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Wallet Details
                  </Dialog.Title>
                  <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2 space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                    <p className="font-medium">{entry.walletAddress}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">User Type</p>
                      <p className="font-medium">{entry.userType}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : entry.status === "Flagged"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">ETH Contributed</p>
                      <p className="font-medium">{entry.ethContributed} ETH</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Projects Backed</p>
                      <p className="font-medium">{entry.projectsBacked}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Activity History</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {activityHistory.map((activity, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{activity.date}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs">{activity.action}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{activity.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
