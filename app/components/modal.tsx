

"use client"

import { useState } from "react"
import WalletConnectModal from "../connection/wallet-connect-modal"
import WalletDisconnectModal from "../connection/Wallet-disconnect-modal"
import { useWalletContext } from "../connection/WalletProvider"

type BasicModalProps = {
  open: boolean
  handleClose: () => void
}

export default function BasicModal({ open, handleClose }: BasicModalProps) {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false)

  const { account, connectWallet, disconnectWallet, connectors } = useWalletContext()

  // Open appropriate modal based on wallet connection status
  const handleModalOpen = () => {
    if (account) {
      setIsDisconnectModalOpen(true)
    } else {
      setIsConnectModalOpen(true)
    }
  }

  const handleWalletSelect = async (walletId: string) => {
    try {
      const connector = connectors.find((c) => c.id === walletId)
      if (connector) {
        await connectWallet(connector)
      }
      setIsConnectModalOpen(false)
      handleClose() // Close main modal after successful connection
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsDisconnectModalOpen(false)
    handleClose() // Close main modal after disconnect
  }

  // Auto-open the appropriate modal when main modal opens
  if (open && !isConnectModalOpen && !isDisconnectModalOpen) {
    handleModalOpen()
  }

  return (
    <>
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false)
          handleClose()
        }}
        onSelect={handleWalletSelect}
      />

      {/* Wallet Disconnect Modal */}
      <WalletDisconnectModal
        isOpen={isDisconnectModalOpen}
        onClose={() => {
          setIsDisconnectModalOpen(false)
          handleClose()
        }}
        onDisconnect={handleDisconnect}
      />
    </>
  )
}