"use client";


import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface WalletDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect: () => void;
}

export default function WalletDisconnectModal({
  isOpen,
  onClose,
  onDisconnect,
}: WalletDisconnectModalProps) {

  const handleDisconnect = () => {
    onDisconnect();
    window.location.href = "/";
  };





  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-sm rounded-2xl bg-[#0a0b1e] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8 px-10">
              <h2 className="text-xl font-semibold text-white">
                Disconnect Wallet
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div >
              <p className="text-gray-300 mb-6 text-center">
                Are you sure you want to disconnect your wallet?
              </p>
            </div>

            <div className="flex justify-between gap-2 mt-8">
              <button
                className=" w-full rounded-[48px] text-center border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className=" py-3 w-full text-center rounded-[48px] bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
                onClick={handleDisconnect}
              >
                Disconnect Wallet
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}