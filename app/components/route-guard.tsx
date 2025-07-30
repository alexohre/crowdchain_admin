"use client";

import { useAccount, useReadContract, useDisconnect } from "@starknet-react/core";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CROWDCHAIN_ABI, CROWDCHAIN_CONTRACT_ADDRESS } from "../lib/contract";
import toast from "react-hot-toast";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [hasShownUnauthorizedToast, setHasShownUnauthorizedToast] = useState(false);
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);
  const prevConnectedRef = useRef(isConnected);

  // Check if connected wallet is admin or owner
  const { data: isAdminOrOwner, isLoading: isCheckingAdmin, error: adminError } = useReadContract({
    abi: CROWDCHAIN_ABI,
    address: CROWDCHAIN_CONTRACT_ADDRESS,
    functionName: "is_admin_or_owner",
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
    watch: true, // Watch for changes
  });

  // Handle disconnection state and detect user-initiated disconnects
  useEffect(() => {
    // If we were connected and now we're not, this might be a user-initiated disconnect
    if (prevConnectedRef.current && !isConnected && pathname !== '/') {
      setIsDisconnecting(true);
      // Redirect immediately for user-initiated disconnects
      router.push('/');
    }
    
    // Update the ref for next comparison
    prevConnectedRef.current = isConnected;
    
    // Reset disconnecting state when fully disconnected
    if (!isConnected && !address) {
      setIsDisconnecting(false);
      setHasShownUnauthorizedToast(false); // Reset toast flag when disconnected
    }
    
    // Reset toast flag when a new wallet connects (different address)
    if (isConnected && address) {
      setHasShownUnauthorizedToast(false);
    }
  }, [isConnected, address, pathname, router]);

  // Main authorization logic
  useEffect(() => {
    // Don't protect the root path
    if (pathname === '/') {
      setIsLoading(false);
      setIsAuthorized(true);
      return;
    }

    // If wallet is not connected, redirect to home after a short delay
    if (!isConnected || !address) {
      // If we're in the process of disconnecting, redirect immediately
      if (isDisconnecting) {
        router.push('/');
        return;
      }
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsAuthorized(false);
        if (!isDisconnecting) {
          router.push('/');
        }
      }, 2000); // Give wallet 2 seconds to reconnect
      
      return () => clearTimeout(timer);
    }

    setHasCheckedWallet(true);

    // Handle authorization after admin check is complete
    if (!isCheckingAdmin && isConnected && address && hasCheckedWallet) {
      const isAuth = !!isAdminOrOwner;
      setIsAuthorized(isAuth);
      setIsLoading(false);
      
      if (!isAuth && !hasShownUnauthorizedToast) {
        setHasShownUnauthorizedToast(true);
        toast.error(
          'Access denied! Only contract admins and owners can access this dashboard. Your wallet has been disconnected.',
          {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '500px',
            },
            icon: '🚫',
          }
        );
        disconnect();
        router.push('/');
      }
    }
  }, [isAdminOrOwner, isCheckingAdmin, isConnected, address, pathname, disconnect, router, hasCheckedWallet, hasShownUnauthorizedToast]);

  // For root path, always render children
  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show loading state while checking connection and admin status, or during disconnect
  if (isLoading || (isConnected && address && isCheckingAdmin) || isDisconnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A5D1A] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isCheckingAdmin ? 'Verifying admin access...' : 'Checking wallet connection...'}
          </p>
        </div>
      </div>
    );
  }

  // For protected routes, show access denied if wallet is not connected or not authorized
  if (!isConnected || !address || !isAuthorized) {
    const isWalletIssue = !isConnected || !address;
    const isAuthIssue = isConnected && address && !isAuthorized;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-[#1A5D1A] mb-4">{isAuthIssue ? '🚫' : '🔒'}</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              {isWalletIssue 
                ? 'You need to connect your wallet to access this page.'
                : 'Your wallet address is not authorized to access the admin dashboard. Only contract admins and owners can access this area.'
              }
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-[#1A5D1A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Go to Homepage
            </Link>
            
            <p className="text-sm text-gray-500">
              {isWalletIssue 
                ? 'Please connect your wallet on the homepage to access the admin dashboard.'
                : 'Contact the contract owner if you believe you should have admin access.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // For protected routes, only render if wallet is connected
  return <>{children}</>;
}
