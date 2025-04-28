"use client";
import React, { useState } from "react";
import { AdminModalProps, AdminRole } from "@/app/types/admin";
import { validateWalletAddress, validateAdminRole } from "@/app/utils/validation";

const AddAdminModal: React.FC<AdminModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState<AdminRole>("Moderator");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate wallet address
    const walletValidation = validateWalletAddress(walletAddress);
    if (!walletValidation.isValid) {
      setError(walletValidation.message || "Invalid wallet address");
      return;
    }

    // Validate role
    const roleValidation = validateAdminRole(role);
    if (!roleValidation.isValid) {
      setError(roleValidation.message || "Invalid role");
      return;
    }

    onSubmit({ walletAddress, role });
    handleClose();
  };

  const handleClose = () => {
    setWalletAddress("");
    setRole("Moderator");
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="overlay absolute inset-0 bg-black opacity-50 z-99" />
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-100">
        <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
              </select>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-md"
              >
                Add Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal; 