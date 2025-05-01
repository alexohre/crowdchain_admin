"use client"

import { useState, useEffect } from "react"
import { Eye, Flag, Ban, Search, Filter, Calendar, Download } from "lucide-react"
import { ViewModal } from "@/app/components/security/ViewModal"
import { ConfirmationModal } from "@/app/components/security/ConfirmationModal"

interface SecurityEntry {
  walletAddress: string
  userType: "Creator" | "Contributor" | "Admin"
  ethContributed: number
  projectsBacked: number
  lastActive: string
  status: "Active" | "Flagged" | "Suspended"
}

// Sample data for demonstration
const securityData: SecurityEntry[] = [
  {
    walletAddress: "0x7b3b...F42d",
    userType: "Creator",
    ethContributed: 234.5,
    projectsBacked: 12,
    lastActive: "2 hours ago",
    status: "Active"
  },
  {
    walletAddress: "0x9a2c...E31b",
    userType: "Contributor",
    ethContributed: 45.2,
    projectsBacked: 8,
    lastActive: "5 hours ago",
    status: "Flagged"
  },
  {
    walletAddress: "0x3f4d...A92e",
    userType: "Admin",
    ethContributed: 532.8,
    projectsBacked: 24,
    lastActive: "1 day ago",
    status: "Active"
  },
  {
    walletAddress: "0x6b5a...C73f",
    userType: "Creator",
    ethContributed: 89.3,
    projectsBacked: 3,
    lastActive: "3 days ago",
    status: "Suspended"
  },
  {
    walletAddress: "0x2d8e...B45c",
    userType: "Contributor",
    ethContributed: 12.7,
    projectsBacked: 5,
    lastActive: "1 week ago",
    status: "Active"
  },
  // Add more mock data for pagination testing
  ...Array(20).fill(0).map((_, i) => ({
    walletAddress: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    userType: ["Creator", "Contributor", "Admin"][Math.floor(Math.random() * 3)] as "Creator" | "Contributor" | "Admin",
    ethContributed: Number((Math.random() * 500).toFixed(1)),
    projectsBacked: Math.floor(Math.random() * 30),
    lastActive: ["2 hours ago", "1 day ago", "3 days ago", "1 week ago", "2 weeks ago"][Math.floor(Math.random() * 5)],
    status: ["Active", "Flagged", "Suspended"][Math.floor(Math.random() * 3)] as "Active" | "Flagged" | "Suspended"
  }))
]

export default function SecurityPage() {
  // State for search, filters, and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState<SecurityEntry[]>(securityData)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(securityData.length)
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    userType: string[];
  }>({
    status: [],
    userType: []
  })
  
  // State for the filter dropdown
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // State for the date range filter dropdown
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: string | null;
    to: string | null;
  }>({
    from: null,
    to: null
  })

  // Stats for the dashboard
  const stats = {
    suspiciousActivities: {
      count: 47,
      change: -2.1
    },
    secureWallets: {
      count: 1245,
      change: 8.3
    },
    smartContractEvents: {
      count: 892,
      change: 5.7
    },
    blacklistedWallets: {
      count: 24,
      change: -2.1
    }
  }

  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<SecurityEntry | null>(null)
  const [actionType, setActionType] = useState<"flag" | "suspend" | null>(null)

  // Apply search and filters
  useEffect(() => {
    let result = securityData

    // Apply search
    if (searchTerm) {
      result = result.filter(entry => 
        entry.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filters
    if (selectedFilters.status.length > 0) {
      result = result.filter(entry => selectedFilters.status.includes(entry.status))
    }

    // Apply user type filters
    if (selectedFilters.userType.length > 0) {
      result = result.filter(entry => selectedFilters.userType.includes(entry.userType))
    }

    // Apply date range filter if specified
    if (dateRange.from || dateRange.to) {
      // In a real implementation, you would convert lastActive to a Date and compare
      // For now, we'll just simulate this filter
      result = result.filter(entry => {
        if (dateRange.from && dateRange.to) {
          return true // Apply proper date range filter in real implementation
        } else if (dateRange.from) {
          return true // Apply from date filter
        } else if (dateRange.to) {
          return true // Apply to date filter
        }
        return true
      })
    }

    setFilteredData(result)
    setTotalItems(result.length)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedFilters, dateRange])

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  // Toggle filter selection
  const toggleFilter = (type: "status" | "userType", value: string) => {
    setSelectedFilters(prev => {
      const current = [...prev[type]]
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: current.filter(item => item !== value)
        }
      } else {
        return {
          ...prev,
          [type]: [...current, value]
        }
      }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      status: [],
      userType: []
    })
    setDateRange({
      from: null,
      to: null
    })
    setSearchTerm("")
  }

  // Handle view wallet details
  const handleViewWallet = (entry: SecurityEntry) => {
    setSelectedEntry(entry)
    setViewModalOpen(true)
  }

  // Handle flag wallet
  const handleFlagWallet = (entry: SecurityEntry) => {
    setSelectedEntry(entry)
    setActionType("flag")
    setConfirmModalOpen(true)
  }

  // Handle suspend wallet
  const handleSuspendWallet = (entry: SecurityEntry) => {
    setSelectedEntry(entry)
    setActionType("suspend")
    setConfirmModalOpen(true)
  }

  // Confirm action handler
  const handleConfirmAction = () => {
    // In a real app, this would call an API to update the wallet status
    if (selectedEntry && actionType) {
      const updatedData = filteredData.map(entry => {
        if (entry.walletAddress === selectedEntry.walletAddress) {
          return {
            ...entry,
            status: (actionType === "flag" ? "Flagged" : "Suspended") as "Flagged" | "Suspended"
          }
        }
        return entry
      })
      setFilteredData(updatedData)
      setConfirmModalOpen(false)
    }
  }

  // Export data
  const handleExport = () => {
    // In a real app, this would generate a CSV or similar export
    console.log("Exporting data:", filteredData)
    alert("Data exported successfully")
  }

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Security Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Suspicious Activities */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
            <span className={`text-sm font-medium ${stats.suspiciousActivities.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.suspiciousActivities.change > 0 ? '+' : ''}{stats.suspiciousActivities.change}%
            </span>
          </div>
          <h2 className="text-2xl font-bold">{stats.suspiciousActivities.count}</h2>
          <p className="text-sm text-gray-500">Suspicious Activities</p>
          <div className="mt-2">
            <svg className="w-full h-6">
              <path 
                d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15" 
                fill="none" 
                stroke="#f87171" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Secure Wallets */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2 bg-green-100 rounded-full">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${stats.secureWallets.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.secureWallets.change > 0 ? '+' : ''}{stats.secureWallets.change}%
            </span>
          </div>
          <h2 className="text-2xl font-bold">{stats.secureWallets.count}</h2>
          <p className="text-sm text-gray-500">Secure Wallets</p>
          <div className="mt-2">
            <svg className="w-full h-6">
              <path 
                d="M0,15 Q10,10 20,5 T40,10 T60,5 T80,10 T100,5" 
                fill="none" 
                stroke="#34d399" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Smart Contract Events */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${stats.smartContractEvents.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.smartContractEvents.change > 0 ? '+' : ''}{stats.smartContractEvents.change}%
            </span>
          </div>
          <h2 className="text-2xl font-bold">{stats.smartContractEvents.count}</h2>
          <p className="text-sm text-gray-500">Smart Contract Events</p>
          <div className="mt-2">
            <svg className="w-full h-6">
              <path 
                d="M0,15 Q10,10 20,5 T40,10 T60,5 T80,10 T100,5" 
                fill="none" 
                stroke="#60a5fa" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Blacklisted Wallets */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <span className={`text-sm font-medium ${stats.blacklistedWallets.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {stats.blacklistedWallets.change > 0 ? '+' : ''}{stats.blacklistedWallets.change}%
            </span>
          </div>
          <h2 className="text-2xl font-bold">{stats.blacklistedWallets.count}</h2>
          <p className="text-sm text-gray-500">Blacklisted Wallets</p>
          <div className="mt-2">
            <svg className="w-full h-6">
              <path 
                d="M0,15 Q10,5 20,15 T40,15 T60,15 T80,15 T100,15" 
                fill="none" 
                stroke="#f87171" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Search, Filter and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters Dropdown */}
        <div className="relative">
          <button
            className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 text-gray-500" />
            <span>Filters</span>
            {(selectedFilters.status.length > 0 || selectedFilters.userType.length > 0) && (
              <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {selectedFilters.status.length + selectedFilters.userType.length}
              </span>
            )}
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Filter Options</h3>
                  <button 
                    className="text-sm text-green-600 hover:text-green-800"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <div className="space-y-1">
                    {["Active", "Flagged", "Suspended"].map((status) => (
                      <div key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`status-${status}`}
                          checked={selectedFilters.status.includes(status)}
                          onChange={() => toggleFilter("status", status)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700">
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">User Type</h4>
                  <div className="space-y-1">
                    {["Creator", "Contributor", "Admin"].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          checked={selectedFilters.userType.includes(type)}
                          onChange={() => toggleFilter("userType", type)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Date Range Dropdown */}
        <div className="relative">
          <button
            className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Date Range</span>
            {(dateRange.from || dateRange.to) && (
              <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                ✓
              </span>
            )}
          </button>
          
          {isDateFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Date Range</h3>
                  <button 
                    className="text-sm text-green-600 hover:text-green-800"
                    onClick={() => setDateRange({ from: null, to: null })}
                  >
                    Clear
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={dateRange.from || ""}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={dateRange.to || ""}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                  </div>
                  
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                    onClick={() => setIsDateFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Export Button */}
        <button
          className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETH Contributed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects Backed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.walletAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.userType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.ethContributed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.projectsBacked}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{entry.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entry.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "Flagged"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewWallet(entry)}
                          className="text-gray-500 hover:text-gray-700"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleFlagWallet(entry)}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="Flag Wallet"
                          disabled={entry.status === "Flagged" || entry.status === "Suspended"}
                        >
                          <Flag className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleSuspendWallet(entry)}
                          className="text-red-500 hover:text-red-700"
                          title="Suspend Wallet"
                          disabled={entry.status === "Suspended"}
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} results
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, Math.ceil(totalItems / itemsPerPage)) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNumber
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          {/* Show next button if there are more pages */}
          {currentPage < Math.ceil(totalItems / itemsPerPage) && (
            <button
              onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(totalItems / itemsPerPage)))}
              className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        entry={selectedEntry}
      />
      
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        entry={selectedEntry}
      />
    </div>
  )
}