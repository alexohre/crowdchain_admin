"use client";

import { useAccount, useReadContract, useDisconnect } from "@starknet-react/core";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  // Check if connected wallet is admin or owner
  const { data: isAdminOrOwner, isLoading: isCheckingAdmin, error: adminError } = useReadContract({
    abi: CROWDCHAIN_ABI,
    address: CROWDCHAIN_CONTRACT_ADDRESS,
    functionName: "is_admin_or_owner",
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
    watch: true, // Watch for changes
  });

  // Update authorization status when admin check completes
  useEffect(() => {
    if (!isCheckingAdmin && isConnected && address) {
      const isAuth = !!isAdminOrOwner;
      setIsAuthorized(isAuth);
      setIsLoading(false);
      
      // If user is not authorized, disconnect them and show alert
      if (!isAuth && pathname !== '/') {
        toast.error('Access denied! Only contract admins and owners can access this dashboard. Your wallet has been disconnected.', {
          duration: 5000,
          position: 'top-center',
        });
        disconnect();
        router.push('/');
      }
    } else if (!isConnected || !address) {
      setIsAuthorized(false);
      setIsLoading(false);
    }
  }, [isAdminOrOwner, isCheckingAdmin, isConnected, address, pathname, disconnect, router]);

  useEffect(() => {
    // Small delay to ensure wallet connection state is properly initialized
    const timer = setTimeout(() => {
      if (!isConnected || !address) {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isConnected, address]);

  useEffect(() => {
    // Don't protect the root path
    if (pathname === '/' || isLoading) {
      return;
    }

    // If wallet is not connected, redirect to home
    if (!isConnected || !address) {
      router.push('/');
      return;
    }

    // Note: Unauthorized users are automatically disconnected in the authorization check above
  }, [isConnected, address, pathname, router, isLoading]);

  // For root path, always render children
  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show loading state while checking connection and admin status
  if (isLoading || (isConnected && address && isCheckingAdmin)) {
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
