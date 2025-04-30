"use client"

import { useState } from "react"
import { AlertTriangle, Eye, Flag, AlertCircle, Download, Search, Filter, Clock } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import Sidebar from "@/app/components/dashboard/Sidebar"
import { PaginationInfo } from "@/app/components/PaginationInfo"
import { Pagination } from "@/app/components/pagination"
import Footer from "@/app/components/Footer"
import { ViewModal } from "@/app/components/security/ViewModal"
import { ConfirmationModal } from "@/app/components/security/ConfirmationModal"

// Types
interface SecurityEntry {
  walletAddress: string
  userType: "Creator" | "Contributor" | "Admin"
  ethContributed: number
  projectsBacked: number
  lastActive: string
  status: "Active" | "Flagged" | "Suspended"
}

export default function SecurityPage() {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(24582)

  // State for modals
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<SecurityEntry | null>(null)
  const [actionType, setActionType] = useState<"flag" | "suspend" | null>(null)

  // Mock data for the security entries
  const [securityEntries, setSecurityEntries] = useState<SecurityEntry[]>([
    {
      walletAddress: "0x7b3b...F42d",
      userType: "Creator",
      ethContributed: 234.5,
      projectsBacked: 12,
      lastActive: "2 hours ago",
      status: "Active",
    },
    {
      walletAddress: "0x9a2c...E31b",
      userType: "Contributor",
      ethContributed: 45.2,
      projectsBacked: 8,
      lastActive: "5 hours ago",
      status: "Flagged",
    },
    {
      walletAddress: "0x3f4d...A92e",
      userType: "Admin",
      ethContributed: 532.8,
      projectsBacked: 24,
      lastActive: "1 day ago",
      status: "Active",
    },
    {
      walletAddress: "0x6b5a...C73f",
      userType: "Creator",
      ethContributed: 89.3,
      projectsBacked: 3,
      lastActive: "3 days ago",
      status: "Suspended",
    },
    {
      walletAddress: "0x2d8e...B45c",
      userType: "Contributor",
      ethContributed: 12.7,
      projectsBacked: 5,
      lastActive: "1 week ago",
      status: "Active",
    },
  ])

  // Stats data
  const stats = [
    {
      title: "Suspicious Activities",
      value: 47,
      change: -2.1,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      chartColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Secure Wallets",
      value: 1245,
      change: 8.3,
      icon: (
        <div className="h-5 w-5 text-green-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      ),
      chartColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Smart Contract Events",
      value: 892,
      change: 5.7,
      icon: (
        <div className="h-5 w-5 text-blue-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      chartColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Blacklisted Wallets",
      value: 24,
      change: -2.1,
      icon: (
        <div className="h-5 w-5 text-red-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
        </div>
      ),
      chartColor: "text-red-500",
      bgColor: "bg-red-50",
    },
  ]

  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Export function
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Wallet Address", "User Type", "ETH Contributed", "Projects Backed", "Last Active", "Status"]
    const csvContent = [
      headers.join(","),
      ...securityEntries.map((entry) =>
        [
          entry.walletAddress,
          entry.userType,
          entry.ethContributed,
          entry.projectsBacked,
          entry.lastActive,
          entry.status,
        ].join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "security_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle view entry
  const handleViewEntry = (entry: SecurityEntry) => {
    setSelectedEntry(entry)
    setViewModalOpen(true)
  }

  // Handle flag or suspend
  const handleAction = (entry: SecurityEntry, action: "flag" | "suspend") => {
    setSelectedEntry(entry)
    setActionType(action)
    setConfirmModalOpen(true)
  }

  // Confirm action
  const confirmAction = () => {
    if (selectedEntry && actionType) {
      // Update the entry status with explicit type
      const updatedEntries: SecurityEntry[] = securityEntries.map((entry) => {
        if (entry.walletAddress === selectedEntry.walletAddress) {
          return {
            ...entry,
            status: actionType === "flag" ? "Flagged" as const : "Suspended" as const,
          }
        }
        return entry
      })
  
      setSecurityEntries(updatedEntries)
      setConfirmModalOpen(false)
    }
  }
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-[220px] border-r">
          <Sidebar />
        </div>
        <div className="flex-1">
          <div className="p-6">
            <h1 className="text-xl font-semibold mb-6">Security Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>{stat.icon}</div>
                    <div className={`text-sm font-medium ${stat.change > 0 ? "text-green-600" : "text-red-500"}`}>
                      {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h2 className="text-2xl font-bold">{stat.value.toLocaleString()}</h2>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                  <div className="mt-2">
                    {/* Simple chart representation */}
                    <svg className={`w-full h-6 ${stat.chartColor}`} viewBox="0 0 100 20">
                      {stat.change > 0 ? (
                        <path d="M0,10 Q25,5 50,10 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
                      ) : (
                        <path d="M0,5 Q25,10 50,5 T100,10" fill="none" stroke="currentColor" strokeWidth="2" />
                      )}
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-[350px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users"
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50">
                  <Clock className="h-4 w-4" />
                  Date Range
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ETH Contributed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects Backed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityEntries.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.walletAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.userType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-1 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            <path d="M9.5 9.5h5v5h-5z" />
                          </svg>
                          {entry.ethContributed}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.projectsBacked}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entry.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : entry.status === "Flagged"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleViewEntry(entry)} className="text-gray-400 hover:text-gray-600">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleAction(entry, "flag")}
                            className="text-gray-400 hover:text-yellow-600"
                            disabled={entry.status === "Flagged"}
                          >
                            <Flag className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleAction(entry, "suspend")}
                            className="text-gray-400 hover:text-red-600"
                            disabled={entry.status === "Suspended"}
                          >
                            <AlertCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <PaginationInfo currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalItems / itemsPerPage)}
                goToPage={goToPage}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
                hasNextPage={currentPage < Math.ceil(totalItems / itemsPerPage)}
                hasPreviousPage={currentPage > 1}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modals */}
      <ViewModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} entry={selectedEntry} />

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmAction}
        actionType={actionType}
        entry={selectedEntry}
      />
    </div>
  )
}
