"use client";
import React from "react";
import { CiWallet } from "react-icons/ci";
import { useState } from "react";
import BasicModal from "@/app/components/discountmodal";

interface CrowdChainNavbarProps {
  walletAddress?: string;
  balance?: string;
}

const Navbar: React.FC<CrowdChainNavbarProps> = ({
  walletAddress = "0x7A3b...F42d",
  balance = "234.5 ETH",
}) => {
  const [walletDetected, setWalletDetected] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <nav className="bg-white shadow-sm px-4 py-3 border-b-2 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-6 h-6 rounded bg-green-700 mr-2"></div>
        <span className="font-medium text-gray-800">CrowdChain</span>
      </div>

      {/* Wallet Info */}
      <button onClick={handleOpen}>
        <div className="flex  space-x-3  items-center bg-[#E8F5E8] rounded-md px-3 py-1 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <CiWallet />
          <span className="text-gray-600">{walletAddress}</span>
          <span className="ml-2 text-green-700 font-medium">{balance}</span>
        </div>
      </button>
      <BasicModal open={open} handleClose={handleClose} />
    </nav>
  );
};

export default Navbar;
