"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useWalletContext } from "../connection/WalletProvider";
import { useRouter } from "next/navigation";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wallet: string) => void;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { connectors, connectAsync, account } = useWalletContext();
  const router = useRouter();

  const handleSelect = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  // ② On confirm, look up the connector object and call connectWallet
  const handleConfirm = async () => {
    if (!selectedWallet) return;

    const connector = connectors.find((c) => c.id === selectedWallet);
    if (!connector) {
      console.error("Connector not found:", selectedWallet);
      return;
    }

    try {
      await connectAsync({ connector }); // ■ await the wallet prompt
      router.push("/dashboard"); // ■ now safe to navigate
      onClose();
    } catch (err) {
      console.error("Wallet connection failed:", err); // ■ handle rejections
    }
  };

  // helper to get icon source
  function getIconSource(
    icon: string | { dark: string; light: string }
  ): string {
    if (typeof icon === "string") {
      // If it's a string, use it directly
      return icon;
    } else {
      // If it's an object, use the dark variant (or light, as needed)
      return icon.dark; // Or icon.light, depending on your theme
    }
  }

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div className="relative w-full max-w-md rounded-2xl bg-[#0a0b1e] p-6 shadow-xl">
            <div className="flex justify-end   mb-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className=" mb-4 text-center text-xl font-semibold text-white">
              Connect Wallet to Crowdchain
            </p>

            <div className="space-y-3 mb-6">
              {connectors.map((wallet, index) => (
                <div key={wallet?.id}>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-full border border-gray-700 hover:border-gray-500 transition-colors ${
                      selectedWallet === wallet.id
                        ? "border-green-700 bg-[#0d0e24]"
                        : ""
                    }`}
                    onClick={() => handleSelect(wallet.id)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center`}
                    >
                      <div className="">
                        <Image
                          src={getIconSource(wallet.icon)}
                          alt={wallet.name}
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <span className="text-white">{wallet.name}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* ③ Confirmation button */}
            <div>
              <button
                onClick={handleConfirm}
                disabled={!selectedWallet}
                className={`w-full py-3 rounded-full text-white font-medium transition-colors ${
                  selectedWallet
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                Connect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
