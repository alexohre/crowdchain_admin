"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { X, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";
import { Button } from "@/app/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/Card";
import { cn } from "@/app/lib/utils";
import { toast } from "react-hot-toast";


type ConnectButtonVariant = "default" | "navbar";

interface ConnectButtonProps {
  variant?: ConnectButtonVariant;
}

const truncateAddress = (address?: string) => {
  if (!address || address.length < 10) return "Invalid Address";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function ConnectButton({ variant = "default" }: ConnectButtonProps) {
  const { connect, connectors, error: connectError } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle connection errors with toast notifications and UI display
  useEffect(() => {
    if (connectError) {
      const message =
        "Failed to connect wallet. Please ensure the wallet is installed and try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  }, [connectError]);

  const handleConnect = () => {
    setErrorMessage(null);
    setIsWalletModalOpen(true);
  };

  const handleWalletSelect = async (connector: any) => {
    try {
      if (!connector.available()) {
        const message = `${connector.name} wallet is not installed. Please install it first.`;
        setErrorMessage(message);
        toast.error(message);
        return;
      }
      await connect({ connector });
      setIsWalletModalOpen(false);
      toast.success("Wallet connected successfully!");
      
      // Redirect to dashboard after successful connection
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Connection failed:", error);
      const message =
        "Connection failed. Please try again or check wallet installation.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleDisconnect = () => {
    setIsDisconnectModalOpen(true);
  };

  const confirmDisconnect = () => {
    disconnect();
    setIsDisconnectModalOpen(false);
    toast.success("Wallet disconnected successfully!");
  };

  return (
    <>
      <div className="relative">
        {isConnected && address ? (
          <div
            className={cn(
              "relative z-40",
              variant === "default" ? "mx-auto w-fit" : ""
            )}
          >
            <button
              onClick={handleDisconnect}
              className={cn(
                "flex items-center cursor-pointer gap-2 border-2 border-[#1A5D1A] text-[#1A5D1A] font-extrabold transition-colors hover:bg-green-50",
                variant === "navbar"
                  ? "rounded-[8px] px-3 py-2 text-sm"
                  : "rounded-[8px] px-4 py-2 text-base"
              )}
              aria-label="Disconnect wallet"
            >
              <Wallet className="w-4 h-4" />
              {truncateAddress(address)}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className={cn(
              "flex items-center cursor-pointer gap-2 bg-[#1A5D1A] text-white cursor-pointer font-extrabold transition-colors hover:bg-green-700",
              variant === "navbar"
                ? "rounded-[8px] px-3 py-2 text-sm"
                : "rounded-[8px] px-4 py-2 text-base"
            )}
            aria-label="Connect wallet"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        )}
      </div>

      {/* Wallet Selection Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-[#374151]">
          <DialogHeader>
            <DialogTitle className="text-[#1A5D1A] font-extrabold text-xl">
              Connect a Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-[#555555] font-medium">
              Select your preferred wallet to connect
            </p>
            <div className="space-y-3">
              {connectors.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No wallet connectors available. Please install Argent X or Braavos wallet.
                </p>
              ) : (
                connectors.map((connector) => {
                  return (
                    <Card
                      key={connector.id}
                      onClick={() => handleWalletSelect(connector)}
                      className={cn(
                        "cursor-pointer hover:bg-green-50 p-4 transition-colors border-[#1A5D1A]",
                        !connector.available() && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {connector.icon && (
                          <img
                            src={typeof connector.icon === 'string' 
                              ? connector.icon 
                              : connector.icon?.dark || connector.icon?.light}
                            alt={connector.name}
                            className="h-7 w-7 rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-logo.png"
                            }}
                          />
                        )}
                        <div className="text-sm text-[#374151] font-medium">
                          <h2 className="text-sm font-extrabold text-[#1A5D1A]">
                            {connector.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {connector.available() ? "Connect using " + connector.name : "Not installed"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Modal */}
      <Dialog
        open={isDisconnectModalOpen}
        onOpenChange={setIsDisconnectModalOpen}
      >
        <DialogContent className="bg-white text-[#374151]">
          <DialogHeader>
            <DialogTitle className="text-[#1A5D1A] font-extrabold">
              Disconnect Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[#555555] font-medium">
              Are you sure you want to disconnect your wallet?
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDisconnectModalOpen(false)}
                className="border-[#1A5D1A] text-[#1A5D1A] cursor-pointer font-extrabold hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDisconnect}
                className="bg-[#1A5D1A] text-white cursor-pointer font-extrabold hover:bg-green-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
