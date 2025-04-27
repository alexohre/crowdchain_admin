"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

import { Search, Eye, Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/app/components/smart-contract-modal';
import EditContractForm from '../../components/EditContractForm';

// Define the Contract type
interface Contract {
  id: number;
  name: string;
  address: string;
  network: string;
  version: string;
  status: string;
  lastInteraction: string;
  creationDate: string;
  deployer: string;
  transactions: number;
  gasUsed: string;
  description: string;
}

const SmartContractsPage = () => {
  // Sample contract data - you would fetch this from your API
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const contractsChartData = [
    { value: 10 },
    { value: 12 },
    { value: 11 },
    { value: 13 },
    { value: 18 },
    { value: 16 },
    { value: 19 }
  ];
  const networksChartData = [
    { value: 2 },
    { value: 3 },
    { value: 3 },
    { value: 4 },
    { value: 4 },
    { value: 4 },
    { value: 4 }
  ];
  const healthChartData = [
    { value: 90 },
    { value: 92 },
    { value: 95 },
    { value: 97 },
    { value: 98 },
    { value: 98.5 },
    { value: 98.5 }
  ];
  const transactionsChartData = [
    { value: 600 },
    { value: 650 },
    { value: 700 },
    { value: 800 },
    { value: 850 },
    { value: 870 },
    { value: 892 }
  ];

  // Fetch contracts data
  useEffect(() => {
    // In a real implementation, this would be an API call
    const fetchContracts = async () => {
      // Sample data matching your screenshot
      const data = [
        { 
          id: 1, 
          name: 'CampaignFactory', 
          address: '0x7b3b...F42d', 
          network: 'Mainnet', 
          version: 'v1.2.3', 
          status: 'Active', 
          lastInteraction: '2 hours ago',
          creationDate: '2025-01-15',
          deployer: '0x7b3b...F42d',
          transactions: 143,
          gasUsed: '1.25 ETH',
          description: 'Creates and manages marketing campaigns on the blockchain'
        },
        { 
          id: 2, 
          name: 'TokenVesting', 
          address: '0x9a2c...E31b', 
          network: 'Goerli', 
          version: 'v1.1.0', 
          status: 'Paused', 
          lastInteraction: '5 hours ago',
          creationDate: '2024-12-10',
          deployer: '0x9a2c...E31b',
          transactions: 87,
          gasUsed: '0.56 ETH',
          description: 'Manages token vesting schedules for team and investors'
        },
        { 
          id: 3, 
          name: 'RewardDistributor', 
          address: '0x3f4d...A92e', 
          network: 'Mainnet', 
          version: 'v1.0.2', 
          status: 'Active', 
          lastInteraction: '1 day ago',
          creationDate: '2025-03-22',
          deployer: '0x3f4d...A92e',
          transactions: 231,
          gasUsed: '2.78 ETH',
          description: 'Distributes rewards to users based on participation'
        },
        { 
          id: 4, 
          name: 'StakingPool', 
          address: '0x6b5a...C73f', 
          network: 'Mainnet', 
          version: 'v2.0.0', 
          status: 'Deprecated', 
          lastInteraction: '3 days ago',
          creationDate: '2024-09-05',
          deployer: '0x6b5a...C73f',
          transactions: 302,
          gasUsed: '3.21 ETH',
          description: 'Provides staking functionality for protocol tokens'
        },
        { 
          id: 5, 
          name: 'Governance', 
          address: '0x2d8e...B45c', 
          network: 'Goerli', 
          version: 'v1.0.0', 
          status: 'Active', 
          lastInteraction: '1 week ago',
          creationDate: '2025-02-18',
          deployer: '0x2d8e...B45c',
          transactions: 129,
          gasUsed: '0.89 ETH',
          description: 'Handles governance proposals and voting'
        },
        // Add more sample contracts to demonstrate pagination
        ...Array.from({ length: 20 }, (_, i) => ({
          id: i + 6,
          name: `Contract${i + 6}`,
          address: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
          network: i % 2 === 0 ? 'Mainnet' : 'Goerli',
          version: `v${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          status: ['Active', 'Paused', 'Deprecated'][Math.floor(Math.random() * 3)],
          lastInteraction: `${Math.floor(Math.random() * 30)} days ago`,
          creationDate: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
          deployer: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
          transactions: Math.floor(Math.random() * 500),
          gasUsed: `${(Math.random() * 5).toFixed(2)} ETH`,
          description: 'Sample contract description'
        }))
      ];
      
      setContracts(data);
      setFilteredContracts(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    };

    fetchContracts();
  }, []);

  // Handle search
  useEffect(() => {
    const results = contracts.filter(contract => 
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.network.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredContracts(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, contracts]);

  // Get current page items
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredContracts.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Handle view contract
  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setViewModalOpen(true);
  };

  // Handle edit contract
  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract);
    setEditModalOpen(true);
  };

  // Handle delete contract
  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract);
    setDeleteModalOpen(true);
  };

  // Confirm delete contract
  const confirmDelete = () => {
    if (!selectedContract) return;
    setContracts(contracts.filter(c => c.id !== selectedContract.id));
    setDeleteModalOpen(false);
  };

  // Handle edit submit
  const handleEditSubmit = (updatedContract: Contract) => {
    setContracts(contracts.map(c => 
      c.id === updatedContract.id ? updatedContract : c
    ));
    setEditModalOpen(false);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'Deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Smart Contracts</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Active Contracts</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-black">16<span className="text-green-500 text-base font-normal ml-1">+8.3%</span></p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={contractsChartData}>
                  <Line type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Deployed Networks</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-black">4<span className="text-green-500 text-base font-normal ml-1">+2.1%</span></p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={networksChartData}>
                  <Line type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Health Status</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-black">98.5%<span className="text-green-500 text-base font-normal ml-1">+5.7%</span></p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={healthChartData}>
                  <Line type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total Transactions</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-black">892<span className="text-green-500 text-base font-normal ml-1">+12.5%</span></p>
            </div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={transactionsChartData}>
                  <Line type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search, filter, and date range */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-10 pr-4 py-2 border rounded-md text-[#9CA3AF]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 border rounded-md text-[#4B5563]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.2492 0L0.750872 0C0.0846841 0 -0.251472 0.808312 0.220559 1.28034L6 7.06066L6 13.5C6 13.7447 6.1194 13.9741 6.3199 14.1144L8.8199 15.8638C9.31312 16.2091 10 15.8592 10 15.2494L10 7.06066L15.7796 1.28034C16.2507 0.80925 15.9168 0 15.2492 0Z" fill="#4B5563"/>
            </svg>
            Filters
          </button>
          <button className="flex items-center gap-1 px-4 py-2 border rounded-md text-[#4B5563]">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <defs>
                <clipPath id="clipPath5092014464">
                  <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath5092014464)">
                <defs>
                  <clipPath id="clipPath7596278622">
                    <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 -0 -0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPath7596278622)">
                  <path d="M0 14.5C0 15.3281 0.671875 16 1.5 16L12.5 16C13.3281 16 14 15.3281 14 14.5L14 6L0 6L0 14.5ZM10 8.375C10 8.16875 10.1687 8 10.375 8L11.625 8C11.8313 8 12 8.16875 12 8.375L12 9.625C12 9.83125 11.8313 10 11.625 10L10.375 10C10.1687 10 10 9.83125 10 9.625L10 8.375ZM10 12.375C10 12.1687 10.1687 12 10.375 12L11.625 12C11.8313 12 12 12.1687 12 12.375L12 13.625C12 13.8313 11.8313 14 11.625 14L10.375 14C10.1687 14 10 13.8313 10 13.625L10 12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8L7.625 8C7.83125 8 8 8.16875 8 8.375L8 9.625C8 9.83125 7.83125 10 7.625 10L6.375 10C6.16875 10 6 9.83125 6 9.625L6 8.375ZM6 12.375C6 12.1687 6.16875 12 6.375 12L7.625 12C7.83125 12 8 12.1687 8 12.375L8 13.625C8 13.8313 7.83125 14 7.625 14L6.375 14C6.16875 14 6 13.8313 6 13.625L6 12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8L3.625 8C3.83125 8 4 8.16875 4 8.375L4 9.625C4 9.83125 3.83125 10 3.625 10L2.375 10C2.16875 10 2 9.83125 2 9.625L2 8.375ZM2 12.375C2 12.1687 2.16875 12 2.375 12L3.625 12C3.83125 12 4 12.1687 4 12.375L4 13.625C4 13.8313 3.83125 14 3.625 14L2.375 14C2.16875 14 2 13.8313 2 13.625L2 12.375ZM12.5 2L11 2L11 0.5C11 0.225 10.775 0 10.5 0L9.5 0C9.225 0 9 0.225 9 0.5L9 2L5 2L5 0.5C5 0.225 4.775 0 4.5 0L3.5 0C3.225 0 3 0.225 3 0.5L3 2L1.5 2C0.671875 2 0 2.67188 0 3.5L0 5L14 5L14 3.5C14 2.67188 13.3281 2 12.5 2Z" fillRule="nonzero" transform="matrix(1 0 0 1 1 0)" fill="rgb(75, 85, 99)"/>
                </g>
              </g>
            </svg>
            Date Range
          </button>
        </div>
        <button className="px-4 py-2 bg-green-700 text-white rounded-md">
          Export
        </button>
      </div>
      
      {/* Smart contracts table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Interaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentItems().map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.network}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.version}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{contract.lastInteraction}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewContract(contract)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteContract(contract)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredContracts.length)} to {Math.min(currentPage * itemsPerPage, filteredContracts.length)} of {filteredContracts.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 border rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show pages around current page
              let pageNum = i + 1;
              
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    pageNum === currentPage ? 'bg-green-700 text-white' : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* View Modal */}
      {viewModalOpen && selectedContract && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Contract Details: ${selectedContract.name}`}
        >
          <div className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contract Name</h3>
                <p className="mt-1">{selectedContract.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">{selectedContract.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Network</h3>
                <p className="mt-1">{selectedContract.network}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Version</h3>
                <p className="mt-1">{selectedContract.version}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedContract.status)}`}>
                    {selectedContract.status}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Interaction</h3>
                <p className="mt-1">{selectedContract.lastInteraction}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Creation Date</h3>
                <p className="mt-1">{selectedContract.creationDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Deployer</h3>
                <p className="mt-1">{selectedContract.deployer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                <p className="mt-1">{selectedContract.transactions}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gas Used</h3>
                <p className="mt-1">{selectedContract.gasUsed}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{selectedContract.description}</p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => handleEditContract(selectedContract)}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900"
              >
                Edit
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Edit Modal */}
      {editModalOpen && selectedContract && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Contract: ${selectedContract.name}`}
        >
          <EditContractForm 
            contract={selectedContract} 
            onSubmit={handleEditSubmit} 
            onCancel={() => setEditModalOpen(false)} 
          />
        </Modal>
      )}
      
      {/* Delete Modal */}
      {deleteModalOpen && selectedContract && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          <div className="space-y-4 text-black">
            <p>Are you sure you want to delete the contract <strong>{selectedContract.name}</strong>?</p>
            <p className="text-red-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SmartContractsPage;
