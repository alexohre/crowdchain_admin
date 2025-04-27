"use client";
import React, { useState } from "react";
import { Table } from "@/app/components/dashboard/Table";
import RoleBadge from "@/app/components/dashboard/RoleBadge";
import AddAdminModal from "@/app/components/dashboard/AddAdminModal";
import ConfirmationModal from "@/app/components/dashboard/ConfirmationModal";
import { AdminUser, AdminRole } from "@/app/types/admin";
import { canDeleteAdmin } from "@/app/utils/validation";
import { toast } from "react-hot-toast";

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium ${
        isActive
          ? "text-green-700 border-b-2 border-green-700"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"General" | "Access Control" | "Notifications">("General");
  const [platformName, setPlatformName] = useState("CrowdChain");
  const [platformDescription, setPlatformDescription] = useState(
    "Decentralized crowdfunding platform powered by blockchain technology."
  );
  const [platformFee, setPlatformFee] = useState("2.5");
  const [defaultCurrency, setDefaultCurrency] = useState("ETH");
  const [enableCampaignCreation, setEnableCampaignCreation] = useState(true);
  const [enableRBAC, setEnableRBAC] = useState(true);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

  // Sample admin users data - In a real app, this would come from your backend
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { walletAddress: "0x1234...abcd", role: "Super Admin", dateAdded: "2024-02-20" },
    { walletAddress: "0x9876...eeff", role: "Moderator", dateAdded: "2024-02-21" },
  ]);

  // Current user info - In a real app, this would come from your auth context
  const currentUser = {
    walletAddress: "0x1234...abcd",
    role: "Super Admin" as AdminRole,
  };

  const handleAddAdmin = async (data: { walletAddress: string; role: AdminRole }) => {
    try {
      // In a real app, this would be an API call
      const newAdmin: AdminUser = {
        ...data,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      
      setAdminUsers([...adminUsers, newAdmin]);
      toast.success("Admin added successfully");
    } catch (error) {
      toast.error("Failed to add admin");
      console.error("Error adding admin:", error);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const validationResult = canDeleteAdmin(
      currentUser.walletAddress,
      admin.walletAddress,
      currentUser.role,
      admin.role
    );

    if (!validationResult.isValid) {
      toast.error(validationResult.message || "An error occurred");
      return;
    }

    setAdminToDelete(admin);
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      // In a real app, this would be an API call
      setAdminUsers(adminUsers.filter(admin => admin.walletAddress !== adminToDelete.walletAddress));
      toast.success("Admin removed successfully");
    } catch (error) {
      toast.error("Failed to remove admin");
      console.error("Error removing admin:", error);
    } finally {
      setIsDeleteConfirmationOpen(false);
      setAdminToDelete(null);
    }
  };

  const handleRefreshUser = async (user: AdminUser) => {
    try {
      // In a real app, this would refresh the user's data from the blockchain/backend
      toast.success("Admin data refreshed");
    } catch (error) {
      toast.error("Failed to refresh admin data");
      console.error("Error refreshing admin:", error);
    }
  };

  const tabs = ["General", "Access Control", "Notifications"] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-6">Platform Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform Description
                  </label>
                  <textarea
                    value={platformDescription}
                    onChange={(e) => setPlatformDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Fee (%)
                    </label>
                    <input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Currency
                    </label>
                    <select
                      value={defaultCurrency}
                      onChange={(e) => setDefaultCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="ETH">ETH</option>
                      <option value="BTC">BTC</option>
                      <option value="USDT">USDT</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Enable Campaign Creation</h3>
                      <p className="text-sm text-gray-500">Allow users to create new campaigns</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableCampaignCreation}
                        onChange={(e) => setEnableCampaignCreation(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Access Control":
        return (
          <div className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Table
                data={adminUsers}
                columns={[
                  {
                    header: "Wallet Address",
                    accessor: "walletAddress",
                  },
                  {
                    header: "Role",
                    accessor: "role",
                    cell: (value) => <RoleBadge role={value} />,
                  },
                  {
                    header: "Date Added",
                    accessor: "dateAdded",
                  },
                ]}
                actions={{
                  refresh: handleRefreshUser,
                  delete: handleDeleteAdmin,
                }}
                headerActions={
                  <button
                    onClick={() => setIsAddAdminModalOpen(true)}
                    className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors"
                  >
                    + Add Admin
                  </button>
                }
              />

              <div className="mt-8 border border-[#E5E7EB] rounded-[8px] p-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Enable Role-Based Access Control (RBAC)</h3>
                    <p className="text-sm text-gray-500">Enable advanced permissions if smart contract roles are implemented</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableRBAC}
                      onChange={(e) => setEnableRBAC(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="mt-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-medium">Notification Settings</h2>
              <p className="text-gray-500 mt-2">Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </div>

      {renderTabContent()}

      <AddAdminModal
        open={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onSubmit={handleAddAdmin}
        currentWalletAddress={currentUser.walletAddress}
      />

      <ConfirmationModal
        open={isDeleteConfirmationOpen}
        onClose={() => {
          setIsDeleteConfirmationOpen(false);
          setAdminToDelete(null);
        }}
        onConfirm={confirmDeleteAdmin}
        title="Remove Admin Access"
        message={`Are you sure you want to remove admin access for ${adminToDelete?.walletAddress}? This action cannot be undone.`}
        confirmLabel="Remove Access"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default SettingsPage;
