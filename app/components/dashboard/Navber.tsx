

"use client"

import type React from "react"
import { useState } from "react"
import { CiWallet } from "react-icons/ci"
import { useWalletContext } from "../../connection/WalletProvider"
import WalletDisconnectModal from "../../connection/Wallet-disconnect-modal"

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)
  const { account, disconnectWallet } = useWalletContext()

  const handleDisconnect = () => {
    disconnectWallet()
    setIsDisconnectModalOpen(false)
    setOpen(false)
  }

  const formatWalletAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  const handleWalletClick = () => {
    if (account) {
      setIsDisconnectModalOpen(true)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <nav className="bg-white shadow-sm px-4 py-3 border-b-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-6 h-6 rounded bg-green-700 mr-2"></div>
          <span className="font-medium text-gray-800">CrowdChain</span>
        </div>

        {/* Wallet Info */}
        <button onClick={handleWalletClick}>
          <div className="flex space-x-3 items-center bg-[#E8F5E8] rounded-md px-3 py-1 text-sm">
            <div className={`w-2 h-2 rounded-full mr-2 ${account ? "bg-green-500" : "bg-gray-400"}`}></div>
            <CiWallet />
            <span className="text-gray-600">{account ? formatWalletAddress(account) : "Connect Wallet"}</span>
          </div>
        </button>
      </nav>

      {/* Disconnect Modal */}
      <WalletDisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={() => setIsDisconnectModalOpen(false)}
        onDisconnect={handleDisconnect}
      />
    </>
  )
}

export default Navbar