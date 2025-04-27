import { ValidationResult } from "../types/admin";

export const validateWalletAddress = (address: string): ValidationResult => {
  if (!address) {
    return {
      isValid: false,
      message: "Wallet address is required",
    };
  }

  // Basic Ethereum address validation
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethereumAddressRegex.test(address)) {
    return {
      isValid: false,
      message: "Invalid Ethereum wallet address format",
    };
  }

  return {
    isValid: true,
  };
};

export const validateAdminRole = (role: string): ValidationResult => {
  const validRoles = ["Super Admin", "Moderator", "User"];
  if (!validRoles.includes(role)) {
    return {
      isValid: false,
      message: "Invalid role selected",
    };
  }

  return {
    isValid: true,
  };
};

export const canDeleteAdmin = (
  currentUserWallet: string,
  targetWallet: string,
  currentUserRole: string,
  targetRole: string
): ValidationResult => {
  // Cannot delete own account
  if (currentUserWallet.toLowerCase() === targetWallet.toLowerCase()) {
    return {
      isValid: false,
      message: "You cannot remove your own admin access",
    };
  }

  // Only Super Admin can delete other admins
  if (currentUserRole !== "Super Admin") {
    return {
      isValid: false,
      message: "Only Super Admins can remove other admins",
    };
  }

  // Super Admin cannot be deleted
  if (targetRole === "Super Admin") {
    return {
      isValid: false,
      message: "Super Admin accounts cannot be removed",
    };
  }

  return {
    isValid: true,
  };
}; 