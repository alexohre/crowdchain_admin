'use client'
import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import { CSVLink } from 'react-csv';

// Define TypeScript types
interface User {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  role: 'Admin' | 'Moderator' | 'Creator' | 'Backer';
  status: 'Active' | 'Inactive' | 'Suspended';
  registrationDate: string;
  lastLogin: string;
  contributionsCount: number;
}

interface SummaryStats {
  totalUsers: number;
  activeUsers: number;
  newUsersTrend: number;
  pendingVerifications: number;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SummaryStats>({ 
    totalUsers: 0, 
    activeUsers: 0, 
    newUsersTrend: 0, 
    pendingVerifications: 0 
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateRange: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const usersPerPage = 10;

  // Fetch users and stats
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // This would be your actual API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            walletAddress: '0x7e5b...F42d',
            role: 'Admin',
            status: 'Active',
            registrationDate: '2025-01-10',
            lastLogin: '2025-04-20',
            contributionsCount: 15
          },
          {
            id: '2',
            name: 'Alice Smith',
            email: 'alice@example.com',
            walletAddress: '0x192c...E31b',
            role: 'Creator',
            status: 'Active',
            registrationDate: '2025-02-15',
            lastLogin: '2025-04-19',
            contributionsCount: 7
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            walletAddress: '0x3f4d...A02e',
            role: 'Backer',
            status: 'Suspended',
            registrationDate: '2024-11-05',
            lastLogin: '2025-03-10',
            contributionsCount: 32
          },
          {
            id: '4',
            name: 'Emma Wilson',
            email: 'emma@example.com',
            walletAddress: '0x405d...C73f',
            role: 'Moderator',
            status: 'Active',
            registrationDate: '2025-03-20',
            lastLogin: '2025-04-22',
            contributionsCount: 0
          },
          {
            id: '5',
            name: 'Michael Brown',
            email: 'michael@example.com',
            walletAddress: '0x298a...845c',
            role: 'Backer',
            status: 'Inactive',
            registrationDate: '2024-12-03',
            lastLogin: '2025-02-25',
            contributionsCount: 5
          }
        ];

        const mockStats: SummaryStats = {
          totalUsers: 2718,
          activeUsers: 1485,
          newUsersTrend: 12.3,
          pendingVerifications: 43
        };

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setStats(mockStats);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower) ||
        user.walletAddress.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply role filter
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      // Implementation would depend on your date range format
      // This is just a placeholder for the actual filtering logic
      const today = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'last7days':
          filterDate.setDate(today.getDate() - 7);
          result = result.filter(user => new Date(user.registrationDate) >= filterDate);
          break;
        case 'last30days':
          filterDate.setDate(today.getDate() - 30);
          result = result.filter(user => new Date(user.registrationDate) >= filterDate);
          break;
        case 'last90days':
          filterDate.setDate(today.getDate() - 90);
          result = result.filter(user => new Date(user.registrationDate) >= filterDate);
          break;
        default:
          break;
      }
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, filters, users]);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Export data for CSV
  const csvData = filteredUsers.map(user => ({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    'Wallet Address': user.walletAddress,
    Role: user.role,
    Status: user.status,
    'Registration Date': user.registrationDate,
    'Last Login': user.lastLogin,
    'Contributions': user.contributionsCount
  }));

  // SVG Export handler
  const handleExportSVG = () => {
    // Create user data table as SVG
    const svgWidth = 800;
    const svgHeight = 600;
    const rowHeight = 30;
    const colWidths = [50, 120, 140, 120, 90, 90, 100, 90]; // Column widths
    const headerHeight = 40;
    
    // Create SVG content
    let svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <style>
          text { font-family: Arial, sans-serif; font-size: 12px; }
          .header { font-weight: bold; fill: #4B5563; }
          .row-even { fill: #F9FAFB; }
          .row-odd { fill: #FFFFFF; }
          .cell { fill: #1F2937; }
          .active { fill: #059669; }
          .inactive { fill: #6B7280; }
          .suspended { fill: #DC2626; }
        </style>
        
        <!-- Title -->
        <text x="${svgWidth / 2}" y="25" text-anchor="middle" font-size="16" font-weight="bold">User Management Report</text>
        
        <!-- Header Row -->
        <rect x="10" y="40" width="${svgWidth - 20}" height="${headerHeight}" fill="#F3F4F6" />
    `;
    
    // Add header text
    const headers = ['ID', 'Name', 'Email', 'Wallet', 'Role', 'Status', 'Registered', 'Contrib.'];
    let xPos = 20;
    headers.forEach((header, i) => {
      svgContent += `<text x="${xPos}" y="65" class="header">${header}</text>`;
      xPos += colWidths[i];
    });
    
    // Add data rows (limit to first 15 for reasonable SVG size)
    const visibleUsers = filteredUsers.slice(0, 15);
    visibleUsers.forEach((user, i) => {
      const yPos = 50 + headerHeight + (i * rowHeight);
      const rowClass = i % 2 === 0 ? 'row-even' : 'row-odd';
      
      // Row background
      svgContent += `<rect x="10" y="${yPos}" width="${svgWidth - 20}" height="${rowHeight}" class="${rowClass}" />`;
      
      // Cell data
      let xPos = 20;
      
      // ID
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.id}</text>`;
      xPos += colWidths[0];
      
      // Name
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.name}</text>`;
      xPos += colWidths[1];
      
      // Email
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.email}</text>`;
      xPos += colWidths[2];
      
      // Wallet
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.walletAddress}</text>`;
      xPos += colWidths[3];
      
      // Role
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.role}</text>`;
      xPos += colWidths[4];
      
      // Status (with color)
      const statusClass = user.status.toLowerCase();
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="${statusClass}">${user.status}</text>`;
      xPos += colWidths[5];
      
      // Registration date
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.registrationDate}</text>`;
      xPos += colWidths[6];
      
      // Contributions
      svgContent += `<text x="${xPos}" y="${yPos + 20}" class="cell">${user.contributionsCount}</text>`;
    });
    
    // Add summary stats at bottom
    const statsY = 50 + headerHeight + (visibleUsers.length * rowHeight) + 40;
    svgContent += `
      <text x="20" y="${statsY}" font-weight="bold">Summary Stats</text>
      <text x="20" y="${statsY + 25}">Total Users: ${stats.totalUsers}</text>
      <text x="150" y="${statsY + 25}">Active Users: ${stats.activeUsers}</text>
      <text x="300" y="${statsY + 25}">New User Trend: +${stats.newUsersTrend}%</text>
      <text x="470" y="${statsY + 25}">Pending Verifications: ${stats.pendingVerifications}</text>
    `;
    
    // Close SVG
    svgContent += '</svg>';
    
    // Create a blob and download link
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crowdchain-users.svg';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };

  // Delete user handler
  const handleDeleteUser = (userId: string) => {
    // In a real application, you would call an API to delete the user
    // For this example, we'll just filter them out of the local state
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalUsers: prev.totalUsers - 1,
      activeUsers: prev.activeUsers - (users.find(u => u.id === userId)?.status === 'Active' ? 1 : 0)
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Total Users</h4>
          <div className="flex items-center">
            <p className="text-2xl font-semibold">{stats.totalUsers.toLocaleString()}</p>
            <span className="ml-2 text-sm text-green-500">+{stats.newUsersTrend}%</span>
          </div>
          <div className="mt-2 h-8 bg-gray-100 rounded">
            {/* Simple chart placeholder */}
            <div className="h-full w-3/4 bg-green-100 rounded relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-3/4 border-r border-green-400 mx-1"></div>
                <div className="h-1/2 border-r border-green-400 mx-1"></div>
                <div className="h-2/3 border-r border-green-400 mx-1"></div>
                <div className="h-3/5 border-r border-green-400 mx-1"></div>
                <div className="h-4/5 border-r border-green-400 mx-1"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Active Users</h4>
          <p className="text-2xl font-semibold">{stats.activeUsers.toLocaleString()}</p>
          <div className="mt-2 h-8 bg-gray-100 rounded">
            {/* Simple chart placeholder */}
            <div className="h-full w-2/3 bg-blue-100 rounded relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1/2 border-r border-blue-400 mx-1"></div>
                <div className="h-3/4 border-r border-blue-400 mx-1"></div>
                <div className="h-2/3 border-r border-blue-400 mx-1"></div>
                <div className="h-1/3 border-r border-blue-400 mx-1"></div>
                <div className="h-1/2 border-r border-blue-400 mx-1"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">New Users Trend</h4>
          <p className="text-2xl font-semibold">+{stats.newUsersTrend}%</p>
          <div className="mt-2 h-8 bg-gray-100 rounded">
            {/* Simple chart placeholder */}
            <div className="h-full w-1/2 bg-purple-100 rounded relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1/4 border-r border-purple-400 mx-1"></div>
                <div className="h-2/3 border-r border-purple-400 mx-1"></div>
                <div className="h-3/4 border-r border-purple-400 mx-1"></div>
                <div className="h-1/2 border-r border-purple-400 mx-1"></div>
                <div className="h-2/3 border-r border-purple-400 mx-1"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-sm text-gray-500">Pending Verifications</h4>
          <p className="text-2xl font-semibold">{stats.pendingVerifications}</p>
          <div className="mt-2 h-8 bg-gray-100 rounded">
            {/* Simple chart placeholder */}
            <div className="h-full w-1/4 bg-orange-100 rounded relative">
              <div className="absolute inset-0 flex items-center">
                <div className="h-1/2 border-r border-orange-400 mx-1"></div>
                <div className="h-3/4 border-r border-orange-400 mx-1"></div>
                <div className="h-1/4 border-r border-orange-400 mx-1"></div>
                <div className="h-1/2 border-r border-orange-400 mx-1"></div>
                <div className="h-1/3 border-r border-orange-400 mx-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users"
            className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex space-x-4">
          <select 
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Creator">Creator</option>
            <option value="Backer">Backer</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
          </select>
          
          {/* <CSVLink
            data={csvData}
            filename="crowdchain-users.csv"
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FiDownload className="mr-2" /> Export CSV
          </CSVLink> */}
          
          {/* SVG Export Button */}
          <button
            onClick={handleExportSVG}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
           Export
          </button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.walletAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.registrationDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.contributionsCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View Details">
                      <FiEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Edit User">
                      <FiEdit />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="flex items-center justify-center px-3 py-1 border rounded text-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show current page, 2 before and 2 after when possible
            let pageNum: number;
            
            if (totalPages <= 5) {
              // Show all pages if we have 5 or fewer
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              // We're near the start
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              // We're near the end
              pageNum = totalPages - 4 + i;
            } else {
              // We're in the middle
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button 
                key={pageNum}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white' 
                    : 'border text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            className="flex items-center justify-center px-3 py-1 border rounded text-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next <FiChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;













