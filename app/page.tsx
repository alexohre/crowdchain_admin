"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CiWallet } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import BasicModal from "./components/modal";

const CrowdChainAdminPortal: React.FC = () => {
  const [walletDetected, setWalletDetected] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Footer */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              CrowdChain
            </h1>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-lg font-medium">Admin Access Portal</h2>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Secure Authentication Required
            </p>
          </div>

          <div className="  p-6 mb-6">
            <div className="flex justify-center items-center">
              <button
                onClick={handleOpen}
                className=" px-10 py-2 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md flex  space-x-5 items-center "
              >
                <CiWallet />
                <span> Connect Wallet</span>
              </button>
              <BasicModal open={open} handleClose={handleClose} />
            </div>

            <div className="mt-4 text-sm">
              <div className="flex  space-x-2 items-center text-gray-600 justify-center">
                <CiCircleCheck className="text-gray-900" />
                <span>Ready to connect</span>
              </div>

              {walletDetected && (
                <div className="flex items-center text-red-500 justify-center mt-1">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Unauthorized wallet detected</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-green-700 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-gray-700">
                Secure Admin Portal
              </span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              This portal is restricted to authorized admin wallets only. All
              access attempts are monitored and logged.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CrowdChainAdminPortal;
